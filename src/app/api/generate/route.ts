import { NextResponse } from "next/server";

export const runtime = "nodejs";
// 生图较慢（尤其 Qwen-Image），放宽函数超时（仅部署到 Vercel 等平台时生效）。
export const maxDuration = 120;

const ENDPOINT = "https://api.siliconflow.cn/v1/images/generations";

export async function POST(req: Request) {
  const key = process.env.SILICONFLOW_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "服务端未配置 SILICONFLOW_API_KEY，请在 .env.local 中填入。" },
      { status: 500 },
    );
  }

  let body: { prompt?: string; model?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON。" }, { status: 400 });
  }

  const prompt = body.prompt?.trim();
  const model = body.model?.trim();
  if (!prompt || !model) {
    return NextResponse.json({ error: "缺少 prompt 或 model 参数。" }, { status: 400 });
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        image_size: "1024x1024",
        batch_size: 1,
      }),
      // 单次生图上限约 110s，避免请求无限挂起。
      signal: AbortSignal.timeout(110_000),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = data?.message || `文生图接口返回 ${res.status}`;
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    const url: string | undefined = data?.images?.[0]?.url;
    if (!url) {
      return NextResponse.json({ error: "接口未返回图片地址。" }, { status: 502 });
    }
    return NextResponse.json({ url });
  } catch (err) {
    const msg =
      err instanceof Error && err.name === "TimeoutError"
        ? "生成超时，请重试。"
        : "调用文生图接口失败。";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
