"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

/**
 * URL 쿼리 파라미터를 get, set, remove 할 수 있는 훅
 * @returns {Object} 파라미터 관리 함수들
 */
export function useUrlParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * 특정 파라미터 값을 가져옵니다
   * @param key 파라미터 키
   * @returns 파라미터 값 또는 null
   */
  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  /**
   * 모든 파라미터를 객체로 가져옵니다
   * @returns 파라미터 객체
   */
  const getAllParams = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  /**
   * 파라미터를 설정합니다 (기존 파라미터는 유지)
   * @param key 파라미터 키
   * @param value 파라미터 값 (null이면 제거)
   */
  const setParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      const newSearch = params.toString();
      const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  /**
   * 파라미터를 제거합니다
   * @param key 파라미터 키
   */
  const removeParam = useCallback(
    (key: string) => {
      setParam(key, null);
    },
    [setParam]
  );

  /**
   * 여러 파라미터를 한번에 설정합니다
   * @param params 설정할 파라미터 객체
   */
  const setMultipleParams = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      const newSearch = newParams.toString();
      const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  /**
   * 모든 파라미터를 제거합니다
   */
  const clearParams = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    getParam,
    getAllParams,
    setParam,
    removeParam,
    setMultipleParams,
    clearParams,
  };
}
