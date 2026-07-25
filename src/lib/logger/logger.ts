import { env } from "@/config/env";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

const isDevelopment = env.NODE_ENV === "development";

function write(level: LogLevel, message: string, context?: LogContext) {
  // Swap this block for a Sentry/monitoring transport later —
  // every log in the app already funnels through here.
  if (level === "debug" && !isDevelopment) return;

  const payload = context ? [message, context] : [message];

  switch (level) {
    case "debug":
      console.debug(...payload);
      break;
    case "info":
      console.info(...payload);
      break;
    case "warn":
      console.warn(...payload);
      break;
    case "error":
      console.error(...payload);
      break;
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) =>
    write("debug", message, context),
  info: (message: string, context?: LogContext) =>
    write("info", message, context),
  warn: (message: string, context?: LogContext) =>
    write("warn", message, context),
  error: (message: string, error?: unknown, context?: LogContext) =>
    write("error", message, {
      ...context,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : error,
    }),
};
