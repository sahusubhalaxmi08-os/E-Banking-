import { useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

export default function ProfileForm({ user, onSave }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    setMessage("");

    try {
      await onSave({ name, email });
      setMessage("Profile update submitted.");
    } catch (err) {
      setMessage(err.message || "Unable to update profile.");
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl space-y-5">
      <Input
        label="Full name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Email address"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {message && <p role="status" className="text-sm text-slate-600">{message}</p>}

      <Button type="submit">Save Changes</Button>
    </form>
  );
}