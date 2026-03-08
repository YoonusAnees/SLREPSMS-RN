import { useState } from "react";
import { Alert, Text, View } from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { useOfficerStore } from "../../store/officer.store";

export default function OfficerVerifyVehicleScreen() {
  const verifyVehicle = useOfficerStore((s) => s.verifyVehicle);
  const lookupVehicleByPlate = useOfficerStore((s) => s.lookupVehicleByPlate);

  const [plateNo, setPlateNo] = useState("");
  const [vehicle, setVehicle] = useState(null);

  async function handleLookup() {
    try {
      const data = await lookupVehicleByPlate(plateNo);
      setVehicle(data);
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Vehicle lookup failed");
    }
  }

  async function handleVerify() {
    try {
      await verifyVehicle(plateNo);
      Alert.alert("Success", "Vehicle verified");
      await handleLookup();
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Verification failed");
    }
  }

  return (
    <Screen>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
        Verify Vehicle
      </Text>

      <Input label="Plate No" value={plateNo} onChangeText={setPlateNo} />
      <AppButton title="Lookup Vehicle" onPress={handleLookup} />
      <AppButton title="Verify Vehicle" onPress={handleVerify} variant="secondary" />

      {vehicle ? (
        <View
          style={{
            backgroundColor: "#0f172a",
            borderColor: "#334155",
            borderWidth: 1,
            padding: 14,
            borderRadius: 12,
            gap: 6,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>{vehicle.plateNo}</Text>
          <Text style={{ color: "#94a3b8" }}>
            {vehicle.type} • {vehicle.model || "-"}
          </Text>
          <Text style={{ color: "#fff" }}>
            Owner: {vehicle?.driver?.user?.name || "-"}
          </Text>
          <Text style={{ color: vehicle.ownershipVerified ? "#4ade80" : "#fbbf24" }}>
            {vehicle.ownershipVerified ? "Verified" : "Pending"}
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}