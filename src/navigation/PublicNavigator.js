import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PublicHomeScreen from "../screens/public/PublicHomeScreen";
import PublicIncidentReportScreen from "../screens/public/PublicIncidentReportScreen.web";
import PrivacyPolicyScreen from "../screens/public/PrivacyPolicyScreen";
import RoadSafetyScreen from "../screens/public/RoadSafetyScreen";
import StatisticsScreen from "../screens/public/StatisticsScreen";


const Stack = createNativeStackNavigator();

export default function PublicNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#0f172a" },
                headerTintColor: "#fff",
                contentStyle: { backgroundColor: "#020617" },
            }}
        >
            <Stack.Screen
                name="PublicHome"
                component={PublicHomeScreen}
                options={{ title: "SLREPMS Public" }}
            />
            <Stack.Screen
                name="PublicIncidentReport"
                component={PublicIncidentReportScreen}
                options={{ title: "Report Incident" }}
            />
            <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{ title: "Privacy Policy" }}
            />
            <Stack.Screen
                name="RoadSafety"
                component={RoadSafetyScreen}
                options={{ title: "Road Safety" }}
            />
            <Stack.Screen
                name="Statistics"
                component={StatisticsScreen}
                options={{ title: "Statistics" }}
            />
        </Stack.Navigator>
    );
}