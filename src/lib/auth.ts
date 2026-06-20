import crypto from "crypto";
import fs from "fs";
import path from "path";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const DATA_DIR = path.join(process.cwd(), "data");
const ADMIN_FILE = path.join(DATA_DIR, "admin.json");
const SESSION_COOKIE = "mcp_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

interface AdminStore {
  passwordHash: string;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET ortam değişkeni en az 32 karakter olmalıdır.");
    }
    return "dev-only-insecure-secret-change-in-production-32chars";
  }
  return secret;
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const verifyHash = crypto.scryptSync(password, salt, 64).toString("hex");
    const hashBuf = Buffer.from(hash, "hex");
    const verifyBuf = Buffer.from(verifyHash, "hex");
    if (hashBuf.length !== verifyBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, verifyBuf);
  } catch {
    return false;
  }
}

function ensureAdminFile(): AdminStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(ADMIN_FILE)) {
    return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8")) as AdminStore;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 12) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_PASSWORD ortam değişkeni en az 12 karakter olmalıdır.");
    }
    const fallback = "admin12345678";
    const store: AdminStore = { passwordHash: hashPassword(fallback) };
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(store, null, 2), "utf-8");
    return store;
  }

  const store: AdminStore = { passwordHash: hashPassword(adminPassword) };
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(store, null, 2), "utf-8");
  return store;
}

export function validateAdminPassword(password: string): boolean {
  const store = ensureAdminFile();
  return verifyPassword(password, store.passwordHash);
}

export function createSessionToken(): string {
  const payload = {
    sub: "admin",
    iat: Date.now(),
    exp: Date.now() + SESSION_DURATION_MS,
    nonce: crypto.randomBytes(16).toString("hex"),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return false;

    const expected = crypto
      .createHmac("sha256", getSessionSecret())
      .update(payloadB64)
      .digest("base64url");

    if (signature.length !== expected.length) return false;
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (payload.sub !== "admin" || typeof payload.exp !== "number") return false;
    if (Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_DURATION_MS / 1000,
};

export { SESSION_COOKIE, SESSION_DURATION_MS };

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export function validateOrigin(request: NextRequest): boolean {
  const host = request.headers.get("host");
  if (!host) return false;

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  return false;
}
