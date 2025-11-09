# Jobs.AI (frontend)

This folder contains the Vite + React frontend for Jobs.AI.

Local dev

1. Copy `.env.example` to `.env` in the `jobs-ai-final` directory and add values:

```
VITE_SUPABASE_URL=https://<your-supabase-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

2. Install dependencies and start dev server:

```bash
cd jobs-ai-final
npm install
npm run dev
```

Supabase + Google OAuth setup (overview)

1. Create Google OAuth credentials in Google Cloud Console. Set the Authorized redirect URI to:

```
https://<your-supabase-ref>.supabase.co/auth/v1/callback
```

2. In the Supabase project dashboard, go to Authentication -> Providers -> Google and add the Client ID and Client Secret created above.

3. In Vercel (or other hosting), set the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the project settings.

4. The frontend uses `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })`.

Notes
- Do not commit real secrets. Use Vercel environment variables for production secrets.
- After enabling Google provider in Supabase, users will be able to sign-in with Google from the Login and Signup pages.
