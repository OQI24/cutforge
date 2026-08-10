export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'cutforge-theme'

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function resolveTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return systemTheme()
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

export function initTheme(): Theme {
  const theme = resolveTheme()
  applyTheme(theme)

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(systemTheme())
      window.dispatchEvent(new Event('cutforge-theme'))
    }
  })

  return theme
}

export function toggleTheme(): Theme {
  const next: Theme = resolveTheme() === 'dark' ? 'light' : 'dark'
  localStorage.setItem(STORAGE_KEY, next)
  applyTheme(next)
  window.dispatchEvent(new Event('cutforge-theme'))
  return next
}

export function currentTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || resolveTheme()
}
