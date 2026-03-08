import { create } from "zustand";
import { loginApi, meApi, registerApi } from "../api/auth.api";

export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  loading: false,
  error: "",

  login: async (payload) => {
    set({ loading: true, error: "" });
    try {
      const data = await loginApi(payload);

      set({
        token: data.accessToken || data.token,
        user: data.user || null,
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
      const data = await registerApi(payload);
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
      const data = await meApi();
      set({ user: data });
      return data;
    } catch (e) {
      throw e;
    }
  },

  logout: () => set({ token: null, user: null, error: "" }),
}));