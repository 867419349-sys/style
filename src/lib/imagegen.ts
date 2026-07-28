import type { ModelSpec } from "@/types";

export const MODELS: ModelSpec[] = [
  {
    id: "z-image",
    apiModel: "Tongyi-MAI/Z-Image-Turbo",
    name: "Z-Image Turbo",
    vendor_zh: "阿里通义",
    vendor_en: "Alibaba Tongyi",
    swatch: ["#6d5cff", "#12e6e6"],
  },
  {
    id: "qwen",
    apiModel: "Qwen/Qwen-Image",
    name: "Qwen-Image",
    vendor_zh: "阿里云",
    vendor_en: "Alibaba Cloud",
    swatch: ["#e67e5b", "#28282b"],
  },
  {
    id: "ernie",
    apiModel: "baidu/ERNIE-Image-Turbo",
    name: "文心 ERNIE",
    vendor_zh: "百度",
    vendor_en: "Baidu",
    swatch: ["#2932e1", "#12c2e9"],
  },
  {
    id: "kolors",
    apiModel: "Kwai-Kolors/Kolors",
    name: "可图 Kolors",
    vendor_zh: "快手",
    vendor_en: "Kuaishou",
    swatch: ["#ff5964", "#ffd23f"],
  },
  {
    id: "z-image-pro",
    apiModel: "Tongyi-MAI/Z-Image",
    name: "Z-Image",
    vendor_zh: "阿里通义",
    vendor_en: "Alibaba Tongyi",
    swatch: ["#4a3aff", "#ff6b9d"],
  },
];

export interface GenerateResult {
  url?: string;
  error?: string;
}

/**
 * Call our own server route (which holds the API key) to run a real
 * text-to-image generation. Returns an image URL or an error message.
 */
export async function generateWithModel(
  prompt: string,
  apiModel: string,
  imageSize?: string,
  apiKey?: string,
  negativePrompt?: string,
): Promise<GenerateResult> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model: apiModel, image_size: imageSize, api_key: apiKey, negative_prompt: negativePrompt }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { error: data?.error ?? `生成失败（${res.status}）` };
    return { url: data.url as string };
  } catch {
    return { error: "网络请求失败，请重试。" };
  }
}

export function getModelById(id: string): ModelSpec | undefined {
  return MODELS.find((m) => m.id === id);
}
