import { useAuthStore } from "../store/auth.store";
import PublicDrawerNavigator from "./PublicDrawerNavigator";
import DriverNavigator from "./DriverNavigator";
import OfficerNavigator from "./OfficerNavigator";

export default function RootNavigator() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  if (!accessToken || !user) {
    return <PublicDrawerNavigator />;
  }

  if (user.role === "OFFICER") {
    return <OfficerNavigator />;
  }

  return <DriverNavigator />;
}