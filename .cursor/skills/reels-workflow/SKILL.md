---
name: reels-workflow
description: >-
  End-to-end workflow for short-form reels: scenario markdown with MCP-ready
  shot lists, duration/structure guidelines, DaVinci Resolve rough-cut assembly,
  lock handling, and visibility checks. Use when the user asks to write or expand
  reel scenarios, build/rebuild reel timelines, assemble rough cuts via Resolve
  MCP, or set up reel project conventions — not for theme-specific storytelling
  of one particular video.
disable-model-invocation: false
---

# Reels workflow

Operational skill for **reels** (short vertical cuts), not a creative brief for one campaign.

**Out of scope here:** plot themes, product talking points, brand opinions, or copy unique to a single source video. Put those only in `projects/<name>/scenarios/` and `notes/`.

**In scope:** timings, scenario file shape, timeline naming/placement, Resolve MCP assembly, locks, verification.

Read [resolve-assembly.md](resolve-assembly.md) before placing clips in Resolve.

---

## When to use

- Write / expand / rebuild reel scenarios with shot lists.
- Assemble or fix rough cuts in DaVinci Resolve from those scenarios.
- Enforce duration, soft open/close, and MCP-consumable tables.
- User mentions: рилс, reel, shot list, раскадровка, черновой монтаж, timeline rebuild.

Companion always-on rule: `.cursor/rules/cutforge-project.mdc`.  
Before new project folders or first scenario dump: read `knowledge/project-layout.md` (and `knowledge/README.md`).

---

## Duration

| Bound | Value |
|---|---|
| Hard min | ~40 s |
| Hard max | 3:00 |
| Preferred center | **~1:30–2:00** |

Thin ~30–40 s drafts are usually incomplete — expand from transcript/source before calling them done, unless the user asks for atomic shorts.

---

## Scenario quality (structure, not topic)

Aim for a **complete reel picture**, not a bare thesis dump:

1. **Soft open** — short context / landing beat before the core claim.
2. **Core** — one clear job for the reel (one idea).
3. **Soft close** — landing / exit beat; avoid cutting mid-thought.

Other standing prefs from practice:

- Structures may differ across reels; do **not** force one canvas on every piece.
- Hooks are **optional**. If used, briefly explain what the hook is doing; do not pad fake hooks.
- Shots **may overlap** across reels in the same source — fine.
- External B-roll / stills are allowed when the source lacks a beat; mark them clearly in the shot list.
- Do not try to satisfy every guideline in every reel — keep them as standing judgment, not a checklist to cram in.
- Prefer one strong idea over a crowded “mega” reel; atomic is OK when complex feels thin.
- **Recommendations** section: only editorial notes for *this* reel (pacing, trim, text-on-screen) — not SEO, not series planning dumps.

### Do not put in scenario files

- Instagram caption / description blocks
- Hashtag lists
- “Future themes / draft ideas for later” sections
- Platform growth fluff unrelated to the cut

---

## Scenario file template (MCP-ready)

Save as `projects/<name>/scenarios/NN-slug.md` (or the project’s agreed scenarios path).

```markdown
# Reel NN. <Title>

**Generated**: YYYY-MM-DD
**Timeline**: `Reel NN - ShortLabel`
**Duration target**: ~M:SS (range 0:40–3:00)
**Source**: `<master-clip.ext>` @ <fps> fps
**Clip ID**: `<media-pool-unique-id>`  # when known

| Field | Value |
|---|---|
| Job | one-sentence purpose of this reel |
| Tone | short |
| Form | soft open → core → soft close (or note if different) |

---

## Dramaturgy

1. Soft open: …
2. Core: …
3. Soft close: …

---

## Shot list (for MCP)

| # | Reel in | Source | start_f | end_f | Speech / sense | On-screen text |
|---|---|---|---|---|---|---|
| 1 | 0:00-0:12 | `00:08`→`00:20` | 200 | 500 | … | … |

**Raw total**: ~M:SS (before pause compression).
**Exclude**: beats reserved for other reels (by number), if any.

### MCP append recipe

Place clips in table order. `record_frame` = cumulative duration of prior shots
(relative to timeline start). See resolve-assembly.md for absolute vs relative frames.
```

Required for assembly: **`start_f` / `end_f` at project fps**, plus source clip identity.

---

## Workflow

```
Task progress:
- [ ] 1. Confirm locked vs experimental timelines
- [ ] 2. Write/expand scenario markdown (shot table complete)
- [ ] 3. Assemble rough cut in Resolve (unlocked only)
- [ ] 4. Put timeline in Master/timelines
- [ ] 5. Verify clips visible from timeline start TC
- [ ] 6. Save project; report durations
```

### 1. Locks

- Locked timeline: rename only if explicitly asked; never rebuild content.
- Rebuild experimental timelines by delete + recreate when cleaner than patching.

### 2. Scenarios first, then Resolve

Finish scenario tables before MCP assembly unless the user asks to cut without docs.

### 3–5. Assembly + verify

Follow [resolve-assembly.md](resolve-assembly.md). The recurring failure mode: clips at record frame `0` while the timeline starts at `01:00:00:00` (frame 90000) → UI looks empty. Always verify item starts align with `timeline.GetStartFrame()`.

### Rough cut definition

First pass = source ranges on V1/A1 from the shot list. Overlays, music, titles, color — later, unless asked.

---

## Deliverable to the user

After assembly, report briefly:

- Timeline names created/updated
- Approx duration each
- What was locked and untouched
- Any missing source ranges / external B-roll still needed
