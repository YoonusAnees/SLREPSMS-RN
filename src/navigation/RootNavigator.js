import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/auth.store";
import AuthNavigator from "./AuthNavigator";
import DriverNavigator from "./DriverNavigator";
import OfficerNavigator from "./OfficerNavigator";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || !user) {
    return <AuthNavigator />;
  }

  if (user.role === "OFFICER") {
    return <OfficerNavigator />;
  }

  return <DriverNavigator />;
}