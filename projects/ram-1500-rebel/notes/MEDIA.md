# Media (not in git)

- Master root (ONLY): `/Volumes/Samsung 4TB/Media/sources/RAM Rabel`
- FPS: проект Resolve **25**
- Timeline resolution: **3840×2160**
- Resolve project: `RAM Rebel`
- Дата съёмки исходников: **2026-08-22**

## Диск (внутри корня)

| Папка | Клипы (без Proxy) | Что это |
|---|---|---|
| `Sony/` | 35× `.MP4` + `RT_SALON.mov` | A-roll, основная камера. Сюда же объединенный салон и транскрипт |
| `Luna/` | 61 | вторая камера / подсъёмка |
| `B-rolls/` | 127 | продуктовый B-roll |
| `BackStage/` | 24 | закулисье |
| `Crop/` | 2 (`C9258`, `C9260`) | кроп-исходники |
| `iphone/` | 7 | телефон |
| `GO Pro/` | 1 | GoPro |

## Салон (текущий блок)

- Объединенный клип на диске: `Sony/RT_SALON.mov` (~19:44, 25 fps, 3840×2160)
- Транскрипт: `Sony/RT_SALON (transcribed on 14-Sep-2026 18-26-57).srt` + `.txt`
- В пуле: compound `RT Salon` (`a040b84c-9831-4f1e-9905-bb84125552e3`), тип «Объединенный», 29601 кадр
- Исходники салона в `Sony/` (в т.ч. `C9294`–`C9299` и более ранние тейки)

## Media pool (как есть)

```
Master/
  RAM Rabel/
    Sony, Luna, B-rolls, BackStage, Crop, iphone, GO Pro, MultiCam_01
  TimeLines/
    RAM_01, RAM_02, RT_IN, RT FINAL, RT_SALON
```

Bins уже совпадают с папками на диске. Файлы на диске не трогаем.

## Resolve timelines

| Timeline | Dur | Заметка |
|---|---|---|
| `RAM_01` | ~4:46 | готовая сцена, не пересобирать |
| `RAM_02` | ~15:46 | готовая сцена, не пересобирать |
| `RT_IN` | ~19:44 | салон без пустот, не пересобирать |
| `RT FINAL` | живой | Иван режет руками |
| `RT_SALON` | ~5:39 | смысловая склейка салона из `RT Salon`, плотная |
