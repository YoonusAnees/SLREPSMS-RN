import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { usePublicStore } from "../../store/public.store";

function StatBox({ title, value, bg }) {
    return (
        <View
            style={{
                backgroundColor: bg,
                borderWidth: 1,
                borderColor: "#334155",
                borderRadius: 18,
                padding: 16,
            }}
        >
            <Text style={{ color: "#94a3b8", fontSize: 13 }}>{title}</Text>
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", marginTop: 8 }}>
                {value}
            </Text>
        </View>
    );
}

export default function StatisticsScreen() {
    const stats = usePublicStore((s) => s.stats);
    const categoryBreakdown = usePublicStore((s) => s.categoryBreakdown);
    const loadPublicHomeData = usePublicStore((s) => s.loadPublicHomeData);
    const loading = usePublicStore((s) => s.loading.home);

    useEffect(() => {
        loadPublicHomeData().catch(() => { });
    }, [loadPublicHomeData]);

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#020617" }}
            contentContainerStyle={{ padding: 16, gap: 16 }}
        >
            <View>
                <Text style={{ color: "#fff", fontSize: 30, fontWeight: "800" }}>
                    Public Statistics
                </Text>
                <Text style={{ color: "#94a3b8", marginTop: 10, lineHeight: 24 }}>
                    High-level incident metrics and category trends based on public incident records.
                </Text>
            </View>

            <View style={{ gap: 12 }}>
                <StatBox title="Total Incidents" value={stats.total} bg="#111827" />
                <StatBox title="Pending Cases" value={stats.pending} bg="#2b1608" />
                <StatBox title="Resolved Cases" value={stats.resolved} bg="#052915" />
                <StatBox title="Accidents" value={stats.accidents} bg="#220c10" />
                <StatBox title="Breakdowns" value={stats.breakdowns} bg="#2b1608" />
                <StatBox title="Emergency Cases" value={stats.emergency} bg="#08263b" />
            </View>

            <View
                style={{
                    backgroundColor: "#0f172a",
                    borderWidth: 1,
                    borderColor: "#334155",
                    borderRadius: 18,
                    padding: 16,
                }}
            >
                <Text style={{ color: "#818cf8", fontSize: 20, fontWeight: "800" }}>
                    Incident category distribution
                </Text>

                {loading ? (
                    <Text style={{ color: "#94a3b8", marginTop: 16 }}>Loading statistics...</Text>
                ) : (
                    <View style={{ marginTop: 16, gap: 14 }}>
                        {categoryBreakdown.map((item) => (
                            <View key={item.label}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginBottom: 6,
                                    }}
                                >
                                    <Text style={{ color: "#cbd5e1" }}>
                                        {item.label} ({item.count})
                                    </Text>
                                    <Text style={{ color: "#94a3b8" }}>{item.percent}%</Text>
                                </View>

                                <View
                                    style={{
                                        height: 10,
                                        backgroundColor: "#1e293b",
                                        borderRadius: 999,
                                        overflow: "hidden",
                                    }}
                                >
                                    <View
                                        style={{
                                            height: "100%",
                                            width: `${item.percent}%`,
                                            backgroundColor: item.color,
                                            borderRadius: 999,
                                        }}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
}