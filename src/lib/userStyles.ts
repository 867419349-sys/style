import type { StyleResult } from "@/types";

export interface UserLibrary {
  id: string;
  name: string;
  styles: StyleResult[];
}

const KEY = "zomo:user-libraries";
const EVENT = "zomo:user-styles-changed";
const DEFAULT_ID = "default";

function readAll(): UserLibrary[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as UserLibrary[];
  } catch {
    return [];
  }
}

function writeAll(libs: UserLibrary[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(libs));
  } catch {}
}

function emit() {
  window.dispatchEvent(new Event(EVENT));
}

export function getLibraries(): UserLibrary[] {
  return readAll().filter((l) => l.id !== DEFAULT_ID);
}

export function getDefaultStyles(): StyleResult[] {
  return readAll().find((l) => l.id === DEFAULT_ID)?.styles ?? [];
}

export function getAllUserStyles(): StyleResult[] {
  return readAll().flatMap((lib) => lib.styles);
}

export function addToDefault(style: StyleResult): boolean {
  const libs = readAll();
  let lib = libs.find((l) => l.id === DEFAULT_ID);
  if (!lib) {
    lib = { id: DEFAULT_ID, name: "", styles: [] };
    libs.unshift(lib);
  }
  if (lib.styles.some((s) => s.id === style.id)) return false;
  lib.styles.unshift(style);
  writeAll(libs);
  emit();
  return true;
}

export function addToLibrary(style: StyleResult, libraryId: string): boolean {
  const libs = readAll();
  const lib = libs.find((l) => l.id === libraryId);
  if (!lib) return false;
  if (lib.styles.some((s) => s.id === style.id)) return false;
  lib.styles.unshift(style);
  writeAll(libs);
  emit();
  return true;
}

export function createLibrary(name: string, style?: StyleResult): UserLibrary {
  const libs = readAll();
  const lib: UserLibrary = {
    id: `lib-${Date.now()}`,
    name,
    styles: style ? [style] : [],
  };
  libs.unshift(lib);
  writeAll(libs);
  emit();
  return lib;
}

export function removeUserStyle(libraryId: string, styleId: string) {
  const libs = readAll();
  const lib = libs.find((l) => l.id === libraryId);
  if (!lib) return;
  lib.styles = lib.styles.filter((s) => s.id !== styleId);
  writeAll(libs);
  emit();
}

export function addImageToStyle(styleId: string, imageDataUrl: string): boolean {
  const libs = readAll();
  for (const lib of libs) {
    const s = lib.styles.find((s) => s.id === styleId);
    if (s) {
      if (!s.images) s.images = [];
      s.images.push(imageDataUrl);
      if (!s.image) s.image = imageDataUrl;
      writeAll(libs);
      emit();
      return true;
    }
  }
  return false;
}

export function copyBuiltinToDefault(style: StyleResult, imageDataUrl: string): boolean {
  const libs = readAll();
  let lib = libs.find((l) => l.id === DEFAULT_ID);
  if (!lib) {
    lib = { id: DEFAULT_ID, name: "", styles: [] };
    libs.unshift(lib);
  }
  const copy: StyleResult = {
    ...style,
    id: style.id,
    images: [...(style.images ?? []), imageDataUrl],
    image: style.image ?? imageDataUrl,
  };
  lib.styles.unshift(copy);
  writeAll(libs);
  emit();
  return true;
}

export function renameLibrary(libraryId: string, newName: string): boolean {
  const libs = readAll();
  const lib = libs.find((l) => l.id === libraryId);
  if (!lib || !newName.trim()) return false;
  lib.name = newName.trim();
  writeAll(libs);
  emit();
  return true;
}

export function updateStyle(libraryId: string, styleId: string, updates: Partial<StyleResult>): boolean {
  const libs = readAll();
  const lib = libs.find((l) => l.id === libraryId);
  if (!lib) return false;
  const idx = lib.styles.findIndex((s) => s.id === styleId);
  if (idx === -1) return false;
  lib.styles[idx] = { ...lib.styles[idx], ...updates };
  writeAll(libs);
  emit();
  return true;
}

export function findStyleLibrary(styleId: string): string | null {
  const libs = readAll();
  for (const lib of libs) {
    if (lib.styles.some((s) => s.id === styleId)) return lib.id;
  }
  return null;
}

export function deleteLibrary(id: string) {
  const libs = readAll().filter((l) => l.id !== id);
  writeAll(libs);
  emit();
}

export { EVENT };
