import { NextRequest } from "next/server";
import { authController } from "@/lib/controllers/authController";

export async function POST(req: NextRequest) {
  return await authController.login(req);
}
