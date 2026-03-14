import { create } from "zustand";
import { http } from "../api/http";

export const useOfficerStore = create((set) => ({
  dashboard: null,
  incidents: [],
  violationTypes: [],
  loading: false,
  error: "",

  lookupLoading: false,
  lookupError: "",
  lookedUp: null,

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

      return dashboardRes.data;
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load officer data";
      set({ loading: false, error: msg });
      throw e;
    }
  },

  loadViolationTypes: async () => {
    try {
      const { data } = await http.get("/violationTypes/get");

      set({
        violationTypes: Array.isArray(data) ? data : [],
      });

      return data;
    } catch (e) {
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
    const lic = (licenseNo || "").trim();

    if (lic.length < 5) {
      set({
        lookedUp: null,
        lookupError: "",
        lookupLoading: false,
      });
      return null;
    }

    set({
      lookupLoading: true,
      lookupError: "",
    });

    try {
      const { data } = await http.get(
        `/drivers/by-license/${encodeURIComponent(lic)}`
      );

      set({
        lookedUp: data,
        lookupLoading: false,
        lookupError: "",
      });

      return data;
    } catch (e) {
      const msg = e?.response?.data?.message || "Driver lookup failed";

      set({
        lookedUp: null,
        lookupLoading: false,
        lookupError: msg,
      });

      throw e;
    }
  },

  clearLookup: () =>
    set({
      lookedUp: null,
      lookupError: "",
      lookupLoading: false,
    }),
}));