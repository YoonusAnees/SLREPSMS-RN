import { createDrawerNavigator } from "@react-navigation/drawer";
import PublicHomeScreen from "../screens/public/PublicHomeScreen";
import PublicIncidentReportScreen from "../screens/public/PublicIncidentReportScreen.web";
import RoadSafetyScreen from "../screens/public/RoadSafetyScreen";
import StatisticsScreen from "../screens/public/StatisticsScreen";
import PrivacyPolicyScreen from "../screens/public/PrivacyPolicyScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

const Drawer = createDrawerNavigator();

export default function PublicDrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: "#0f172a" },
                headerTintColor: "#fff",
                drawerStyle: { backgroundColor: "#020617" },
                drawerActiveTintColor: "#818cf8",
                drawerInactiveTintColor: "#cbd5e1",
                sceneContainerStyle: { backgroundColor: "#020617" },
            }}
        >
            <Drawer.Screen
                name="PublicHome"
                component={PublicHomeScreen}
                options={{ title: "Home" }}
            />
            <Drawer.Screen
                name="PublicIncidentReport"
                component={PublicIncidentReportScreen}
                options={{ title: "Report Incident" }}
            />
            <Drawer.Screen
                name="RoadSafety"
                component={RoadSafetyScreen}
                options={{ title: "Road Safety" }}
            />
            <Drawer.Screen
                name="Statistics"
                component={StatisticsScreen}
                options={{ title: "Statistics" }}
            />
            <Drawer.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{ title: "Privacy Policy" }}
            />
            <Drawer.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: "Login" }}
            />
            <Drawer.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: "Register" }}
            />
        </Drawer.Navigator>
    );
}