import type { ProjectMeta, ScenarioMeta } from '../types'
import {
  escapeHtml,
  iconCompress,
  iconDownload,
  iconExpand,
  renderPage,
} from '../components/shell'
import { hrefHome, hrefProject } from '../lib/router'

const WIDTH_KEY = 'cutforge-reader-width'

export function renderScenarioFrame(project: ProjectMeta, scenario: ScenarioMeta): string {
  return renderPage({
    scenario: true,
    crumbs: [
      { label: 'Проекты', href: hrefHome() },
      { label: project.title, href: hrefProject(project.slug) },
      { label: scenario.title },
    ],
    body: `
      <div class="reader-shell" id="reader-shell">
        <div class="reader-resize reader-resize--left" data-resize="left" title="Ширина" aria-hidden="true"></div>
        <div class="reader-resize reader-resize--right" data-resize="right" title="Ширина" aria-hidden="true"></div>
        <div class="reader">
          <div class="reader-actions">
            <button
              type="button"
              class="icon-btn"
              data-action="download"
              title="Скачать MD"
              aria-label="Скачать MD"
            >${iconDownload}</button>
            <button
              type="button"
              class="icon-btn"
              data-action="expand"
              title="На весь экран"
              aria-label="На весь экран"
              aria-pressed="false"
            >${iconExpand}</button>
          </div>
          <div id="milkdown-root" class="loading">Загрузка…</div>
        </div>
      </div>
    `,
  })
}

export function downloadMarkdown(filename: string, markdown: string): void {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.md') ? filename : `${filename}.md`
  a.click()
  URL.revokeObjectURL(url)
}

function defaultWidth(): number {
  return Math.min(Math.max(window.innerWidth - 48, 640), 1600)
}

function clampWidth(px: number): number {
  const min = 560
  const max = Math.max(window.innerWidth - 24, min)
  return Math.min(Math.max(px, min), max)
}

function applyWidth(shell: HTMLElement, px: number): void {
  const width = clampWidth(px)
  shell.style.setProperty('--reader-width', `${width}px`)
}

export function bindReaderChrome(root: HTMLElement): () => void {
  const shell = root.querySelector<HTMLElement>('#reader-shell')
  const expandBtn = root.querySelector<HTMLButtonElement>('[data-action="expand"]')
  if (!shell) return () => undefined

  const stored = Number(localStorage.getItem(WIDTH_KEY))
  applyWidth(shell, Number.isFinite(stored) && stored > 0 ? stored : defaultWidth())

  let expanded = false
  let dragSide: 'left' | 'right' | null = null
  let startX = 0
  let startWidth = 0

  const setExpanded = (value: boolean) => {
    expanded = value
    shell.classList.toggle('reader-shell--expanded', expanded)
    document.body.classList.toggle('reader-expanded', expanded)
    if (expandBtn) {
      expandBtn.setAttribute('aria-pressed', expanded ? 'true' : 'false')
      expandBtn.title = expanded ? 'Свернуть' : 'На весь экран'
      expandBtn.setAttribute('aria-label', expandBtn.title)
      expandBtn.innerHTML = expanded ? iconCompress : iconExpand
    }
  }

  const onExpandClick = () => setExpanded(!expanded)

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && expanded) {
      e.preventDefault()
      setExpanded(false)
    }
  }

  const onPointerDown = (e: PointerEvent) => {
    if (expanded) return
    const target = e.target as HTMLElement | null
    const handle = target?.closest<HTMLElement>('[data-resize]')
    if (!handle || !shell.contains(handle)) return
    const side = handle.dataset.resize
    if (side !== 'left' && side !== 'right') return
    dragSide = side
    startX = e.clientX
    startWidth = shell.getBoundingClientRect().width
    handle.setPointerCapture(e.pointerId)
    document.body.classList.add('is-resizing-reader')
    e.preventDefault()
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!dragSide) return
    const delta = e.clientX - startX
    // Both edges grow/shrink from center: left drag left = wider, right drag right = wider
    const next =
      dragSide === 'right' ? startWidth + delta * 2 : startWidth - delta * 2
    applyWidth(shell, next)
  }

  const onPointerUp = (e: PointerEvent) => {
    if (!dragSide) return
    dragSide = null
    document.body.classList.remove('is-resizing-reader')
    const width = shell.getBoundingClientRect().width
    localStorage.setItem(WIDTH_KEY, String(Math.round(width)))
    try {
      ;(e.target as HTMLElement).releasePointerCapture?.(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const onResizeWindow = () => {
    if (expanded) return
    const current = shell.getBoundingClientRect().width
    applyWidth(shell, current)
  }

  expandBtn?.addEventListener('click', onExpandClick)
  window.addEventListener('keydown', onKeydown)
  shell.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('resize', onResizeWindow)

  return () => {
    setExpanded(false)
    expandBtn?.removeEventListener('click', onExpandClick)
    window.removeEventListener('keydown', onKeydown)
    shell.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('resize', onResizeWindow)
    document.body.classList.remove('is-resizing-reader', 'reader-expanded')
  }
}
