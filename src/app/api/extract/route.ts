import { NextResponse } from "next/server";
import type { StyleResult, Swatch } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const ENDPOINT = "https://api.siliconflow.cn/v1/chat/completions";
const VISION_MODEL = "Qwen/Qwen3-VL-8B-Instruct";

const INSTRUCTION = `你是资深设计风格分析师。分析这张图的视觉设计风格，只输出一个 JSON 对象，不要任何解释或代码块标记。字段：
name_zh, name_en, tagline_zh(不超过12字), tagline_en, description_zh(2-3句), description_en, palette(恰好5个元素，每个 {hex(形如 #RRGGBB), role_zh, role_en}), prompt(英文文生图提示词，凝练描述该风格的视觉特征)。`;

function grad(cols: string[]): string {
  const a = cols[0] ?? "#e67e5b";
  const b = cols[1] ?? cols[0] ?? "#f4c2a1";
  const c = cols[cols.length - 1] ?? "#28282b";
  return `linear-gradient(135deg, ${a} 0%, ${b} 55%, ${c} 100%)`;
}

function buildCss(palette: Swatch[]): string {
  const lines = palette
    .map((s, i) => `  --color-${i + 1}: ${s.hex}; /* ${s.role_en} */`)
    .join("\n");
  return `:root {\n${lines}\n}\n\n.surface {\n  background: var(--color-1);\n  color: var(--color-${palette.length});\n  font-family: system-ui, sans-serif;\n}`;
}

function buildMarkdown(
  name: string,
  desc: string,
  palette: Swatch[],
  prompt: string,
): string {
  const sw = palette.map((s) => `- \`${s.hex}\` — ${s.role_en}`).join("\n");
  return `# ${name}\n\n${desc}\n\n## Palette\n${sw}\n\n## Prompt\n> ${prompt}`;
}

function cleanHex(h: unknown): string | null {
  if (typeof h !== "string") return null;
  const m = h.trim().match(/#?[0-9a-fA-F]{6}/);
  if (!m) return null;
  const v = m[0].startsWith("#") ? m[0] : `#${m[0]}`;
  return v.toUpperCase();
}

export async function POST(req: Request) {
  const key = process.env.SILICONFLOW_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "服务端未配置 SILICONFLOW_API_KEY，请在 .env.local 中填入。" },
      { status: 500 },
    );
  }

  let body: { image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON。" }, { status: 400 });
  }

  const image = body.image;
  if (!image || !image.startsWith("data:image/")) {
    return NextResponse.json({ error: "缺少有效的图片数据。" }, { status: 400 });
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        messages: [
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: image } },
              { type: "text", text: INSTRUCTION },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 900,
      }),
      signal: AbortSignal.timeout(55_000),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || `视觉模型返回 ${res.status}` },
        { status: 502 },
      );
    }

    let content: string = data?.choices?.[0]?.message?.content ?? "";
    content = content.replace(/```json\s*/gi, "").replace(/```/g, "").trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "模型输出解析失败，请重试。" },
        { status: 502 },
      );
    }

    const rawPal = Array.isArray(parsed.palette)
      ? (parsed.palette as Record<string, unknown>[])
      : [];
    const palette: Swatch[] = rawPal.slice(0, 6).map((p) => ({
      hex: cleanHex(p?.hex) ?? "#888888",
      role_zh: String(p?.role_zh ?? "颜色"),
      role_en: String(p?.role_en ?? "Color"),
    }));
    while (palette.length < 3) {
      palette.push({ hex: "#888888", role_zh: "颜色", role_en: "Color" });
    }

    const name_en = String(parsed.name_en ?? "Uploaded Style");
    const description_en = String(parsed.description_en ?? "");
    const prompt = String(parsed.prompt ?? "");

    const style: StyleResult = {
      id: `upload-${Date.now()}-${Math.floor(Math.random() * 1e4)}`,
      name_zh: String(parsed.name_zh ?? "上传的风格"),
      name_en,
      tagline_zh: String(parsed.tagline_zh ?? ""),
      tagline_en: String(parsed.tagline_en ?? ""),
      thumb: grad(palette.map((p) => p.hex)),
      images: [],
      image: undefined,
      palette,
      description_zh: String(parsed.description_zh ?? ""),
      description_en,
      prompt,
      css: buildCss(palette),
      markdown: buildMarkdown(name_en, description_en, palette, prompt),
    };

    return NextResponse.json({ style });
  } catch (err) {
    const msg =
      err instanceof Error && err.name === "TimeoutError"
        ? "分析超时，请重试。"
        : "调用视觉模型失败。";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
