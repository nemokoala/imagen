import { NextRequest } from "next/server";
import { imageController } from "../../../../lib/controllers/imageController";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params;
  return await imageController.getImageById(req, resolvedParams.id);
}
