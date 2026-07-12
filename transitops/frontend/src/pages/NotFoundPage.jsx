import { SearchX } from "lucide-react";
import React from "react";
import { useNavigation } from "../routing/NavigationContext.jsx";

export function NotFoundPage() {
  const { navigate } = useNavigation();

  return (
    <section className="state-page">
      <SearchX size={36} aria-hidden="true" />
      <h1>Not found</h1>
      <p>The requested TransitOps workspace does not exist.</p>
      <button onClick={() => navigate("/dashboard")} type="button">
        Back to dashboard
      </button>
    </section>
  );
}
