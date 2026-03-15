import { useEffect, RefObject } from "react";

interface UseScrollObserverOptions {
  /** 스크롤 이벤트가 발생할 때 호출되는 콜백 함수 */
  onScrollChange?: (scrollTop: number) => void;
  /** passive 이벤트 리스너 사용 여부. 기본값: true */
  passive?: boolean;
}

/**
 * ref로 지정된 요소의 스크롤 이벤트를 감지하는 훅
 * @param scrollRef 스크롤 가능한 요소의 ref
 * @param options 옵션 설정
 */
export function useScrollObserver<T extends HTMLElement = HTMLElement>(
  scrollRef: RefObject<T | null>,
  options: UseScrollObserverOptions = {},
) {
  const { onScrollChange, passive = true } = options;

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !onScrollChange) return;

    const handleScroll = () => {
      onScrollChange(scrollElement.scrollTop);
    };

    scrollElement.addEventListener("scroll", handleScroll, { passive });
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef, onScrollChange, passive]);
}
