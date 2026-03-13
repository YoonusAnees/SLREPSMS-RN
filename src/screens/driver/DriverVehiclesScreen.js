import { useEffect, useState } from "react";
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

export default function DriverVehiclesScreen() {
  const { vehicles, loadDashboardData, addVehicle } = useDriverStore();

  const [form, setForm] = useState({
    plateNo: "",
    type: "",
    model: "",
    color: "",
    year: "",
    insuranceExpiry: "",
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    loadDashboardData().catch(() => {});
  }, []);

  async function handleAdd() {
    try {
      await addVehicle({
        ...form,
        year: form.year ? Number(form.year) : undefined,
      });

      Alert.alert("Success", "Vehicle added");
      await loadDashboardData();

      setForm({
        plateNo: "",
        type: "",
        model: "",
        color: "",
        year: "",
        insuranceExpiry: "",
      });
    } catch (e) {
      Alert.alert(
        "Error",
        e?.response?.data?.message || "Failed to add vehicle"
      );
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
          <Text style={styles.title}>My Vehicles</Text>
          <Text style={styles.subtitle}>
            Add and manage your registered vehicles
          </Text>
        </View>

        {/* Add Vehicle Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Add New Vehicle</Text>

          <Input
            label="Plate No"
            value={form.plateNo}
            onChangeText={(v) => update("plateNo", v)}
            placeholder="Enter plate number"
          />

          <Input
            label="Type"
            value={form.type}
            onChangeText={(v) => update("type", v)}
            placeholder="Car, Bike, Van..."
          />

          <Input
            label="Model"
            value={form.model}
            onChangeText={(v) => update("model", v)}
            placeholder="Enter model"
          />

          <Input
            label="Color"
            value={form.color}
            onChangeText={(v) => update("color", v)}
            placeholder="Enter color"
          />

          <Input
            label="Year"
            value={form.year}
            onChangeText={(v) => update("year", v)}
            placeholder="Enter year"
          />

          <Input
            label="Insurance Expiry"
            value={form.insuranceExpiry}
            onChangeText={(v) => update("insuranceExpiry", v)}
            placeholder="YYYY-MM-DD"
          />

          <View style={styles.buttonWrap}>
            <AppButton title="Add Vehicle" onPress={handleAdd} />
          </View>
        </View>

        {/* Vehicle List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Registered Vehicles</Text>

          {vehicles.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No vehicles added yet</Text>
              <Text style={styles.emptyText}>
                Add your first vehicle using the form above.
              </Text>
            </View>
          ) : (
            <View style={styles.listWrap}>
              {vehicles.map((v) => (
                <View key={v.id} style={styles.vehicleCard}>
                  <View style={styles.vehicleTopRow}>
                    <Text style={styles.plateText}>{v.plateNo}</Text>
                    <View
                      style={[
                        styles.badge,
                        v.ownershipVerified
                          ? styles.badgeVerified
                          : styles.badgePending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          v.ownershipVerified
                            ? styles.badgeTextVerified
                            : styles.badgeTextPending,
                        ]}
                      >
                        {v.ownershipVerified ? "Verified" : "Pending"}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.vehicleInfo}>
                    {v.type || "-"} • {v.model || "-"} • {v.color || "-"}
                  </Text>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Year:</Text>
                    <Text style={styles.metaValue}>{v.year || "-"}</Text>
                  </View>

                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Insurance Expiry:</Text>
                    <Text style={styles.metaValue}>
                      {v.insuranceExpiry || "-"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 20,
  },

  formCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  buttonWrap: {
    marginTop: 6,
  },

  listSection: {
    gap: 12,
  },

  listWrap: {
    gap: 12,
  },

  vehicleCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  vehicleTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  plateText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
  },

  vehicleInfo: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 12,
  },

  metaRow: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 6,
  },

  metaLabel: {
    color: "#cbd5e1",
    fontSize: 13,
    fontWeight: "600",
  },

  metaValue: {
    color: "#94a3b8",
    fontSize: 13,
    flex: 1,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  badgeVerified: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.35)",
  },

  badgePending: {
    backgroundColor: "rgba(245,158,11,0.12)",
    borderColor: "rgba(245,158,11,0.35)",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  badgeTextVerified: {
    color: "#4ade80",
  },

  badgeTextPending: {
    color: "#fbbf24",
  },

  emptyCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },

  emptyText: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});