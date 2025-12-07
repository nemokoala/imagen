import { useEffect, useState } from "react";

/**
 * 윈도우 리사이즈 시 현재 윈도우 너비를 반환하는 훅
 * @returns 현재 윈도우 너비 (픽셀 단위)
 */
export function useWindowWidth(): number {
  const [width, setWidth] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return window.innerWidth;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // 초기 너비 설정
    setWidth(window.innerWidth);

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", handleResize);

    // 클린업 함수
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
}
