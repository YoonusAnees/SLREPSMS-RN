import { useEffect } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Screen from "../../components/Screen";
import StatCard from "../../components/StatCard";
import { useDriverStore } from "../../store/driver.store";

export default function DriverHomeScreen() {
  const { me, vehicles, penalties, incidents, loadDashboardData, loading } =
    useDriverStore();

  useEffect(() => {
    loadDashboardData().catch((e) =>
      Alert.alert("Error", e?.response?.data?.message || "Failed to load")
    );
  }, []);

  return (
    <Screen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>Driver Dashboard</Text>
          <Text style={styles.subtitle}>
            Welcome back, {me?.user?.name || "Driver"}
          </Text>
          <Text style={styles.caption}>
            Here is your current road activity summary
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsWrapper}>
          <View style={styles.row}>
            <View style={styles.cardBox}>
              <StatCard title="Vehicles" value={vehicles.length} />
            </View>
            <View style={styles.cardBox}>
              <StatCard title="Penalties" value={penalties.length} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.cardBox}>
              <StatCard title="Incidents" value={incidents.length} />
            </View>
            <View style={styles.cardBox}>
              <StatCard title="Current Points" value={me?.currentPoints ?? 0} />
            </View>
          </View>
        </View>

        {/* Status */}
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#60a5fa" />
            <Text style={styles.loadingText}>Loading dashboard data...</Text>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 18,
  },

  headerCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  caption: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 20,
  },

  statsWrapper: {
    gap: 14,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  cardBox: {
    flex: 1,
  },

  loadingBox: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  loadingText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
});