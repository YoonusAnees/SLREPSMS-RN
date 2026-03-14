import { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import Screen from "../../components/Screen";
import Input from "../../components/Input";
import AppButton from "../../components/AppButton";
import { useOfficerStore } from "../../store/officer.store";

const INCIDENT_TYPES = ["ACCIDENT", "BREAKDOWN", "MEDICAL", "FIRE", "OTHER"];
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const SUSPECTED_VIOLATIONS = [
  { label: "None / Not sure", value: "" },
  { label: "Drunk Driving", value: "DRUNK_DRIVE" },
  { label: "Reckless Driving", value: "RECKLESS_DRIVING" },
  { label: "No Helmet", value: "NO_HELMET" },
  { label: "Red Light Violation", value: "RED_LIGHT_VIOLATION" },
];

function InfoBadge({ text, tone = "yellow" }) {
  const tones = {
    yellow: {
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.35)",
      text: "#fbbf24",
    },
    red: {
      bg: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.35)",
      text: "#f87171",
    },
    blue: {
      bg: "rgba(99,102,241,0.14)",
      border: "rgba(99,102,241,0.35)",
      text: "#a5b4fc",
    },
    green: {
      bg: "rgba(34,197,94,0.12)",
      border: "rgba(34,197,94,0.35)",
      text: "#86efac",
    },
  };

  const style = tones[tone] || tones.yellow;

  return (
    <View
      style={[
        styles.infoBadge,
        {
          backgroundColor: style.bg,
          borderColor: style.border,
        },
      ]}
    >
      <Text style={[styles.infoBadgeText, { color: style.text }]}>{text}</Text>
    </View>
  );
}

export default function OfficerIncidentCreateScreen() {
  const createIncident = useOfficerStore((s) => s.createIncident);

  const [form, setForm] = useState({
    type: "ACCIDENT",
    severity: "LOW",
    lat: "6.9271",
    lng: "79.8612",
    description: "",
    locationText: "",
    evidence: "",
    plateNo: "",
    suspectedViolationCode: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  async function handleCreate() {
    try {
      setSubmitting(true);

      await createIncident({
        ...form,
        lat: Number(form.lat),
        lng: Number(form.lng),
        plateNo: form.plateNo.trim() || undefined,
        suspectedViolationCode: form.suspectedViolationCode || undefined,
        description: form.description.trim() || undefined,
        locationText: form.locationText.trim() || undefined,
        evidence: form.evidence.trim() || undefined,
      });

      Alert.alert("Success", "Incident created");

      setForm({
        type: "ACCIDENT",
        severity: "LOW",
        lat: form.lat,
        lng: form.lng,
        description: "",
        locationText: "",
        evidence: "",
        plateNo: "",
        suspectedViolationCode: "",
      });
    } catch (e) {
      Alert.alert(
        "Error",
        e?.response?.data?.message || "Failed to create incident"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const severityTone = useMemo(() => {
    if (form.severity === "CRITICAL" || form.severity === "HIGH") return "red";
    if (form.severity === "MEDIUM") return "yellow";
    return "green";
  }, [form.severity]);

  return (
    <Screen scroll={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.title}>Create Incident</Text>
          <Text style={styles.subtitle}>
            Officers can record incidents, attach location details, vehicle
            information, and suspected violations.
          </Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Incident Classification</Text>
          <Text style={styles.sectionSubtitle}>
            Define the type and severity level of the incident.
          </Text>

          <Text style={styles.label}>Incident Type</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={form.type}
              onValueChange={(v) => update("type", v)}
              dropdownIconColor="#fff"
              style={styles.picker}
            >
              {INCIDENT_TYPES.map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Severity</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={form.severity}
              onValueChange={(v) => update("severity", v)}
              dropdownIconColor="#fff"
              style={styles.picker}
            >
              {SEVERITIES.map((item) => (
                <Picker.Item key={item} label={item} value={item} />
              ))}
            </Picker>
          </View>

          <View style={styles.badgeRow}>
            <InfoBadge text={`Type: ${form.type}`} tone="blue" />
            <InfoBadge text={`Severity: ${form.severity}`} tone={severityTone} />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <Text style={styles.sectionSubtitle}>
            Enter coordinates and location information for the incident.
          </Text>

          <Input
            label="Latitude"
            value={form.lat}
            onChangeText={(v) => update("lat", v)}
            placeholder="Latitude"
          />

          <Input
            label="Longitude"
            value={form.lng}
            onChangeText={(v) => update("lng", v)}
            placeholder="Longitude"
          />

          <Input
            label="Location"
            value={form.locationText}
            onChangeText={(v) => update("locationText", v)}
            placeholder="Incident location"
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Vehicle & Violation</Text>
          <Text style={styles.sectionSubtitle}>
            Add the involved vehicle and any suspected violation if known.
          </Text>

          <Input
            label="Plate No"
            value={form.plateNo}
            onChangeText={(v) => update("plateNo", v.toUpperCase())}
            placeholder="Optional vehicle plate number"
          />

          <Text style={styles.label}>Suspected Violation Code</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={form.suspectedViolationCode}
              onValueChange={(v) => update("suspectedViolationCode", v)}
              dropdownIconColor="#fff"
              style={styles.picker}
            >
              {SUSPECTED_VIOLATIONS.map((item) => (
                <Picker.Item
                  key={item.value || "none"}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <Text style={styles.sectionSubtitle}>
            Include evidence URL and officer notes if available.
          </Text>

          <Input
            label="Evidence URL"
            value={form.evidence}
            onChangeText={(v) => update("evidence", v)}
            placeholder="Optional evidence URL"
          />

          <Input
            label="Description"
            value={form.description}
            onChangeText={(v) => update("description", v)}
            placeholder="Describe what happened"
            multiline
          />
        </View>

        <View style={styles.submitWrap}>
          <AppButton
            title={submitting ? "Creating..." : "Create Incident"}
            onPress={handleCreate}
            loading={submitting}
          />
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

  sectionCard: {
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
  },

  sectionSubtitle: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 19,
  },

  label: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: -4,
    marginTop: 2,
  },

  pickerWrap: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 14,
    overflow: "hidden",
  },

  picker: {
    color: "#ffffff",
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },

  infoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  infoBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  submitWrap: {
    marginTop: -2,
  },
});