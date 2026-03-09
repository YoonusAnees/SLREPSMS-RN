import { create } from "zustand";
import { http, setHttpToken } from "../api/http";

export const useAuthStore = create((set) => ({
  token: null,
  user: null,
  loading: false,
  error: "",

  login: async (payload) => {
    set({ loading: true, error: "" });
    try {
      const { data } = await http.post("/auth/login", payload);

      const token = data.accessToken || data.token || null;
      const user = data.user || null;

      setHttpToken(token);

      set({
        token,
        user,
        loading: false,
        error: "",
      });

      return data;
    } catch (e) {
      const msg = e?.response?.data?.message || "Login failed";
      set({ loading: false, error: msg });
      throw e;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: "" });
    try {
      const { data } = await http.post("/auth/register", payload);
      set({ loading: false, error: "" });
      return data;
    } catch (e) {
      const msg = e?.response?.data?.message || "Registration failed";
      set({ loading: false, error: msg });
      throw e;
    }
  },

  loadMe: async () => {
    try {
      const { data } = await http.get("/auth/me");
      set({ user: data });
      return data;
    } catch (e) {
      throw e;
    }
  },

  logout: () => {
    setHttpToken(null);
    set({ token: null, user: null, error: "" });
  },
}));