export type LogLevel = "info" | "warn" | "error";

export function logEvent(event: string, data?: Record<string, unknown>, level: LogLevel = "info") {
  const payload = { event, level, ...data };
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console[level](`[fe] ${event}`, payload);
  } else {
    // eslint-disable-next-line no-console
    console[level](`[be] ${event}`, payload);
  }
}


