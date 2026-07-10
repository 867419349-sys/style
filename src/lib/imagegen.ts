import type { ModelSpec, StyleResult } from "@/types";

export const MODELS: ModelSpec[] = [
  {
    id: "jimeng",
    name: "即梦 / 豆包",
    vendor_zh: "字节跳动",
    vendor_en: "ByteDance",
    swatch: ["#e67e5b", "#28282b"],
  },
  {
    id: "wanx",
    name: "通义万相",
    vendor_zh: "阿里云",
    vendor_en: "Alibaba",
    swatch: ["#6d5cff", "#12e6e6"],
  },
  {
    id: "sd",
    name: "Stable Diffusion",
    vendor_zh: "Stability AI",
    vendor_en: "Stability AI",
    swatch: ["#17bebb", "#0a0f2c"],
  },
  {
    id: "dalle",
    name: "DALL·E 3",
    vendor_zh: "OpenAI",
    vendor_en: "OpenAI",
    swatch: ["#ffd23f", "#ff5964"],
  },
];

/** deterministic pseudo-random from a seed, range [0,1) */
function rand(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/** stable seed for a (style, model) pair so a card and its detail page match */
export function seedFor(styleId: string, modelId: string): number {
  const s = `${styleId}::${modelId}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 100000;
}

/**
 * MOCK text-to-image. Instead of calling a real model we render a layered
 * gradient derived from the style palette + model swatch + seed, so each
 * model/seed produces a visibly different "generation". Replace with a real
 * API call (returning an image URL) later.
 */
export function mockGeneratedImage(
  style: StyleResult,
  model: ModelSpec,
  seed: number,
): string {
  const p = style.palette;
  const a = p[Math.floor(rand(seed) * p.length)]?.hex ?? model.swatch[0];
  const b = p[Math.floor(rand(seed + 7) * p.length)]?.hex ?? model.swatch[1];
  const angle = Math.floor(rand(seed + 3) * 360);
  const x = Math.floor(rand(seed + 1) * 100);
  const y = Math.floor(rand(seed + 2) * 100);
  return [
    `radial-gradient(circle at ${x}% ${y}%, ${model.swatch[0]}66, transparent 60%)`,
    `radial-gradient(circle at ${100 - x}% ${100 - y}%, ${model.swatch[1]}55, transparent 55%)`,
    `linear-gradient(${angle}deg, ${a}, ${b})`,
  ].join(", ");
}

export async function generateWithModel(): Promise<void> {
  // simulate per-model latency
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 1400));
}

export function getModelById(id: string): ModelSpec | undefined {
  return MODELS.find((m) => m.id === id);
}
