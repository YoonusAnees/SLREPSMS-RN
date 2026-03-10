import { useEffect } from "react";
import { Text, View } from "react-native";
import { useAuthStore } from "../../store/auth.store";

export default function LogoutScreen() {
    const logout = useAuthStore((s) => s.logout);

    useEffect(() => {
        logout();
    }, [logout]);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#020617",
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
            }}
        >
            <Text style={{ color: "#fff", fontSize: 18 }}>Logging out...</Text>
        </View>
    );
}