# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

A single-screen recreation of Telegram's profile header (Expo SDK 57): on scroll the avatar "merges" into the Dynamic Island on iOS, or drips out through the top of the screen on Android. Many numeric constants in the motion code are measured from Telegram iOS (see Credits in `README.md`), not arbitrary tuning.

## Commands

Package manager is **yarn** (`yarn.lock`). There are no tests.

```bash
yarn start                # dev server; the app runs in Expo Go
yarn ios / yarn android   # local development build
yarn lint                 # expo lint
npx tsc --noEmit          # typecheck
```

`ios/` and `android/` exist locally but are gitignored prebuild output.

## Architecture

Everything is driven by one `scrollY` shared value (`use-settings-scroll.ts`) from the `SettingsList` ScrollView in `src/app/index.tsx`, and runs on the UI thread via Reanimated. `ProfileHeader` is an absolutely positioned overlay above the list; the list's top padding (`top + HEADER_CONTENT_HEIGHT`) reserves its space and `snapToOffsets={[0, collapseRange]}` snaps it open/closed.

- **`use-header-layout.ts`** — computes insets, nav bar center, `collapseRange`, and the `AvatarMode`:
  - `island` — iOS with Dynamic Island (detected by `Device.modelId` in `constants/island-devices.ts`, or top inset ≥ 55 on simulator): mask's drip line hides under the island.
  - `topEdge` — Android: mask + avatar are lifted so the line is off-screen before it appears (uses `avatar-mask-top-edge.json`, whose `Line` layer starts at frame 75).
  - `plain` — iOS without an island: no mask, avatar just scrolls, shrinks and blurs.
- **`use-avatar-motion.ts`** — maps `scrollY` → Lottie `frame` (0–540), `lift`, `discY`, `discScale`, `blur`. Mask geometry constants are in the Lottie's 512×512 units. As in Telegram, the photo scrolls with the content and shrinks while the mask plays in place; in `topEdge` the mask first scrolls with the photo until its line is off screen, and only then starts playing.
- **`avatar.tsx`** — Skia `Canvas`: renders the Skottie mask, then composites the photo (blurred, darkened, vignetted) into it with `srcIn`.
- **`avatar-pattern.tsx`** — honeycomb star rings (6 per ring) pulled in by a wave as the header collapses; consumes the same `AvatarMotion`.
- **`profile-header.tsx`** — collapses via transforms only (frame translated up, content translated back down) so nothing re-lays out on scroll; name moves into the nav bar and scales down, subtitle fades, gradient fades out near full collapse (kept on Android).

Shared layout numbers live in `constants/header-metrics.ts`; changing `AVATAR_RADIUS`, `AVATAR_CENTER`, or `NAME_LOCK_DRIFT` affects the header, avatar motion, and star pattern together.

Nav bar buttons differ per platform in `index.tsx`: `Stack.Toolbar` on iOS, `headerLeft`/`headerRight` with `SymbolView` on Android.
