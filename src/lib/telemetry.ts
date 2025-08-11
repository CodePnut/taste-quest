export type LogLevel = "info" | "warn" | "error";

/**
 * Minimal logging helper used in both FE and BE contexts.
 * For now this uses console so juniors can see events while developing.
 * In production we will route to Sentry/structured logs.
 */
export function logEvent(event: string, data?: Record<string, unknown>, level: LogLevel = "info") {
  const payload = { event, level, ...data };
  const prefix = typeof window !== "undefined" ? "[fe]" : "[be]";
  // Using console intentionally for development visibility.
  // ESLint rule left enabled since we want warnings when used elsewhere.
  // eslint-disable-next-line no-console
  console[level](`${prefix} ${event}`, payload);
}


