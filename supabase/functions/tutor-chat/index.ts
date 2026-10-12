// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SCENARIOS = {
  coffee: {
    tutor: 'emma',
    title: 'Coffee Shop',
    level: 'Beginner',
    objective: 'Order a drink politely and handle a simple follow-up question.',
    rules: 'Act as a friendly barista. Keep sentences short and natural.',
  },
  university: {
    tutor: 'emma',
    title: 'University',
    level: 'Beginner',
    objective: 'Ask for help around campus and keep a short conversation going.',
    rules: 'Act as a helpful university student. Use simple everyday English.',
  },
  travel: {
    tutor: 'emma',
    title: 'Travel',
    level: 'Intermediate',
    objective: 'Ask for directions and solve a small travel problem.',
    rules: 'Act as a hotel or travel staff member. Be practical and polite.',
  },
  interview: {
    tutor: 'david',
    title: 'Job Interview',
    level: 'Intermediate',
    objective: 'Give a clear self-introduction and answer common interview questions.',
    rules: 'Act as a supportive interviewer. Ask one focused question at a time.',
  },
  presentation: {
    tutor: 'david',
    title: 'Presentation',
    level: 'Advanced',
    objective: 'Open a presentation, explain one idea and handle a question.',
    rules: 'Act as a professional presentation coach. Push for clear structure.',
  },
  meeting: {
    tutor: 'david',
    title: 'Meeting',
    level: 'Advanced',
    objective: 'Share an opinion, disagree politely and agree on an action.',
    rules: 'Act as a workplace colleague. Model concise, professional language.',
  },
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function trimHistory(history: unknown) {
  if (!Array.isArray(history)) return [];
  return history.slice(-12).map((item) => ({
    role: item?.role === 'learner' ? 'user' : 'assistant',
    content: String(item?.text || '').slice(0, 1200),
  })).filter((item) => item.content);
}

function parseModelContent(content: string) {
  try {
    const parsed = JSON.parse(content);
    const correction = parsed.correction;
    const normalizedCorrection =
      correction &&
      typeof correction.original === 'string' &&
      typeof correction.corrected === 'string' &&
      typeof correction.explanation === 'string'
        ? {
            original: correction.original.slice(0, 1000),
            corrected: correction.corrected.slice(0, 1000),
            explanation: correction.explanation.slice(0, 2000),
          }
        : null;
    return {
      message: String(parsed.message || '').slice(0, 5000),
      correction: normalizedCorrection,
      suggestedReplies: Array.isArray(parsed.suggestedReplies)
        ? parsed.suggestedReplies.filter((item) => typeof item === 'string').slice(0, 3)
        : [],
      newVocabulary: Array.isArray(parsed.newVocabulary)
        ? parsed.newVocabulary
            .filter((item) => item && typeof item.term === 'string' && typeof item.meaning === 'string')
            .map((item) => ({ term: item.term.slice(0, 100), meaning: item.meaning.slice(0, 300) }))
            .slice(0, 5)
        : [],
    };
  } catch {
    return { message: content, correction: null, suggestedReplies: [], newVocabulary: [] };
  }
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return json({ error: 'Authentication required.' }, 401);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return json({ error: 'Invalid session.' }, 401);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', authData.user.id)
    .maybeSingle();
  if (profileError || !profile || profile.status !== 'active') {
    return json({ error: 'This account cannot use Tutor AI.' }, 403);
  }

  const body = await request.json().catch(() => null);
  const scenario = SCENARIOS[body?.scenarioId as keyof typeof SCENARIOS];
  if (!scenario) return json({ error: 'Unknown scenario.' }, 400);
  if (!body?.sessionId || !body?.tutorId || !body?.action) return json({ error: 'Invalid tutor request.' }, 400);
  if (!['message', 'hint', 'correct', 'summary'].includes(body.action)) {
    return json({ error: 'Unknown tutor action.' }, 400);
  }
  if (!['emma', 'david'].includes(body.tutorId) || scenario.tutor !== body.tutorId) {
    return json({ error: 'Tutor does not match this scenario.' }, 400);
  }
  if (body.message !== undefined && typeof body.message !== 'string') {
    return json({ error: 'Message must be text.' }, 400);
  }
  const maxMessageLength = body.action === 'summary' ? 10000 : 500;
  if (typeof body.message === 'string' && body.message.length > maxMessageLength) {
    return json({ error: `Message is too long (max ${maxMessageLength} characters).` }, 400);
  }

  const { data: existingSession } = await supabase
    .from('tutor_sessions')
    .select('id, status, tutor_id, scenario_id')
    .eq('id', body.sessionId)
    .eq('user_id', authData.user.id)
    .maybeSingle();

  if (
    existingSession &&
    (existingSession.tutor_id !== body.tutorId || existingSession.scenario_id !== body.scenarioId)
  ) {
    return json({ error: 'Tutor session context does not match.' }, 409);
  }
  if (existingSession?.status === 'completed' || existingSession?.status === 'abandoned') {
    return json({ error: 'This tutor session has already ended.' }, 409);
  }

  if (!existingSession) {
    const { error: sessionError } = await supabase.from('tutor_sessions').insert({
      id: body.sessionId,
      user_id: authData.user.id,
      tutor_id: body.tutorId,
      scenario_id: body.scenarioId,
    });
    if (sessionError) return json({ error: 'Could not create tutor session.' }, 500);
  }

  if (body.action === 'summary') {
    let summary = null;
    if (typeof body.message === 'string') {
      try {
        summary = JSON.parse(body.message);
      } catch {
        summary = null;
      }
    }

    const { error: updateError } = await supabase
      .from('tutor_sessions')
      .update({
        status: 'completed',
        summary,
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.sessionId)
      .eq('user_id', authData.user.id);

    if (updateError) return json({ error: 'Could not save tutor summary.' }, 500);
    return json({
      message: 'Tutor session summary saved.',
      correction: null,
      suggestedReplies: [],
      newVocabulary: [],
    });
  }

  const providerKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('AI_API_KEY');
  if (!providerKey) return json({ error: 'AI service is not configured yet.' }, 503);

  const baseUrl = (Deno.env.get('AI_BASE_URL') || 'https://api.openai.com/v1').replace(/\/$/, '');
  const model = Deno.env.get('OPENAI_MODEL') || Deno.env.get('AI_MODEL') || 'gpt-4o-mini';
  const actionInstruction = body.action === 'hint'
    ? 'Give one short hint. Do not answer for the learner.'
    : body.action === 'correct'
      ? 'Focus on correcting the learner sentence and explain one important improvement.'
      : 'Continue the role-play naturally. Ask at most one follow-up question.';

  const system = [
    `You are ${body.tutorId}, an English tutor inside HustLingo.`,
    `Scenario: ${scenario.title}. Level: ${scenario.level}.`,
    `Objective: ${scenario.objective}`,
    scenario.rules,
    actionInstruction,
    'Keep the response concise and encouraging.',
    'Return JSON only with keys: message, correction, suggestedReplies, newVocabulary.',
    'correction must be null or {original, corrected, explanation}.',
    'newVocabulary must be an array of {term, meaning}.',
  ].join('\n');

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${providerKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      max_tokens: 450,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, ...trimHistory(body.history)],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error('tutor provider error', response.status, detail.slice(0, 500));
    return json({ error: 'AI provider request failed.' }, 502);
  }

  const providerBody = await response.json();
  const content = providerBody?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') return json({ error: 'AI provider returned no message.' }, 502);

  const result = parseModelContent(content);
  if (!result.message) return json({ error: 'AI provider returned an empty message.' }, 502);

  const messages = [];
  if (body.message) {
    messages.push({
      session_id: body.sessionId,
      user_id: authData.user.id,
      role: 'learner',
      content: String(body.message).slice(0, 5000),
    });
  }
  messages.push({
    session_id: body.sessionId,
    user_id: authData.user.id,
    role: 'tutor',
    content: result.message.slice(0, 5000),
    metadata: result,
  });
  const { error: messageError } = await supabase.from('tutor_messages').insert(messages);
  if (messageError) return json({ error: 'Could not save tutor messages.' }, 500);

  return json(result);
});
