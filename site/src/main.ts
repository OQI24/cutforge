import './styles/main.css'
import {
  findProject,
  findScenario,
  loadManifest,
  loadScenarioMarkdown,
} from './lib/content'
import { onRouteChange, parseRoute, hrefHome } from './lib/router'
import { mountCrepe, type ViewerHandle } from './lib/milkdown-lazy'
import { currentTheme, initTheme, toggleTheme } from './lib/theme'
import { bindHomeSearch, renderHome } from './views/home'
import { renderProject } from './views/project'
import { bindReaderChrome, downloadMarkdown, renderScenarioFrame } from './views/scenario'
import { escapeHtml, iconMoon, iconSun, renderPage } from './components/shell'

const rootEl = document.querySelector<HTMLDivElement>('#app')
if (!rootEl) throw new Error('#app missing')
const app: HTMLDivElement = rootEl

let viewer: ViewerHandle | null = null
let cleanupReader: (() => void) | null = null

initTheme()

async function destroyViewer() {
  cleanupReader?.()
  cleanupReader = null
  if (viewer) {
    await viewer.destroy()
    viewer = null
  }
}

function setDocumentTitle(parts: string[]) {
  document.title = [...parts, 'cutforge'].join(' · ')
}

function syncThemeToggle(btn: HTMLButtonElement) {
  const dark = currentTheme() === 'dark'
  btn.innerHTML = dark ? iconSun : iconMoon
  btn.title = dark ? 'Светлая тема' : 'Тёмная тема'
  btn.setAttribute('aria-label', btn.title)
}

function wireThemeToggle(btn: HTMLButtonElement | null) {
  if (!btn) return
  syncThemeToggle(btn)
  btn.addEventListener('click', () => {
    toggleTheme()
    syncThemeToggle(btn)
  })
}

/** On non-home pages keep a compact theme control top-right. */
function ensureFloatingTheme(show: boolean) {
  let btn = document.querySelector<HTMLButtonElement>('#theme-toggle-float')
  if (!show) {
    btn?.remove()
    return
  }
  if (!btn) {
    btn = document.createElement('button')
    btn.id = 'theme-toggle-float'
    btn.type = 'button'
    btn.className = 'icon-btn theme-fab'
    document.body.appendChild(btn)
    wireThemeToggle(btn)
  } else {
    syncThemeToggle(btn)
  }
}

async function render() {
  await destroyViewer()
  const route = parseRoute()

  try {
    const manifest = await loadManifest()

    if (route.name === 'home') {
      setDocumentTitle(['Сценарии'])
      ensureFloatingTheme(true)
      app.innerHTML = renderHome(manifest)
      bindHomeSearch(app)
      return
    }

    if (route.name === 'project') {
      const project = findProject(manifest, route.project)
      if (!project) {
        renderNotFound(`Проект «${route.project}» не найден`)
        return
      }
      setDocumentTitle([project.title])
      ensureFloatingTheme(true)
      app.innerHTML = renderProject(project)
      return
    }

    if (route.name === 'scenario') {
      const project = findProject(manifest, route.project)
      if (!project) {
        renderNotFound(`Проект «${route.project}» не найден`)
        return
      }
      const scenario = findScenario(project, route.scenario)
      if (!scenario) {
        renderNotFound(`Сценарий «${route.scenario}» не найден`)
        return
      }

      setDocumentTitle([scenario.title, project.title])
      ensureFloatingTheme(true)
      app.innerHTML = renderScenarioFrame(project, scenario)
      cleanupReader = bindReaderChrome(app)

      const milkRoot = document.querySelector<HTMLElement>('#milkdown-root')
      const downloadBtn = document.querySelector<HTMLButtonElement>('[data-action="download"]')
      if (!milkRoot) return

      try {
        const markdown = await loadScenarioMarkdown(scenario.path)
        milkRoot.className = ''
        viewer = await mountCrepe(milkRoot, markdown)
      } catch (err) {
        milkRoot.className = 'error'
        milkRoot.textContent = err instanceof Error ? err.message : 'Не вышло открыть файл'
        return
      }

      downloadBtn?.addEventListener('click', () => {
        if (!viewer) return
        downloadMarkdown(scenario.file, viewer.getMarkdown())
      })

      return
    }

    renderNotFound('Такой страницы нет')
  } catch (err) {
    ensureFloatingTheme(true)
    app.innerHTML = renderPage({
      crumbs: [{ label: 'Проекты', href: hrefHome() }],
      body: `<div class="error">${escapeHtml(err instanceof Error ? err.message : 'Сбой загрузки')}</div>`,
    })
  }
}

function renderNotFound(message: string) {
  setDocumentTitle(['Не найдено'])
  ensureFloatingTheme(true)
  app.innerHTML = renderPage({
    crumbs: [
      { label: 'Проекты', href: hrefHome() },
      { label: '404' },
    ],
    body: `
      <h1 class="page-title">Нет такой страницы</h1>
      <p class="meta">${escapeHtml(message)}</p>
      <p><a href="${hrefHome()}">К проектам</a></p>
    `,
  })
}

onRouteChange(() => {
  void render()
})

void render()
