import { ScrollView, Text, View } from "react-native";

const tips = [
    {
        title: "Wear helmets and seatbelts",
        text: "Helmets and seatbelts significantly reduce injury risk during crashes and sudden impacts.",
        icon: "⛑️",
    },
    {
        title: "Avoid drunk and reckless driving",
        text: "Driving under the influence or at unsafe speed increases the risk of major road incidents.",
        icon: "🚫",
    },
    {
        title: "Follow traffic signals",
        text: "Stopping at red lights and respecting road signs helps protect drivers, riders, and pedestrians.",
        icon: "🚦",
    },
    {
        title: "Keep your vehicle roadworthy",
        text: "Check brakes, tyres, lights, insurance, and overall condition regularly.",
        icon: "🔧",
    },
];

export default function RoadSafetyScreen() {
    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#020617" }}
            contentContainerStyle={{ padding: 16, gap: 16 }}
        >
            <View>
                <Text style={{ color: "#fff", fontSize: 30, fontWeight: "800" }}>
                    Road Safety Guidelines
                </Text>
                <Text style={{ color: "#94a3b8", marginTop: 10, lineHeight: 24 }}>
                    Basic road safety reminders for drivers, riders, passengers, and the general public.
                </Text>
            </View>

            {tips.map((tip) => (
                <View
                    key={tip.title}
                    style={{
                        backgroundColor: "#0f172a",
                        borderWidth: 1,
                        borderColor: "#334155",
                        borderRadius: 18,
                        padding: 16,
                    }}
                >
                    <Text style={{ fontSize: 32 }}>{tip.icon}</Text>
                    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800", marginTop: 10 }}>
                        {tip.title}
                    </Text>
                    <Text style={{ color: "#94a3b8", lineHeight: 22, marginTop: 8 }}>
                        {tip.text}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
}