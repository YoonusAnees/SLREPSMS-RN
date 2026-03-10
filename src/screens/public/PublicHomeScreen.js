import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { usePublicStore } from "../../store/public.store";

function statusTone(status) {
  const s = String(status || "").toUpperCase();

  if (["RESOLVED", "CLOSED", "COMPLETED"].includes(s)) return "#22c55e";
  if (["NEW", "PENDING", "OPEN", "SUBMITTED", "IN_PROGRESS", "DISPATCHED", "UNDER_REVIEW"].includes(s)) {
    return "#f59e0b";
  }
  return "#94a3b8";
}

function severityTone(severity) {
  const s = String(severity || "").toUpperCase();

  if (s === "HIGH" || s === "CRITICAL") return "#ef4444";
  if (s === "MEDIUM") return "#f59e0b";
  return "#22c55e";
}

function StatCard({ title, value, note, icon, bg }) {
  return (
    <View
      style={{
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 18,
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 10 }}>{title}</Text>
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", marginTop: 6 }}>
        {value}
      </Text>
      <Text style={{ color: "#cbd5e1", fontSize: 13, marginTop: 6 }}>{note}</Text>
    </View>
  );
}

function MetricTile({ label, value, bg }) {
  return (
    <View
      style={{
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: "#334155",
        borderRadius: 14,
        padding: 14,
        flex: 1,
        minWidth: "47%",
      }}
    >
      <Text style={{ color: "#94a3b8", fontSize: 12 }}>{label}</Text>
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "800", marginTop: 8 }}>
        {value}
      </Text>
    </View>
  );
}

export default function PublicHomeScreen({ navigation }) {
  const stats = usePublicStore((s) => s.stats);
  const categoryBreakdown = usePublicStore((s) => s.categoryBreakdown);
  const recentIncidents = usePublicStore((s) => s.recentIncidents);
  const loadPublicHomeData = usePublicStore((s) => s.loadPublicHomeData);
  const loading = usePublicStore((s) => s.loading.home);

  useEffect(() => {
    loadPublicHomeData().catch(() => {});
  }, [loadPublicHomeData]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#020617" }}
      contentContainerStyle={{ padding: 16, gap: 18 }}
    >
      <View
        style={{
          backgroundColor: "#0f172a",
          borderWidth: 1,
          borderColor: "#1e293b",
          borderRadius: 24,
          padding: 20,
        }}
      >
        <Text style={{ color: "#818cf8", fontWeight: "700", fontSize: 14 }}>
          🚦 Sri Lanka Road E-Penalty Management System
        </Text>

        <Text
          style={{
            color: "#fff",
            fontSize: 30,
            fontWeight: "900",
            lineHeight: 38,
            marginTop: 14,
          }}
        >
          Public road safety, incident awareness, and traffic response in one place.
        </Text>

        <Text
          style={{
            color: "#cbd5e1",
            fontSize: 15,
            lineHeight: 24,
            marginTop: 14,
          }}
        >
          SLREPSMS provides a public-facing view of incident reporting, safety awareness,
          and general road event activity while keeping private user data protected.
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("PublicIncidentReport")}
            style={{
              backgroundColor: "#4f46e5",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Report Public Incident</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("PrivacyPolicy")}
            style={{
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: "#334155",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("RoadSafety")}
            style={{
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: "#334155",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Road Safety</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Statistics")}
            style={{
              backgroundColor: "#111827",
              borderWidth: 1,
              borderColor: "#334155",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Statistics</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <StatCard
          title="Total Incidents"
          value={stats.total}
          note="All public incident records"
          icon="🚨"
          bg="#220c10"
        />
        <StatCard
          title="Accidents"
          value={stats.accidents}
          note="Collision and crash-related"
          icon="🚗"
          bg="#2b1608"
        />
        <StatCard
          title="Resolved Cases"
          value={stats.resolved}
          note="Closed or completed"
          icon="✅"
          bg="#052915"
        />
        <StatCard
          title="Emergency Cases"
          value={stats.emergency}
          note="Rescue / urgent assistance"
          icon="🚑"
          bg="#08263b"
        />
      </View>

      <View
        style={{
          backgroundColor: "#0f172a",
          borderRadius: 18,
          borderWidth: 1,
          borderColor: "#334155",
          padding: 16,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
          Public incident statistics
        </Text>
        <Text style={{ color: "#94a3b8", marginTop: 8, lineHeight: 22 }}>
          These insights are based on incident records loaded from the public incident feed.
        </Text>

        <View style={{ marginTop: 16, gap: 12 }}>
          {categoryBreakdown.map((item) => (
            <View key={item.label}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ color: "#cbd5e1" }}>
                  {item.label} ({item.count})
                </Text>
                <Text style={{ color: "#94a3b8" }}>{item.percent}%</Text>
              </View>
              <View
                style={{
                  height: 10,
                  backgroundColor: "#1e293b",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${item.percent}%`,
                    backgroundColor: item.color,
                    borderRadius: 999,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        <View
          style={{
            marginTop: 18,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <MetricTile label="Pending Review" value={stats.pending} bg="#2b1608" />
          <MetricTile label="Resolved" value={stats.resolved} bg="#052915" />
          <MetricTile label="Accident Reports" value={stats.accidents} bg="#220c10" />
          <MetricTile label="Emergency Linked" value={stats.emergency} bg="#08263b" />
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#0f172a",
          borderRadius: 18,
          borderWidth: 1,
          borderColor: "#334155",
          padding: 16,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
          Recent public incidents
        </Text>
        <Text style={{ color: "#94a3b8", marginTop: 8, lineHeight: 22 }}>
          Public summary view. Sensitive personal information should not be shown here.
        </Text>

        <View style={{ gap: 12, marginTop: 16 }}>
          {loading ? (
            <View
              style={{
                backgroundColor: "#020617",
                borderWidth: 1,
                borderColor: "#334155",
                borderRadius: 14,
                padding: 18,
              }}
            >
              <Text style={{ color: "#94a3b8" }}>Loading public incidents...</Text>
            </View>
          ) : recentIncidents.length > 0 ? (
            recentIncidents.map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: "#020617",
                  borderWidth: 1,
                  borderColor: "#334155",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                  {item?.title || item?.type || item?.category || "Incident"}
                </Text>

                <Text style={{ color: "#94a3b8", marginTop: 4 }}>
                  {item?.locationText || item?.location || item?.city || "Unknown location"}
                </Text>

                <Text style={{ color: "#64748b", marginTop: 4 }}>
                  {new Date(item?.createdAt || item?.reportedAt || Date.now()).toLocaleString()}
                </Text>

                {!!item?.description && (
                  <Text style={{ color: "#cbd5e1", marginTop: 8, lineHeight: 21 }}>
                    {item.description}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#111827",
                      borderWidth: 1,
                      borderColor: severityTone(item?.severity || "LOW"),
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ color: severityTone(item?.severity || "LOW"), fontSize: 12, fontWeight: "700" }}>
                      {(item?.severity || "LOW").toUpperCase()} Severity
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: "#111827",
                      borderWidth: 1,
                      borderColor: statusTone(item?.status || "PENDING"),
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 999,
                    }}
                  >
                    <Text style={{ color: statusTone(item?.status || "PENDING"), fontSize: 12, fontWeight: "700" }}>
                      {item?.status || "PENDING"}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                backgroundColor: "#020617",
                borderWidth: 1,
                borderColor: "#334155",
                borderRadius: 14,
                padding: 18,
              }}
            >
              <Text style={{ color: "#94a3b8" }}>No public incidents available yet.</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}