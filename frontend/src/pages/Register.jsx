import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import useAuth from "../hooks/useAuth";
import {
  isStrongPassword,
  isValidEmail,
} from "../utils/validators";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isValidEmail(form.email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!isStrongPassword(form.password)) {
      setError(
        "Use at least 8 characters with uppercase, lowercase, and a number."
      );
      return;
    }

    setSubmitting(true);

    try {
      await register(form);
      navigate("/login", {
        replace: true,
        state: { message: "Registration successful. Please sign in." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
      <p className="mt-2 text-sm text-slate-500">
        Register for your demo banking account.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <Input
          label="Full name"
          name="name"
          value={form.name}
          onChange={update}
          autoComplete="name"
          placeholder="Your full name"
          required
        />
        <Input
          label="Email address"
          type="email"
          name="email"
          value={form.email}
          onChange={update}
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={update}
          autoComplete="new-password"
          placeholder="Create a strong password"
          required
        />

        {error && (
          <p role="alert" className="text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating account..." : "Register"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-blue-600">
          Sign in
        </Link>
      </p>
    </>
  );
}