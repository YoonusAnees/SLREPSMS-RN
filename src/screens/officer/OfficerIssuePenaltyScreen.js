import { useState } from "react";
import { Alert, Text } from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { useOfficerStore } from "../../store/officer.store";

export default function OfficerIssuePenaltyScreen() {
  const issuePenalty = useOfficerStore((s) => s.issuePenalty);

  const [form, setForm] = useState({
    licenseNo: "",
    plateNo: "",
    violationCode: "",
    locationText: "",
    occurredAt: new Date().toISOString(),
    notes: "",
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  async function handleIssue() {
    try {
      await issuePenalty(form);
      Alert.alert("Success", "Penalty issued");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to issue penalty");
    }
  }

  return (
    <Screen>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
        Issue Penalty
      </Text>

      <Input label="License No" value={form.licenseNo} onChangeText={(v) => update("licenseNo", v)} />
      <Input label="Plate No" value={form.plateNo} onChangeText={(v) => update("plateNo", v)} />
      <Input
        label="Violation Code"
        value={form.violationCode}
        onChangeText={(v) => update("violationCode", v)}
      />
      <Input
        label="Location"
        value={form.locationText}
        onChangeText={(v) => update("locationText", v)}
      />
      <Input label="Notes" value={form.notes} onChangeText={(v) => update("notes", v)} multiline />

      <AppButton title="Issue Penalty" onPress={handleIssue} />
    </Screen>
  );
}