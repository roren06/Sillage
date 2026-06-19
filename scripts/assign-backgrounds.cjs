/**
 * Assign unique Unsplash hero/card backgrounds to all perfumes.
 * Run: node scripts/assign-backgrounds.cjs
 */
const fs = require("fs");
const path = require("path");

const PHOTO = {
  "sauvage-elixir": "1506905925346-21bda4d32df4",
  "bleu-de-chanel": "1505142468610-359e7d316be0",
  "ysl-y": "1441974231531-c6227db76b6e",
  "le-male": "1516450360452-9312f5e86fc7",
  "versace-eros": "1518837695005-2083093ee35b",
  "azzaro-wanted": "1501785888041-af3ef285b470",
  "cloud-oud": "1500530855697-b586d89ba3ee",
  "born-in-roma": "1552832230-c0197dd311b5",
  "creed-aventus": "1464822759023-fed622ff2c3b",
  "lv-imagination": "1470071459604-3b5ec3a7fe05",
  "stronger-with-you-intensely": "1470229722913-7c0e2dbbafd3",
  "lattafa-qahwa": "1632466477918-66ed5a901be2",
  "initio-side-effect": "1497366754035-f200968a6e72",
  "rasasi-hawas-ice": "1519681393784-d120267933ba",
  "liquid-brun": "1551024506-0bccd828d307",
  "freeze-riff": "1501004318641-b39e6451bec6",
  "nine-pm": "1493225457124-a3eb161ffa5f",
  "vulcan-feu": "1511497584788-876760111969",
  "afnan-supremacy-ce": "1565299624946-b28f40a0ae38",
  "ravine-ice": "1469474968028-56623f02e42e",
  "marwa-arabiyat": "1512453979798-5ea266f8880c",
  "cdnim": "1480714378408-67cf0d13bc1b",
  "lattafa-khamrah": "1542401886-65d6c61db217",
  "atlantis-extrait": "1507525428034-b723cf961d3e",
  "velixir-demeter": "1501854140801-50d01698950b",
  "velixir-icarus": "1519682337058-a94d519337bc",
  "velixir-poseidon": "1558618666-fcd25c85cd64",
  "blue-talisman": "1517487881594-2787fef5ebf7",
};

function heroUrl(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1920&q=80`;
}

function cardUrl(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;
}

const jsonPath = path.join(__dirname, "../lib/perfumes.json");
const perfumes = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

const usedPhotos = new Set();
for (const p of perfumes) {
  const photoId = PHOTO[p.id];
  if (!photoId) {
    console.error(`Missing photo mapping for: ${p.id}`);
    process.exit(1);
  }
  if (usedPhotos.has(photoId)) {
    console.error(`Duplicate photo ${photoId} assigned to ${p.id}`);
    process.exit(1);
  }
  usedPhotos.add(photoId);
  p.hero.image = heroUrl(photoId);
  p.card.image = cardUrl(photoId);
}

if (usedPhotos.size !== perfumes.length) {
  console.error(`Expected ${perfumes.length} unique photos, got ${usedPhotos.size}`);
  process.exit(1);
}

fs.writeFileSync(jsonPath, JSON.stringify(perfumes, null, 2) + "\n");
console.log(`Updated ${perfumes.length} perfumes with ${usedPhotos.size} unique backgrounds.`);
