import { ShieldX } from "lucide-react";
import React from "react";
import { useNavigation } from "../routing/NavigationContext.jsx";

export function UnauthorizedPage() {
  const { navigate } = useNavigation();

  return (
    <section className="state-page">
      <ShieldX size={36} aria-hidden="true" />
      <h1>Unauthorized</h1>
      <p>Your current role does not have access to this workspace.</p>
      <button onClick={() => navigate("/dashboard")} type="button">
        Back to dashboard
      </button>
    </section>
  );
}
