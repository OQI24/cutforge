# Resolve assembly for reels

Companion to `reels-workflow`. Theme-agnostic Resolve / MCP ops.

## Preconditions

1. DaVinci Resolve open with the correct project.
2. MCP server `davinci-resolve` connected.
3. Free edition: run in-app **Workspace → Scripts → `resolve_bridge`** (not canary duplicates). Studio: External scripting = Local.
4. Know the master clip **name** and **unique id** in the media pool.

## Media pool

| Bin | Contents |
|---|---|
| `Master/video` | Source media |
| `Master/timelines` | All reel timelines only |

Before `CreateEmptyTimeline` / `create_timeline_from_clips`, set current folder to `Master/timelines`.

## Timeline start / record frames (critical)

Typical project start TC: **`01:00:00:00`** → start frame **`90000`** at 25 fps.

| Mode | How to place |
|---|---|
| Relative (preferred with MCP helpers that support it) | `record_frame` starts at `0` = first frame of *this* timeline |
| Absolute (raw Resolve `AppendToTimeline`) | `record_frame = timelineStartFrame + offset` e.g. `90000 + offset` |

**Symptom of wrong offset:** API shows N clips, UI from `01:00:00:00` looks empty; `GetStartFrame()==GetEndFrame()==90000` while items sit at `0…N`.

**After every build, verify:**

```
timeline start frame == first video item start
timeline end frame   >= last video item end
item count matches shot list (or intentional merges)
```

Then `project_manager.SaveProject` / `pm.SaveProject()`.

## Naming

```
Reel NN - ShortLabel
```

Match the scenario’s `Timeline:` field.

## Build recipe (Python-shaped)

Pseudocode for one reel from a shot table:

```
OFFSET = timeline.GetStartFrame()  # often 90000
record = 0
infos = []
for shot in shots:
    infos.append({
      mediaPoolItem: master_clip,
      startFrame: shot.start_f,
      endFrame: shot.end_f,
      recordFrame: OFFSET + record,   # absolute
    })
    record += shot.end_f - shot.start_f

CreateEmptyTimeline(name) in Master/timelines
AppendToTimeline(infos)
SetCurrentTimeline(tl); assert items[0].GetStart() == OFFSET
SaveProject()
```

Overlapping adjacent source ranges may be merged into fewer timeline items — OK for rough cut if speech continuity holds.

## MCP notes

- Prefer `media_pool.create_timeline_from_clips` with `clip_infos` when available; check schema via `GetMcpTools` first.
- Destructive deletes (`delete_timelines`) require confirm tokens — never include locked reel ids.
- Keep **Reel 01** (or any locked id) out of delete/rebuild lists.
- After create, `timeline.set_current` to the new reel so the user sees content immediately.

## Free vs Studio bridge

- Duplicate bridge scripts in both user and system Script folders cause double menu entries — keep one clean install path.
- On macOS, Resolve script menu needs **python.org framework Python** (Homebrew-only installs often invisible to Resolve).

## What rough cut is not

Do not auto-add titles, generators, music beds, or Fusion unless the user asks. Source speech + picture sync first.
