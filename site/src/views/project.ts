import type { ProjectFormat, ProjectMeta } from '../types'
import { escapeHtml, renderPage } from '../components/shell'
import { hrefHome, hrefScenario } from '../lib/router'

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}.${m}.${y}`
}

function badgeClass(format: ProjectFormat): string {
  return format === 'horizontal' ? 'badge badge--horizontal' : 'badge badge--reels'
}

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

  const created = formatDate(project.created)
  const metaBits = [
    `<span class="${badgeClass(project.format)}">${escapeHtml(project.formatLabel)}</span>`,
    created ? `<span>${escapeHtml(created)}</span>` : '',
  ]
    .filter(Boolean)
    .join('')

  return renderPage({
    crumbs: [
      { label: 'Проекты', href: hrefHome() },
      { label: project.title },
    ],
    body: `
      <div class="project-heading">
        <h1 class="page-title page-title--flush">${escapeHtml(project.title)}</h1>
        <div class="project-heading__meta">${metaBits}</div>
      </div>
      ${rows}
    `,
  })
}
