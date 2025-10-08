import { NextRequest, NextResponse } from "next/server";
import { ollamaService } from "@/lib/services/ollamaService";
import { imageService } from "@/lib/services/image/imageService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ target: string }> }
) {
  const resolvedParams = await params;
  const target = resolvedParams.target;

  try {
    let response: boolean;

    switch (target) {
      case "ollama":
        response = await ollamaService.healthCheck();
        break;
      case "stable":
        response = await imageService.stableHealthCheck();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid target. Use "ollama" or "stable"' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      {
        target,
        status: response ? "healthy" : "unhealthy",
        healthy: response,
      },
      { status: response ? 200 : 500 }
    );
  } catch (error) {
    console.error(`Health check failed for ${target}:`, error);
    return NextResponse.json(
      {
        target,
        status: "error",
        healthy: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
