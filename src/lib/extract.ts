import type { StyleResult } from "@/types";

/** 把上传文件缩到最长边 max px 并转成 JPEG data URL，控制请求体积、加快分析 */
async function fileToDataUrl(file: File, max = 1024): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("无法处理该图片。");
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.85);
}

/**
 * 真实提取：上传图片 → 视觉模型（Qwen3-VL，经服务端路由，Key 保密）
 * → 返回结构化的设计风格结果。
 */
export async function extractStyle(file: File): Promise<StyleResult> {
  const image = await fileToDataUrl(file);
  const res = await fetch("/api/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.style) {
    throw new Error(data?.error ?? "分析失败，请重试。");
  }
  const style = data.style as StyleResult;
  // 把用户上传的原图带进结果，供结果页大图与参考图展示
  return { ...style, image, images: [image] };
}
