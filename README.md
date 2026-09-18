# VideoSpeed

[![CI](https://github.com/mihasic/VideoSpeed/actions/workflows/ci.yml/badge.svg)](https://github.com/mihasic/VideoSpeed/actions/workflows/ci.yml)

Safari (macOS) extension: set every `<video>` on the current page to 1×, 1.5× or 2× — including videos inside iframes and open shadow roots. Stateless: acts only when you click, remembers nothing.

## Install

```sh
xcodebuild -project VideoSpeed/VideoSpeed.xcodeproj -scheme VideoSpeed -configuration Debug -derivedDataPath build -xcconfig Local.xcconfig build
open build/Build/Products/Debug/VideoSpeed.app
```

Safari → Settings → Extensions → enable **VideoSpeed** (restart Safari if missing) → on first use choose **Always Allow on Every Website** (needed for cross-origin iframes).

Signing: `cp Local.xcconfig.example Local.xcconfig` and set your Apple team ID (file is gitignored). No certificate? Drop `-xcconfig` and enable Safari → Develop → Developer → Allow Unsigned Extensions (per Safari launch).

## Use

- Toolbar popup: `1× / 1.5× / 2×`, shows videos/frames found and current rate.
- ⌥⇧2: toggle 2× ↔ 1×.

Not reachable: videos in closed shadow roots.
