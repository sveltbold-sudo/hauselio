const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
} as const;

const optionalEnvVars = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_API_KEY: process.env.ALGOLIA_SEARCH_API_KEY,
  ALGOLIA_ADMIN_API_KEY: process.env.ALGOLIA_ADMIN_API_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
} as const;

let _validated = false;

export function validateEnv() {
  if (_validated) return;

  const missing: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    if (process.env.NODE_ENV === "production") {
      console.warn(`[HAUSELIO] Missing env vars: ${missing.join(", ")}. App may not function correctly.`);
    } else {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}. ` +
          `Please add them to your .env file or environment configuration.`
      );
    }
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[HAUSELIO] JWT_SECRET is missing or too short (<32 chars). Auth may not work.");
    } else {
      throw new Error("JWT_SECRET must be at least 32 characters long.");
    }
  }

  _validated = true;
}

export function getEnv() {
  validateEnv();
  return {
    ...requiredEnvVars,
    ...optionalEnvVars,
  };
}
