import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import OfficerHomeScreen from "../screens/officer/OfficerHomeScreen";
import OfficerIssuePenaltyScreen from "../screens/officer/OfficerIssuePenaltyScreen";
import OfficerVerifyVehicleScreen from "../screens/officer/OfficerVerifyVehicleScreen";
import OfficerIncidentCreateScreen from "../screens/officer/OfficerIncidentCreateScreen";
import OfficerIncidentReviewScreen from "../screens/officer/OfficerIncidentReviewScreen";

const Tab = createBottomTabNavigator();

function getTabIcon(routeName, focused) {
  switch (routeName) {
    case "Home":
      return focused ? "home" : "home-outline";
    case "Penalty":
      return focused ? "receipt" : "receipt-outline";
    case "Verify":
      return focused ? "shield-checkmark" : "shield-checkmark-outline";
    case "CreateIncident":
      return focused ? "add-circle" : "add-circle-outline";
    case "Review":
      return focused ? "document-text" : "document-text-outline";
    default:
      return focused ? "ellipse" : "ellipse-outline";
  }
}

export default function OfficerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#0f172a",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#1e293b",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 18,
        },
        headerTitleAlign: "center",

        sceneContainerStyle: {
          backgroundColor: "#020617",
        },

        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopColor: "#1e293b",
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#818cf8",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={getTabIcon(route.name, focused)}
            size={size ?? 22}
            color={color}
          />
        ),
        tabBarIconStyle: {
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={OfficerHomeScreen}
        options={{
          title: "Officer Home",
          tabBarLabel: "Home",
          headerTitle: "Officer Dashboard",
        }}
      />

      <Tab.Screen
        name="Penalty"
        component={OfficerIssuePenaltyScreen}
        options={{
          title: "Issue Penalty",
          tabBarLabel: "Penalty",
          headerTitle: "Issue Penalty",
        }}
      />

      <Tab.Screen
        name="Verify"
        component={OfficerVerifyVehicleScreen}
        options={{
          title: "Verify Vehicle",
          tabBarLabel: "Verify",
          headerTitle: "Verify Vehicle",
        }}
      />

      <Tab.Screen
        name="CreateIncident"
        component={OfficerIncidentCreateScreen}
        options={{
          title: "Create Incident",
          tabBarLabel: "Create",
          headerTitle: "Create Incident",
        }}
      />

      <Tab.Screen
        name="Review"
        component={OfficerIncidentReviewScreen}
        options={{
          title: "Review Incidents",
          tabBarLabel: "Review",
          headerTitle: "Incident Review",
        }}
      />
    </Tab.Navigator>
  );
}