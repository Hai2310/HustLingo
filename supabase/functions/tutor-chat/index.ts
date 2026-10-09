// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SCENARIOS = {
  coffee: {
    title: 'Coffee Shop',
    level: 'Beginner',
    objective: 'Order a drink politely and handle a simple follow-up question.',
    rules: 'Act as a friendly barista. Keep sentences short and natural.',
  },
  university: {
    title: 'University',
    level: 'Beginner',
    objective: 'Ask for help around campus and keep a short conversation going.',
    rules: 'Act as a helpful university student. Use simple everyday English.',
  },
  travel: {
    title: 'Travel',
    level: 'Intermediate',
    objective: 'Ask for directions and solve a small travel problem.',
    rules: 'Act as a hotel or travel staff member. Be practical and polite.',
  },
  interview: {
    title: 'Job Interview',
    level: 'Intermediate',
    objective: 'Give a clear self-introduction and answer common interview questions.',
    rules: 'Act as a supportive interviewer. Ask one focused question at a time.',
  },
  presentation: {
    title: 'Presentation',
    level: 'Advanced',
    objective: 'Open a presentation, explain one idea and handle a question.',
    rules: 'Act as a professional presentation coach. Push for clear structure.',
  },
  meeting: {
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
    return {
      message: String(parsed.message || ''),
      correction: parsed.correction || null,
      suggestedReplies: Array.isArray(parsed.suggestedReplies) ? parsed.suggestedReplies.slice(0, 3) : [],
      newVocabulary: Array.isArray(parsed.newVocabulary) ? parsed.newVocabulary.slice(0, 5) : [],
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

  const body = await request.json().catch(() => null);
  const scenario = SCENARIOS[body?.scenarioId as keyof typeof SCENARIOS];
  if (!scenario) return json({ error: 'Unknown scenario.' }, 400);
  if (!body?.sessionId || !body?.tutorId || !body?.action) return json({ error: 'Invalid tutor request.' }, 400);

  const providerKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('AI_API_KEY');
  if (!providerKey) return json({ error: 'AI service is not configured yet.' }, 503);

  const { data: existingSession } = await supabase
    .from('tutor_sessions')
    .select('id')
    .eq('id', body.sessionId)
    .eq('user_id', authData.user.id)
    .maybeSingle();

  if (!existingSession) {
    const { error: sessionError } = await supabase.from('tutor_sessions').insert({
      id: body.sessionId,
      user_id: authData.user.id,
      tutor_id: body.tutorId,
      scenario_id: body.scenarioId,
    });
    if (sessionError) return json({ error: 'Could not create tutor session.' }, 500);
  }

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
  await supabase.from('tutor_messages').insert(messages);

  return json(result);
});
