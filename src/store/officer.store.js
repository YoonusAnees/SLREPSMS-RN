import { create } from "zustand";
import { http } from "../api/http";

export const useOfficerStore = create((set) => ({
  dashboard: null,
  incidents: [],
  violationTypes: [],
  loading: false,
  error: "",

  loadDashboard: async () => {
    set({ loading: true, error: "" });
    try {
      const [dashboardRes, incidentsRes, violationsRes] = await Promise.all([
        http.get("/officer/dashboard/me"),
        http.get("/incidents"),
        http.get("/violationTypes/get"),
      ]);

      set({
        dashboard: dashboardRes.data,
        incidents: Array.isArray(incidentsRes.data) ? incidentsRes.data : [],
        violationTypes: Array.isArray(violationsRes.data)
          ? violationsRes.data
          : [],
        loading: false,
        error: "",
      });
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load officer data";
      set({ loading: false, error: msg });
      throw e;
    }
  },

  issuePenalty: async (payload) => {
    const { data } = await http.post("/penalties", payload);
    return data;
  },

  verifyVehicle: async (plateNo) => {
    const { data } = await http.post(
      `/vehicles/verify/${encodeURIComponent(plateNo)}`
    );
    return data;
  },

  createIncident: async (payload) => {
    const { data } = await http.post("/incidents", payload);
    return data;
  },

  reviewIncident: async (incidentId) => {
    const { data } = await http.patch(`/incidents/${incidentId}/review`);
    return data;
  },

  resolveIncident: async (incidentId) => {
    const { data } = await http.patch(`/incidents/${incidentId}/resolve`);
    return data;
  },

  lookupVehicleByPlate: async (plateNo) => {
    const { data } = await http.get(
      `/vehicles/by-plate/${encodeURIComponent(plateNo)}`
    );
    return data;
  },

  lookupDriverByLicense: async (licenseNo) => {
    const { data } = await http.get(
      `/drivers/by-license/${encodeURIComponent(licenseNo)}`
    );
    return data;
  },
}));