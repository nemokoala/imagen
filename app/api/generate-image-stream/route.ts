import { NextRequest } from "next/server";
import { imageController } from "../../../lib/controllers/imageController";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  return await imageController.generateImageStream(req);
}
