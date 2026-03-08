import { useState } from "react";
import { Alert, Text, View } from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { useAuthStore } from "../../store/auth.store";

export default function RegisterScreen({ navigation }) {
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    nic: "",
    role: "DRIVER",
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  async function handleRegister() {
    try {
      await register(form);
      Alert.alert("Success", "Account created successfully");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Registration Failed", e?.response?.data?.message || "Try again");
    }
  }

  return (
    <Screen>
      <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
        Register
      </Text>

      <Input label="Name" value={form.name} onChangeText={(v) => update("name", v)} />
      <Input label="Email" value={form.email} onChangeText={(v) => update("email", v)} />
      <Input
        label="Password"
        value={form.password}
        onChangeText={(v) => update("password", v)}
        secureTextEntry
      />
      <Input label="Phone" value={form.phone} onChangeText={(v) => update("phone", v)} />
      <Input label="NIC" value={form.nic} onChangeText={(v) => update("nic", v)} />
      <Input
        label="Role"
        value={form.role}
        onChangeText={(v) => update("role", v)}
        placeholder="DRIVER or OFFICER"
      />

      <AppButton title="Register" onPress={handleRegister} loading={loading} />
    </Screen>
  );
}