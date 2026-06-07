import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  setAuthToken(data.token);
  return data as { token: string; email: string; fullName: string; roles: string[] };
}
