import { create } from "zustand";
import { http } from "../api/http";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: "",

  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken }),

  login: async (payload) => {
    set({ loading: true, error: "" });

    try {
      const { data } = await http.post("/auth/login", payload);

      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        loading: false,
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

      set({ loading: false });

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

  logoutLocal: () => {
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      error: "",
    });
  },
}));