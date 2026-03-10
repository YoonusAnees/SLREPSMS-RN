import { ScrollView, Text, View } from "react-native";

function Section({ title, text }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: "#818cf8", fontSize: 18, fontWeight: "800" }}>{title}</Text>
      <Text style={{ color: "#cbd5e1", lineHeight: 24 }}>{text}</Text>
    </View>
  );
}

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#020617" }}
      contentContainerStyle={{ padding: 16 }}
    >
      <View
        style={{
          backgroundColor: "#0f172a",
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "#334155",
          padding: 20,
          gap: 18,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 30, fontWeight: "800" }}>
          Privacy Policy
        </Text>
        <Text style={{ color: "#94a3b8" }}>Last updated: March 2026</Text>

        <Section
          title="1. Introduction"
          text="The Sri Lanka Road E-Penalty Management System (SLREPMS) is committed to protecting personal information and handling data responsibly. This policy explains how information may be collected, used, stored, and disclosed through the platform."
        />

        <Section
          title="2. Information We Collect"
          text="Information may include user account details, contact information, license data, vehicle data, incident reports, system usage information, and payment-related references."
        />

        <Section
          title="3. How Information Is Used"
          text="Data may be used for incident handling, verification, enforcement workflows, rescue coordination, reporting, administration, service improvement, and lawful operational needs."
        />

        <Section
          title="4. Public and Private Data"
          text="Public-facing pages may show only generalized statistics and non-sensitive incident summaries. Personally identifiable or sensitive records should not be publicly exposed unless legally authorized."
        />

        <Section
          title="5. Data Security"
          text="Reasonable technical and administrative measures should be used to reduce the risk of unauthorized access, misuse, disclosure, or alteration of stored data."
        />

        <Section
          title="6. Third-Party Services"
          text="The platform may use third-party services such as map providers, payment providers, hosting providers, and communication tools as needed for operation."
        />

        <Section
          title="7. Payment Information"
          text="Payment processing may be handled by third-party providers. Sensitive card details should be processed securely and should not be stored directly unless compliant handling is in place."
        />

        <Section
          title="8. Record Retention"
          text="Records may be retained only as long as necessary for lawful, administrative, operational, or investigative purposes."
        />

        <Section
          title="9. User Rights"
          text="Users may request access to their personal information, request corrections, or raise privacy-related concerns according to applicable rules and system procedures."
        />

        <Section
          title="10. Contact"
          text="For privacy questions, users should contact the platform administrator or the official support contact channel published by the system."
        />
      </View>
    </ScrollView>
  );
}