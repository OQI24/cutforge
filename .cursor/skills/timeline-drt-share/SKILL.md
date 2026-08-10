---
name: timeline-drt-share
description: >-
  Export and import DaVinci Resolve timelines as native .drt for team handoff
  via git. Use when the user asks to export the current timeline, dump a cut into
  the repo, share a rough cut with teammates, pull a colleague's .drt, or import
  timelines from projects/<name>/timelines/. Not for FCPXML/AAF team exchange,
  media export/render, or rebuilding cuts (use reels-workflow).
disable-model-invocation: false
---

# Timeline DRT share

Team handoff of **cuts only** (no media) through Resolve-native `.drt` in git.

**Team exchange format: `.drt` only.** Other interchange (FCPXML, AAF, EDL) is for external/debug cases — do not use them for normal cutforge collaboration.

Read MCP schemas (`GetMcpTools` → `timeline`) before calling export/import.  
Project tree and handoff paths: `knowledge/project-layout.md`.

---

## Paths

```
projects/<project-name>/timelines/<slug>.drt
```

- `<project-name>` = cutforge project folder (not Resolve DB name, unless they match).
- If unclear which project folder — ask once.
- Create `timelines/` if missing.
- **Slug** from timeline name: lowercase, hyphens, ASCII.  
  `Reel 02 - Factory ARB` → `reel-02-factory-arb.drt`

Do not put `.drt` at the cutforge repo root.

---

## Command: export current timeline

Triggers: «экспортируй текущий таймлайн», «выгрузи нарезку в репозиторий», «share this cut».

```
- [ ] 1. Resolve open; get current timeline name
- [ ] 2. Resolve projects/<name>/timelines/ path
- [ ] 3. Export .drt via MCP
- [ ] 4. Confirm file on disk (size > 0)
- [ ] 5. Draft commit message in chat (do not commit unless asked)
```

### Export via MCP

Use `timeline.export_timeline_checked`:

```json
{
  "action": "export_timeline_checked",
  "params": {
    "path": "/absolute/…/cutforge/projects/<name>/timelines/<slug>.drt",
    "format": "drt",
    "require_temp_path": false
  }
}
```

`require_temp_path: false` is required — default MCP sandbox only allows temp dirs.

Prefer checked export over raw `Export`. If export fails, report the MCP error; do not silently fall back to FCPXML for team share.

### Commit message (Russian, draft only)

Example:

```
chore: выгружен таймлайн reel-02-factory-arb.drt

Черновая нарезка Reel 02 - Factory ARB для обмена в команде.
```

Include scenario updates in the message only if those files actually changed. **Do not** `git commit` / `git push` unless the user explicitly asks.

Optional one-liner in chat: timeline name, slug path, locked or not (from `notes/LOCKS.md`).

---

## Command: import colleague cut after pull

Triggers: «подтянул ветку коллеги», «импортируй drt», «собери нарезку из репо».

Assumption: user already pulled git. Agent does **not** pull unless asked.

```
- [ ] 1. List projects/<name>/timelines/*.drt (new or named by user)
- [ ] 2. Import into the open Resolve project
- [ ] 3. Move imported timeline item into Master/timelines if needed
- [ ] 4. Check missing media; relink only with user OK
- [ ] 5. Report timeline name + offline clip count
```

### Import via MCP

Prefer `timeline.import_timeline_checked` (or media_pool import equivalent) with:

```json
{
  "path": "/absolute/…/timelines/<slug>.drt",
  "require_temp_path": false
}
```

Place result in `Master/timelines` per project rules.

### Relink reality

Resolve may match media by filename — **not guaranteed** (different absolute paths on each Mac).

After import:

1. `detect_missing_media` (or equivalent probe).
2. If offline: ask for shared media root → `build_relink_plan` / `safe_relink` only after user confirms.
3. Never move or rewrite source files on disk.

---

## Safety

- `.drt` = timeline definition only. Never commit masters, proxies, renders, `.dra`.
- Do not overwrite a teammate’s `.drt` without saying so; if file exists, confirm or version (`-v2`) if unsure.
- Same major Resolve version across the team when possible; DRT can fail across DB/format skew — report clearly.
- Locked timelines: exporting is fine; importing a replacement over a locked cut — ask first.
