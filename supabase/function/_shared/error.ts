import type { ErrorEnvelope } from '@chat/shared-types';

export function errorResponse(code: string, message: string, retryable = false, status = 400): Response {
  const body: ErrorEnvelope = { code, message, retryable };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
