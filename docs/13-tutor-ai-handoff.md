# Tutor AI Configuration Guide

This guide covers the environment and deployment steps required to run the Tutor
text experience with Supabase and an OpenAI-compatible provider.

## 1. Local environment

Copy the example file and fill in the public Supabase client values:

```powershell
Copy-Item .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Do not put provider secrets in `.env`, Expo public variables, source files, or
the web bundle.

## 2. Supabase project

Install and authenticate the Supabase CLI, then link the shared project:

```powershell
supabase login
supabase link --project-ref <project-ref>
```

Apply database migrations:

```powershell
supabase db push
```

The Tutor migration creates the session, message, and memory tables used by the
server function. Row-level security must remain enabled.

## 3. Server-side AI secrets

Store provider credentials only as Supabase Edge Function secrets:

```powershell
supabase secrets set OPENAI_API_KEY=<provider-key>
supabase secrets set OPENAI_MODEL=gpt-4o-mini
supabase secrets set AI_BASE_URL=https://api.openai.com/v1
```

Use a rotated key when configuring a shared project. Never use a service-role
key in the Expo app.

## 4. Deploy the Tutor function

```powershell
supabase functions deploy tutor-chat
```

The Expo client invokes `tutor-chat`; it does not call the provider directly.
Guest mode remains available through the local fallback when Supabase is not
configured.

## 5. Verification

From the project root:

```powershell
npm ci
npm run check
npx expo export --platform web
```

For an interactive local check:

```powershell
$env:EXPO_NO_TELEMETRY='1'
npx expo start --web
```

Verify the flow:

```text
Tutor → scenario → Start practice → send message → Finish → summary
```

With an authenticated account, confirm that sessions and messages are owned by
the current user and that a completed session cannot be continued.

## 6. Security checklist

- `.env` is local-only and must not be committed.
- `OPENAI_API_KEY` is configured only in Supabase secrets.
- No provider key uses an `EXPO_PUBLIC_*` name.
- No service-role key is bundled in the app.
- Rotate any key that has been exposed outside the provider dashboard.
