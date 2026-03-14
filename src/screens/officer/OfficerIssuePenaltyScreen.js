import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Screen from "../../components/Screen";
import AppButton from "../../components/AppButton";
import { useOfficerStore } from "../../store/officer.store";

function Badge({ children, tone = "gray" }) {
  const toneStyles = {
    gray: {
      bg: "#334155",
      border: "#475569",
      text: "#cbd5e1",
    },
    green: {
      bg: "rgba(20,83,45,0.6)",
      border: "rgba(34,197,94,0.45)",
      text: "#86efac",
    },
    red: {
      bg: "rgba(127,29,29,0.6)",
      border: "rgba(248,113,113,0.45)",
      text: "#fca5a5",
    },
    yellow: {
      bg: "rgba(120,53,15,0.6)",
      border: "rgba(251,191,36,0.45)",
      text: "#fcd34d",
    },
    blue: {
      bg: "rgba(49,46,129,0.6)",
      border: "rgba(129,140,248,0.45)",
      text: "#a5b4fc",
    },
    orange: {
      bg: "rgba(124,45,18,0.6)",
      border: "rgba(251,146,60,0.45)",
      text: "#fdba74",
    },
  };

  const style = toneStyles[tone] || toneStyles.gray;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: style.bg,
          borderColor: style.border,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: style.text }]}>{children}</Text>
    </View>
  );
}

function useDebounce(value, delay = 600) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function OfficerIssuePenaltyScreen() {
  const loadViolationTypes = useOfficerStore((s) => s.loadViolationTypes);
  const violationTypes = useOfficerStore((s) => s.violationTypes);
  const issuePenalty = useOfficerStore((s) => s.issuePenalty);

  const lookupDriverByLicense = useOfficerStore((s) => s.lookupDriverByLicense);
  const lookedUp = useOfficerStore((s) => s.lookedUp);
  const lookupLoading = useOfficerStore((s) => s.lookupLoading);
  const lookupError = useOfficerStore((s) => s.lookupError);
  const clearLookup = useOfficerStore((s) => s.clearLookup);

  const [form, setForm] = useState({
    licenseNo: "",
    plateNo: "",
    violationCode: "",
    locationText: "",
    occurredAt: new Date().toISOString().slice(0, 16),
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    loadViolationTypes().catch(() => {});
  }, [loadViolationTypes]);

  const debouncedLicense = useDebounce(form.licenseNo.trim(), 600);

  useEffect(() => {
    if (debouncedLicense.length < 5) {
      clearLookup();
      return;
    }

    lookupDriverByLicense(debouncedLicense).catch(() => {});
  }, [debouncedLicense, lookupDriverByLicense, clearLookup]);

  useEffect(() => {
    if (!lookedUp?.vehicles?.length) return;
    if (form.plateNo.trim()) return;

    updateField("plateNo", lookedUp.vehicles[0]?.plateNo || "");
  }, [lookedUp]);

  async function handleSubmit() {
    if (!lookedUp?.driver?.licenseNo) {
      Alert.alert("Invalid Driver", "Please load valid driver details first");
      return;
    }

    if (!form.violationCode) {
      Alert.alert("Required", "Please select a violation");
      return;
    }

    try {
      setSubmitting(true);

      await issuePenalty({
        licenseNo: form.licenseNo.trim(),
        plateNo: form.plateNo.trim() || undefined,
        violationCode: form.violationCode,
        locationText: form.locationText.trim() || undefined,
        occurredAt: form.occurredAt,
        notes: form.notes.trim() || undefined,
      });

      Alert.alert("Success", "Penalty issued successfully");

      setForm((prev) => ({
        ...prev,
        plateNo: "",
        violationCode: "",
        locationText: "",
        notes: "",
        occurredAt: new Date().toISOString().slice(0, 16),
      }));
    } catch (err) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to issue penalty"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const vehicles = lookedUp?.vehicles || [];

  const statusTone =
    lookedUp?.driver?.licenseStatus === "SUSPENDED" ||
    lookedUp?.driver?.licenseStatus === "REVOKED"
      ? "red"
      : lookedUp?.driver?.licenseStatus === "ACTIVE"
      ? "green"
      : "yellow";

  const pointsTone =
    (lookedUp?.driver?.currentPoints ?? 0) >= 12
      ? "red"
      : (lookedUp?.driver?.currentPoints ?? 0) >= 8
      ? "orange"
      : "green";

  const selectedViolation = useMemo(() => {
    return violationTypes.find((v) => v.code === form.violationCode) || null;
  }, [violationTypes, form.violationCode]);

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>Issue Traffic Penalty</Text>
          <Text style={styles.subtitle}>
            Verify driver, select violation, and issue fine with demerit points.
          </Text>

          {lookupLoading ? (
            <View style={styles.headerBadgeWrap}>
              <Badge tone="yellow">Searching driver...</Badge>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>👤 Driver & License Lookup</Text>
          <Text style={styles.cardSubtext}>
            Enter license number to fetch driver profile and vehicles
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>License Number</Text>
            <TextInput
              value={form.licenseNo}
              onChangeText={(v) => updateField("licenseNo", v.toUpperCase())}
              placeholder="e.g. B12345678"
              placeholderTextColor="#64748b"
              autoCapitalize="characters"
              style={styles.input}
            />
            <Text style={styles.helperText}>
              Enter full license number • auto lookup after 600ms
            </Text>
          </View>

          <View style={styles.badgeRow}>
            {lookupLoading ? <Badge tone="yellow">Searching...</Badge> : null}
            {!!lookupError ? <Badge tone="red">{lookupError}</Badge> : null}
            {lookedUp?.driver && !lookupLoading ? (
              <Badge tone={statusTone}>
                {lookedUp.driver.licenseStatus || "UNKNOWN"}
              </Badge>
            ) : null}
          </View>

          {lookedUp?.driver ? (
            <View style={styles.previewWrap}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Driver</Text>
                <Text style={styles.infoMain}>{lookedUp.user?.name || "—"}</Text>
                <Text style={styles.infoText}>
                  Email: {lookedUp.user?.email || "—"}
                </Text>
                <Text style={styles.infoText}>
                  Phone: {lookedUp.user?.phone || "—"}
                </Text>
                <Text style={styles.infoText}>
                  NIC: {lookedUp.user?.nic || "—"}
                </Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>License</Text>

                <View style={styles.badgeRow}>
                  <Badge tone={statusTone}>
                    {lookedUp.driver.licenseStatus || "Unknown"}
                  </Badge>
                  <Badge tone={pointsTone}>
                    Demerit: {lookedUp.driver.currentPoints ?? 0}
                  </Badge>
                </View>

                {lookedUp.driver.suspendedUntil ? (
                  <Text style={styles.warningText}>
                    Suspended until:{" "}
                    {new Date(
                      lookedUp.driver.suspendedUntil
                    ).toLocaleDateString()}
                  </Text>
                ) : null}
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>
                  Registered Vehicles ({vehicles.length})
                </Text>

                {vehicles.length === 0 ? (
                  <Text style={styles.emptyText}>No vehicles found</Text>
                ) : (
                  vehicles.slice(0, 3).map((v, index) => (
                    <View
                      key={v.id ?? `${v.plateNo}-${index}`}
                      style={styles.vehicleRow}
                    >
                      <View style={styles.vehicleTextWrap}>
                        <Text style={styles.vehiclePlate}>{v.plateNo}</Text>
                        <Text style={styles.vehicleMeta}>
                          {v.type} {v.model ? `(${v.model})` : ""}
                        </Text>
                      </View>

                      <Badge tone={v.ownershipVerified ? "green" : "yellow"}>
                        {v.ownershipVerified ? "Verified" : "Pending"}
                      </Badge>
                    </View>
                  ))
                )}

                {vehicles.length > 3 ? (
                  <Text style={styles.moreText}>
                    + {vehicles.length - 3} more...
                  </Text>
                ) : null}
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚖️ Issue New Penalty</Text>
          <Text style={styles.cardSubtext}>
            Available after successful driver lookup
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Vehicle Plate</Text>

            {vehicles.length > 0 ? (
              <View style={styles.optionWrap}>
                {vehicles.map((v, index) => {
                  const selected = form.plateNo === v.plateNo;

                  return (
                    <Pressable
                      key={v.id ?? `${v.plateNo}-${index}`}
                      onPress={() => updateField("plateNo", v.plateNo)}
                      style={[
                        styles.optionItem,
                        selected && styles.optionItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionItemText,
                          selected && styles.optionItemTextSelected,
                        ]}
                      >
                        {v.plateNo} — {v.type} {v.model ? `(${v.model})` : ""}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <TextInput
                value={form.plateNo}
                onChangeText={(v) => updateField("plateNo", v.toUpperCase())}
                placeholder="e.g. ABC-1234 (optional)"
                placeholderTextColor="#64748b"
                autoCapitalize="characters"
                style={styles.input}
              />
            )}

            <Text style={styles.helperText}>
              Select from registered vehicles or type manually
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Violation Code</Text>

            <View style={styles.optionWrap}>
              {violationTypes.length === 0 ? (
                <Text style={styles.emptyText}>No violation types found</Text>
              ) : (
                violationTypes.map((v, index) => {
                  const selected = form.violationCode === v.code;

                  return (
                    <Pressable
                      key={v.id ?? v.code ?? index}
                      onPress={() => updateField("violationCode", v.code)}
                      style={[
                        styles.optionItem,
                        selected && styles.optionItemSelectedRed,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionItemText,
                          selected && styles.optionItemTextSelected,
                        ]}
                      >
                        {v.code} — {v.title} (LKR {v.baseFineLkr},{" "}
                        {v.demeritPoints} pts)
                      </Text>
                    </Pressable>
                  );
                })
              )}
            </View>

            {selectedViolation ? (
              <View style={styles.selectedInfoCard}>
                <Text style={styles.selectedInfoTitle}>Selected Violation</Text>
                <Text style={styles.selectedInfoText}>
                  {selectedViolation.code} — {selectedViolation.title}
                </Text>
                <Text style={styles.selectedInfoSubtext}>
                  Fine: LKR {selectedViolation.baseFineLkr} • Demerit:{" "}
                  {selectedViolation.demeritPoints} points
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Location / Road</Text>
            <TextInput
              value={form.locationText}
              onChangeText={(v) => updateField("locationText", v)}
              placeholder="e.g. Kandy-Colombo Road, Digana"
              placeholderTextColor="#64748b"
              style={styles.input}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Date & Time of Violation</Text>
            <TextInput
              value={form.occurredAt}
              onChangeText={(v) => updateField("occurredAt", v)}
              placeholder="YYYY-MM-DDTHH:mm"
              placeholderTextColor="#64748b"
              style={styles.input}
            />
            <Text style={styles.helperText}>Example: 2026-03-14T09:30</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Additional Notes / Remarks</Text>
            <TextInput
              value={form.notes}
              onChangeText={(v) => updateField("notes", v)}
              placeholder="e.g. Speeding 95 km/h in 60 zone, no seatbelt..."
              placeholderTextColor="#64748b"
              multiline
              textAlignVertical="top"
              style={[styles.input, styles.textArea]}
            />
          </View>

          <View style={styles.submitWrap}>
            {submitting || lookupLoading ? (
              <Pressable style={styles.disabledButton}>
                <ActivityIndicator color="#cbd5e1" />
                <Text style={styles.disabledButtonText}>Processing...</Text>
              </Pressable>
            ) : (
              <AppButton
                title="Issue Penalty"
                onPress={handleSubmit}
                disabled={!lookedUp?.driver || !form.violationCode}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },

  headerCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  headerBadgeWrap: {
    marginTop: 12,
    alignSelf: "flex-start",
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },

  card: {
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    color: "#a5b4fc",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  cardSubtext: {
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 14,
  },

  fieldGroup: {
    marginTop: 4,
    marginBottom: 14,
  },

  label: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "rgba(30,41,59,0.7)",
    borderWidth: 1,
    borderColor: "#475569",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#fff",
    fontSize: 14,
  },

  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },

  helperText: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 6,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },

  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginRight: 8,
    marginBottom: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  previewWrap: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingTop: 14,
  },

  infoBlock: {
    backgroundColor: "#0f172a",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 14,
  },

  infoLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  infoMain: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  infoText: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 4,
  },

  warningText: {
    color: "#fca5a5",
    fontSize: 13,
    marginTop: 6,
  },

  emptyText: {
    color: "#64748b",
    fontSize: 14,
  },

  vehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  vehicleTextWrap: {
    flex: 1,
    paddingRight: 10,
  },

  vehiclePlate: {
    color: "#a5b4fc",
    fontSize: 14,
    fontWeight: "700",
  },

  vehicleMeta: {
    color: "#cbd5e1",
    fontSize: 13,
    marginTop: 2,
  },

  moreText: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },

  optionWrap: {
    marginTop: 2,
  },

  optionItem: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },

  optionItemSelected: {
    backgroundColor: "#1d4ed8",
    borderColor: "#3b82f6",
  },

  optionItemSelectedRed: {
    backgroundColor: "#b91c1c",
    borderColor: "#ef4444",
  },

  optionItemText: {
    color: "#e5e7eb",
    fontSize: 14,
    fontWeight: "600",
  },

  optionItemTextSelected: {
    color: "#fff",
  },

  selectedInfoCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#243041",
    borderRadius: 14,
    padding: 12,
    marginTop: 4,
  },

  selectedInfoTitle: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },

  selectedInfoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  selectedInfoSubtext: {
    color: "#cbd5e1",
    fontSize: 13,
    marginTop: 3,
  },

  submitWrap: {
    marginTop: 8,
  },

  disabledButton: {
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  disabledButtonText: {
    color: "#cbd5e1",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 10,
  },
});