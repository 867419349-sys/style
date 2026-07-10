import { MODELS } from "./imagegen";

const STORAGE_KEY = "zomo-design-api-keys";

export interface ApiKeys {
  vision: string;
  models: Record<string, string>;
}

function emptyKeys(): ApiKeys {
  const models: Record<string, string> = {};
  for (const m of MODELS) models[m.id] = "";
  return { vision: "", models };
}

export function loadKeys(): ApiKeys {
  if (typeof window === "undefined") return emptyKeys();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyKeys();
    const parsed = JSON.parse(raw) as Partial<ApiKeys>;
    const base = emptyKeys();
    return {
      vision: parsed.vision ?? base.vision,
      models: { ...base.models, ...(parsed.models ?? {}) },
    };
  } catch {
    return emptyKeys();
  }
}

export function saveKeys(keys: ApiKeys): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}
