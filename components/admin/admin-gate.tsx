"use client"

import Image from "next/image"
import Link from "next/link"
import { createContext, type FormEvent, useCallback, useContext, useEffect, useState } from "react"
import { ArrowLeft, KeyRound, Loader2, Lock, Settings } from "lucide-react"

import { LandingBackground } from "@/components/landing/landing-background"
import { LoadingScreen } from "@/components/loading-screen"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { APP_NAME } from "@/lib/brand"
import { cn } from "@/lib/utils"

const ADMIN_ENTER_MS = 900
const ADMIN_ENTER_FADE_MS = 280

type AdminGateProps = {
  children: React.ReactNode
}

type AuthStatus = "loading" | "locked" | "entering" | "unlocked"

type AdminAuthContextValue = {
  logout: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminGate")
  }
  return context
}

export function AdminGate({ children }: AdminGateProps) {
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [configured, setConfigured] = useState(true)
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [enterProgress, setEnterProgress] = useState(12)
  const [enterFadeOut, setEnterFadeOut] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/admin/auth", { cache: "no-store" })
        const data = (await response.json()) as {
          configured?: boolean
          authenticated?: boolean
        }
        setConfigured(data.configured ?? false)
        setStatus(data.authenticated ? "unlocked" : "locked")
      } catch {
        setStatus("locked")
        setConfigured(false)
      }
    }

    void checkAuth()
  }, [])

  useEffect(() => {
    if (status !== "entering") return

    setEnterProgress(12)
    setEnterFadeOut(false)

    const progressTimer = window.setInterval(() => {
      setEnterProgress((current) => {
        if (current >= 100) return 100
        const step = Math.max(2, Math.round((100 - current) * 0.2))
        return Math.min(current + step, 100)
      })
    }, 120)

    const unlockTimer = window.setTimeout(() => {
      setEnterProgress(100)
      setEnterFadeOut(true)
      window.setTimeout(() => setStatus("unlocked"), ADMIN_ENTER_FADE_MS)
    }, ADMIN_ENTER_MS)

    return () => {
      window.clearInterval(progressTimer)
      window.clearTimeout(unlockTimer)
    }
  }, [status])

  useEffect(() => {
    document.body.style.overflow = status === "entering" ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [status])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? "Could not sign in")
      }

      setPassword("")
      setStatus("entering")
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Could not sign in"
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const logout = useCallback(async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    setPassword("")
    setError("")
    setStatus("locked")
  }, [])

  if (status === "unlocked") {
    return (
      <AdminAuthContext.Provider value={{ logout }}>
        {children}
      </AdminAuthContext.Provider>
    )
  }

  if (status === "entering") {
    return (
      <LoadingScreen
        message="Opening admin..."
        value={enterProgress}
        className={cn(
          "z-50 transition-opacity duration-300",
          enterFadeOut && "pointer-events-none opacity-0"
        )}
      />
    )
  }

  return (
    <div className="relative flex min-h-[70vh] flex-1 flex-col overflow-hidden">
      <LandingBackground />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
        <Dialog open={status === "locked"} onOpenChange={() => {}}>
          <DialogContent
            showCloseButton={false}
            className="gap-5 sm:max-w-md"
            onEscapeKeyDown={(event) => event.preventDefault()}
            onInteractOutside={(event) => event.preventDefault()}
          >
            <DialogHeader className="items-center text-center sm:items-center sm:text-center">
              <div className="mb-1 flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                <Image
                  src="/music (1).png"
                  alt=""
                  width={48}
                  height={48}
                  className="size-11 object-contain"
                />
              </div>
              <Badge variant="secondary" className="gap-1.5">
                <Settings className="size-3.5" />
                Admin
              </Badge>
              <DialogTitle className="text-xl">Enter admin password</DialogTitle>
              <DialogDescription className="text-balance">
                {configured ? (
                  <>
                    This area is for managing the {APP_NAME} song catalog. Family
                    members on the request page do not need this password.
                  </>
                ) : (
                  <>
                    Set <code className="text-foreground">ADMIN_PASSWORD</code> in{" "}
                    <code className="text-foreground">.env.local</code>, restart the
                    dev server, then try again.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            {configured ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="admin-password" className="flex items-center gap-1.5 text-sm font-medium">
                    <KeyRound className="size-3.5 text-muted-foreground" />
                    Password
                  </label>
                  <Input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-10"
                    autoFocus
                    disabled={submitting}
                  />
                  {error ? (
                    <p className="flex items-center gap-1.5 text-sm text-destructive">
                      <Lock className="size-3.5 shrink-0" />
                      {error}
                    </p>
                  ) : null}
                </div>

                <DialogFooter className="gap-2 sm:justify-stretch">
                  <Button asChild variant="outline" type="button" className="sm:flex-1">
                    <Link href="/">
                      <ArrowLeft data-icon="inline-start" />
                      Back home
                    </Link>
                  </Button>
                  <Button
                    type="submit"
                    className="sm:flex-1"
                    disabled={submitting || !password.trim()}
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" data-icon="inline-start" />
                    ) : (
                      <Lock data-icon="inline-start" />
                    )}
                    {submitting ? "Checking..." : "Unlock admin"}
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <DialogFooter>
                <Button asChild className="w-full">
                  <Link href="/">
                    <ArrowLeft data-icon="inline-start" />
                    Back home
                  </Link>
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
