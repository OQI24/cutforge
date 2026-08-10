# cutforge

**Сценарии:** [https://oqi24.github.io/cutforge/](https://oqi24.github.io/cutforge/)

Открыл ссылку — проекты и сценарии в браузере. По репозиторию лазить не нужно.

---

Репозиторий-гайдлайн для командной работы над монтажом: общая структура проектов, обмен нарезками, правила и (по желанию) автоматизация через AI-агента.

**Главная идея:** новый монтажёр клонирует репо и может работать **вручную** — одинаково на macOS и Windows. Агент и скиллы не обязательное условие.

Целевой контекст команды: русскоязычный сегмент (YouTube / Reels / Shorts / VK Клипы), обмен черновыми нарезками без пересылки исходников в git.

---

## Что здесь лежит

```
cutforge/
  knowledge/           # база знаний команды (агент читает в первую очередь)
    project-layout.md  # как устроен живой проект, как его создать
  projects/            # только живые проекты (без _template)
    toyota-4runner/    # пример
  site/                # статический просмотр сценариев (Milkdown → GitHub Pages)
  davinci/
    presets/
    templates/
  .cursor/
    rules/
    skills/
  skills/              # указатель → .cursor/skills/
```

**В git не кладём:** исходники видео, прокси, рендеры, кэш Resolve, `.dra` / локальные базы с медиа.  
**В git кладём:** сценарии, заметки, `.drt` нарезки, `knowledge/`, правила/скиллы, пресеты без медиа.

Архитектура папки проекта: `[knowledge/project-layout.md](knowledge/project-layout.md)`.

---

## Быстрый старт

1. Установить Git, **DaVinci Resolve Studio** (полная версия, не Free), (по желанию) Cursor.
2. Клонировать этот репозиторий.
3. Создать живой проект по `[knowledge/project-layout.md](knowledge/project-layout.md)` (mkdir + `notes/MEDIA.md` / `LOCKS.md`).
4. Держать исходники **рядом на диске** (не в git); путь записать в `notes/MEDIA.md`.
5. В Resolve: Media Pool → bins `video` (или источники) и `timelines`.
6. Монтировать. Для обмена с командой — экспорт таймлайна в `.drt` в `projects/<имя>/timelines/`.
7. Коммит/пуш только сценариев, notes и `.drt` (без медиа).

Дальше — детальная установка и ежедневный цикл.

---

## 1. Инструменты


| Инструмент                                          | Зачем                                          | Обязательно?                   |
| --------------------------------------------------- | ---------------------------------------------- | ------------------------------ |
| **Git**                                             | клон репо, обмен сценариями и `.drt`           | да                             |
| **DaVinci Resolve Studio** (полная версия, не Free) | монтаж + scripting для команды                 | да                             |
| **ffmpeg**                                          | быстрые проверки медиа, конверты вне Resolve   | желательно                     |
| **Cursor** (или другой AI IDE с MCP)                | агентная автоматизация                         | нет                            |
| **Python 3.10+**                                    | Resolve MCP при агентной работе                | нет (для чистой ручной работы) |
| **Node.js / npm**                                   | установка `davinci-resolve-mcp` одной командой | нет (только для агента)        |


---

## 2. Установка с нуля

### 2.1. Git

**macOS/Windows**

1. Скачать: [https://git-scm.com/download/](https://git-scm.com/download/win)
2. Установить с опцией «Git from the command line».
3. Проверка в PowerShell / Git Bash:

```powershell
git --version
```

### 2.2. Клон репозитория

**macOS / Linux / Git Bash (Windows)**

```bash
cd ~/Projects   # или любая ваша папка
git clone <URL-этого-репо> cutforge
cd cutforge
```

**Windows (PowerShell)** — то же, пути в стиле `C:\Users\<you>\Projects\cutforge`.  

### 2.3. DaVinci Resolve Studio (полная версия)

Команда ориентируется на **DaVinci Resolve Studio**, не на Free.

На сайте Blackmagic есть две кнопки загрузки — нужна именно **Studio** (платная/лицензионная полная версия). Free для этого репозитория **не целевая**: без Studio нет нормального external scripting, обмен и агентная автоматизация заточены под Studio.

1. Скачать **DaVinci Resolve Studio**: [https://www.blackmagicdesign.com/products/davinciresolve](https://www.blackmagicdesign.com/products/davinciresolve)
  (не путать с кнопкой «Download» у бесплатной DaVinci Resolve.)
2. Установить как обычно для вашей ОС (macOS / Windows).
3. Preferences → General → **External scripting using = Local** (нужно для MCP/агента).
4. Создать/открыть проект под ролик (имя лучше согласовать с папкой в `projects/`, например `4runner-reels`).

### 2.4. ffmpeg (желательно)

**macOS (Homebrew)**

```bash
brew install ffmpeg
ffmpeg -version
```

**Windows**

1. Сборка с [https://www.gyan.dev/ffmpeg/builds/](https://www.gyan.dev/ffmpeg/builds/) или `winget install ffmpeg`
2. Добавить `bin` в PATH.
3. Проверка:

```powershell
ffmpeg -version
```

### 2.5. Структура Media Pool в Resolve (договорённость команды)

В корне Media Pool:


| Bin                            | Содержимое       |
| ------------------------------ | ---------------- |
| `video` (или inbox источников) | исходники        |
| `timelines`                    | только таймлайны |


Имена таймлайнов рилсов:

```text
Reel NN - ShortLabel
```

Пример: `Reel 01 - Zachem hybrid`.  
Законченный таймлайн — в `notes/LOCKS.md`; его не пересобирают без договорённости.

---

## 3. Новый проект в cutforge (руками)

Полная инструкция: `[knowledge/project-layout.md](knowledge/project-layout.md)`.

Кратко — создать дерево **без** копирования шаблона:

```bash
# macOS / Linux / Git Bash — из корня cutforge
NAME=my-reel-series
mkdir -p "projects/$NAME"/{scenarios,timelines,configs,notes}
```

**Windows (PowerShell):**

```powershell
$NAME = "my-reel-series"
New-Item -ItemType Directory -Force -Path `
  projects\$NAME\scenarios, projects\$NAME\timelines, `
  projects\$NAME\configs, projects\$NAME\notes
```

Дальше заполняете:


| Папка / файл     | Что писать                                                     |
| ---------------- | -------------------------------------------------------------- |
| `scenarios/`     | сценарии и раскадровки (`start_f` / `end_f` при необходимости) |
| `timelines/`     | экспортированные `.drt`                                        |
| `notes/MEDIA.md` | абсолютный путь к исходникам на **вашей** машине               |
| `notes/LOCKS.md` | какие таймлайны нельзя пересобирать                            |
| `configs/`       | проектные пресеты Resolve, если нужны                          |


В `projects/` только живые серии. Пример: `projects/toyota-4runner/`.

## 4. Обмен нарезкой в команде (`.drt`)

Формат обмена **внутри Resolve-команды:** только родной `.drt` (DaVinci Resolve Timeline).  
FCPXML / AAF / EDL — не для обычного handoff в этом репо.

### 4.1. Экспорт (монтажёр A → git)

1. Открыть нужный таймлайн в Resolve.
2. File → Export → Timeline… (или эквивалент в вашей версии) → тип **DRT**.
3. Сохранить в:

```text
projects/<имя-проекта>/timelines/<slug>.drt
```

Имя файла — slug латиницей, например:

`Reel 02 - Factory ARB` → `reel-02-factory-arb.drt`

1. Закоммитить `.drt` (+ сценарий, если менялся). Медиа не коммитить.

### 4.2. Импорт (монтажёр B после `git pull`)

1. `git pull`
2. В Resolve: File → Import → Timeline… → выбрать `.drt` из `projects/<имя>/timelines/`
3. Перенести таймлайн в bin `timelines`, если попал не туда.
4. Если клипы offline — **Relink** на свою копию исходников (пути на дисках разные). Имена файлов лучше держать одинаковыми в команде.

`.drt` не содержит видеофайлов — только нарезку.

---

## 5. Опционально: AI-агент и автоматизация

Репозиторий рассчитан на ручную работу. Если в команде есть Cursor (или IDE с MCP), агент может ускорить рутину: разложить bins, собрать черновик по shot list, выгрузить `.drt`.

Это **не** замена ручному пайплайну из §§2–4.

### 5.1. Что уже лежит в репо для агента


| Путь              | Назначение                                                                           |
| ----------------- | ------------------------------------------------------------------------------------ |
| `knowledge/`      | база знаний команды; агент читает **до** скиллов (`project-layout.md` и др.)         |
| `.cursor/rules/`  | always-on правила (структура, RU-сегмент, knowledge+skills first, safety исходников) |
| `.cursor/skills/` | скиллы: `reels-workflow`, `raw-media-sort`, `timeline-drt-share`                     |


Корневая папка `skills/` — только README-указатель (если есть). Cursor читает скиллы из `.cursor/skills/`.

### 5.2. Установка DaVinci Resolve MCP (для управления Resolve из агента)

Пакет: [samuelgursky/davinci-resolve-mcp](https://github.com/samuelgursky/davinci-resolve-mcp)  
Целевая редакция — **Resolve Studio** (см. §2.3). Free + bridge здесь не основной путь.

**Общие шаги (macOS и Windows):**

1. Установить **Python 3.10+** с [python.org](https://www.python.org/downloads/) (на Windows отметить «Add to PATH»).
2. Установить **Node.js LTS** (для `npx`).
3. В терминале:

```bash
npx davinci-resolve-mcp setup
```

Инсталлятор подтянет сервер в user application-data и может прописать MCP в Cursor.

1. Открыть **Resolve Studio** с проектом; Preferences → General → External scripting using = **Local**.
2. Подключить MCP в Cursor (Settings → MCP) — сервер обычно называется `davinci-resolve`.

#### Различия macOS / Windows (пути MCP)


| Тема                    | macOS                                               | Windows                                       |
| ----------------------- | --------------------------------------------------- | --------------------------------------------- |
| Каталог MCP после setup | `~/Library/Application Support/davinci-resolve-mcp` | `%APPDATA%\davinci-resolve-mcp` (типично)     |
| Python                  | 3.10+ с python.org, в PATH                          | то же, «Add python.exe to PATH» при установке |


### 5.3. Когда звать knowledge и скиллы (агент)

Порядок: `**knowledge/` → `.cursor/skills/` → ad-hoc** (правило `skills-first`).


| Скилл                | Задача                                                                       |
| -------------------- | ---------------------------------------------------------------------------- |
| `raw-media-sort`     | разложить сырьё по A-roll / B-roll в Media Pool (без правок файлов на диске) |
| `reels-workflow`     | сценарии рилсов, shot list, черновой монтаж в Resolve                        |
| `timeline-drt-share` | экспорт/импорт `.drt` в `projects/<имя>/timelines/`                          |


Исходники на диске агент **не** перемещает и не удаляет — только операции внутри Resolve / запись `.drt` и markdown в репо.

---

## 6. Договорённости команды (кратко)

1. Один ролик / серия = одна **живая** папка в `projects/` (без `_template`).
2. Как устроен проект — в `knowledge/project-layout.md`; агент читает `knowledge/` до скиллов.
3. Медиа — локально у каждого; в git — сценарии + `.drt` + notes + knowledge.
4. Обмен нарезкой — `.drt`, не FCPXML.
5. Имена таймлайнов — `Reel NN - ShortLabel`; готовое — в `LOCKS.md`.
6. RU-сегмент: приоритет русской речи в транскриптах/сценариях; ответы агента по-русски.
7. Ручной пайплайн — источник правды; агент повторяет те же пути и форматы.

---

## 7. Пример: `projects/toyota-4runner`

Уже заведён как образец:

- `scenarios/` — 8 сценариев рилсов  
- `timelines/*.drt` — черновые нарезки  
- `notes/LOCKS.md` — Reel 01 залочен  
- `notes/MEDIA.md` — где лежит мастер на машине автора

Новый человек: `git pull` → импорт нужного `.drt` → relink на свой путь к `4Raner.mp4`.

---

## 8. Просмотр сценариев на GitHub Pages

Сайт: [https://oqi24.github.io/cutforge/](https://oqi24.github.io/cutforge/) (ссылка ещё в шапке README).

Статика в `site/`. На каждый push в `main` CI сканирует `projects/*/scenarios/*.md`, собирает оглавление и выкладывает Pages. Добавил папку/файл → после пуша появится само. Файлы-источники не меняются.

Локально:

```bash
cd site
npm install
npm run dev
```

---

## Полезные ссылки

- **Сценарии (GitHub Pages):** [https://oqi24.github.io/cutforge/](https://oqi24.github.io/cutforge/)
- DaVinci Resolve **Studio**: [https://www.blackmagicdesign.com/products/davinciresolve](https://www.blackmagicdesign.com/products/davinciresolve) (полная версия, не Free)  
- Resolve MCP: [https://github.com/samuelgursky/davinci-resolve-mcp](https://github.com/samuelgursky/davinci-resolve-mcp)  
- Git: [https://git-scm.com/](https://git-scm.com/)  
- Python (framework / Windows installer): [https://www.python.org/downloads/](https://www.python.org/downloads/)

