# Архитектура проекта в cutforge

В `projects/` лежат **только живые проекты** (реальные серии/ролики). Отдельной папки `_template` нет — это было пустое место в дереве без пользы для клона.

Шаблон = эта статья + команды ниже. Пример живого проекта: `projects/toyota-4runner/`.

---

## Дерево одного проекта

```text
projects/<project-name>/
  project.json        # format: reels|horizontal, created: YYYY-MM-DD — дата съёмки исходников (баджи Pages)
  README.md           # что за серия, имя Resolve-проекта, ссылка на MEDIA
  scenarios/          # сценарии, shot lists (start_f / end_f)
  timelines/          # .drt для обмена нарезкой (без медиа)
  configs/            # пресеты Resolve только для этой серии
  notes/
    MEDIA.md          # абсолютные пути к исходникам на машине автора
    LOCKS.md          # таймлайны, которые нельзя пересобирать
    MUSIC.md          # промпт для Epidemic Sound Assistant + выбранные треки
```

Имя папки: латиница/kebab-case (`toyota-4runner`, `brand-spring-reels`).

### `project.json` (обязателен для нового проекта)

```json
{
  "format": "reels",
  "created": "2026-08-15"
}
```

| Поле | Значения | Зачем |
|---|---|---|
| `format` | `reels` \| `horizontal` | бадж на GitHub Pages: **Рилс** / **Горизонт** |
| `created` | `YYYY-MM-DD` | дата самого раннего исходника, который пошёл в проект (не день сценария) |

`format` — от сути работы (вертикальные коротыши vs горизонтальный long-form). Без файла генератор Pages попробует угадать по README, но лучше явный json.

---

## Как завести новый проект (руками)

**macOS / Linux / Git Bash**

```bash
cd /path/to/cutforge
NAME=my-reel-series
mkdir -p "projects/$NAME"/{scenarios,timelines,configs,notes}
```

**Windows (PowerShell)**

```powershell
cd C:\path\to\cutforge
$NAME = "my-reel-series"
New-Item -ItemType Directory -Force -Path `
  projects\$NAME\scenarios, projects\$NAME\timelines, `
  projects\$NAME\configs, projects\$NAME\notes
```

Минимальные файлы:

**`README.md`** — одна страница: цель серии, имя проекта в Resolve, кто ведёт.

**`notes/MEDIA.md`**

```markdown
# Media (not in git)

- Master: `<absolute-path-on-this-machine>`
- FPS: …
- Resolve project: `<name>`
```

**`notes/LOCKS.md`**

```markdown
# Locks

```
Reel 01 - …
```

Everything else is experimental unless added here.
```

**`notes/MUSIC.md`** — промпт для подбора музыки (Epidemic Sound Assistant и аналоги) + таблица выбранных треков. Заводить вместе с проектом, даже если трек ещё не выбран: так не теряется brief.

Шаблон (см. живой пример `projects/ford-mustang-dark-horse/notes/MUSIC.md`):

- заголовок `# Music — Epidemic Sound`
- пометка **лимит Assistant: ≤1000 символов**
- один блок **Epidemic Sound Assistant (копировать)** с English-промптом в fenced `text` + факт длины (`NNN / 1000`)
- таблица **Выбранные треки**: Track | Epidemic URL / ID | Куда в таймлайне | Notes

Как писать brief для Assistant:

- **Жёсткий лимит: 1000 символов** (пробелы и `\n` считаются). Цель: **≤980**, один промпт без «короткой альтернативы».
- Перед отдачей пользователю **проверить `len(prompt)`** (скрипт/счётчик); если >1000 — сжать, не надеяться на обрезку платформой.
- **На английском** — так стабильнее отрабатывает Epidemic Sound Assistant.
- Указать формат и хронометраж (YouTube long-form / Reels 9:16), есть ли постоянный VO.
- Настроение + энергия + явный **Avoid** (жанры/вокал, которые не нужны).
- Для роликов с речью: *instrumental / sparse vocals*, *OK under speech*.
- Треки и WAV в git не коммитить; в таблице — имя, ссылка/ID, куда легло в таймлайне.

Пример заполненного файла: `projects/ford-mustang-dark-horse/notes/MUSIC.md`.

**`timelines/README.md`** (по желанию) — таблица slug → имя таймлайна в Resolve.

Сценарии появляются по мере работы в `scenarios/`.  
`.drt` — в `timelines/` после экспорта (см. корневой README §4 и скилл `timeline-drt-share`).

---

## Как завести новый проект (агент)

1. Прочитать этот файл.  
2. Создать дерево как выше (не копировать удалённый `_template`).  
3. Сразу положить `project.json`: `format` (`reels` / `horizontal`) + `created` (дата самого раннего исходника в проекте, `YYYY-MM-DD`).  
4. Заполнить `MEDIA.md` / `LOCKS.md` из того, что сказал пользователь.  
5. Создать `MUSIC.md`: промпт для Epidemic Sound Assistant по формату/тону серии (даже без выбранного трека).  
6. Дальше — нужный скилл (`raw-media-sort` → `reels-workflow` → `timeline-drt-share`).

---

## Resolve (договорённость)

| Bin | Содержимое |
|---|---|
| источники (`video` / inbox) | медиа |
| `timelines` | только таймлайны |

Имена: `Reel NN - ShortLabel`. Готовое — в `LOCKS.md`.

Обмен в git: только `.drt` в `timelines/`. Медиа на диск каждого монтажёра + relink.

---

## Почему не `_template` в `projects/`

- В `projects/` видны только реальные работы — проще онбординг и code review.  
- Пустой шаблон быстро расходится с докой и забывается.  
- Одного описания в `knowledge/` достаточно для людей и агента; пример — живой `toyota-4runner`.
