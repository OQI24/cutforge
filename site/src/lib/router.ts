import type { Route } from '../types'

/** Hash routes keep GitHub Pages simple — no server rewrite needed. */
export function parseRoute(hash = window.location.hash): Route {
  const raw = hash.replace(/^#\/?/, '').replace(/\/$/, '')
  if (!raw) return { name: 'home' }

  const parts = raw.split('/').map(decodeURIComponent)

  if (parts[0] === 'p' && parts[1] && parts.length === 2) {
    return { name: 'project', project: parts[1] }
  }

  if (parts[0] === 'p' && parts[1] && parts[2] === 's' && parts[3]) {
    return { name: 'scenario', project: parts[1], scenario: parts[3] }
  }

  return { name: 'notfound' }
}

export function hrefHome(): string {
  return '#/'
}

export function hrefProject(slug: string): string {
  return `#/p/${encodeURIComponent(slug)}`
}

export function hrefScenario(project: string, scenario: string): string {
  return `#/p/${encodeURIComponent(project)}/s/${encodeURIComponent(scenario)}`
}

export function onRouteChange(handler: () => void): () => void {
  const listener = () => handler()
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}
