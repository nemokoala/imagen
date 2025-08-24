'use server';

import { cookies } from 'next/headers';

export const getCookie = async (key: string) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(key);
  return accessToken;
};

export const removeCookie = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
};

export const setCookie = async (
  key: string,
  value: string,
  options?: {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  },
) => {
  const cookieStore = await cookies();
  cookieStore.set(key, value, options);
};
