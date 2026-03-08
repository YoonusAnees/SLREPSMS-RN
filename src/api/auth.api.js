import { http } from "./http";

export async function loginApi(payload) {
  const { data } = await http.post("/auth/login", payload);
  return data;
}

export async function registerApi(payload) {
  const { data } = await http.post("/auth/register", payload);
  return data;
}

export async function meApi() {
  const { data } = await http.get("/auth/me");
  return data;
}