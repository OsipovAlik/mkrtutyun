import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

/**
 * Minimal single-user login for the event owner.
 * Credentials come from ADMIN_USERNAME / ADMIN_PASSWORD env vars.
 * The session is a signed, httpOnly cookie — changing the password logs everyone out.
 */

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function credentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  return username && password ? { username, password } : null;
}

export function isAdminConfigured() {
  return credentials() !== null;
}

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? `${credentials()?.username}:${credentials()?.password}`;
}

function safeEqual(a: string, b: string) {
  // Hash first so lengths match and timing doesn't leak the length.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkCredentials(username: string, password: string) {
  const creds = credentials();
  if (!creds) return false;
  const userOk = safeEqual(username, creds.username);
  const passOk = safeEqual(password, creds.password);
  return userOk && passOk;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSessionToken() {
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${sign(expires)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !isAdminConfigured()) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (!safeEqual(signature, sign(expires))) return false;
  return Number(expires) > Date.now();
}

/** For Server Components / Route Handlers. */
export async function isAdmin() {
  // Expiry check reads the clock — mark this as request-time work for Cache Components.
  await connection();
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
