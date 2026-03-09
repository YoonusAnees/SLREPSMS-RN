import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { useDriverStore } from "../../store/driver.store";

export default function DriverVehiclesScreen() {
  const { vehicles, loadDashboardData, addVehicle } = useDriverStore();

  const [form, setForm] = useState({
    plateNo: "",
    type: "",
    model: "",
    color: "",
    year: "",
    insuranceExpiry: "",
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    loadDashboardData().catch(() => {});
  }, []);

  async function handleAdd() {
    try {
      await addVehicle({
        ...form,
        year: form.year ? Number(form.year) : undefined,
      });
      Alert.alert("Success", "Vehicle added");
      await loadDashboardData();
      setForm({
        plateNo: "",
        type: "",
        model: "",
        color: "",
        year: "",
        insuranceExpiry: "",
      });
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to add vehicle");
    }
  }

  return (
    <Screen>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
        My Vehicles
      </Text>

      <Input label="Plate No" value={form.plateNo} onChangeText={(v) => update("plateNo", v)} />
      <Input label="Type" value={form.type} onChangeText={(v) => update("type", v)} />
      <Input label="Model" value={form.model} onChangeText={(v) => update("model", v)} />
      <Input label="Color" value={form.color} onChangeText={(v) => update("color", v)} />
      <Input label="Year" value={form.year} onChangeText={(v) => update("year", v)} />
      <Input
        label="Insurance Expiry"
        value={form.insuranceExpiry}
        onChangeText={(v) => update("insuranceExpiry", v)}
        placeholder="YYYY-MM-DD"
      />
      <AppButton title="Add Vehicle" onPress={handleAdd} />

      <View style={{ gap: 12 }}>
        {vehicles.map((v) => (
          <View
            key={v.id}
            style={{
              backgroundColor: "#0f172a",
              borderColor: "#334155",
              borderWidth: 1,
              padding: 14,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>{v.plateNo}</Text>
            <Text style={{ color: "#94a3b8" }}>
              {v.type} • {v.model || "-"} • {v.color || "-"}
            </Text>
            <Text style={{ color: v.ownershipVerified ? "#4ade80" : "#fbbf24" }}>
              {v.ownershipVerified ? "Verified" : "Pending Verification"}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}