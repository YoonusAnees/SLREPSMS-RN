import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { useDriverStore } from "../../store/driver.store";

export default function DriverIncidentsScreen() {
  const { incidents, loadDashboardData, createIncident } = useDriverStore();

  const [form, setForm] = useState({
    type: "ACCIDENT",
    severity: "LOW",
    lat: "6.9271",
    lng: "79.8612",
    locationText: "",
    description: "",
    plateNo: "",
    suspectedViolationCode: "",
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    loadDashboardData().catch(() => {});
  }, []);

  async function handleCreate() {
    try {
      await createIncident({
        ...form,
        lat: Number(form.lat),
        lng: Number(form.lng),
      });
      Alert.alert("Success", "Incident created");
      await loadDashboardData();
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to create incident");
    }
  }

  return (
    <Screen>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
        My Incidents
      </Text>

      <Input label="Type" value={form.type} onChangeText={(v) => update("type", v)} />
      <Input label="Severity" value={form.severity} onChangeText={(v) => update("severity", v)} />
      <Input label="Latitude" value={form.lat} onChangeText={(v) => update("lat", v)} />
      <Input label="Longitude" value={form.lng} onChangeText={(v) => update("lng", v)} />
      <Input
        label="Location"
        value={form.locationText}
        onChangeText={(v) => update("locationText", v)}
      />
      <Input
        label="Description"
        value={form.description}
        onChangeText={(v) => update("description", v)}
        multiline
      />
      <Input label="Plate No" value={form.plateNo} onChangeText={(v) => update("plateNo", v)} />
      <Input
        label="Suspected Violation Code"
        value={form.suspectedViolationCode}
        onChangeText={(v) => update("suspectedViolationCode", v)}
      />
      <AppButton title="Create Incident" onPress={handleCreate} />

      <View style={{ gap: 12 }}>
        {incidents.map((i) => (
          <View
            key={i.id}
            style={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderWidth: 1,
              padding: 14,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>{i.type}</Text>
            <Text style={{ color: "#94a3b8" }}>{i.locationText || "-"}</Text>
            <Text style={{ color: "#fbbf24" }}>{i.status}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}