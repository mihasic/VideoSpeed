// Shared by popup and background. Plain script (no modules).

/**
 * Runs inside each frame. Self-contained: serialized by scripting.executeScript.
 * Sets rate on every <video> in document + open shadow roots (rate === null → probe only).
 * Returns the resulting playbackRate of each video.
 */
function setRateInFrame(rate) {
  const rates = [];
  const walk = (root) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.localName === "video") {
        if (rate !== null) el.playbackRate = el.defaultPlaybackRate = rate;
        rates.push(el.playbackRate);
      }
      if (el.shadowRoot) walk(el.shadowRoot);
    }
  };
  walk(document);
  return rates;
}

/** Apply (or probe when rate === null) across all frames → { frames, rates }; frames = frames containing video. */
async function applyRate(tabId, rate) {
  const results = await browser.scripting.executeScript({
    target: { tabId, allFrames: true },
    func: setRateInFrame,
    args: [rate],
  });
  const perFrame = results.map((r) => r?.result).filter((x) => x?.length);
  return { frames: perFrame.length, rates: perFrame.flat() };
}

/** If every video is at `on`, set `off`; otherwise set `on`. */
async function toggleRate(tabId, on, off) {
  const { rates } = await applyRate(tabId, null);
  if (!rates.length) return;
  await applyRate(tabId, rates.every((r) => r === on) ? off : on);
}
