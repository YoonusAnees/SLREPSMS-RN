import { useState } from "react";
import { Alert, Text, View } from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { useAuthStore } from "../../store/auth.store";

export default function LoginScreen({ navigation }) {
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      await login({ email, password });
    } catch (e) {
      Alert.alert("Login Failed", e?.response?.data?.message || "Invalid credentials");
    }
  }

  return (
    <Screen scroll={false}>
      <View style={{ flex: 1, justifyContent: "center", gap: 18 }}>
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>
          SLREPMS Login
        </Text>

        <Input label="Email" value={email} onChangeText={setEmail} placeholder="Enter email" />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
        />

        <AppButton title="Login" onPress={handleLogin} loading={loading} />
        <AppButton
          title="Create Account"
          onPress={() => navigation.navigate("Register")}
          variant="secondary"
        />
      </View>
    </Screen>
  );
}