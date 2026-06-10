## Secrets

`GEMINI_API_KEY` and `DEEPSEEK_API_KEY` are required by the Edge Functions and must be set as Supabase secrets — either via `supabase secrets set GEMINI_API_KEY=<value> DEEPSEEK_API_KEY=<value>` in the CLI or through the Supabase dashboard under Project Settings → Edge Functions → Secrets. These values are never committed to the repository. For local development, create a `supabase/.env.local` file (not tracked by git) with the same keys; `supabase/config.toml` is committed and shared across the team — it holds structural config only, no secrets.
