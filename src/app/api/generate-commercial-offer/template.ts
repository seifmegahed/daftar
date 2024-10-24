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
        width: 10,
        height: 10,
      },
      {
        name: "b",
        type: "text",
        position: { x: 10, y: 10 },
        width: 10,
        height: 10,
      },
      {
        name: "c",
        type: "text",
        position: { x: 20, y: 20 },
        width: 10,
        height: 10,
      },
    ],
  ],
};
