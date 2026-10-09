import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>;
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Login failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-500">
        Sign in to your banking account.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        {error && (
          <p role="alert" className="text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-blue-600">
          Create account
        </Link>
      </p>
    </>
  );
}