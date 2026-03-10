import { create } from "zustand";
import { http } from "../api/http";

function toCount(items, type) {
    return items.filter((x) => String(x?.type || "").toUpperCase() === type).length;
}

export const usePublicStore = create((set, get) => ({
    stats: {
        total: 0,
        pending: 0,
        resolved: 0,
        accidents: 0,
        breakdowns: 0,
        emergency: 0,
    },
    categoryBreakdown: [],
    recentIncidents: [],
    loading: {
        home: false,
        report: false,
    },

    loadPublicHomeData: async () => {
        set((state) => ({
            loading: { ...state.loading, home: true },
        }));

        try {
            const { data } = await http.get("/incidents");
            const incidents = Array.isArray(data) ? data : [];

            const total = incidents.length;
            const pending = incidents.filter((x) =>
                ["NEW", "PENDING", "OPEN", "SUBMITTED", "IN_PROGRESS", "DISPATCHED", "UNDER_REVIEW"].includes(
                    String(x?.status || "").toUpperCase()
                )
            ).length;

            const resolved = incidents.filter((x) =>
                ["RESOLVED", "CLOSED", "COMPLETED"].includes(
                    String(x?.status || "").toUpperCase()
                )
            ).length;

            const accidents = toCount(incidents, "ACCIDENT");
            const breakdowns = toCount(incidents, "BREAKDOWN");
            const medical = toCount(incidents, "MEDICAL");
            const fire = toCount(incidents, "FIRE");
            const other = toCount(incidents, "OTHER");

            const emergency = medical + fire;

            const categories = [
                { label: "Accidents", count: accidents, color: "#ef4444" },
                { label: "Breakdowns", count: breakdowns, color: "#f59e0b" },
                { label: "Medical", count: medical, color: "#3b82f6" },
                { label: "Fire", count: fire, color: "#f97316" },
                { label: "Other", count: other, color: "#22c55e" },
            ];

            const categoryBreakdown = categories.map((item) => ({
                ...item,
                percent: total > 0 ? Math.round((item.count / total) * 100) : 0,
            }));

            const recentIncidents = [...incidents]
                .sort(
                    (a, b) =>
                        new Date(b?.createdAt || b?.reportedAt || 0) -
                        new Date(a?.createdAt || a?.reportedAt || 0)
                )
                .slice(0, 8);

            set((state) => ({
                stats: {
                    total,
                    pending,
                    resolved,
                    accidents,
                    breakdowns,
                    emergency,
                },
                categoryBreakdown,
                recentIncidents,
                loading: { ...state.loading, home: false },
            }));

            return incidents;
        } catch (e) {
            set((state) => ({
                loading: { ...state.loading, home: false },
            }));
            throw e;
        }
    },

    createPublicIncident: async (payload) => {
        set((state) => ({
            loading: { ...state.loading, report: true },
        }));

        try {
            const { data } = await http.post("/incidents", payload);

            set((state) => ({
                loading: { ...state.loading, report: false },
            }));

            return data;
        } catch (e) {
            set((state) => ({
                loading: { ...state.loading, report: false },
            }));
            throw e;
        }
    },
}));