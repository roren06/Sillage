const sharp = require("sharp");
const path = require("path");

const bottlesDir = path.join(__dirname, "..", "public", "bottles");

const files = process.argv.slice(2);
const targets = files.length > 0 ? files : ["eros.png"];

/** Black cap + black studio bg can't be auto-cut — use white-bg PNG + screen blend instead */
const SKIP_FILES = new Set(["wanted.png", "wantedd.png"]);

function isEdgeBackgroundPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (max < 12 && delta < 10) return true;
  if (max > 240) return true;
  if (max > 145 && delta < 55) return true;

  return false;
}

function isBackgroundPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (max < 28 && delta < 18) return true;
  if (max > 240) return true;
  if (max > 175 && delta < 45) return true;

  return false;
}

function floodFillFromEdges(data, width, height, channels) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const pushIfNew = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const index = y * width + x;
    if (visited[index]) return;
    queue.push([x, y]);
  };

  for (let x = 0; x < width; x++) {
    pushIfNew(x, 0);
    pushIfNew(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfNew(0, y);
    pushIfNew(width - 1, y);
  }

  while (queue.length > 0) {
    const [x, y] = queue.pop();
    const index = y * width + x;
    if (visited[index]) continue;

    const offset = index * channels;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];

    if (!isEdgeBackgroundPixel(r, g, b)) continue;

    visited[index] = 1;
    data[offset + 3] = 0;

    pushIfNew(x + 1, y);
    pushIfNew(x - 1, y);
    pushIfNew(x, y + 1);
    pushIfNew(x, y - 1);
  }
}

function isFringePixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (max > 140 && delta < 50) return true;

  return false;
}

function removeFringe(data, width, height, channels) {
  const alpha = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    alpha[i] = data[i * channels + 3];
  }

  for (let pass = 0; pass < 2; pass++) {
    const next = alpha.slice();
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        if (alpha[index] === 0) continue;

        const offset = index * channels;
        if (!isFringePixel(data[offset], data[offset + 1], data[offset + 2])) {
          continue;
        }

        const neighbors = [
          x > 0 ? alpha[index - 1] : 0,
          x < width - 1 ? alpha[index + 1] : 0,
          y > 0 ? alpha[index - width] : 0,
          y < height - 1 ? alpha[index + width] : 0,
        ];

        if (neighbors.some((value) => value === 0)) {
          next[index] = 0;
        }
      }
    }
    alpha.set(next);
  }

  for (let index = 0; index < width * height; index++) {
    data[index * channels + 3] = alpha[index];
  }
}

async function fixBottle(filename) {
  if (SKIP_FILES.has(filename)) {
    console.log(
      `Skipped ${filename} — black-on-black bottles need a white-background PNG (no script).`,
    );
    return;
  }

  const input = path.join(bottlesDir, filename);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  floodFillFromEdges(data, width, height, channels);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (isBackgroundPixel(r, g, b) && data[i + 3] > 0) {
      data[i + 3] = 0;
    }
  }

  removeFringe(data, width, height, channels);

  await sharp(data, { raw: { width, height, channels } }).png().toFile(input);
  console.log(`Fixed background: ${filename}`);
}

Promise.all(targets.map(fixBottle)).catch((error) => {
  console.error(error);
  process.exit(1);
});
