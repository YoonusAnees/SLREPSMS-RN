import { useAuthStore } from "../store/auth.store";
import PublicDrawerNavigator from "./PublicDrawerNavigator";
import DriverNavigator from "./DriverNavigator";
import OfficerNavigator from "./OfficerNavigator";

export default function RootNavigator() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || !user) {
    return <PublicDrawerNavigator />;
  }

  if (user.role === "OFFICER") {
    return <OfficerNavigator />;
  }

  return <DriverNavigator />;
}