import { Button } from "../ui/button";
import Link from "next/link";

export function WelcomeTitle() {
  return (
    <main className="mx-auto px-6 py-8 w-full">
      <div className="text-center">
        <h1 className="text-5xl md:text-5xl font-bold text-foreground mb-6">
          AI로 만드는
          <br />
          <span className="gradient-purple-text">특별한 사진</span>
        </h1>
        <p className="text-xl text-subtitle mb-8 max-w-2xl mx-auto">
          Imagen와 함께 AI 이미지를 생성해보세요. 당신의 상상력을 현실로
          구현합니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register">
            <Button variant="gradient" size="lg" className="font-bold">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
