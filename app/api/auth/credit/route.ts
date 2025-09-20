import { authController } from "@/lib/controllers/authController";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 10;

export async function GET() {
  return await authController.getUserCredit();
}
