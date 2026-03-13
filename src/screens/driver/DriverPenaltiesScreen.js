import { useEffect } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import Screen from "../../components/Screen";
import { useDriverStore } from "../../store/driver.store";

export default function DriverPenaltiesScreen() {
  const { penalties, loadDashboardData } = useDriverStore();

  useEffect(() => {
    loadDashboardData().catch((e) =>
      Alert.alert("Error", e?.response?.data?.message || "Failed to load")
    );
  }, []);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>My Penalties</Text>
          <Text style={styles.subtitle}>
            View your traffic violations, fines, and payment status
          </Text>
        </View>

        {/* List */}
        <View style={styles.listSection}>
          {penalties.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No penalties found</Text>
              <Text style={styles.emptyText}>
                Your issued penalties will appear here.
              </Text>
            </View>
          ) : (
            penalties.map((p) => {
              const isPaid = p.status === "PAID";

              return (
                <View key={p.id} style={styles.penaltyCard}>
                  <View style={styles.topRow}>
                    <Text style={styles.violationTitle}>
                      {p?.violationType?.title || "Violation"}
                    </Text>

                    <View
                      style={[
                        styles.badge,
                        isPaid ? styles.paidBadge : styles.unpaidBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          isPaid ? styles.paidText : styles.unpaidText,
                        ]}
                      >
                        {p.status || "PENDING"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.amountLabel}>Fine Amount</Text>
                  <Text style={styles.amountValue}>Rs. {p.fineLkr}</Text>

                  <View style={styles.metaBox}>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Points:</Text>
                      <Text style={styles.metaValue}>
                        {p?.points ?? p?.violationType?.points ?? "-"}
                      </Text>
                    </View>

                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Penalty ID:</Text>
                      <Text style={styles.metaValue}>{p.id}</Text>
                    </View>

                    <View style={styles.metaRow}>
                      <Text style={styles.metaLabel}>Violation Type:</Text>
                      <Text style={styles.metaValue}>
                        {p?.violationType?.title || "-"}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 16,
  },

  headerCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
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

  listSection: {
    gap: 12,
  },

  penaltyCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 14,
  },

  violationTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    flex: 1,
    lineHeight: 24,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  paidBadge: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.35)",
  },

  unpaidBadge: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.35)",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  paidText: {
    color: "#4ade80",
  },

  unpaidText: {
    color: "#f87171",
  },

  amountLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  amountValue: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 14,
  },

  metaBox: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#243041",
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },

  metaRow: {
    flexDirection: "row",
    gap: 8,
  },

  metaLabel: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "600",
    minWidth: 95,
  },

  metaValue: {
    color: "#94a3b8",
    fontSize: 13,
    flex: 1,
  },

  emptyCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 16,
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
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});