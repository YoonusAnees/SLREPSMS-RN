import { useState } from "react";
import { Alert, Text, View, Image, StyleSheet } from "react-native";
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
      Alert.alert(
        "Registration Failed",
        e?.response?.data?.message || "Try again"
      );
    }
  }

  return (
    <Screen>
      <View style={styles.container}>

        {/* Logo */}
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join SLREPMS System</Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Name"
            value={form.name}
            onChangeText={(v) => update("name", v)}
          />

          <Input
            label="Email"
            value={form.email}
            onChangeText={(v) => update("email", v)}
          />

          <Input
            label="Password"
            value={form.password}
            onChangeText={(v) => update("password", v)}
            secureTextEntry
          />

          <Input
            label="Phone"
            value={form.phone}
            onChangeText={(v) => update("phone", v)}
          />

          <Input
            label="NIC"
            value={form.nic}
            onChangeText={(v) => update("nic", v)}
          />

          <Input
            label="Role"
            value={form.role}
            onChangeText={(v) => update("role", v)}
            placeholder="DRIVER or OFFICER"
          />

          <AppButton
            title="Register"
            onPress={handleRegister}
            loading={loading}
          />

          <AppButton
            title="Back to Login"
            variant="secondary"
            onPress={() => navigation.goBack()}
          />
        </View>

      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  logo: {
    width: 110,
    height: 110,
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 30,
  },

  form: {
    gap: 16,
  },

});