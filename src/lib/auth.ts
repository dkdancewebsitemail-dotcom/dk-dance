import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { AuthSession } from "@/types";
import { getAdminUser } from "./db-services";

export function getJwtSecretKey(): Uint8Array | null {
  const secret = process.env.ADMIN_JWT_SECRET?.trim();
  const isProduction = process.env.NODE_ENV === "production";

  if (secret) {
    if (isProduction && secret.length < 32) {
      console.error("[CRITICAL AUTH ERROR] ADMIN_JWT_SECRET must be at least 32 characters long in production.");
      return null;
    }
    return new TextEncoder().encode(secret);
  }

  // In production, fail closed - never sign or verify tokens with a fallback
  if (isProduction) {
    console.error("[CRITICAL AUTH ERROR] ADMIN_JWT_SECRET is missing in production environment variables.");
    return null;
  }

  // Local development / testing fallback only
  return new TextEncoder().encode("dkdancecompany_dev_fallback_secret_32chars!");
}
export const COOKIE_NAME = "dkdc_session";

// Rate limiting in-memory store: IP -> attempts timestamp array
const loginAttempts = new Map<string, number[]>();

export function checkRateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = loginAttempts.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    loginAttempts.set(ip, recent);
    return false; // Rate limit exceeded
  }

  recent.push(now);
  loginAttempts.set(ip, recent);
  return true;
}

export async function createSessionToken(username: string): Promise<string> {
  const secretKey = getJwtSecretKey();
  if (!secretKey) {
    throw new Error("Server authentication is misconfigured: ADMIN_JWT_SECRET must be configured in production.");
  }
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const token = await new SignJWT({
    username,
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secretKey);

  return token;
}

export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  const secretKey = getJwtSecretKey();
  if (!secretKey) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (!payload?.username || payload.role !== "admin") {
      return null;
    }
    return {
      username: payload.username as string,
      role: payload.role as "admin",
      exp: payload.exp as number,
      iat: payload.iat as number,
    };
  } catch {
    return null;
  }
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function verifyRequestAuth(req: NextRequest): Promise<AuthSession | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    const session = await verifySessionToken(token);
    if (session) return session;
  }

  // Also support Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const bearer = authHeader.substring(7).trim();
    if (bearer) {
      const session = await verifySessionToken(bearer);
      if (session) return session;
    }
  }

  return null;
}

export async function validateCredentials(username: string, pass: string): Promise<boolean> {
  try {
    const admin = await getAdminUser();
    const cleanUser = username.trim();
    const cleanPass = pass.trim();

    // Check username (case-insensitive)
    if (cleanUser.toLowerCase() !== admin.username.toLowerCase()) {
      return false;
    }

    // Verify password strictly against the stored bcrypt hash in DB
    let isMatch = false;
    try {
      isMatch = bcrypt.compareSync(cleanPass, admin.passwordHash);
    } catch {
      isMatch = false;
    }

    // Return strict bcrypt comparison result; no old password fallback
    return isMatch;
  } catch (err) {
    console.error("Error validating credentials against database:", err);
    return false;
  }
}
