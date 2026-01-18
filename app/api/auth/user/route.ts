import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/authService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  try {
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const user = await authService.getUserInfoById(userId);
    return NextResponse.json(user);
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  try {
    const userId = await authService.getUserIdFromCookie(cookieStore);
    const formData = await request.formData();
    const nickname = formData.get("nickname") as string | null;
    const imageFile = formData.get("image") as File | null;

    let profileImageUrl: string | undefined;

    if (imageFile) {
      profileImageUrl = await authService.saveProfileImageToFileSystem(
        imageFile,
        userId,
      );
    }

    const updatedUser = await authService.updateUserProfile(userId, {
      ...(nickname && { nickname }),
      ...(profileImageUrl && { profileImageUrl }),
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return errorHandler(error);
  }
}
