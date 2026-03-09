import axios from "axios";

let authToken = null;

export function setHttpToken(token) {
  authToken = token;
}

console.log("API BASE URL =", process.env.EXPO_PUBLIC_API_BASE_URL);

export const http = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 3000,
});

http.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});