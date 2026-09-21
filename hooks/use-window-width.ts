import { useEffect, useState } from "react";

/**
 * 윈도우 리사이즈 시 현재 윈도우 너비를 반환하는 훅
 * @returns 현재 윈도우 너비 (픽셀 단위)
 */
export function useWindowWidth(): number {
  // SSR과 hydration의 첫 렌더에서 같은 값을 사용한다.
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
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

