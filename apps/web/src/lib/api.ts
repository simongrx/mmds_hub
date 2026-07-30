import axios from "axios";
import { clearSession, getToken } from "./auth";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Cliente axios apuntando al backend Express.
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Cliente para endpoints públicos (portal cliente): sin token ni redirección a login.
export const publicApi = axios.create({
  baseURL: API_URL,
});

// Adjunta el token JWT a cada petición.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ante 401, limpia la sesión y redirige a /login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      clearSession();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
