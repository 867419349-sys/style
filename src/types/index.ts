export interface Swatch {
  hex: string;
  role_zh: string;
  role_en: string;
}

export interface StyleResult {
  id: string;
  name_zh: string;
  name_en: string;
  tagline_zh: string;
  tagline_en: string;
  /** gradient used as a fallback background behind images (CSS background value) */
  thumb: string;
  /** all reference images from the style's source folder (public paths) */
  images: string[];
  /** primary reference image = images[0] (public path), undefined if none */
  image?: string;
  palette: Swatch[];
  description_zh: string;
  description_en: string;
  /** English prompt suitable for text-to-image models */
  prompt: string;
  /** derived at runtime from palette, but kept editable */
  css: string;
  markdown: string;
}

export interface ModelSpec {
  id: string;
  /** real model path passed to the SiliconFlow API, e.g. "Qwen/Qwen-Image" */
  apiModel: string;
  name: string;
  vendor_zh: string;
  vendor_en: string;
  /** two colors used as the brand chip / loading placeholder */
  swatch: [string, string];
}

export type GenStatus = "idle" | "loading" | "done" | "error";

export interface ModelResult {
  modelId: string;
  status: GenStatus;
  /** real generated image URL (SiliconFlow temporary link, ~24h) */
  image: string;
  /** error message when status === "error" */
  error?: string;
}
