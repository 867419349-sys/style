import type { StyleResult } from "@/types";
import { STYLES } from "./styles";

/** simple deterministic hash so the same image maps to the same style */
function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export interface ExtractInput {
  fileName: string;
  fileSize: number;
}

/**
 * MOCK extraction. In the prototype we don't call a real vision model — we
 * deterministically map the uploaded file to one of the built-in styles and
 * simulate analysis latency. Swap the body for a real API call later
 * (the return type stays the same).
 */
export async function extractStyle(input: ExtractInput): Promise<StyleResult> {
  const delay = 1100 + Math.random() * 700;
  await new Promise((r) => setTimeout(r, delay));
  const idx = hashString(`${input.fileName}:${input.fileSize}`) % STYLES.length;
  return STYLES[idx];
}
