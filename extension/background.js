browser.commands.onCommand.addListener(async (command, tab) => {
  if (command !== "toggle-2x") return;
  const tabId = tab?.id ?? (await browser.tabs.query({ active: true, currentWindow: true }))[0]?.id;
  if (tabId === undefined) return;
  toggleRate(tabId, 2, 1).catch((e) => console.error("VideoSpeed:", e));
});
