// My Secret Logbook — make.fun competition u-email-baru-my-secret-logbook-cc177449
// Writes one diary entry line (at most 200 characters) to entry.txt.
// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// not only white space.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const MAX_CHARS = 200;

export const ENTRY =
  "Dear logbook: today I pretended to work for eight hours, and the only thing I actually finished was this sentence.";

// Resolve the full path of the output file entry.txt.
// Precedence: $MAKEFUN_OUTPUT_DIR -> $OUTPUT_PATH -> /output when
// MAKEFUN_BOT_DIR is set -> local output/ fallback (for local runs).
export function resolveOutputPath(): string {
  const makefunDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (makefunDir && makefunDir.trim() !== "") {
    return join(makefunDir, "entry.txt");
  }
  const outputPath = process.env.OUTPUT_PATH;
  if (outputPath && outputPath.trim() !== "") {
    return outputPath.endsWith(".txt")
      ? outputPath
      : join(outputPath, "entry.txt");
  }
  if (process.env.MAKEFUN_BOT_DIR) {
    return "/output/entry.txt";
  }
  return join(process.cwd(), "output", "entry.txt");
}

// Validate the entry against the gate: 1-200 characters, not blank.
export function validateEntry(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("entry must not be blank or only white space");
  }
  const chars = [...text].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(
      `entry must be 1 to ${MAX_CHARS} characters, got ${chars}`,
    );
  }
}

function main(): void {
  validateEntry(ENTRY);
  const outPath = resolveOutputPath();
  mkdirSync(dirname(outPath), { recursive: true });
  // No trailing newline: entry.txt is byte-identical to ENTRY.
  writeFileSync(outPath, ENTRY, "utf8");
  // Read back and verify: what landed on disk must be exactly ENTRY,
  // valid UTF-8, still within the gate. Fail loudly otherwise.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) {
    throw new Error(`read-back mismatch: ${outPath} differs from ENTRY`);
  }
  validateEntry(written);
  console.log(`wrote ${[...ENTRY].length} chars to ${outPath}`);
}

main();
