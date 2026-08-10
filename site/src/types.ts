export type ScenarioMeta = {
  id: string
  file: string
  title: string
  index: number | null
  path: string
}

export type ProjectMeta = {
  slug: string
  title: string
  scenarioCount: number
  scenarios: ScenarioMeta[]
}

export type Manifest = {
  generatedAt: string
  projects: ProjectMeta[]
}

export type Route =
  | { name: 'home' }
  | { name: 'project'; project: string }
  | { name: 'scenario'; project: string; scenario: string }
  | { name: 'notfound' }
