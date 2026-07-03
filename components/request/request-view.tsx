"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import {
  ArrowLeft,
  ListMusic,
  Loader2,
  PlayCircle,
  Search,
  Sparkles,
  User,
} from "lucide-react"
import { toast } from "sonner"

import { useQueue } from "@/hooks/use-queue"
import { LandingBackground } from "@/components/landing/landing-background"
import { RequestQueuePanel } from "@/components/request/request-queue-panel"
import { RequestSongCard } from "@/components/request/request-song-card"
import { YoutubeResultCard } from "@/components/request/youtube-result-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { APP_NAME } from "@/lib/brand"
import type { Song, YoutubeSearchResult } from "@/lib/types"
import { cn } from "@/lib/utils"

const REQUESTER_KEY = "cuesing-requester-name"

function SongListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-2xl bg-card/50" />
      ))}
    </div>
  )
}

export function RequestView() {
  const [catalogQuery, setCatalogQuery] = useState("")
  const [youtubeQuery, setYoutubeQuery] = useState("")
  const [name, setName] = useState("")
  const [songs, setSongs] = useState<Song[]>([])
  const [youtubeResults, setYoutubeResults] = useState<YoutubeSearchResult[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [youtubeLoading, setYoutubeLoading] = useState(false)
  const [youtubeSearched, setYoutubeSearched] = useState(false)
  const [requestingId, setRequestingId] = useState<string | null>(null)
  const { queue, refresh: refreshQueue } = useQueue()

  const queueCount = queue.upNext.length + (queue.nowPlaying ? 1 : 0)

  useEffect(() => {
    const saved = window.localStorage.getItem(REQUESTER_KEY)
    if (saved) setName(saved)
  }, [])

  const fetchSongs = useCallback(async (search: string) => {
    setCatalogLoading(true)
    const params = search ? `?q=${encodeURIComponent(search)}` : ""
    const response = await fetch(`/api/songs${params}`, { cache: "no-store" })
    if (!response.ok) {
      setCatalogLoading(false)
      return
    }
    const data = (await response.json()) as { songs: Song[] }
    setSongs(data.songs)
    setCatalogLoading(false)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchSongs(catalogQuery)
    }, 250)

    return () => window.clearTimeout(timer)
  }, [catalogQuery, fetchSongs])

  function saveName(): string | null {
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error("Enter your name first")
      return null
    }
    window.localStorage.setItem(REQUESTER_KEY, trimmedName)
    return trimmedName
  }

  async function handleCatalogRequest(song: Song) {
    const trimmedName = saveName()
    if (!trimmedName) return

    setRequestingId(song.id)

    try {
      const response = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          songId: song.id,
          requestedBy: trimmedName,
        }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error ?? "Failed to request song")
      }

      toast.success(`Added "${song.title}" to the queue`)
      await refreshQueue()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to request song"
      toast.error(message)
    } finally {
      setRequestingId(null)
    }
  }

  async function handleYoutubeSearch() {
    if (!youtubeQuery.trim()) {
      toast.error("Type something to search on YouTube")
      return
    }

    setYoutubeLoading(true)
    setYoutubeSearched(true)

    try {
      const response = await fetch(
        `/api/youtube/search?q=${encodeURIComponent(youtubeQuery.trim())}`,
        { cache: "no-store" }
      )
      const data = (await response.json()) as {
        results?: YoutubeSearchResult[]
        error?: string
      }

      if (!response.ok) throw new Error(data.error ?? "YouTube search failed")

      setYoutubeResults(data.results ?? [])
      if ((data.results ?? []).length === 0) {
        toast.message("No embeddable videos found. Try different words.")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "YouTube search failed"
      toast.error(message)
      setYoutubeResults([])
    } finally {
      setYoutubeLoading(false)
    }
  }

  async function handleYoutubeRequest(result: YoutubeSearchResult) {
    const trimmedName = saveName()
    if (!trimmedName) return

    setRequestingId(result.youtubeId)

    try {
      const response = await fetch("/api/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtubeId: result.youtubeId,
          title: result.title,
          artist: result.channelTitle,
          requestedBy: trimmedName,
        }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { error?: string }
        throw new Error(data.error ?? "Failed to add song")
      }

      const data = (await response.json()) as { savedToCatalog?: boolean }
      toast.success(
        data.savedToCatalog
          ? "Added to the queue and family list"
          : "Added to the queue"
      )
      await refreshQueue()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add song"
      toast.error(message)
    } finally {
      setRequestingId(null)
    }
  }

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden landscape-short:min-h-0">
      <LandingBackground />

      <div
        className={cn(
          "mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8",
          "landscape-short:max-w-none landscape-short:grid landscape-short:grid-cols-[minmax(220px,0.9fr)_minmax(0,1.2fr)] landscape-short:items-start landscape-short:gap-x-4 landscape-short:gap-y-3 landscape-short:px-4 landscape-short:py-3"
        )}
      >
        <div className="flex items-center justify-between gap-4 landscape-short:col-span-2 landscape-short:gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">
              <ArrowLeft data-icon="inline-start" />
              Home
            </Link>
          </Button>
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <ListMusic />
            Request
          </Badge>
        </div>

        <div className="flex flex-col gap-6 landscape-short:col-start-1 landscape-short:max-h-[calc(100dvh-3.5rem)] landscape-short:gap-3 landscape-short:overflow-y-auto">
        <section className="relative overflow-hidden rounded-2xl bg-card/55 px-5 py-6 text-center backdrop-blur-sm sm:px-6 sm:py-7 landscape-short:px-4 landscape-short:py-3 landscape-short:text-left">
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-1/2 size-32 -translate-x-1/2 rounded-full bg-primary/15 blur-2xl landscape-short:left-0 landscape-short:size-20 landscape-short:translate-x-0"
          />
          <div className="relative flex flex-col items-center gap-3 landscape-short:flex-row landscape-short:items-center landscape-short:gap-3">
            <Image
              src="/microphone.png"
              alt=""
              width={72}
              height={72}
              className="size-16 object-contain sm:size-[4.5rem] landscape-short:size-12"
            />
            <div className="min-w-0 space-y-1 landscape-short:flex-1">
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                {APP_NAME}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight landscape-short:text-lg">
                Request a song
              </h1>
              <p className="text-sm text-muted-foreground text-balance landscape-short:line-clamp-2 landscape-short:text-xs">
                Pick from your family list or search YouTube and choose the version you want.
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5 px-3 py-1 landscape-short:shrink-0">
              <Sparkles />
              {queueCount} in queue
            </Badge>
          </div>
        </section>

        <section className="rounded-2xl bg-card/55 p-4 backdrop-blur-sm sm:p-5 landscape-short:p-3">
          <div className="space-y-2">
            <label
              htmlFor="requester-name"
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              <User className="size-3.5 text-muted-foreground" />
              Your name
            </label>
            <Input
              id="requester-name"
              placeholder="e.g. Mom, Dad, Alex"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10"
            />
          </div>
        </section>

        <RequestQueuePanel queue={queue} />
        </div>

        <Tabs
          defaultValue="catalog"
          className="gap-4 landscape-short:col-start-2 landscape-short:max-h-[calc(100dvh-3.5rem)] landscape-short:min-h-0 landscape-short:gap-3 landscape-short:overflow-y-auto"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="catalog">Family list</TabsTrigger>
            <TabsTrigger value="youtube" className="gap-1.5">
              <PlayCircle />
              YouTube
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="catalog-search"
                className="flex items-center gap-1.5 text-sm font-medium"
              >
                <Search className="size-3.5 text-muted-foreground" />
                Search family list
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="catalog-search"
                  className="h-10 pl-9"
                  placeholder="Title, artist, or tag..."
                  value={catalogQuery}
                  onChange={(event) => setCatalogQuery(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 px-1">
                <h2 className="text-sm font-medium">Karaoke catalog</h2>
                {!catalogLoading ? (
                  <span className="text-xs text-muted-foreground">
                    {songs.length} song{songs.length === 1 ? "" : "s"}
                  </span>
                ) : null}
              </div>

              {catalogLoading ? (
                <SongListSkeleton />
              ) : songs.length === 0 ? (
                <div className="rounded-2xl bg-card/50 px-4 py-10 text-center backdrop-blur-sm">
                  <p className="font-medium">No songs found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try the YouTube tab or add songs in{" "}
                    <Link href="/admin" className="text-primary hover:underline">
                      Manage songs
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="space-y-3 landscape-short:grid landscape-short:grid-cols-2 landscape-short:gap-2 landscape-short:space-y-0">
                  {songs.map((song) => (
                    <RequestSongCard
                      key={song.id}
                      song={song}
                      isRequesting={requestingId === song.id}
                      onRequest={handleCatalogRequest}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="youtube-search"
                className="flex items-center gap-1.5 text-sm font-medium"
              >
                <PlayCircle className="size-3.5 text-muted-foreground" />
                Search YouTube
              </label>
              <div className="flex gap-2">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="youtube-search"
                    className="h-10 pl-9"
                    placeholder="e.g. perfect ed sheeran karaoke"
                    value={youtubeQuery}
                    onChange={(event) => setYoutubeQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleYoutubeSearch()
                    }}
                  />
                </div>
                <Button
                  type="button"
                  className="shrink-0"
                  disabled={youtubeLoading}
                  onClick={handleYoutubeSearch}
                >
                  {youtubeLoading ? <Loader2 className="animate-spin" /> : "Search"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                See thumbnails and titles, then pick karaoke or MV yourself. Uses your
                daily YouTube API quota.
              </p>
            </div>

            <div className="space-y-3">
              {youtubeLoading ? (
                <SongListSkeleton />
              ) : !youtubeSearched ? (
                <div className="rounded-2xl bg-card/50 px-4 py-10 text-center backdrop-blur-sm">
                  <p className="font-medium">Search YouTube</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Type a song and tap Search to browse results.
                  </p>
                </div>
              ) : youtubeResults.length === 0 ? (
                <div className="rounded-2xl bg-card/50 px-4 py-10 text-center backdrop-blur-sm">
                  <p className="font-medium">No results</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adding &quot;karaoke&quot; or the artist name.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 landscape-short:grid landscape-short:grid-cols-2 landscape-short:gap-2 landscape-short:space-y-0">
                  {youtubeResults.map((result) => (
                    <YoutubeResultCard
                      key={result.youtubeId}
                      result={result}
                      isRequesting={requestingId === result.youtubeId}
                      onRequest={handleYoutubeRequest}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
