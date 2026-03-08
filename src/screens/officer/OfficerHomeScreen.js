import { useEffect } from "react";
import { Alert, Text, View } from "react-native";
import Screen from "../../components/Screen";
import StatCard from "../../components/StatCard";
import { useOfficerStore } from "../../store/officer.store";
import { useAuthStore } from "../../store/auth.store";
import AppButton from "../../components/AppButton";

export default function OfficerHomeScreen() {
  const { dashboard, loadDashboard } = useOfficerStore();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    loadDashboard().catch((e) =>
      Alert.alert("Error", e?.response?.data?.message || "Failed to load")
    );
  }, []);

  const stats = dashboard?.stats || {};

  return (
    <Screen>
      <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>
        Officer Dashboard
      </Text>

      <View style={{ gap: 12 }}>
        <StatCard title="Issued Penalties" value={stats.issuedPenalties || 0} />
        <StatCard title="Verified Vehicles" value={stats.verifiedVehicles || 0} />
        <StatCard title="Reviewed Incidents" value={stats.reviewedIncidents || 0} />
        <StatCard title="Resolved Incidents" value={stats.resolvedIncidents || 0} />
      </View>

      <AppButton title="Logout" onPress={logout} variant="secondary" />
    </Screen>
  );
}