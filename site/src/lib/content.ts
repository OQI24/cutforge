import type { Manifest, ProjectMeta, ScenarioMeta } from '../types'

const base = import.meta.env.BASE_URL

export function contentUrl(relPath: string): string {
  const clean = relPath.replace(/^\//, '')
  return `${base}content/${clean}`
}

let cache: Manifest | null = null

export async function loadManifest(): Promise<Manifest> {
  if (cache) return cache
  const res = await fetch(contentUrl('manifest.json'), { cache: 'no-cache' })
  if (!res.ok) throw new Error(`Не удалось загрузить манифест (${res.status})`)
  cache = (await res.json()) as Manifest
  return cache
}

export function findProject(manifest: Manifest, slug: string): ProjectMeta | undefined {
  return manifest.projects.find((p) => p.slug === slug)
}

export function findScenario(
  project: ProjectMeta,
  scenarioId: string,
): ScenarioMeta | undefined {
  return project.scenarios.find((s) => s.id === scenarioId)
}

export async function loadScenarioMarkdown(relPath: string): Promise<string> {
  const res = await fetch(contentUrl(relPath), { cache: 'no-cache' })
  if (!res.ok) throw new Error(`Не удалось открыть сценарий (${res.status})`)
  return res.text()
}

export function neighbors(project: ProjectMeta, scenarioId: string) {
  const i = project.scenarios.findIndex((s) => s.id === scenarioId)
  return {
    prev: i > 0 ? project.scenarios[i - 1] : null,
    next: i >= 0 && i < project.scenarios.length - 1 ? project.scenarios[i + 1] : null,
  }
}
