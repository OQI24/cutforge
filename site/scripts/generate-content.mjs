import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const siteRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(siteRoot, '..')
const projectsRoot = path.join(repoRoot, 'projects')
const outRoot = path.join(siteRoot, 'public', 'content')

function readTitle(md, fallback) {
  const match = md.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : fallback
}

function readProjectTitle(projectDir, slug) {
  const readme = path.join(projectDir, 'README.md')
  if (fs.existsSync(readme)) {
    const text = fs.readFileSync(readme, 'utf8')
    const h1 = text.match(/^#\s+(.+)$/m)
    if (h1) return h1[1].replace(/\s*—\s*.+$/, '').trim()
  }
  return slug
}

function ensureCleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
}

function main() {
  ensureCleanDir(outRoot)

  if (!fs.existsSync(projectsRoot)) {
    const empty = { generatedAt: new Date().toISOString(), projects: [] }
    fs.writeFileSync(path.join(outRoot, 'manifest.json'), JSON.stringify(empty, null, 2))
    console.log('No projects/ — empty manifest')
    return
  }

  const projectSlugs = fs
    .readdirSync(projectsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b, 'en'))

  const projects = []

  for (const slug of projectSlugs) {
    const projectDir = path.join(projectsRoot, slug)
    const scenariosDir = path.join(projectDir, 'scenarios')
    const outProject = path.join(outRoot, 'projects', slug, 'scenarios')
    fs.mkdirSync(outProject, { recursive: true })

    const scenarios = []
    if (fs.existsSync(scenariosDir)) {
      const files = fs
        .readdirSync(scenariosDir)
        .filter((f) => f.endsWith('.md'))
        .sort((a, b) => a.localeCompare(b, 'en'))

      for (const file of files) {
        const src = path.join(scenariosDir, file)
        const md = fs.readFileSync(src, 'utf8')
        const id = file.replace(/\.md$/i, '')
        const title = readTitle(md, id)
        const indexMatch = id.match(/^(\d+)/)
        const index = indexMatch ? Number(indexMatch[1]) : null

        fs.copyFileSync(src, path.join(outProject, file))
        scenarios.push({
          id,
          file,
          title,
          index,
          path: `projects/${slug}/scenarios/${file}`,
        })
      }
    }

    projects.push({
      slug,
      title: readProjectTitle(projectDir, slug),
      scenarioCount: scenarios.length,
      scenarios,
    })
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    projects,
  }

  fs.writeFileSync(path.join(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(
    `Content: ${projects.length} project(s), ${projects.reduce((n, p) => n + p.scenarioCount, 0)} scenario(s)`,
  )
}

main()
