import type { ProjectMeta } from '../types'
import { escapeHtml, renderPage } from '../components/shell'
import { hrefHome, hrefScenario } from '../lib/router'

export function renderProject(project: ProjectMeta): string {
  const rows =
    project.scenarios.length === 0
      ? `<div class="empty">В <code>scenarios/</code> нет markdown-файлов.</div>`
      : `<ul class="file-list">
          ${project.scenarios
            .map(
              (s) => `
            <li>
              <a class="file-row" href="${hrefScenario(project.slug, s.id)}">
                <span class="file-row__id">${escapeHtml(s.id)}</span>
                <span class="file-row__title">${escapeHtml(s.title)}</span>
              </a>
            </li>`,
            )
            .join('')}
        </ul>`

  return renderPage({
    crumbs: [
      { label: 'Проекты', href: hrefHome() },
      { label: project.title },
    ],
    body: `
      <h1 class="page-title">${escapeHtml(project.title)}</h1>
      ${rows}
    `,
  })
}
