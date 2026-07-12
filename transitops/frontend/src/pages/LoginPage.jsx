import { LockKeyhole } from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useNavigation } from "../routing/NavigationContext.jsx";

export function LoginPage() {
  const { user, login } = useAuth();
  const { navigate } = useNavigation();
  const [email, setEmail] = useState("admin@transitops.demo");
  const [password, setPassword] = useState("TransitOpsDemo@123");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
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
          {error ? <p className="form-error">{error}</p> : null}
          <button disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}
