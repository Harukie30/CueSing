import type { QueueResponse } from "@/lib/types"

type QueueListener = (state: QueueResponse) => void

const globalForQueue = globalThis as typeof globalThis & {
  __cuesingQueueListeners?: Set<QueueListener>
}

function getListeners() {
  if (!globalForQueue.__cuesingQueueListeners) {
    globalForQueue.__cuesingQueueListeners = new Set()
  }
  return globalForQueue.__cuesingQueueListeners
}

export function subscribeQueue(listener: QueueListener) {
  getListeners().add(listener)
  return () => {
    getListeners().delete(listener)
  }
}

export function publishQueue(state: QueueResponse) {
  for (const listener of getListeners()) {
    listener(state)
  }
}
