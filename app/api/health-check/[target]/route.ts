import { NextRequest } from "next/server";
import { healthCheckController } from "@/lib/controllers/healthCheckController";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ target: string }> }
) {
  const resolvedParams = await params;
  return healthCheckController.healthCheck(req, resolvedParams.target);
}
