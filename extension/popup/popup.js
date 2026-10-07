const statusEl = document.getElementById("status");
const buttons = [...document.querySelectorAll("button[data-rate]")];

function render({ frames, rates }) {
  const current = new Set(rates).size === 1 ? rates[0] : null;
  buttons.forEach((b) => b.classList.toggle("active", Number(b.dataset.rate) === current));
  if (!rates.length) { statusEl.textContent = "No video found"; return; }
  const where = `${rates.length} video${rates.length > 1 ? "s" : ""}` + (frames > 1 ? ` / ${frames} frames` : "");
  statusEl.textContent = current === null ? `${where}, mixed rates` : `${where} at ${current}×`;
}

async function run(rate) {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab) { statusEl.textContent = "No active tab"; return; }
  try {
    const result = await applyRate(tab.id, rate);
    if (rate === null) render(result);
    else window.close();
  } catch (e) {
    statusEl.textContent = "Cannot access this page";
    console.error("VideoSpeed:", e);
  }
}

buttons.forEach((b) => b.addEventListener("click", () => run(Number(b.dataset.rate))));
run(null);
