import { getSongById, saveSongFromYoutube } from "@/lib/songs-store"
import { publishQueue } from "@/lib/queue-events"
import type { QueueItem, QueueResponse } from "@/lib/types"

type AddToQueueInput = {
  songId: string
  requestedBy: string
}

type AddYoutubeToQueueInput = {
  youtubeId: string
  title: string
  artist: string
  requestedBy: string
}

const queue: QueueItem[] = []

function createId() {
  return crypto.randomUUID()
}

function getQueuedItems() {
  return queue.filter((item) => item.status === "queued")
}

function getPlayingItem() {
  return queue.find((item) => item.status === "playing") ?? null
}

function startNextIfIdle() {
  if (getPlayingItem()) return

  const next = getQueuedItems()[0]
  if (!next) return

  next.status = "playing"
}

export function getQueueState(): QueueResponse {
  clearFinishedItems()
  startNextIfIdle()

  return {
    nowPlaying: getPlayingItem(),
    upNext: getQueuedItems(),
  }
}

function emitQueueChange() {
  publishQueue(getQueueState())
}

export async function addToQueue({ songId, requestedBy }: AddToQueueInput) {
  const song = await getSongById(songId)
  if (!song) {
    throw new Error("Song not found")
  }

  const name = requestedBy.trim()
  if (!name) {
    throw new Error("Name is required")
  }

  const item: QueueItem = {
    id: createId(),
    songId: song.id,
    title: song.title,
    artist: song.artist,
    youtubeId: song.youtubeId,
    requestedBy: name,
    status: "queued",
    addedAt: new Date().toISOString(),
  }

  queue.push(item)
  startNextIfIdle()
  emitQueueChange()

  return item
}

export async function addYoutubeToQueue({
  youtubeId,
  title,
  artist,
  requestedBy,
}: AddYoutubeToQueueInput) {
  const name = requestedBy.trim()
  if (!name) {
    throw new Error("Name is required")
  }

  if (!youtubeId.trim() || !title.trim()) {
    throw new Error("Video info is required")
  }

  const { song, created } = await saveSongFromYoutube({ youtubeId, title, artist })

  const item: QueueItem = {
    id: createId(),
    songId: song.id,
    title: song.title,
    artist: song.artist,
    youtubeId: song.youtubeId,
    requestedBy: name,
    status: "queued",
    addedAt: new Date().toISOString(),
  }

  queue.push(item)
  startNextIfIdle()
  emitQueueChange()

  return { item, savedToCatalog: created }
}

export function removeFromQueue(id: string) {
  const index = queue.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Queue item not found")
  }

  const [removed] = queue.splice(index, 1)

  if (removed.status === "playing") {
    startNextIfIdle()
  }

  emitQueueChange()
  return removed
}

export function advanceQueue() {
  const playing = getPlayingItem()
  if (playing) {
    playing.status = "done"
  }

  startNextIfIdle()
  emitQueueChange()

  return getQueueState()
}

export function clearFinishedItems() {
  const cutoff = queue.length
  for (let i = cutoff - 1; i >= 0; i -= 1) {
    if (queue[i].status === "done") {
      queue.splice(i, 1)
    }
  }
}
