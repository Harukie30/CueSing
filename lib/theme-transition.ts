const THEME_TRANSITION_MS = 350
let themeTransitionTimeout: number | undefined

export function withThemeTransition(callback: () => void) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    callback()
    return
  }

  const root = document.documentElement

  if ("startViewTransition" in document) {
    root.classList.add("theme-view-transition")
    const transition = document.startViewTransition(callback)

    transition.finished.finally(() => {
      root.classList.remove("theme-view-transition")
    })

    return
  }

  window.clearTimeout(themeTransitionTimeout)
  root.classList.add("theme-transition")
  window.requestAnimationFrame(() => {
    callback()

    themeTransitionTimeout = window.setTimeout(() => {
      root.classList.remove("theme-transition")
    }, THEME_TRANSITION_MS)
  })
}
