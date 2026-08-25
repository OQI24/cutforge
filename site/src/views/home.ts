import type { Manifest, ProjectFormat } from '../types'
import { escapeHtml, renderPage } from '../components/shell'
import { hrefProject } from '../lib/router'

function pluralFiles(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} файл`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} файла`
  return `${n} файлов`
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}.${m}.${y}`
}

function badgeClass(format: ProjectFormat): string {
  return format === 'horizontal' ? 'badge badge--horizontal' : 'badge badge--reels'
}

export function renderHome(manifest: Manifest): string {
  const cards =
    manifest.projects.length === 0
      ? `<div class="empty">В <code>projects/</code> пока нет проектов со сценариями.</div>`
      : manifest.projects
          .map((p) => {
            const created = formatDate(p.created)
            const metaBits = [created, pluralFiles(p.scenarioCount)].filter(Boolean).join(' · ')
            return `
            <a
              class="project-card"
              href="${hrefProject(p.slug)}"
              data-project-title="${escapeHtml(p.title)}"
              data-project-slug="${escapeHtml(p.slug)}"
              data-project-format="${escapeHtml(p.format)}"
            >
              <span class="project-card__main">
                <span class="project-card__top">
                  <span class="${badgeClass(p.format)}">${escapeHtml(p.formatLabel)}</span>
                  <span class="project-card__title">${escapeHtml(p.title)}</span>
                </span>
                <span class="project-card__meta">${escapeHtml(metaBits)}</span>
              </span>
            </a>`
          })
          .join('')

  return renderPage({
    home: true,
    body: `
      <div class="home">
        <div class="home__head">
          <h1 class="page-title page-title--flush">Сценарии</h1>
        </div>
        <div class="home__toolbar">
          <label class="home__search">
            <span class="visually-hidden">Поиск проекта</span>
            <input
              type="search"
              id="project-search"
              placeholder="Поиск проекта…"
              autocomplete="off"
              spellcheck="false"
            />
          </label>
          <label class="home__filter">
            <span class="visually-hidden">Формат</span>
            <select id="project-format-filter" aria-label="Фильтр по формату">
              <option value="all">Все</option>
              <option value="reels">Рилс</option>
              <option value="horizontal">Горизонт</option>
            </select>
          </label>
        </div>
        <div class="project-scroll" id="project-list">
          <div class="project-grid">${cards}</div>
          <div class="empty home__empty" id="project-search-empty" hidden>Ничего не нашлось</div>
        </div>
      </div>
    `,
  })
}

export function bindHomeSearch(root: HTMLElement): void {
  const input = root.querySelector<HTMLInputElement>('#project-search')
  const filter = root.querySelector<HTMLSelectElement>('#project-format-filter')
  const empty = root.querySelector<HTMLElement>('#project-search-empty')
  const cards = [...root.querySelectorAll<HTMLAnchorElement>('.project-card')]
  if (!input) return

  const apply = () => {
    const q = input.value.trim().toLocaleLowerCase('ru')
    const format = filter?.value || 'all'
    let visible = 0
    for (const card of cards) {
      const title = (card.dataset.projectTitle || '').toLocaleLowerCase('ru')
      const slug = (card.dataset.projectSlug || '').toLocaleLowerCase('ru')
      const cardFormat = card.dataset.projectFormat || ''
      const textMatch = !q || title.includes(q) || slug.includes(q)
      const formatMatch = format === 'all' || cardFormat === format
      const match = textMatch && formatMatch
      card.hidden = !match
      if (match) visible += 1
    }
    if (empty) empty.hidden = visible > 0 || cards.length === 0
  }

  input.addEventListener('input', apply)
  filter?.addEventListener('change', apply)
}
