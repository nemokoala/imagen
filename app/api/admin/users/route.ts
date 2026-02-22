import { NextResponse } from "next/server";
import { checkAdminRole } from "@/lib/server-utils";
import { prisma } from "@/lib/prisma";
import { errorHandler } from "@/lib/errors/errorHandler";

// 허용되는 정렬 필드
const ALLOWED_SORT_FIELDS = [
  "id",
  "email",
  "nickname",
  "credits",
  "role",
  "provider",
  "createdAt",
];

export async function GET(request: Request) {
  try {
    // 어드민 권한 확인
    await checkAdminRole();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    const skip = (page - 1) * limit;

    // 검색 조건
    const where = search
      ? {
          OR: [
            { email: { contains: search } },
            { nickname: { contains: search } },
          ],
        }
      : {};

    const orderByField = ALLOWED_SORT_FIELDS.includes(sortBy)
      ? sortBy
      : "createdAt";

    // 유저 목록 조회
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          nickname: true,
          credits: true,
          role: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
          profileImageUrl: true,
        },
        orderBy: { [orderByField]: order },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorHandler(error);
  }
}
