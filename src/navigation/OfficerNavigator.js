import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OfficerHomeScreen from "../screens/officer/OfficerHomeScreen";
import OfficerIssuePenaltyScreen from "../screens/officer/OfficerIssuePenaltyScreen";
import OfficerVerifyVehicleScreen from "../screens/officer/OfficerVerifyVehicleScreen";
import OfficerIncidentCreateScreen from "../screens/officer/OfficerIncidentCreateScreen";
import OfficerIncidentReviewScreen from "../screens/officer/OfficerIncidentReviewScreen";

const Tab = createBottomTabNavigator();

export default function OfficerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0f172a" },
        headerTintColor: "#fff",
        tabBarStyle: { backgroundColor: "#0f172a" },
        tabBarActiveTintColor: "#818cf8",
        tabBarInactiveTintColor: "#94a3b8",
        sceneContainerStyle: { backgroundColor: "#020617" },
      }}
    >
      <Tab.Screen name="Home" component={OfficerHomeScreen} />
      <Tab.Screen name="Penalty" component={OfficerIssuePenaltyScreen} />
      <Tab.Screen name="Verify" component={OfficerVerifyVehicleScreen} />
      <Tab.Screen name="CreateIncident" component={OfficerIncidentCreateScreen} />
      <Tab.Screen name="Review" component={OfficerIncidentReviewScreen} />
    </Tab.Navigator>
  );
}