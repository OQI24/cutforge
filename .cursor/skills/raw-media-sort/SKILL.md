---
name: raw-media-sort
description: >-
  Sort raw footage in DaVinci Resolve media pool into A-roll / B-roll / timelines
  bins without touching files on disk. Use when the user asks to organize raw
  media, split interview vs B-roll, prepare bins from a dump folder, or run
  preproduction sorting — not for clip markers, Whisper pipelines, or assembling
  reel rough cuts (use reels-workflow for cuts).
disable-model-invocation: false
---

# Raw media sort

Preproduction skill: **organize raw clips inside Resolve**, nothing on disk.

**Out of scope (parked for later):** clip markers with transcripts, local Whisper, auto scenario variants, auto B-roll overlays.

**In scope:** scan pool / imported set → create bins → move pool clips into A-roll / B-roll / timelines → short report.

Companion rules: source-disk safety + RU-segment (`.cursor/rules/`).  
If the cutforge project folder does not exist yet: `knowledge/project-layout.md` first.

---

## When to use

- «разложи сырьё», «A-roll / B-roll», «покорзинь медиа», «подготовь bins»
- Fresh dump imported into Resolve, needs sorting before scenarios/cuts

After sorting for reels assembly → hand off to `reels-workflow`.

---

## Safety

- Never move/rename/delete/recompress source files on disk (any OS).
- Only Media Pool folder create + `move_clips` (or equivalent MCP).
- Do not rebuild or wipe locked timelines.

---

## Default bins

Create under `Master/` if missing (Russian labels OK):

| Bin | Purpose |
|---|---|
| `01_A-Roll_Интервью` | Dense speech / talking head / interview A-roll |
| `02_B-Roll_Подсъёмка` | No/low speech: action, inserts, beauty, weak audio |
| `03_Таймлайны` | Timelines only (align with project rule: prefer also using `timelines` if that bin already exists — **do not duplicate**; put timelines in the existing timelines bin) |

If the project already has `Master/timelines` / `Master/video`, **reuse them**:

- Timelines → existing `timelines` (do not invent a second timelines bin without asking).
- Sources may stay in `video` and be *copied conceptually* by moving pool items into A/B bins, or keep `video` as inbox and sort from there.

Prefer extending the project’s existing layout over renaming established bins.

---

## Sorting heuristic

Without Whisper/markers for now, classify by what you can see:

1. **User labels / filenames** (e.g. `interview`, `a-roll`, `broll`, `insert`).
2. **Existing transcripts/SRT** next to the project if present — speech-heavy → A-roll.
3. **Resolve metadata / duration / audio presence** via MCP probes when available.
4. **Ask once** only if a clip is ambiguous and volume is small; for large dumps, park ambiguous in `00_Inbox` or leave in source bin and list them in the report.

A-roll: clear spoken track, face-to-camera, interview takes.  
B-roll: landscapes, hands, product, drive-bys, silence/noise-only, failed takes by audio.

RU priority: when using any speech cue, treat Russian dialogue as the signal for A-roll.

---

## Workflow

```
- [ ] Confirm Resolve project + source bin/folder
- [ ] Ensure A-roll / B-roll bins exist (reuse timelines bin if present)
- [ ] Classify clips; move only media-pool items
- [ ] Report counts + ambiguous list
- [ ] Do not write markers / do not build timelines unless asked
```

## Report format

```
A-roll: N clips
B-roll: N clips
Left unsorted: …
Bins used: …
Disk files touched: none
```
