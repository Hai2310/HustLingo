import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

function load(name, bindings = {}) {
  const source = readFileSync(new URL(`../supabase/functions/pronunciation-assessment/${name}.ts`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const exports = {};
  new Function('exports', ...Object.keys(bindings), outputText)(exports, ...Object.values(bindings));
  return exports;
}

const core = load('core');

function audio() {
  const wav = new ArrayBuffer(32_044);
  const header = new DataView(wav);
  for (const [offset, value] of [[0, 0x52494646], [8, 0x57415645], [12, 0x666d7420], [36, 0x64617461]]) header.setUint32(offset, value);
  for (const [offset, value] of [[4, 32_036], [16, 16], [24, 16_000], [28, 32_000], [40, 32_000]]) header.setUint32(offset, value, true);
  for (const [offset, value] of [[20, 1], [22, 1], [32, 2], [34, 16]]) header.setUint16(offset, value, true);
  return wav;
}

function request(body = audio(), token = 'test-user') {
  return new Request('http://localhost/pronunciation-assessment', {
    method: 'POST', body,
    headers: { 'Content-Type': 'audio/wav', 'x-exercise-id': 'speak-1', Authorization: `Bearer ${token}` },
  });
}

test('accepts only canonical mono 16-kHz PCM WAV within the bound', async () => {
  assert.equal((await core.readWav(request())).byteLength, 32_044);
  await assert.rejects(core.readWav(request(new ArrayBuffer(32_044))), { code: 'invalid_audio' });
  await assert.rejects(core.readWav(request(new ArrayBuffer(640_046))), { code: 'audio_too_long' });
  const stereo = audio();
  new DataView(stereo).setUint16(22, 2, true);
  await assert.rejects(core.readWav(request(stereo)), { code: 'invalid_audio' });
});

test('maps nested and flat assessment fields and preserves skipped words and zero scores', () => {
  const result = core.parseAzureResult({ RecognitionStatus: 'Success', NBest: [{
    PronScore: 78.2, FluencyScore: 85, CompletenessScore: 50,
    Words: [
      { Word: 'Hello', PronunciationAssessment: { AccuracyScore: 90 }, Phonemes: [{ Phoneme: 'h', AccuracyScore: 90 }] },
      { Word: 'there', ErrorType: 'Omission', AccuracyScore: 0 },
    ],
  }] });
  assert.equal(result.score, 78);
  assert.equal(result.prosody, null);
  assert.deepEqual(result.words, [
    { text: 'Hello', accuracy: 90, error: null, phonemes: [{ text: 'h', accuracy: 90 }] },
    { text: 'there', accuracy: 0, error: 'Omission', phonemes: [] },
  ]);
  assert.throws(() => core.parseAzureResult({ RecognitionStatus: 'NoMatch' }), { code: 'no_speech' });
  assert.throws(() => core.parseAzureResult({ NBest: [{ Words: [] }] }), { code: 'provider_error' });
});

test('authenticates, selects the published reference, and claims quota before calling Azure', async () => {
  let handle;
  let quota = 'ok';
  let providerCalls = 0;
  const filters = new Map();
  const query = {
    select(columns) { assert.equal(columns, 'payload'); return this; },
    eq(key, value) { filters.set(key, value); return this; },
    async maybeSingle() { return { data: { payload: { text: 'Café is open.' } } }; },
  };
  const supabase = {
    auth: { async getUser(token) { return token === 'test-user' ? { data: { user: { id: 'user-1' } } } : { data: { user: null }, error: {} }; } },
    from(table) { assert.equal(table, 'practice_content'); return query; },
    async rpc(name, args) { assert.equal(name, 'claim_pronunciation_attempt'); assert.deepEqual(args, { p_user_id: 'user-1' }); return { data: quota }; },
  };
  const env = { SUPABASE_URL: 'http://localhost', SUPABASE_SERVICE_ROLE_KEY: 'test', AZURE_SPEECH_KEY: 'not-a-real-key', AZURE_SPEECH_REGION: 'southeastasia' };
  load('index', {
    require: specifier => specifier === './core.ts' ? core : { createClient: () => supabase },
    Deno: { serve(handler) { handle = handler; }, env: { get: key => env[key] } },
    fetch: async (url, options) => {
      providerCalls++;
      assert.deepEqual(Object.fromEntries(filters), { id: 'speak-1', skill: 'speaking', is_published: true });
      assert.equal(new URL(url).searchParams.get('language'), 'en-US');
      assert.equal(options.body.byteLength, 32_044);
      const header = JSON.parse(Buffer.from(options.headers['Pronunciation-Assessment'], 'base64').toString('utf8'));
      assert.equal(header.ReferenceText, 'Café is open.');
      assert.equal(header.Granularity, 'Phoneme');
      return Response.json({ RecognitionStatus: 'Success', NBest: [{ PronunciationAssessment: { PronScore: 92 }, Words: [{ Word: 'Café' }] }] });
    },
  });
  assert.equal((await handle(request(audio(), 'invalid'))).status, 401);
  assert.equal((await handle(request(new ArrayBuffer(0)))).status, 422);
  quota = 'account_inactive';
  assert.equal((await handle(request())).status, 403);
  quota = 'daily_limit';
  assert.equal((await handle(request())).status, 429);
  assert.equal(providerCalls, 0);
  quota = 'ok';
  const ok = await handle(request());
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).score, 92);
  assert.equal(providerCalls, 1);
});
