import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import {
  ADMIN_COOKIE,
  adminSessionCookieOptions,
  getAdminSessionToken,
  isAdminAuthenticated,
  isAdminPasswordConfigured,
  verifyAdminPassword,
} from "@/lib/admin-auth"

export async function GET() {
  return NextResponse.json({
    configured: isAdminPasswordConfigured(),
    authenticated: await isAdminAuthenticated(),
  })
}

export async function POST(request: Request) {
  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: "Admin password is not configured. Add ADMIN_PASSWORD to .env.local" },
      { status: 503 }
    )
  }

  const body = (await request.json()) as { password?: string }
  const password = body.password ?? ""

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
  }

  const store = await cookies()
  store.set(ADMIN_COOKIE, getAdminSessionToken(), adminSessionCookieOptions())

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
  return NextResponse.json({ ok: true })
}
