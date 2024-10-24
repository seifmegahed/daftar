import { BLANK_PDF } from "@pdfme/common";
import type { Template } from "@pdfme/common";

export const template: Template = {
  basePdf: BLANK_PDF,
  schemas: [
    [
      {
        name: "a",
        type: "text",
        position: { x: 0, y: 0 },
        width: 300,
        height: 30,
      },
      {
        name: "b",
        type: "text",
        position: { x: 10, y: 30 },
        width: 300,
        height: 30,
      },
      {
        name: "c",
        type: "text",
        position: { x: 20, y: 60 },
        width: 300,
        height: 30,
      },
    ],
  ],
};
