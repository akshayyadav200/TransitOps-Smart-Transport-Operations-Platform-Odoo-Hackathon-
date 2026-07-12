import React from "react";
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useNavigation } from "../routing/NavigationContext.jsx";
import { UnauthorizedPage } from "../pages/UnauthorizedPage.jsx";

export function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, navigate, user]);

  if (loading) {
    return <div className="loading-screen">Checking session...</div>;
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <UnauthorizedPage />;
  }

  return children;
}
