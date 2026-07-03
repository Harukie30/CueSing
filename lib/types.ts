export type Song = {
  id: string
  title: string
  artist: string
  youtubeId: string
  tags?: string[]
}

export type QueueItem = {
  id: string
  songId: string
  title: string
  artist: string
  youtubeId: string
  requestedBy: string
  status: "queued" | "playing" | "done"
  addedAt: string
}

export type QueueResponse = {
  nowPlaying: QueueItem | null
  upNext: QueueItem[]
}

export type YoutubeSearchResult = {
  youtubeId: string
  title: string
  channelTitle: string
  thumbnailUrl: string
}
