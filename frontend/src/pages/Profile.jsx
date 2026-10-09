import { useState } from "react";
import useAuth from "../hooks/useAuth";
import ProfileForm from "../components/profile/ProfileForm";
import api from "../services/api";
import Button from "../components/common/Button";

export default function Profile() {
  const { user, logout } = useAuth();
  const [error, setError] = useState("");

  async function saveProfile(form) {
    try {
      const { data } = await api.patch("/auth/me", form);

      // Update profile through your authentication context when
      // the backend returns the updated user.
      if (!data.user) {
        setError("The server did not return the updated user profile.");
      } else {
        setError("");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Profile update endpoint unavailable."
      );
      throw err;
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your customer information.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <ProfileForm user={user} onSave={saveProfile} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-bold text-slate-900">Account session</h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign out of the current session.
        </p>
        <Button
          variant="danger"
          className="mt-4"
          onClick={logout}
        >
          Log Out
        </Button>
      </section>
    </div>
  );
}