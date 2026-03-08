import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

export default function Screen({ children, scroll = true }) {
  if (scroll) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return <SafeAreaView style={[styles.safe, styles.content]}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    padding: 16,
    gap: 16,
  },
});