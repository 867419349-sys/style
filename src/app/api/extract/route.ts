import { NextResponse } from "next/server";
import type { StyleResult, Swatch } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const ENDPOINT = "https://api.siliconflow.cn/v1/chat/completions";
const VISION_MODEL = "Qwen/Qwen3-VL-8B-Instruct";

const INSTRUCTION = `你是一位世界级的视觉设计分析师和AI绘画提示词(Prompt)工程师。你的任务是**同时分析**这张图片的：① 主体内容（角色/物体/场景）② 视觉设计风格，并生成能精准还原原图效果的完整提示词。

【核心原则】
你需要分拆输出两个层次：
1. **主体描述（subject）**：图片里有什么？人物/角色/物体/场景的具体特征（外貌、姿态、服饰、道具、环境等）。
2. **风格描述（style）**：图片的视觉风格是什么？（色彩、光影、质感、构图、氛围等可迁移的风格元素）。

最终的生图 prompt 应当 = 主体描述 + 风格描述，确保能生成与原图高度一致的效果。

【分析维度 —— 共 8 个】

0. **主体与内容 (Subject & Content)** ⭐ 新增
   图片中有哪些人物/角色/物体？他们的具体特征是什么？
   - 人物：性别、年龄感、发型发色、五官特征、表情、姿态、服装款式与颜色
   - 角色/IP：物种（人物/动物/拟人化物体）、体型比例（Q版/正常/夸张）、标志性特征（耳朵/尾巴/角/翅膀等）、皮肤/毛发颜色
   - 物体：种类、材质、形状、大小、数量、排列方式
   - 场景：室内/室外、具体环境（街道/森林/太空/办公室…）、时间（白天/黄昏/夜晚）
   请写得尽可能具体，因为这部分会直接进入生图 prompt。

1. **艺术风格与媒介 (Style & Medium)**
   精准识别：具体流派（如孟菲斯设计、瑞士国际主义、赛博朋克、浮世绘、包豪斯…）+ 媒介模拟（如丝网印刷、胶片摄影、3D octane渲染、水彩手绘、像素艺术…）。
   给出5-10个核心风格关键词（style_keywords），例如："弥散光"、"酸性金属"、"拼贴"、"粗野主义"。

2. **色彩体系 (Color System)**
   主色调是什么？辅助色？点缀色？饱和度（高/中/低/灰阶）？明度（高调/中调/低调）？对比度（强/弱）？冷暖倾向？
   提取恰好 5 个 hex 色值构成配色板（palette），按视觉权重排序。

3. **光影方案 (Lighting Scheme)**
   光源方向（顶光/侧光/逆光/环境光/无明确光源）？光线质感（硬光锐影/柔光漫射/霓虹发光/自然散射）？
   阴影类型（硬边投影/软阴影/无阴影扁平化/长投影）？整体亮度级别？

4. **构图系统 (Composition System)**
   视觉重心位置？网格系统（对称/三分法/对角线/散点/轴向）？留白比例？元素密度？景别（特写/中景/远景/平面无景深）？

5. **质感与材质 (Texture & Material)**
   表面质感（光滑镜面/磨砂哑光/粗粝颗粒/纸张纹理/液态金属/毛玻璃/塑料光泽/木质/布纹…等）。
   笔触感（如有手绘元素）？噪点/做旧/光晕等后期效果？

6. **图形与装饰语言 (Shape & Decorative Language)**
   形状倾向（几何硬边/有机曲线/圆角柔和/尖锐棱角）？装饰元素（边框/分隔线/图标风格/纹理底纹/渐变类型）？

7. **氛围与情绪 (Mood & Atmosphere)**
   整体气质（严肃专业/活泼俏皮/奢华高端/复古怀旧/科技未来/自然清新/暗黑神秘…）。画面给人什么感觉？

【输出格式】
严格只输出一个 JSON 对象，不要 Markdown 代码块，不要任何解释文字。字段：

- name_zh (string): 风格名称，4-8 字，精炼且有辨识度
- name_en (string): English style name
- tagline_zh (string): 一句话概括，≤12 字
- tagline_en (string): English tagline
- subject_zh (string): ⭐ 主体描述 —— 详细描写图片中的角色/人物/物体/场景，包含具体的外貌、姿态、服饰、道具、环境等特征，80-150 字
- subject_en (string): English subject description
- description_zh (string): 2-4 句完整描述该风格的核心特征
- description_en (string): English description
- style_keywords (string[]): 5-10 个核心风格关键词，按重要性排序
- palette: 恰好 5 个 [{hex: "#RRGGBB", role_zh: "角色名", role_en: "Role"}]
- prompt_zh (string): **⭐ 最重要！完整生图提示词 ⭐**
  结构：「[主体描述]，[风格定性]，[色彩描述]，[光影描述]，[质感描述]，[构图特征]，[装饰元素]，[整体氛围]，高细节，杰作」
  要求：① 第一句必须完整描述主体（角色/人物/物体），然后才是风格描述 ② 用中文自然语句连接，不要逗号堆砌 ③ 包含具体可量化的视觉特征 ④ 长度 150-250 字
- prompt (string): English version of the full prompt, same structure
- style_prompt_zh (string): 纯风格提示词（不含具体主体，可应用到任意主体上），长度 80-150 字
- style_prompt_en (string): English style-only prompt
- negative_prompt (string): 生图时需要排除的元素（如"写实照片风格、3D渲染、杂乱背景、文字水印、低画质、模糊"）
- analysis_zh (string): 按"主体内容 → 艺术风格 → 色彩 → 光影 → 构图 → 质感 → 装饰 → 氛围"的顺序，用中文写一段完整分析报告，每个维度 1-2 句。`;

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
  let body: { image?: string; api_key?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON。" }, { status: 400 });
  }

  const key = body.api_key?.trim() || process.env.SILICONFLOW_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "请先在右上角设置中填入硅基流动 API Key。" },
      { status: 401 },
    );
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
        max_tokens: 2500,
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

    const prompt_zh = String(parsed.prompt_zh ?? parsed.prompt ?? "");
    const subject_zh = String(parsed.subject_zh ?? "");
    const subject_en = String(parsed.subject_en ?? "");
    const style_prompt_zh = String(parsed.style_prompt_zh ?? "");
    const style_prompt_en = String(parsed.style_prompt_en ?? "");
    const analysis_zh = String(parsed.analysis_zh ?? parsed.description_zh ?? "");
    const negative_prompt = String(parsed.negative_prompt ?? "");
    const style_keywords: string[] = Array.isArray(parsed.style_keywords)
      ? (parsed.style_keywords as string[]).filter((k) => typeof k === "string")
      : [];

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
      prompt_zh,
      subject_zh,
      subject_en,
      style_prompt_zh,
      style_prompt_en,
      negative_prompt,
      style_keywords,
      analysis_zh,
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
