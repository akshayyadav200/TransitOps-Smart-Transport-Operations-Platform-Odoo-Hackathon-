import React from "react";
import { EmptyState } from "../components/shared.jsx";
import { useNavigation } from "../routing/NavigationContext.jsx";

export function NotFoundPage() {
  const { navigate } = useNavigation();

  return (
    <EmptyState
      action={
        <button onClick={() => navigate("/dashboard")} type="button">
          Back to dashboard
        </button>
      }
      message="The requested TransitOps workspace does not exist."
      title="Not found"
    />
  );
}
