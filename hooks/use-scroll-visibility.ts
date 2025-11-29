import { useState, useCallback, useRef } from "react";

interface UseScrollVisibilityOptions {
  /** 스크롤이 이 값 이하일 때 항상 버튼을 표시합니다. 기본값: 100 */
  threshold?: number;
}

/**
 * 스크롤 방향에 따라 요소의 가시성을 제어하는 훅
 * @param options 옵션 설정
 * @returns isVisible: 버튼 표시 여부, handleScrollChange: 스크롤 변경 핸들러
 */
export function useScrollVisibility(options: UseScrollVisibilityOptions = {}) {
  const { threshold = 100 } = options;
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTopRef = useRef(0);

  const handleScrollChange = useCallback(
    (scrollTop: number) => {
      const lastScrollTop = lastScrollTopRef.current;

      // 스크롤이 맨 위에 있거나 위로 스크롤할 때는 버튼 표시
      if (scrollTop < lastScrollTop || scrollTop < threshold) {
        setIsVisible(true);
      }
      // 아래로 스크롤할 때는 버튼 숨김
      else if (scrollTop > lastScrollTop) {
        setIsVisible(false);
      }

      lastScrollTopRef.current = scrollTop;
    },
    [threshold]
  );

  return {
    isVisible,
    handleScrollChange,
  };
}
