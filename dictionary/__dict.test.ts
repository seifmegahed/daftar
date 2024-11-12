import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

interface TranslationFileType {
  [key: string]: string | TranslationFileType;
}

const loadJson = (filePath: string) => {
  try {
    const pathname = path.resolve(__dirname, filePath);
    console.log(pathname);
    const content = fs.readFileSync(pathname, "utf8");
    return JSON.parse(content) as TranslationFileType;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
};

const checkKeys = (
  baseline: TranslationFileType,
  testFile: TranslationFileType,
  fileName: string,
  path: string[] = [],
): string[] => {
  const errors: string[] = [];

  for (const key in baseline) {
    const currentPath = [...path, key];
    const formattedPath = currentPath.join(".");

    if (!(key in testFile)) {
      errors.push(`Missing key in ${fileName}: ${formattedPath}`);
    } else if (typeof baseline[key] === "object" && baseline[key]) {
      if (typeof testFile[key] !== "object") {
        errors.push(`Expected object in ${fileName}: ${formattedPath}`);
        continue;
      }
      errors.push(
        ...checkKeys(baseline[key], testFile[key], fileName, currentPath),
      );
    } else if (
      typeof baseline[key] === "string" &&
      /\{.*?\}/.test(baseline[key])
    ) {
      if (typeof testFile[key] !== "string") {
        errors.push(`Expected string in ${fileName}: ${formattedPath}`);
        continue;
      }

      const regex = /\{(\w+),\s*(select|plural),\s*(.*?)\}/gs;
      let match;
      while ((match = regex.exec(baseline[key])) !== null) {
        const [placeholder, variable, icuType, options] = match;

        // Check that the placeholder with the same variable and type exists in the test string
        const testRegex = new RegExp(`\\{${variable},\\s*${icuType},`);
        if (!testRegex.test(testFile[key])) {
          errors.push(
            `Missing ICU placeholder in ${fileName} at ${formattedPath}: ${placeholder}`,
          );
        } else {
          // Extract the option keys (e.g., "one", "other") from the options part
          const optionKeys = options
            ? [...options.matchAll(/\b\w+\b(?=\s*\{)/g)].map((m) => m[0])
            : [];
          const testOptions = new RegExp(
            `\\{${variable},\\s*${icuType},\\s*(.*?)\\}`,
            "s",
          ).exec(testFile[key]);
          const testOptionKeys = testOptions?.[1]
            ? [...testOptions[1].matchAll(/\b\w+\b(?=\s*\{)/g)].map((m) => m[0])
            : [];

          optionKeys.forEach((opt) => {
            if (!testOptionKeys.includes(opt)) {
              errors.push(
                `Missing ICU option '${opt}' in ${fileName} at ${formattedPath} for ${placeholder}`,
              );
            }
          });
        }
      }
    }
  }
  return errors;
};

describe("Translation files validation", () => {
  const baselineFilePath = "en.json";
  const testFilePaths = ["ar.json", "de.json", "es.json", "fr.json", "nl.json"];

  const baseline = loadJson(baselineFilePath);
  if (!baseline)
    throw new Error(`Could not load baseline file: ${baselineFilePath}`);

  testFilePaths.forEach((filePath) => {
    const fileName = path.basename(filePath);

    it(`should validate keys and placeholders for ${fileName}`, () => {
      const testFile = loadJson(filePath);
      expect(testFile).toBeTruthy();

      if (testFile) {
        const errors = checkKeys(baseline, testFile, fileName);
        if (errors.length > 0) {
          console.error(`Errors in ${fileName}:`);
          errors.forEach((error) => console.error(`  - ${error}`));
        }
        expect(errors).toEqual([]);
      }
    });
  });
});
