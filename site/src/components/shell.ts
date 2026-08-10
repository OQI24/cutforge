export type Crumb = { label: string; href?: string }

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function renderCrumbs(crumbs: Crumb[]): string {
  if (crumbs.length === 0) return ''
  return `<nav class="crumbs" aria-label="Навигация">${crumbs
    .map((c, i) => {
      const sep = i === 0 ? '' : `<span class="crumbs__sep" aria-hidden="true">/</span>`
      const node = c.href
        ? `<a href="${c.href}">${escapeHtml(c.label)}</a>`
        : `<span>${escapeHtml(c.label)}</span>`
      return `${sep}${node}`
    })
    .join('')}</nav>`
}

export function renderPage(options: {
  crumbs?: Crumb[]
  body: string
  wide?: boolean
  home?: boolean
}): string {
  const crumbs = options.crumbs?.length ? renderCrumbs(options.crumbs) : ''
  const classes = [
    'page',
    options.wide ? 'page--wide' : '',
    options.home ? 'page--home' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return `<div class="${classes}">${crumbs}${options.body}</div>`
}

export const iconSun = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`

export const iconMoon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5Z"/></svg>`

export const iconDownload = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>`
