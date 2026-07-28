const STORAGE_KEY = "zomo-design-siliconflow-key";

export function getKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function hasKey(): boolean {
  return getKey().trim().length > 0;
}

export function saveKey(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, key.trim());
}
