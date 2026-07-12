import React from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { ErrorState } from "../components/shared.jsx";
import { getDefaultRouteForRole } from "../lib/permissions.js";
import { useNavigation } from "../routing/NavigationContext.jsx";

export function UnauthorizedPage() {
  const { user } = useAuth();
  const { navigate } = useNavigation();

  return (
    <ErrorState
      message="Your current role does not have access to this workspace."
      onRetry={() => navigate(getDefaultRouteForRole(user?.role))}
      title="Unauthorized"
    />
  );
}
