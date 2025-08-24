import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const refreshToken = await req.headers.get("refreshToken");

  if (!refreshToken) {
    return NextResponse.json(
      { message: "Refresh token not found" },
      { status: 400 }
    );
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string);

  if (!decoded) {
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );
}
