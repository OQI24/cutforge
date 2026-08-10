import type { Manifest } from '../types'
import { escapeHtml, iconMoon, iconSun, renderPage } from '../components/shell'
import { hrefProject } from '../lib/router'
import { currentTheme } from '../lib/theme'

function pluralFiles(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} файл`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} файла`
  return `${n} файлов`
}

export function renderHome(manifest: Manifest): string {
  const dark = currentTheme() === 'dark'
  const cards =
    manifest.projects.length === 0
      ? `<div class="empty">В <code>projects/</code> пока нет проектов со сценариями.</div>`
      : manifest.projects
          .map(
            (p) => `
            <a class="project-card" href="${hrefProject(p.slug)}" data-project-title="${escapeHtml(p.title)}" data-project-slug="${escapeHtml(p.slug)}">
              <span class="project-card__title">${escapeHtml(p.title)}</span>
              <span class="project-card__count">${pluralFiles(p.scenarioCount)}</span>
            </a>`,
          )
          .join('')

  return renderPage({
    home: true,
    body: `
      <div class="home">
        <div class="home__head">
          <h1 class="page-title page-title--flush">Сценарии</h1>
          <button
            type="button"
            id="theme-toggle"
            class="icon-btn"
            title="${dark ? 'Светлая тема' : 'Тёмная тема'}"
            aria-label="${dark ? 'Светлая тема' : 'Тёмная тема'}"
          >${dark ? iconSun : iconMoon}</button>
        </div>
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
  const empty = root.querySelector<HTMLElement>('#project-search-empty')
  const cards = [...root.querySelectorAll<HTMLAnchorElement>('.project-card')]
  if (!input) return

  const apply = () => {
    const q = input.value.trim().toLocaleLowerCase('ru')
    let visible = 0
    for (const card of cards) {
      const title = (card.dataset.projectTitle || '').toLocaleLowerCase('ru')
      const slug = (card.dataset.projectSlug || '').toLocaleLowerCase('ru')
      const match = !q || title.includes(q) || slug.includes(q)
      card.hidden = !match
      if (match) visible += 1
    }
    if (empty) empty.hidden = visible > 0 || cards.length === 0
  }

  input.addEventListener('input', apply)
}
