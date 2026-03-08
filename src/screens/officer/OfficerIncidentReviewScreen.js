import { useEffect } from "react";
import { Alert, Text, View } from "react-native";
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
import { useOfficerStore } from "../../store/officer.store";

export default function OfficerIncidentReviewScreen() {
  const { incidents, loadDashboard, reviewIncident, resolveIncident } = useOfficerStore();

  useEffect(() => {
    loadDashboard().catch((e) =>
      Alert.alert("Error", e?.response?.data?.message || "Failed to load incidents")
    );
  }, []);

  async function handleReview(id) {
    try {
      await reviewIncident(id);
      await loadDashboard();
      Alert.alert("Success", "Incident marked reviewed");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Review failed");
    }
  }

  async function handleResolve(id) {
    try {
      await resolveIncident(id);
      await loadDashboard();
      Alert.alert("Success", "Incident resolved");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Resolve failed");
    }
  }

  return (
    <Screen>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
        Incident Review
      </Text>

      {incidents.map((i) => (
        <View
          key={i.id}
          style={{
            backgroundColor: "#0f172a",
            borderColor: "#334155",
            borderWidth: 1,
            padding: 14,
            borderRadius: 12,
            gap: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {i.type} • {i.severity}
          </Text>
          <Text style={{ color: "#94a3b8" }}>{i.locationText || "-"}</Text>
          <Text style={{ color: "#fbbf24" }}>{i.status}</Text>
          <Text style={{ color: "#fff" }}>Plate: {i.plateNo || "-"}</Text>
          <Text style={{ color: "#fff" }}>
            Violation: {i.suspectedViolationCode || "-"}
          </Text>

          <AppButton title="Mark Reviewed" onPress={() => handleReview(i.id)} />
          <AppButton
            title="Resolve Incident"
            onPress={() => handleResolve(i.id)}
            variant="secondary"
          />
        </View>
      ))}
    </Screen>
  );
}