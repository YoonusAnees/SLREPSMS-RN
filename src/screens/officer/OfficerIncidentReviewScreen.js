import { useEffect, useState } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
import { useOfficerStore } from "../../store/officer.store";

function Badge({ children, tone = "gray" }) {
  const tones = {
    gray: {
      bg: "#334155",
      border: "#475569",
      text: "#cbd5e1",
    },
    green: {
      bg: "rgba(20,83,45,0.6)",
      border: "rgba(34,197,94,0.45)",
      text: "#86efac",
    },
    red: {
      bg: "rgba(127,29,29,0.6)",
      border: "rgba(248,113,113,0.45)",
      text: "#fca5a5",
    },
    yellow: {
      bg: "rgba(120,53,15,0.6)",
      border: "rgba(251,191,36,0.45)",
      text: "#fcd34d",
    },
    blue: {
      bg: "rgba(49,46,129,0.6)",
      border: "rgba(129,140,248,0.45)",
      text: "#a5b4fc",
    },
  };

  const style = tones[tone] || tones.gray;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: style.bg,
          borderColor: style.border,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: style.text }]}>{children}</Text>
    </View>
  );
}

export default function OfficerIncidentReviewScreen() {
  const incidents = useOfficerStore((s) => s.incidents);
  const loadDashboard = useOfficerStore((s) => s.loadDashboard);
  const reviewIncident = useOfficerStore((s) => s.reviewIncident);
  const resolveIncident = useOfficerStore((s) => s.resolveIncident);

  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [actingType, setActingType] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);
      await loadDashboard();
    } catch (e) {
      Alert.alert(
        "Error",
        e?.response?.data?.message || "Failed to load incidents"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(id) {
    try {
      setActingId(id);
      setActingType("review");
      await reviewIncident(id);
      await loadDashboard();
      Alert.alert("Success", "Incident marked reviewed");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Review failed");
    } finally {
      setActingId(null);
      setActingType("");
    }
  }

  async function handleResolve(id) {
    try {
      setActingId(id);
      setActingType("resolve");
      await resolveIncident(id);
      await loadDashboard();
      Alert.alert("Success", "Incident resolved");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Resolve failed");
    } finally {
      setActingId(null);
      setActingType("");
    }
  }

  function getStatusTone(status) {
    const s = String(status || "").toUpperCase();

    if (["RESOLVED", "CLOSED", "COMPLETED"].includes(s)) return "green";
    if (["REVIEWED", "IN_PROGRESS"].includes(s)) return "blue";
    if (["PENDING", "OPEN", "NEW", "SUBMITTED"].includes(s)) return "yellow";
    return "gray";
  }

  function getSeverityTone(severity) {
    const s = String(severity || "").toUpperCase();

    if (["HIGH", "CRITICAL", "SEVERE"].includes(s)) return "red";
    if (["MEDIUM", "MODERATE"].includes(s)) return "yellow";
    if (["LOW", "MINOR"].includes(s)) return "green";
    return "gray";
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>Incident Review</Text>
          <Text style={styles.subtitle}>
            Review reported incidents, inspect details, and update status.
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#cbd5e1" />
            <Text style={styles.loadingText}>Loading incidents...</Text>
          </View>
        ) : incidents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No incidents found</Text>
            <Text style={styles.emptyText}>
              There are currently no incidents available for review.
            </Text>
          </View>
        ) : (
          incidents.map((i) => {
            const busy = actingId === i.id;

            return (
              <View key={i.id} style={styles.incidentCard}>
                <View style={styles.cardTopRow}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.incidentTitle}>
                      {i.type || "Unknown Incident"}
                    </Text>
                    <Text style={styles.incidentMeta}>
                      {i.locationText || "No location provided"}
                    </Text>
                  </View>

                  <View style={styles.badgesColumn}>
                    <Badge tone={getSeverityTone(i.severity)}>
                      {i.severity || "UNKNOWN"}
                    </Badge>
                    <Badge tone={getStatusTone(i.status)}>
                      {i.status || "UNKNOWN"}
                    </Badge>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoGrid}>
                  <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>Plate Number</Text>
                    <Text style={styles.infoValue}>{i.plateNo || "-"}</Text>
                  </View>

                  <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>Violation Code</Text>
                    <Text style={styles.infoValue}>
                      {i.suspectedViolationCode || "-"}
                    </Text>
                  </View>

                  <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>Severity</Text>
                    <Text style={styles.infoValue}>{i.severity || "-"}</Text>
                  </View>

                  <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Text style={styles.infoValue}>{i.status || "-"}</Text>
                  </View>
                </View>

                <View style={styles.actionsWrap}>
                  {busy && actingType === "review" ? (
                    <Pressable style={styles.loadingButton}>
                      <ActivityIndicator color="#cbd5e1" />
                      <Text style={styles.loadingButtonText}>
                        Marking reviewed...
                      </Text>
                    </Pressable>
                  ) : (
                    <AppButton
                      title="Mark Reviewed"
                      onPress={() => handleReview(i.id)}
                    />
                  )}

                  {busy && actingType === "resolve" ? (
                    <Pressable style={styles.secondaryLoadingButton}>
                      <ActivityIndicator color="#ffffff" />
                      <Text style={styles.secondaryLoadingButtonText}>
                        Resolving...
                      </Text>
                    </Pressable>
                  ) : (
                    <AppButton
                      title="Resolve Incident"
                      onPress={() => handleResolve(i.id)}
                      variant="secondary"
                    />
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },

  headerCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 20,
  },

  loadingCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },

  emptyCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },

  incidentCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  incidentTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },

  incidentMeta: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },

  badgesColumn: {
    alignItems: "flex-end",
  },

  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#1f2937",
    marginVertical: 16,
  },

  infoGrid: {
    gap: 12,
  },

  infoBlock: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 14,
    padding: 12,
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },

  infoValue: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  actionsWrap: {
    gap: 10,
    marginTop: 16,
  },

  loadingButton: {
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  loadingButtonText: {
    color: "#cbd5e1",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 10,
  },

  secondaryLoadingButton: {
    backgroundColor: "#1d4ed8",
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  secondaryLoadingButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 10,
  },
});