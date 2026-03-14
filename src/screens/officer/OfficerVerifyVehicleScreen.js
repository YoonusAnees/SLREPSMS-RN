import { useState } from "react";
import {
  Alert,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { useOfficerStore } from "../../store/officer.store";

function StatusBadge({ verified }) {
  return (
    <View
      style={[
        styles.badge,
        verified ? styles.badgeSuccess : styles.badgeWarning,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          verified ? styles.badgeTextSuccess : styles.badgeTextWarning,
        ]}
      >
        {verified ? "Verified" : "Pending Verification"}
      </Text>
    </View>
  );
}

export default function OfficerVerifyVehicleScreen() {
  const verifyVehicle = useOfficerStore((s) => s.verifyVehicle);
  const lookupVehicleByPlate = useOfficerStore((s) => s.lookupVehicleByPlate);

  const [plateNo, setPlateNo] = useState("");
  const [vehicle, setVehicle] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  async function handleLookup() {
    const cleanedPlate = plateNo.trim().toUpperCase();

    if (!cleanedPlate) {
      Alert.alert("Required", "Please enter a plate number");
      return;
    }

    try {
      setLookupLoading(true);
      const data = await lookupVehicleByPlate(cleanedPlate);
      setVehicle(data);
    } catch (e) {
      setVehicle(null);
      Alert.alert(
        "Error",
        e?.response?.data?.message || "Vehicle lookup failed"
      );
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleVerify() {
    const cleanedPlate = plateNo.trim().toUpperCase();

    if (!cleanedPlate) {
      Alert.alert("Required", "Please enter a plate number");
      return;
    }

    try {
      setVerifyLoading(true);
      await verifyVehicle(cleanedPlate);
      Alert.alert("Success", "Vehicle verified");
      const refreshed = await lookupVehicleByPlate(cleanedPlate);
      setVehicle(refreshed);
    } catch (e) {
      Alert.alert(
        "Error",
        e?.response?.data?.message || "Verification failed"
      );
    } finally {
      setVerifyLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>Verify Vehicle</Text>
          <Text style={styles.subtitle}>
            Search vehicle registration details and confirm ownership
            verification.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Vehicle Lookup</Text>

          <Input
            label="Plate No"
            value={plateNo}
            onChangeText={(v) => setPlateNo(v.toUpperCase())}
            placeholder="Enter vehicle plate number"
            autoCapitalize="characters"
          />

          <View style={styles.buttonGroup}>
            {lookupLoading ? (
              <Pressable style={styles.loadingButton}>
                <ActivityIndicator color="#cbd5e1" />
                <Text style={styles.loadingButtonText}>Looking up...</Text>
              </Pressable>
            ) : (
              <AppButton title="Lookup Vehicle" onPress={handleLookup} />
            )}

            {verifyLoading ? (
              <Pressable style={styles.secondaryLoadingButton}>
                <ActivityIndicator color="#ffffff" />
                <Text style={styles.secondaryLoadingButtonText}>
                  Verifying...
                </Text>
              </Pressable>
            ) : (
              <AppButton
                title="Verify Vehicle"
                onPress={handleVerify}
                variant="secondary"
              />
            )}
          </View>
        </View>

        {vehicle ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={styles.plateText}>{vehicle.plateNo}</Text>
                <Text style={styles.vehicleTypeText}>
                  {vehicle.type || "-"} • {vehicle.model || "-"}
                </Text>
              </View>

              <StatusBadge verified={vehicle.ownershipVerified} />
            </View>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Owner</Text>
                <Text style={styles.infoValue}>
                  {vehicle?.driver?.user?.name || "-"}
                </Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>License No</Text>
                <Text style={styles.infoValue}>
                  {vehicle?.driver?.licenseNo || "-"}
                </Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Vehicle Type</Text>
                <Text style={styles.infoValue}>{vehicle?.type || "-"}</Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Model</Text>
                <Text style={styles.infoValue}>{vehicle?.model || "-"}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No vehicle selected</Text>
            <Text style={styles.emptyText}>
              Enter a plate number above and tap lookup to view vehicle details.
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
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
    marginBottom: 2,
  },

  buttonGroup: {
    gap: 10,
    marginTop: 4,
  },

  loadingButton: {
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  loadingButtonText: {
    color: "#cbd5e1",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 10,
  },

  secondaryLoadingButton: {
    backgroundColor: "#1d4ed8",
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  secondaryLoadingButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 10,
  },

  resultCard: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 16,
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  plateText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
  },

  vehicleTypeText: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#1f2937",
    marginVertical: 16,
  },

  infoGrid: {
    gap: 12,
  },

  infoBlock: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 14,
    padding: 12,
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 6,
  },

  infoValue: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  badgeSuccess: {
    backgroundColor: "rgba(20,83,45,0.6)",
    borderColor: "rgba(34,197,94,0.45)",
  },

  badgeWarning: {
    backgroundColor: "rgba(120,53,15,0.6)",
    borderColor: "rgba(251,191,36,0.45)",
  },

  badgeTextSuccess: {
    color: "#86efac",
  },

  badgeTextWarning: {
    color: "#fcd34d",
  },

  emptyCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 18,
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
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});