import { NextRequest, NextResponse } from "next/server";
import { ollamaService } from "../services/ollamaService";
import { errorHandler } from "../errors/errorHandler";

export const ollamaController = {
  async translateText(req: NextRequest): Promise<NextResponse> {
    try {
      const { prompt } = await req.json();

      const response = await ollamaService.translateText(prompt);

      return NextResponse.json(response, { status: 201 });
    } catch (error) {
      return errorHandler(error);
    }
  },
};
