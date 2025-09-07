import { authController } from "@/lib/controllers/authController";

export async function POST() {
  return await authController.logout();
}
