import { authController } from "@/lib/controllers/authController";

export async function GET() {
  return await authController.getUserInfo();
}
