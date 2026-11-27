// @ts-nocheck -- Deno runtime is checked separately from the Expo TypeScript project.
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { AssessmentError, azureAssessmentHeader, parseAzureResult, readWav } from './core.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-exercise-id',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { ...corsHeaders, 'Cache-Control': 'no-store' } });
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  try {
    const token = /^Bearer\s+(\S+)$/i.exec(request.headers.get('Authorization') ?? '')?.[1];
    if (!token) throw new AssessmentError('sign_in_required', 401);
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceKey) throw new AssessmentError('service_unavailable', 503);
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: auth, error: authError } = await admin.auth.getUser(token);
    if (authError || !auth.user || auth.user.is_anonymous) throw new AssessmentError('sign_in_required', 401);

    const azureKey = Deno.env.get('AZURE_SPEECH_KEY')?.trim();
    const region = Deno.env.get('AZURE_SPEECH_REGION')?.trim().toLowerCase();
    if (!azureKey || !region || !/^[a-z0-9]+$/.test(region)) throw new AssessmentError('service_unavailable', 503);

    const exerciseId = request.headers.get('x-exercise-id') ?? '';
    if (!/^[a-z0-9_-]{1,120}$/i.test(exerciseId)) throw new AssessmentError('exercise_not_found', 404);
    const wav = await readWav(request);
    const { data: exercise, error: exerciseError } = await admin.from('practice_content')
      .select('payload').eq('id', exerciseId).eq('skill', 'speaking').eq('is_published', true).maybeSingle();
    if (exerciseError) throw new AssessmentError('service_unavailable', 503);
    const reference = exercise?.payload?.text;
    if (typeof reference !== 'string' || !reference.trim() || reference.length > 1000) {
      throw new AssessmentError('exercise_not_found', 404);
    }

    const { data: quota, error: quotaError } = await admin.rpc('claim_pronunciation_attempt', { p_user_id: auth.user.id });
    if (quotaError) throw new AssessmentError('service_unavailable', 503);
    if (quota === 'account_inactive') throw new AssessmentError('account_inactive', 403);
    if (quota === 'daily_limit') throw new AssessmentError('daily_limit', 429);
    if (quota !== 'ok') throw new AssessmentError('service_unavailable', 503);

    const timeout = AbortSignal.timeout(15_000);
    const response = await fetch(
      `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`,
      {
        method: 'POST',
        signal: timeout,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
          'Ocp-Apim-Subscription-Key': azureKey,
          'Pronunciation-Assessment': azureAssessmentHeader(reference),
        },
        body: wav,
      },
    );
    if (!response.ok) {
      console.error('Azure pronunciation HTTP status:', response.status);
      throw new AssessmentError('provider_error', 502);
    }
    return json(parseAzureResult(await response.json()));
  } catch (error) {
    if (error instanceof AssessmentError) return json({ error: error.code }, error.status);
    if (error instanceof Error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
      return json({ error: 'provider_timeout' }, 504);
    }
    console.error('Pronunciation assessment failed:', error instanceof Error ? error.name : 'UnknownError');
    return json({ error: 'provider_error' }, 502);
  }
});
