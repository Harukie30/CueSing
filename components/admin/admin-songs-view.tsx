"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import {
  ArrowLeft,
  ExternalLink,
  Link2,
  Loader2,
  LogOut,
  Plus,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { useAdminAuth } from "@/components/admin/admin-gate"
import { LandingBackground } from "@/components/landing/landing-background"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { APP_NAME } from "@/lib/brand"
import type { Song } from "@/lib/types"

type PreviewResponse = {
  youtubeId: string
  title: string
  artist: string
  rawTitle: string
}

export function AdminSongsView() {
  const { logout } = useAdminAuth()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [tags, setTags] = useState("")
  const [previewing, setPreviewing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [songToDelete, setSongToDelete] = useState<Song | null>(null)
  const [loggingOut, setLoggingOut] = useState(false)

  const fetchSongs = useCallback(async () => {
    setLoading(true)
    const response = await fetch("/api/admin/songs", { cache: "no-store" })
    if (!response.ok) {
      setLoading(false)
      toast.error("Could not load songs")
      return
    }
    const data = (await response.json()) as { songs: Song[] }
    setSongs(data.songs)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchSongs()
  }, [fetchSongs])

  async function handlePreview() {
    if (!youtubeUrl.trim()) {
      toast.error("Paste a YouTube link first")
      return
    }

    setPreviewing(true)
    try {
      const response = await fetch("/api/admin/songs/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl }),
      })

      const data = (await response.json()) as PreviewResponse & { error?: string }
      if (!response.ok) throw new Error(data.error ?? "Could not look up video")

      setTitle(data.title)
      setArtist(data.artist)
      toast.success("Video info loaded — edit if needed, then save")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not look up video"
      toast.error(message)
    } finally {
      setPreviewing(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeUrl,
          title,
          artist,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      const data = (await response.json()) as { song?: Song; error?: string }
      if (!response.ok) throw new Error(data.error ?? "Failed to save song")

      toast.success(`Added "${data.song?.title}" to the catalog`)
      setYoutubeUrl("")
      setTitle("")
      setArtist("")
      setTags("")
      await fetchSongs()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save song"
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!songToDelete) return

    const { id, title } = songToDelete
    setDeletingId(id)

    try {
      const response = await fetch(`/api/admin/songs/${id}`, { method: "DELETE" })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(data.error ?? "Failed to delete song")

      toast.success(`Removed "${title}" from the catalog`)
      setSongToDelete(null)
      await fetchSongs()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete song"
      toast.error(message)
    } finally {
      setDeletingId(null)
    }
  }

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      toast.success("Signed out of admin")
    } catch {
      toast.error("Could not sign out")
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <LandingBackground />

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 landscape-short:max-w-4xl landscape-short:gap-4 landscape-short:py-3">
        <div className="flex items-center justify-between gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              Home
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loggingOut}
              onClick={() => void handleLogout()}
            >
              {loggingOut ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <LogOut data-icon="inline-start" />
              )}
              Log out
            </Button>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Settings />
              Admin
            </Badge>
          </div>
        </div>

        <section className="relative overflow-hidden rounded-2xl bg-card/55 px-5 py-6 text-center backdrop-blur-sm sm:px-6">
          <div className="relative flex flex-col items-center gap-3">
            <Image
              src="/music (1).png"
              alt=""
              width={72}
              height={72}
              className="size-16 object-contain"
            />
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                {APP_NAME}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">Manage songs</h1>
              <p className="mx-auto max-w-md text-sm text-muted-foreground text-balance">
                Paste a YouTube karaoke link, check the title, save — no JSON editing needed.
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5 px-3 py-1">
              <Sparkles />
              {songs.length} songs in catalog
            </Badge>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl bg-card/55 p-4 backdrop-blur-sm sm:p-5 landscape-short:p-4">
          <div className="space-y-2">
            <label htmlFor="youtube-url" className="flex items-center gap-1.5 text-sm font-medium">
              <Link2 className="size-3.5 text-muted-foreground" />
              YouTube link
            </label>
            <Input
              id="youtube-url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
              className="h-10"
            />
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={previewing}
              onClick={handlePreview}
            >
              {previewing ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <ExternalLink data-icon="inline-start" />
              )}
              {previewing ? "Looking up..." : "Load video info"}
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="song-title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="song-title"
                placeholder="Song title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="song-artist" className="text-sm font-medium">
                Artist
              </label>
              <Input
                id="song-artist"
                placeholder="Artist name"
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="song-tags" className="text-sm font-medium">
              Tags (optional)
            </label>
            <Input
              id="song-tags"
              placeholder="pop, karaoke, english"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate with commas — helps family search on the request page.
            </p>
          </div>

          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : (
              <Plus data-icon="inline-start" />
            )}
            {saving ? "Saving..." : "Save to catalog"}
          </Button>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-medium">Your catalog</h2>
            {!loading ? (
              <span className="text-xs text-muted-foreground">{songs.length} total</span>
            ) : null}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-2xl bg-card/50" />
              ))}
            </div>
          ) : songs.length === 0 ? (
            <div className="rounded-2xl bg-card/50 px-4 py-10 text-center">
              <p className="font-medium">No songs yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first karaoke link above.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {songs.map((song) => (
                <article
                  key={song.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-card/70 p-4 backdrop-blur-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{song.title}</p>
                    <p className="truncate text-sm text-muted-foreground">{song.artist}</p>
                    <a
                      href={`https://www.youtube.com/watch?v=${song.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="size-3" />
                      Preview on YouTube
                    </a>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={deletingId === song.id}
                    onClick={() => setSongToDelete(song)}
                    aria-label={`Delete ${song.title}`}
                  >
                    <Trash2 />
                  </Button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <AlertDialog
        open={songToDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deletingId) setSongToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 />
            </AlertDialogMedia>
            <AlertDialogTitle>Remove this song?</AlertDialogTitle>
            <AlertDialogDescription>
              {songToDelete ? (
                <>
                  <span className="font-medium text-foreground">
                    &ldquo;{songToDelete.title}&rdquo;
                  </span>{" "}
                  by {songToDelete.artist} will be removed from your family catalog.
                  Songs already in the queue will not be affected.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deletingId !== null}
              onClick={(event) => {
                event.preventDefault()
                void confirmDelete()
              }}
            >
              {deletingId ? (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              ) : (
                <Trash2 data-icon="inline-start" />
              )}
              {deletingId ? "Removing..." : "Remove song"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
