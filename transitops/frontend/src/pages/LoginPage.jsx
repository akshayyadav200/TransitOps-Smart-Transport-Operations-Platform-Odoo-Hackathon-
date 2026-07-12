import { LockKeyhole } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { FormError } from "../components/shared.jsx";
import { getDefaultRouteForRole } from "../lib/permissions.js";
import { useNavigation } from "../routing/NavigationContext.jsx";

export function LoginPage() {
  const { user, login } = useAuth();
  const { navigate } = useNavigation();
  const [email, setEmail] = useState("admin@transitops.demo");
  const [password, setPassword] = useState("TransitOpsDemo@123");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(getDefaultRouteForRole(user.role), { replace: true });
    }
  }, [navigate, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const loggedInUser = await login(email, password);
      navigate(getDefaultRouteForRole(loggedInUser.role), { replace: true });
    } catch (loginError) {
      setError(loginError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-mark" aria-hidden="true">
          <LockKeyhole size={28} />
        </div>
        <p className="eyebrow">TransitOps</p>
        <h1>Sign in</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input autoComplete="email" name="email" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
          </label>
          <label>
            Password
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>
          <FormError errors={error?.errors} message={error?.message} />
          <button disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
