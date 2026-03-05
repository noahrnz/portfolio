/**
 * Composite script: crop the laptop-on-couch image to match the current
 * sybill-credits preview (1024×769) and place the Ask Sybill UI into the
 * laptop's black screen area.
 *
 * Usage: node scripts/composite-credits-hero.mjs
 */

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const PATHS = {
  laptop: path.join(root, "public/images/laptop-bg-source.png"),
  ui: path.join(root, "public/images/ask-sybill-ui.png"),
  out: path.join(root, "public/images/sybill-credits.png"),
};

// Output at 2x so the image stays sharp on retina and when zoomed (Next/Image will serve appropriate size)
const TARGET_WIDTH = 2048;
const TARGET_HEIGHT = 1538;

// Laptop source is 682×1024 (portrait). We crop a horizontal slice and resize.
const CROP = {
  left: 0,
  top: Math.round((1024 - 682 * (TARGET_HEIGHT / TARGET_WIDTH)) / 2),
  width: 682,
  height: Math.round(682 * (TARGET_HEIGHT / TARGET_WIDTH)),
};

// Screen rectangle in the final image (2x of original so UI has more pixels)
const SCREEN = {
  x: 196,
  y: 116,
  width: 1656,
  height: 864,
};

async function main() {
  const laptopMeta = await sharp(PATHS.laptop).metadata();
  console.log("Laptop image:", laptopMeta.width, "x", laptopMeta.height);

  // 1) Crop laptop to landscape slice and resize to target
  const cropped = await sharp(PATHS.laptop)
    .extract({
      left: CROP.left,
      top: CROP.top,
      width: CROP.width,
      height: CROP.height,
    })
    .resize(TARGET_WIDTH, TARGET_HEIGHT)
    .toBuffer();

  // 2) Resize UI to fit entirely inside the screen rectangle (contain = no cropping; may have letterboxing)
  const uiBuffer = await sharp(PATHS.ui)
    .resize(SCREEN.width, SCREEN.height, { fit: "contain", kernel: "lanczos3" })
    .sharpen({ sigma: 0.6, m1: 1.0, m2: 0.5 })
    .toBuffer();

  // 3) Composite UI onto the cropped laptop at screen position
  const result = await sharp(cropped)
    .composite([{ input: uiBuffer, left: SCREEN.x, top: SCREEN.y }])
    .png()
    .toFile(PATHS.out);

  console.log("Written:", PATHS.out, result.width, "x", result.height);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
