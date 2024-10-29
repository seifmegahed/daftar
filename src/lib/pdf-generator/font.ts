import type { Font } from "@pdfme/common";
import fs from "node:fs/promises";

const readexPro = await fs.readFile(
  "src/fonts/Readex_Pro/static/ReadexPro-ExtraLight.ttf",
);
const readexProBold = await fs.readFile(
  "src/fonts/Readex_Pro/static/ReadexPro-SemiBold.ttf",
);
const readexProFontData = Buffer.from(readexPro).toString("base64");
const readexProBoldFontData = Buffer.from(readexProBold).toString("base64");

export const font: Font = {
  readexPro: {
    data: readexProFontData,
    fallback: true,
  },
  readexProBold: {
    data: readexProBoldFontData,
  },
};
