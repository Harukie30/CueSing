const THEME_TRANSITION_MS = 300

export function withThemeTransition(callback: () => void) {
  const root = document.documentElement
  root.classList.add("theme-transition")
  callback()

  window.setTimeout(() => {
    root.classList.remove("theme-transition")
  }, THEME_TRANSITION_MS)
}
