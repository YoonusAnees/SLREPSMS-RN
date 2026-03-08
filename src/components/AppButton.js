import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

export default function AppButton({ title, onPress, loading, variant = "primary" }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={[styles.btn, variant === "secondary" && styles.secondary]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#4f46e5",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondary: {
    backgroundColor: "#1e293b",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
  },
});