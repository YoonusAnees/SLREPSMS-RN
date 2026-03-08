import { useEffect } from "react";
import { Alert, Text, View } from "react-native";
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
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
        My Penalties
      </Text>

      {penalties.map((p) => (
        <View
          key={p.id}
          style={{
            backgroundColor: "#0f172a",
            borderColor: "#334155",
            borderWidth: 1,
            padding: 14,
            borderRadius: 12,
            gap: 6,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {p?.violationType?.title || "Violation"}
          </Text>
          <Text style={{ color: "#94a3b8" }}>Fine: Rs. {p.fineLkr}</Text>
          <Text style={{ color: p.status === "PAID" ? "#4ade80" : "#f87171" }}>
            {p.status}
          </Text>
        </View>
      ))}
    </Screen>
  );
}