"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "zh" | "en";

type Dict = Record<string, { zh: string; en: string }>;

const DICT: Dict = {
  brandTag: { zh: "设计风格提取", en: "Design Style Extractor" },
  navGallery: { zh: "风格库", en: "Styles" },
  navStudio: { zh: "提取", en: "Extract" },
  navCompare: { zh: "模型对比", en: "Compare" },
  settings: { zh: "设置", en: "Settings" },

  heroTitle: { zh: "解构设计，提炼精髓。", en: "Decode design, distill the essence." },
  heroSub: {
    zh: "上传任意一张界面或插画，自动提取它的设计语言——配色、质感、排版与氛围，一键生成可复用的风格 Prompt。",
    en: "Upload any UI or illustration and extract its design language — palette, texture, type and mood — into a reusable style prompt.",
  },
  ctaUpload: { zh: "上传图片提取", en: "Upload & extract" },
  ctaBrowse: { zh: "浏览风格库", en: "Browse styles" },

  galleryTitle: { zh: "风格库", en: "Style library" },
  gallerySub: {
    zh: "精选设计风格，点击任意一款查看它的配色与提示词。",
    en: "Curated design styles. Click any card to inspect its palette and prompts.",
  },

  studioTitle: { zh: "提取风格提示词", en: "Extract a style prompt" },
  studioSub: {
    zh: "拖入或选择一张图片，我们会分析它的设计风格并生成提示词。",
    en: "Drop or pick an image; we analyze its design and generate prompts.",
  },
  dropHint: { zh: "拖拽图片到此处，或点击选择", en: "Drop an image here, or click to choose" },
  dropSub: { zh: "支持 PNG / JPG / WEBP", en: "PNG / JPG / WEBP supported" },
  analyzing: { zh: "正在分析设计风格…", en: "Analyzing design style…" },
  reExtract: { zh: "换一张", en: "Try another" },

  emptyResult: {
    zh: "上传图片或从风格库中选择，这里会显示提取结果。",
    en: "Upload an image or pick a style — the result shows up here.",
  },
  palette: { zh: "配色板", en: "Palette" },
  copy: { zh: "复制", en: "Copy" },
  copied: { zh: "已复制", en: "Copied" },
  tabDesc: { zh: "风格描述", en: "Description" },
  tabPrompt: { zh: "Prompt", en: "Prompt" },

  compareTitle: { zh: "多模型效果对比", en: "Multi-model comparison" },
  compareSub: {
    zh: "用当前提示词，让不同文生图模型各生成一张，横向对比风格还原度。",
    en: "Run the current prompt across text-to-image models and compare fidelity.",
  },
  compareEmpty: {
    zh: "先提取一个风格，再来这里对比各模型的生成效果。",
    en: "Extract a style first, then compare model outputs here.",
  },
  generate: { zh: "生成对比", en: "Generate" },
  regenerate: { zh: "重新生成", en: "Regenerate" },
  generating: { zh: "生成中…", en: "Generating…" },
  download: { zh: "下载", en: "Download" },

  settingsTitle: { zh: "API 设置", en: "API settings" },
  settingsNote: {
    zh: "原型阶段：以下 Key 仅保存在你的浏览器（localStorage），暂不进行真实调用。接入真实 API 后即可生效。",
    en: "Prototype: keys are stored only in your browser (localStorage) and are not called yet. They activate once real APIs are wired up.",
  },
  visionKey: { zh: "视觉模型 Key（图片→风格）", en: "Vision model key (image→style)" },
  save: { zh: "保存", en: "Save" },
  close: { zh: "关闭", en: "Close" },
  mockBadge: { zh: "示例数据", en: "Sample data" },
};

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: keyof typeof DICT) => string;
  pick: <T>(zh: T, en: T) => T;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("zh");

  const toggle = useCallback(() => setLang((l) => (l === "zh" ? "en" : "zh")), []);
  const t = useCallback(
    (key: keyof typeof DICT) => DICT[key]?.[lang] ?? String(key),
    [lang],
  );
  const pick = useCallback(<T,>(zh: T, en: T) => (lang === "zh" ? zh : en), [lang]);

  const value = useMemo(
    () => ({ lang, setLang, toggle, t, pick }),
    [lang, toggle, t, pick],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
