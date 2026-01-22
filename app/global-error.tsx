'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 글로벌 에러 로깅
    console.error('Global application error:', error);

    // 청크 로드 에러 감지 및 자동 새로고침
    const handler = (event: ErrorEvent) => {
      const isChunkError = 
        event.message && 
        (event.message.includes('Loading chunk') || 
         event.message.includes('minified react error'));

      if (isChunkError) {
        console.log('New version detected. Reloading...');
        window.location.reload();
      }
    };

    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">일시적인 오류가 발생했습니다</h1>
              <p className="text-muted-foreground">
                일시적인 문제가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
              </p>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-left">
                <p className="text-sm font-semibold text-destructive">에러 상세:</p>
                <pre className="mt-2 overflow-auto text-xs">
                  {error.message}
                </pre>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button onClick={reset} variant="default">
                다시 시도
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="outline"
              >
                홈으로 이동
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
