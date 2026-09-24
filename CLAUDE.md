# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

macOS Safari Web Extension (MV3). Sets `playbackRate` on all `<video>` in the current tab, incl. cross-origin iframes and open shadow roots. Stateless: no content scripts, no storage.

## Layout

- `extension/` — the extension. Xcode references it in place (`../../extension/...` in `project.pbxproj`); edits go straight into the next build.
- `VideoSpeed/` — converter-generated Xcode project (Swift host app + boilerplate `SafariWebExtensionHandler.swift`, unused).
- `test/` — local page: top-level + shadow-root + iframe video → popup must report 3 videos / 2 frames.

## Commands

```sh
xcodebuild -project VideoSpeed/VideoSpeed.xcodeproj -scheme VideoSpeed -configuration Debug -derivedDataPath build -xcconfig Local.xcconfig build
open build/Build/Products/Debug/VideoSpeed.app        # registers extension with Safari
python3 -m http.server 8000 --directory test          # test page
pluginkit -m -v -i com.mihasic.VideoSpeed.Extension # what Safari sees
# regenerate project (loses manual project edits, e.g. deployment target 14.0, icons)
rm -rf VideoSpeed && xcrun safari-web-extension-converter extension --macos-only --swift \
  --project-location . --app-name VideoSpeed --bundle-identifier com.mihasic.VideoSpeed --no-open --no-prompt
```

No automated tests; verify manually in Safari.

## How it works

`lib/apply.js` is a plain script loaded by both popup and background (no ES modules).
- `setRateInFrame(rate)` is serialized into every frame via `scripting.executeScript({allFrames: true, func, args})` — must stay self-contained. Walks `document` + open shadow roots. `rate === null` = probe.
- `applyRate(tabId, rate)` aggregates per-frame results → `{ frames, rates }`; `toggleRate` implements the ⌥⇧2 rule.
- Popup probes on open, applies on click; status is derived from actual post-apply rates.

## Safari gotchas

- `background.persistent` is rejected by Safari MV3.
- `manifest.json` changes need rebuild + app relaunch; restart Safari if the extension vanishes.
- Ad-hoc-signed builds are hidden unless Develop → Allow Unsigned Extensions is on. Team ID lives in gitignored `Local.xcconfig` (copy from `Local.xcconfig.example`), passed via `-xcconfig`; never put `DEVELOPMENT_TEAM` in `project.pbxproj`.
- `executeScript` throws on restricted pages (Safari pages, PDFs) → popup shows "Cannot access this page".

## CI

`.github/workflows/build.yml` is the reusable unsigned Release build on the `xcode-27` runner (`objectVersion = 110` needs Xcode 27). `ci.yml` = JS syntax + manifest check on Ubuntu + `build.yml`. `release.yml` on `v*` tags: fails unless tag == `v` + manifest `version`, then `build.yml`, then attaches the zip to a GitHub Release.
