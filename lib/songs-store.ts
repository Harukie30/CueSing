import { readFile, writeFile } from "fs/promises"
import path from "path"

import type { Song } from "@/lib/types"
import { extractYoutubeId, fetchYoutubeMetadata, slugifySongId } from "@/lib/youtube"

const SONGS_PATH = path.join(process.cwd(), "data", "songs.json")

let cache: Song[] | null = null

async function readSongsFile(): Promise<Song[]> {
  const raw = await readFile(SONGS_PATH, "utf-8")
  return JSON.parse(raw) as Song[]
}

export async function getSongs(): Promise<Song[]> {
  if (!cache) {
    cache = await readSongsFile()
  }
  return cache
}

async function persistSongs(songs: Song[]) {
  cache = songs
  await writeFile(SONGS_PATH, `${JSON.stringify(songs, null, 2)}\n`, "utf-8")
}

export async function getSongById(id: string): Promise<Song | undefined> {
  const songs = await getSongs()
  return songs.find((song) => song.id === id)
}

export async function searchSongs(query: string): Promise<Song[]> {
  const songs = await getSongs()
  const normalized = query.trim().toLowerCase()
  if (!normalized) return songs

  return songs.filter((song) => {
    const haystack = `${song.title} ${song.artist} ${song.tags?.join(" ") ?? ""}`.toLowerCase()
    return haystack.includes(normalized)
  })
}

type AddSongInput = {
  youtubeUrl: string
  title: string
  artist: string
  tags?: string[]
}

export async function addSong(input: AddSongInput): Promise<Song> {
  const youtubeId = extractYoutubeId(input.youtubeUrl)
  if (!youtubeId) {
    throw new Error("Paste a valid YouTube link or video ID")
  }

  const title = input.title.trim()
  const artist = input.artist.trim()
  if (!title || !artist) {
    throw new Error("Title and artist are required")
  }

  const songs = await getSongs()
  if (songs.some((song) => song.youtubeId === youtubeId)) {
    throw new Error("This YouTube video is already in your catalog")
  }

  let id = slugifySongId(title, artist) || `song-${youtubeId}`
  if (songs.some((song) => song.id === id)) {
    id = `${id}-${youtubeId.slice(0, 6)}`
  }

  const song: Song = {
    id,
    title,
    artist,
    youtubeId,
    tags: input.tags?.filter(Boolean),
  }

  await persistSongs([...songs, song])
  return song
}

type SaveSongFromYoutubeInput = {
  youtubeId: string
  title: string
  artist: string
}

export async function saveSongFromYoutube(
  input: SaveSongFromYoutubeInput
): Promise<{ song: Song; created: boolean }> {
  const youtubeId = input.youtubeId.trim()
  const title = input.title.trim()
  const artist = input.artist.trim() || "YouTube"

  if (!youtubeId || !title) {
    throw new Error("Video info is required")
  }

  const songs = await getSongs()
  const existing = songs.find((song) => song.youtubeId === youtubeId)
  if (existing) {
    return { song: existing, created: false }
  }

  let id = slugifySongId(title, artist) || `song-${youtubeId}`
  if (songs.some((song) => song.id === id)) {
    id = `${id}-${youtubeId.slice(0, 6)}`
  }

  const song: Song = {
    id,
    title,
    artist,
    youtubeId,
    tags: ["youtube-search"],
  }

  await persistSongs([...songs, song])
  return { song, created: true }
}

export async function removeSong(id: string): Promise<Song> {
  const songs = await getSongs()
  const index = songs.findIndex((song) => song.id === id)
  if (index === -1) {
    throw new Error("Song not found")
  }

  const [removed] = songs.splice(index, 1)
  await persistSongs(songs)
  return removed
}

export async function previewSongFromUrl(youtubeUrl: string) {
  const youtubeId = extractYoutubeId(youtubeUrl)
  if (!youtubeId) {
    throw new Error("Paste a valid YouTube link or video ID")
  }

  const metadata = await fetchYoutubeMetadata(youtubeId)
  const cleanedTitle = metadata.title
    .replace(/\s*\(karaoke.*?\)\s*/gi, "")
    .replace(/\s*\[karaoke.*?\]\s*/gi, "")
    .trim()

  return {
    youtubeId,
    title: cleanedTitle || metadata.title,
    artist: metadata.author_name,
    rawTitle: metadata.title,
  }
}
