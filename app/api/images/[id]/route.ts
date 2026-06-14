import { NextRequest, NextResponse } from "next/server";
import { imageService } from "@/lib/services/image/imageService";
import { errorHandler } from "@/lib/errors/errorHandler";
import { cookies } from "next/headers";
import { authService } from "@/lib/services/auth/authService";
import { ApiError } from "@/lib/errors/AppError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const imageId = parseInt(id);

    if (!id) {
      return NextResponse.json(
        { error: "이미지 ID가 필요합니다." },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    let currentUserId: number | undefined;
    try {
      currentUserId = await authService.getUserIdFromCookie(cookieStore);
    } catch {
      // 로그인하지 않은 경우 무시
    }

    const image = await imageService.getImageById(imageId, currentUserId);

    if (!image) {
      return NextResponse.json(
        { error: "이미지를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 이전/다음 이미지 가져오기
    const { prevImages, nextImages } = await imageService.getAdjacentImages(
      imageId,
      3,
      3,
      currentUserId,
    );

    return NextResponse.json(
      {
        success: true,
        image,
        prevImages,
        nextImages,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Get image by id error:", error);
    return errorHandler(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const imageId = parseInt(resolvedParams.id);

    if (!resolvedParams.id || Number.isNaN(imageId)) {
      throw new ApiError("이미지 ID가 필요합니다.", 400, "IMAGE_ID_REQUIRED");
    }

    const formData = await req.formData();
    const editData = formData.get("editData");
    const editedImage = formData.get("editedImage");

    if (typeof editData !== "string" || !(editedImage instanceof Blob)) {
      throw new ApiError(
        "editData와 editedImage가 필요합니다.",
        400,
        "INVALID_EDIT_PAYLOAD",
      );
    }

    const editedImageBuffer = Buffer.from(await editedImage.arrayBuffer());

    const cookieStore = await cookies();
    const currentUserId = await authService.getUserIdFromCookie(cookieStore);

    const updated = await imageService.updateImageEdit({
      imageId,
      userId: currentUserId,
      editData,
      editedImageBuffer,
    });

    return NextResponse.json(
      { success: true, image: updated },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Update image edit error:", error);
    return errorHandler(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { error: "이미지 ID가 필요합니다." },
        { status: 400 },
      );
    }

    // 인증 확인 및 사용자 정보 가져오기
    const cookieStore = await cookies();
    const currentUserId = await authService.getUserIdFromCookie(cookieStore);
    const currentUser = await authService.findUserById(currentUserId);

    if (!currentUser) {
      throw new ApiError("사용자를 찾을 수 없습니다.", 404, "USER_NOT_FOUND");
    }

    // 이미지 정보 가져오기
    const image = await imageService.getImageById(parseInt(id));

    if (!image) {
      return NextResponse.json(
        { error: "이미지를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 권한 확인: 본인 이미지이거나 어드민인 경우만 삭제 가능
    const isOwner = image.userId === currentUserId;
    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      throw new ApiError("이미지를 삭제할 권한이 없습니다.", 403, "FORBIDDEN");
    }

    await imageService.deleteImage(parseInt(id));

    return NextResponse.json(
      {
        success: true,
        message: "이미지가 삭제되었습니다.",
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Delete image error:", error);
    return errorHandler(error);
  }
}
