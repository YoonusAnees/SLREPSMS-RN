import { useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { useDriverStore } from "../../store/driver.store";
import { useAuthStore } from "../../store/auth.store";

export default function DriverProfileScreen() {
  const { me, loadDashboardData, updateProfile } = useDriverStore();
  const logout = useAuthStore((s) => s.logout);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    nic: "",
  });

  useEffect(() => {
    loadDashboardData().catch(() => {});
  }, []);

  useEffect(() => {
    setForm({
      name: me?.user?.name || "",
      phone: me?.user?.phone || "",
      nic: me?.user?.nic || "",
    });
  }, [me]);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  async function handleSave() {
    try {
      await updateProfile(form);
      Alert.alert("Success", "Profile updated");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Update failed");
    }
  }

  return (
    <Screen>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>
        Profile
      </Text>

      <Input label="Name" value={form.name} onChangeText={(v) => update("name", v)} />
      <Input label="Phone" value={form.phone} onChangeText={(v) => update("phone", v)} />
      <Input label="NIC" value={form.nic} onChangeText={(v) => update("nic", v)} />

      <AppButton title="Save Changes" onPress={handleSave} />
      <AppButton title="Logout" onPress={logout} variant="secondary" />
    </Screen>
  );
}