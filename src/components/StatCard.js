import { View, Text, StyleSheet } from "react-native";

export default function StatCard({ title, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    minHeight: 110,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  title: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "600",
  },

  value: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
});