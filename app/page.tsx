import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
export default function Home() {
  return (
    <Layout.Content className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <main className="mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            AI로 만드는
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              특별한 사진
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Imagen와 함께 AI 이미지 생성으로 독특하고 창의적인 메뉴를
            만들어보세요. 당신의 상상력을 현실로 구현합니다.
          </p>
          <div className="flex gap-4 justify-center md:flex-row flex-col">
            <Link href="/image-gen">
              <Button size="lg" className="text-lg px-8 py-6">
                이미지 생성 시작하기
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                갤러리 보기
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                무료로 시작하기
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">빠른 생성</h3>
            <p className="text-gray-600">
              AI 기술로 몇 초 만에 고품질 이미지 생성
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">창의적 아이디어</h3>
            <p className="text-gray-600">
              무한한 상상력을 바탕으로 한 독특한 디자인
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">안전한 서비스</h3>
            <p className="text-gray-600">
              보안이 강화된 안전한 이미지 생성 서비스
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center bg-white rounded-2xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작해보세요</h2>
          <p className="text-gray-600 mb-8">
            AI 이미지 생성의 놀라운 경험을 체험해보세요
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8 py-6">
              무료 계정 만들기
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-2xl font-bold mb-4">Imagen</div>
          <p className="text-gray-400 mb-6">AI로 만드는 특별한 이미지</p>
          <div className="text-sm text-gray-500">
            © 2024 Imagen. All rights reserved.
          </div>
        </div>
      </footer>
    </Layout.Content>
  );
}
