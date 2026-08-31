/**
 * Structured logger for HAUSAURA.
 *
 * In production: logs minimal info (no secrets, no internal details).
 * In development: full error details for debugging.
 */

export const logger = {
  error(context: string, error: unknown, extra?: Record<string, unknown>) {
    const isProd = process.env.NODE_ENV === "production";
    const entry = {
      level: "error",
      context,
      timestamp: new Date().toISOString(),
      ...extra,
    };

    if (isProd) {
      const entryWithError = {
        ...entry,
        error: error instanceof Error ? error.message : String(error),
      };
      console.error(JSON.stringify(entryWithError));
    } else {
      console.error(`[HAUSAURA] ${context}:`, error, extra);
    }
  },

  warn(context: string, message: string, extra?: Record<string, unknown>) {
    const isProd = process.env.NODE_ENV === "production";
    const entry = {
      level: "warn",
      context,
      message,
      timestamp: new Date().toISOString(),
      ...extra,
    };

    if (isProd) {
      console.warn(JSON.stringify(entry));
    } else {
      console.warn(`[HAUSAURA] ${context}: ${message}`, extra);
    }
  },

  info(context: string, message: string, extra?: Record<string, unknown>) {
    const isProd = process.env.NODE_ENV === "production";
    const entry = {
      level: "info",
      context,
      message,
      timestamp: new Date().toISOString(),
      ...extra,
    };

    if (isProd) {
      console.log(JSON.stringify(entry));
    } else {
      console.log(`[HAUSAURA] ${context}: ${message}`, extra);
    }
  },
};
