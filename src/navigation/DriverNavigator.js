import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import DriverHomeScreen from "../screens/driver/DriverHomeScreen";
import DriverVehiclesScreen from "../screens/driver/DriverVehiclesScreen";
import DriverPenaltiesScreen from "../screens/driver/DriverPenaltiesScreen";
import DriverIncidentsScreen from "../screens/driver/DriverIncidentsScreen";
import DriverProfileScreen from "../screens/driver/DriverProfileScreen";

const Tab = createBottomTabNavigator();

export default function DriverNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#0f172a",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
        headerShadowVisible: false,

        sceneContainerStyle: {
          backgroundColor: "#020617",
        },

        tabBarStyle: {
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 0,
          height: 68,
          backgroundColor: "#0f172a",
          borderRadius: 20,
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
        },

        tabBarActiveTintColor: "#818cf8",
        tabBarInactiveTintColor: "#94a3b8",

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 2,
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Vehicles") {
            iconName = focused ? "car-sport" : "car-sport-outline";
          } else if (route.name === "Penalties") {
            iconName = focused ? "document-text" : "document-text-outline";
          } else if (route.name === "Incidents") {
            iconName = focused ? "warning" : "warning-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={size ?? 22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={DriverHomeScreen}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="Vehicles"
        component={DriverVehiclesScreen}
        options={{ title: "My Vehicles" }}
      />
      <Tab.Screen
        name="Penalties"
        component={DriverPenaltiesScreen}
        options={{ title: "Penalties" }}
      />
      <Tab.Screen
        name="Incidents"
        component={DriverIncidentsScreen}
        options={{ title: "Incidents" }}
      />
      <Tab.Screen
        name="Profile"
        component={DriverProfileScreen}
        options={{ title: "My Profile" }}
      />
    </Tab.Navigator>
  );
}