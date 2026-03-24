const requests = new Map<string, { count: number; resetTime: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 submissions per minute per action

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || now > entry.resetTime) {
    requests.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return true; // allowed
  }

  if (entry.count >= MAX_REQUESTS) {
    return false; // blocked
  }

  entry.count++;
  return true; // allowed
}
