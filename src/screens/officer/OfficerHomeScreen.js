import { useEffect } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import Screen from "../../components/Screen";
import StatCard from "../../components/StatCard";
import { useOfficerStore } from "../../store/officer.store";
import { useAuthStore } from "../../store/auth.store";
import AppButton from "../../components/AppButton";

export default function OfficerHomeScreen() {
  const { dashboard, loadDashboard } = useOfficerStore();
  const logout = useAuthStore((s) => s.logoutLocal);

  useEffect(() => {
    loadDashboard().catch((e) =>
      Alert.alert("Error", e?.response?.data?.message || "Failed to load")
    );
  }, []);

  const stats = dashboard?.stats || {};

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>Officer Dashboard</Text>
          <Text style={styles.subtitle}>
            Manage penalties, vehicles, and incident reports
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsWrap}>
          <View style={styles.row}>
            <View style={styles.cardBox}>
              <StatCard
                title="Issued Penalties"
                value={stats.issuedPenalties || 0}
              />
            </View>

            <View style={styles.cardBox}>
              <StatCard
                title="Verified Vehicles"
                value={stats.verifiedVehicles || 0}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.cardBox}>
              <StatCard
                title="Reviewed Incidents"
                value={stats.reviewedIncidents || 0}
              />
            </View>

            <View style={styles.cardBox}>
              <StatCard
                title="Resolved Incidents"
                value={stats.resolvedIncidents || 0}
              />
            </View>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Account</Text>

          <AppButton
            title="Logout"
            onPress={logout}
            variant="secondary"
          />
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

  statsWrap: {
    gap: 14,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  cardBox: {
    flex: 1,
  },

  actionCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },

  actionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});