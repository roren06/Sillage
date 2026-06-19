const sharp = require("sharp");
const path = require("path");

const file = process.argv[2] || "wanted.png";
const input = path.join(__dirname, "..", "public", "bottles", file);

sharp(input)
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const total = info.width * info.height;
    let transparent = 0;
    let bottleTransparent = 0;
    let bottleTotal = 0;

    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        const i = (y * info.width + x) * info.channels;
        const alpha = data[i + 3];
        if (alpha < 10) transparent++;

        const inBottle =
          x > info.width * 0.15 &&
          x < info.width * 0.85 &&
          y > info.height * 0.03 &&
          y < info.height * 0.92;

        if (inBottle) {
          bottleTotal++;
          if (alpha < 10) bottleTransparent++;
        }
      }
    }

    const transparentPct = ((transparent / total) * 100).toFixed(1);
    const bottlePct = ((bottleTransparent / bottleTotal) * 100).toFixed(1);
    const ok = Number(bottlePct) < 5;

    console.log(`${file}: ${info.width}x${info.height}`);
    console.log(`  outer transparent: ${transparentPct}%`);
    console.log(`  inside bottle silhouette: ${bottlePct}%`);
    console.log(
      ok
        ? "  OK — bottle body is solid, safe to use on the site"
        : "  BROKEN — holes inside the bottle; use your original unedited photo",
    );

    process.exit(ok ? 0 : 1);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
