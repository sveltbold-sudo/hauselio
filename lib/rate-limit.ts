/**
 * Rate limiter avec Upstash Redis pour Vercel/serverless.
 *
 * En production : Upstash Redis (HTTP-based, partagé entre instances)
 * En dev local : fallback in-memory (suffisant pour le développement)
 *
 * Env vars requises en production :
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const useUpstash = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

const upstashInstances = new Map<string, Ratelimit>();

function getUpstashLimiter(maxRequests: number, windowMs: number): Ratelimit {
  const windowSec = Math.ceil(windowMs / 1000);
  const key = `${maxRequests}:${windowSec}`;
  if (!upstashInstances.has(key)) {
    upstashInstances.set(
      key,
      new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(maxRequests, `${windowSec} s`),
        analytics: true,
        prefix: `hauselio:ratelimit:${key}`,
      })
    );
  }
  return upstashInstances.get(key)!;
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getMemoryEntry(key: string) {
  return rateLimitStore.get(key);
}

function setMemoryEntry(key: string, count: number, windowMs: number) {
  rateLimitStore.set(key, { count, resetAt: Date.now() + windowMs });
}

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  if (useUpstash) {
    const limiter = getUpstashLimiter(maxRequests, windowMs);
    const { success } = await limiter.limit(key);
    return success;
  }

  const now = Date.now();
  const entry = getMemoryEntry(key);

  if (!entry || now > entry.resetAt) {
    setMemoryEntry(key, 1, windowMs);
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

export async function getRemainingAttempts(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ remaining: number; retryAfterMs: number }> {
  if (useUpstash) {
    const limiter = getUpstashLimiter(maxRequests, windowMs);
    const { remaining, reset } = await limiter.getRemaining(key);
    const retryAfterMs = remaining === 0 ? Math.max(0, reset - Date.now()) : 0;
    return { remaining, retryAfterMs };
  }

  const now = Date.now();
  const entry = getMemoryEntry(key);

  if (!entry || now > entry.resetAt) {
    return { remaining: maxRequests, retryAfterMs: 0 };
  }

  const remaining = Math.max(0, maxRequests - entry.count);
  const retryAfterMs = remaining === 0 ? entry.resetAt - now : 0;

  return { remaining, retryAfterMs };
}

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
