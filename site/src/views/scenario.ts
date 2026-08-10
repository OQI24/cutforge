import type { ProjectMeta, ScenarioMeta } from '../types'
import { escapeHtml, iconDownload, renderPage } from '../components/shell'
import { hrefHome, hrefProject } from '../lib/router'

export function renderScenarioFrame(project: ProjectMeta, scenario: ScenarioMeta): string {
  return renderPage({
    wide: true,
    crumbs: [
      { label: 'Проекты', href: hrefHome() },
      { label: project.title, href: hrefProject(project.slug) },
      { label: scenario.title },
    ],
    body: `
      <div class="reader-wrap">
        <button
          type="button"
          class="icon-btn download-fab"
          data-action="download"
          title="Скачать MD"
          aria-label="Скачать MD"
        >${iconDownload}</button>
        <div class="reader">
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
