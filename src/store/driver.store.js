import { create } from "zustand";
import { http } from "../api/http";

export const useDriverStore = create((set) => ({
  me: null,
  vehicles: [],
  penalties: [],
  incidents: [],
  loading: false,
  error: "",

  loadDashboardData: async () => {
    set({ loading: true, error: "" });
    try {
      const [meRes, vehiclesRes, penaltiesRes, incidentsRes] = await Promise.all([
        http.get("/drivers/me"),
        http.get("/vehicles/my"),
        http.get("/penalties/my"),
        http.get("/incidents/my"),
      ]);

      set({
        me: meRes.data,
        vehicles: Array.isArray(vehiclesRes.data) ? vehiclesRes.data : [],
        penalties: Array.isArray(penaltiesRes.data) ? penaltiesRes.data : [],
        incidents: Array.isArray(incidentsRes.data) ? incidentsRes.data : [],
        loading: false,
        error: "",
      });
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load driver data";
      set({ loading: false, error: msg });
      throw e;
    }
  },

  createIncident: async (payload) => {
    const { data } = await http.post("/incidents", payload);
    return data;
  },

  addVehicle: async (payload) => {
    const { data } = await http.post("/vehicles/add", payload);
    return data;
  },

  updateProfile: async (payload) => {
    const { data } = await http.put("/drivers/me/update", payload);
    set((state) => ({
      me: {
        ...state.me,
        user: data,
      },
    }));
    return data;
  },
}));