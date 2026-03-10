import { useState } from "react";
import { Alert, Text, View, Image, StyleSheet } from "react-native";
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
    console.log("LOGIN CLICKED");

    try {
      const res = await login({ email, password });
      console.log("LOGIN SUCCESS", res);
    } catch (e) {
      console.log("LOGIN ERROR", e);
      Alert.alert(
        "Login Failed",
        e?.response?.data?.message || "Invalid credentials"
      );
    }
  }

  return (
    <Screen scroll={false}>
      <View style={styles.container}>

        {/* Logo */}
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>SLREPMS</Text>
        <Text style={styles.subtitle}>Road Penalty Management System</Text>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />

          <AppButton
            title="Login"
            onPress={handleLogin}
            loading={loading}
          />

          <AppButton
            title="Create Account"
            onPress={() => navigation.navigate("Register")}
            variant="secondary"
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
    justifyContent: "center",
  },

  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
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