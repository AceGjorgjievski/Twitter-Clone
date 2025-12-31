

import { paths } from "@/routes/paths";
import axiosInstance from "@/utils/axios";

function jwtDecode(token?: string | null) {
  if (!token || typeof token !== 'string') {
    throw new Error("Invalid token: token is undefined, null, or not a string");
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error("Invalid token: JWT must have 3 parts");
  }

  const base64Url = parts[1];
  if (!base64Url) {
    throw new Error("Invalid token: missing payload part");
  }

  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}



export const isValidToken = (accessToken?: string | null) => {
  if (!accessToken) return false;

  try {
    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (err) {
    console.error("Invalid token:", err);
    return false;
  }
};



export const tokenExpired = (exp: number) => {
  // eslint-disable-next-line prefer-const
  let expiredTimer;

  const currentTime = Date.now();

  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    sessionStorage.removeItem('accessToken');

    window.location.href = paths.login();
  }, timeLeft);
};


export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);

    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    const { exp } = jwtDecode(accessToken);
    tokenExpired(exp);
  } else {
    sessionStorage.removeItem('accessToken');

    delete axiosInstance.defaults.headers.common.Authorization;
  }
};
