import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 60;

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = "dall-e-3";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "프롬프트가 필요합니다." },
        { status: 400 }
      );
    }

    const result = await client.images.generate({
      model,
      prompt,
      size: "1024x1024",
      // response_format: "b64_json", // 기본값이라 생략 가능
      // background: "transparent",   // 필요 시 투명 배경
    });

    console.log("result", result);

    if (model === "gpt-image-1") {
      const imageB64 = result.data?.[0]?.b64_json;
      if (!imageB64) {
        return NextResponse.json(
          { error: "이미지 생성에 실패했습니다." },
          { status: 500 }
        );
      }
    }

    if (model === "dall-e-2" || model === "dall-e-3") {
      const imgUrl = result.data?.[0]?.url;
      if (!imgUrl) {
        return NextResponse.json(
          { error: "이미지 생성에 실패했습니다." },
          { status: 500 }
        );
      }
    }

    // 프런트에서 바로 <img src="...">로 쓸 수 있게 data URL로
    let dataUrl = "";
    if (model === "gpt-image-1") {
      dataUrl = result.data?.[0]?.b64_json || "";
      dataUrl = `data:image/png;base64,${dataUrl}`;
    }
    if (model === "dall-e-2" || model === "dall-e-3") {
      dataUrl = result.data?.[0]?.url || "";
    }
    return NextResponse.json({ dataUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Image generation error:", error);

    const status =
      typeof error?.status === "number"
        ? error.status
        : String(error?.message || "").includes("must be verified")
        ? 403
        : 500;

    const message = error?.message || "이미지 생성 중 오류가 발생했습니다.";

    return NextResponse.json({ error: message }, { status });
  }
}
