import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { useDriverStore } from "../../store/driver.store";
import { useAuthStore } from "../../store/auth.store";

function getInitials(name) {
  if (!name) return "U";

  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

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

  const initials = useMemo(() => getInitials(form.name || me?.user?.name), [form.name, me]);

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <Text style={styles.title}>Profile</Text>
          <Text style={styles.name}>{me?.user?.name || "Driver User"}</Text>
          <Text style={styles.email}>{me?.user?.email || "No email available"}</Text>

          <View style={styles.metaRowWrap}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>
                Role: {me?.user?.role || "DRIVER"}
              </Text>
            </View>

            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>
                Points: {me?.currentPoints ?? 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Edit Information</Text>

          <Input
            label="Name"
            value={form.name}
            onChangeText={(v) => update("name", v)}
            placeholder="Enter your full name"
          />

          <Input
            label="Phone"
            value={form.phone}
            onChangeText={(v) => update("phone", v)}
            placeholder="Enter phone number"
          />

          <Input
            label="NIC"
            value={form.nic}
            onChangeText={(v) => update("nic", v)}
            placeholder="Enter NIC"
          />

          <View style={styles.buttonGroup}>
            <AppButton title="Save Changes" onPress={handleSave} />
            <AppButton title="Logout" onPress={logout} variant="secondary" />
          </View>
        </View>

        {/* Extra Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Account Summary</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{me?.user?.name || "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{me?.user?.email || "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{me?.user?.phone || "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NIC</Text>
            <Text style={styles.infoValue}>{me?.user?.nic || "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Points</Text>
            <Text style={styles.infoValue}>{me?.currentPoints ?? 0}</Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 16,
  },

  headerCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 3,
    borderColor: "#818cf8",
  },

  avatarText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 1,
  },

  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },

  name: {
    color: "#e2e8f0",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },

  email: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },

  metaRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
  },

  metaBadge: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  metaBadgeText: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "700",
  },

  formCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },

  infoCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 16,
    gap: 12,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },

  buttonGroup: {
    gap: 12,
    marginTop: 6,
  },

  infoRow: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#243041",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 4,
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  infoValue: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});