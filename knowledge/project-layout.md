# Архитектура проекта в cutforge

В `projects/` лежат **только живые проекты** (реальные серии/ролики). Отдельной папки `_template` нет — это было пустое место в дереве без пользы для клона.

Шаблон = эта статья + команды ниже. Пример живого проекта: `projects/toyota-4runner/`.

---

## Дерево одного проекта

```text
projects/<project-name>/
  README.md           # что за серия, имя Resolve-проекта, ссылка на MEDIA
  scenarios/          # сценарии, shot lists (start_f / end_f)
  timelines/          # .drt для обмена нарезкой (без медиа)
  configs/            # пресеты Resolve только для этой серии
  notes/
    MEDIA.md          # абсолютные пути к исходникам на машине автора
    LOCKS.md          # таймлайны, которые нельзя пересобирать
```

Имя папки: латиница/kebab-case (`toyota-4runner`, `brand-spring-reels`).

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

**`timelines/README.md`** (по желанию) — таблица slug → имя таймлайна в Resolve.

Сценарии появляются по мере работы в `scenarios/`.  
`.drt` — в `timelines/` после экспорта (см. корневой README §4 и скилл `timeline-drt-share`).

---

## Как завести новый проект (агент)

1. Прочитать этот файл.  
2. Создать дерево как выше (не копировать удалённый `_template`).  
3. Заполнить `MEDIA.md` / `LOCKS.md` из того, что сказал пользователь.  
4. Дальше — нужный скилл (`raw-media-sort` → `reels-workflow` → `timeline-drt-share`).

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
