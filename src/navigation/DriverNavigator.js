import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DriverHomeScreen from "../screens/driver/DriverHomeScreen";
import DriverVehiclesScreen from "../screens/driver/DriverVehiclesScreen";
import DriverPenaltiesScreen from "../screens/driver/DriverPenaltiesScreen";
import DriverIncidentsScreen from "../screens/driver/DriverIncidentsScreen";
import DriverProfileScreen from "../screens/driver/DriverProfileScreen";

const Tab = createBottomTabNavigator();

export default function DriverNavigator() {
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
      <Tab.Screen name="Home" component={DriverHomeScreen} />
      <Tab.Screen name="Vehicles" component={DriverVehiclesScreen} />
      <Tab.Screen name="Penalties" component={DriverPenaltiesScreen} />
      <Tab.Screen name="Incidents" component={DriverIncidentsScreen} />
      <Tab.Screen name="Profile" component={DriverProfileScreen} />
    </Tab.Navigator>
  );
}