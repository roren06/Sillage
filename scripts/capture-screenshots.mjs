import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.SCREENSHOT_BASE ?? "https://sillage-sooty.vercel.app";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "docs", "screenshots");

const SAVED_STATE = JSON.stringify({
  state: {
    savedIds: ["sauvage-elixir", "creed-aventus", "bleu-de-chanel"],
  },
  version: 0,
});

async function seedSaved(page) {
  await page.addInitScript((data) => {
    localStorage.setItem("sillage-saved", data);
  }, SAVED_STATE);
}

async function waitForHero(page) {
  await page.waitForSelector("h1", { timeout: 30_000 });
  await page.waitForTimeout(1200);
}

async function capture(page, name, options = {}) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false, ...options });
  console.log(`Saved ${file}`);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch();

  // Desktop captures
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await desktop.newPage();

  await page.goto(BASE, { waitUntil: "networkidle" });
  await waitForHero(page);
  await capture(page, "01-hero");

  await page.getByRole("button", { name: "Oud", exact: true }).click();
  await page.waitForTimeout(800);
  await capture(page, "02-search-filters");

  await page.getByRole("button", { name: "Oud", exact: true }).click();
  await page.waitForTimeout(400);

  await page.evaluate(() => {
    document.getElementById("collection")?.scrollIntoView({ block: "center" });
  });
  await page.waitForTimeout(600);
  await capture(page, "03-collection-carousel");

  await page.goto(`${BASE}/scent/creed-aventus`, { waitUntil: "networkidle" });
  await waitForHero(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await capture(page, "04-shareable-url");

  await page.getByText("Explore notes", { exact: true }).click();
  await page.waitForTimeout(600);
  await capture(page, "05-notes-panel");

  await page.getByRole("button", { name: "Close details" }).click();
  await page.waitForTimeout(300);

  await page.evaluate(() => {
    document.getElementById("similar")?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(600);
  await capture(page, "06-similar-vibes");

  await page.evaluate(() => {
    document.getElementById("about")?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(600);
  await capture(page, "07-about");

  await desktop.close();

  // Saved + compare (needs localStorage)
  const savedCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const savedPage = await savedCtx.newPage();
  await seedSaved(savedPage);
  await savedPage.goto(BASE, { waitUntil: "networkidle" });
  await waitForHero(savedPage);

  await savedPage.getByRole("button", { name: /^Saved/ }).click();
  await savedPage.waitForTimeout(700);
  await capture(savedPage, "08-my-rotation");

  await savedPage.getByRole("button", { name: "Compare saved scents" }).click();
  await savedPage.waitForTimeout(700);
  await capture(savedPage, "09-compare");

  await savedCtx.close();

  // Mobile hero with bottle
  const mobileCtx = await browser.newContext({
    ...devices["iPhone 14 Pro Max"],
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto(BASE, { waitUntil: "networkidle" });
  await waitForHero(mobilePage);
  await capture(mobilePage, "10-mobile-hero");

  await mobileCtx.close();
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
