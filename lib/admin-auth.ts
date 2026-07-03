import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const ADMIN_COOKIE = "cuesing-admin-session"

export function isAdminPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim())
}

function getSessionToken() {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) return ""
  return createHmac("sha256", secret).update("cuesing-admin-v1").digest("hex")
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? ""
  if (!expected) return false
  if (password.length !== expected.length) return false

  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function isAdminAuthenticated() {
  if (!isAdminPasswordConfigured()) return false

  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  return token === getSessionToken()
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Admin authentication required" },
    { status: 401 }
  )
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return unauthorizedResponse()
  }
  return null
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  }
}

export function getAdminSessionToken() {
  return getSessionToken()
}
