import { useEffect } from "react";
import { Alert, Text, View } from "react-native";
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
      <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>
        Driver Dashboard
      </Text>
      <Text style={{ color: "#94a3b8" }}>
        Welcome {me?.user?.name || "Driver"}
      </Text>

      <View style={{ gap: 12 }}>
        <StatCard title="Vehicles" value={vehicles.length} />
        <StatCard title="Penalties" value={penalties.length} />
        <StatCard title="Incidents" value={incidents.length} />
        <StatCard title="Current Points" value={me?.currentPoints ?? 0} />
      </View>

      {loading ? <Text style={{ color: "#94a3b8" }}>Loading...</Text> : null}
    </Screen>
  );
}