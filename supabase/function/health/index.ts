import { createClient } from 'jsr:@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS })
  }

  const checks: Record<string, { ok: boolean; latencyMs?: number; error?: string }> = {}

  // Database check
  const dbStart = Date.now()
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { error } = await supabase.from('_health_check').select('1').limit(1).maybeSingle()
    // table won't exist — that's fine, a postgres error means DB is reachable
    checks.database = { ok: !error || error.code === 'PGRST116' || error.code === '42P01', latencyMs: Date.now() - dbStart }
  } catch (e) {
    checks.database = { ok: false, latencyMs: Date.now() - dbStart, error: String(e) }
  }

  // AI provider reachability (fast HEAD checks, no API key needed)
  for (const [name, url] of [
    ['gemini', 'https://generativelanguage.googleapis.com'],
    ['deepseek', 'https://api.deepseek.com'],
  ] as const) {
    const start = Date.now()
    try {
      const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(3000) })
      checks[name] = { ok: res.status < 500, latencyMs: Date.now() - start }
    } catch (e) {
      checks[name] = { ok: false, latencyMs: Date.now() - start, error: String(e) }
    }
  }

  const allOk = Object.values(checks).every((c) => c.ok)

  const body = {
    status: allOk ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  }

  return new Response(JSON.stringify(body, null, 2), {
    status: allOk ? 200 : 503,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
})
