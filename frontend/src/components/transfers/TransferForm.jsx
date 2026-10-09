
import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import Button from "../common/Button";
import Input from "../common/Input";
import { isValidAmount } from "../../utils/validators";

export default function TransferForm({
  accounts = [],
  onTransfer,
  submitting = false,
}) {
  const [form, setForm] = useState({
    fromAccount: "",
    beneficiaryAccount: "",
    amount: "",
    note: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  function update(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (processing || submitting) return;

    if (typeof onTransfer !== "function") {
      setError("Transfer service is not configured.");
      return;
    }

    if (!form.fromAccount) {
      setError("Please select your sender account.");
      return;
    }

    const recipient = form.beneficiaryAccount.trim();

    if (!recipient) {
      setError("Please enter the recipient account number.");
      return;
    }

    if (!isValidAmount(form.amount)) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || Math.round(amount * 100) !== amount * 100) {
      setError("Amount cannot have more than two decimal places.");
      return;
    }

    if (form.note.length > 120) {
      setError("Transfer note cannot exceed 120 characters.");
      return;
    }

    setProcessing(true);

    try {
      await onTransfer({
        fromAccount: form.fromAccount,
        beneficiaryAccount: recipient,
        amount,
        note: form.note.trim(),
      });

      setSuccess("Fund transfer completed successfully.");

      setForm({
        fromAccount: "",
        beneficiaryAccount: "",
        amount: "",
        note: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Transfer failed. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  }

  const isSubmitting = submitting || processing;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <ArrowRightLeft size={22} />
        </div>

        <div>
          <h2 className="font-bold text-slate-900">Transfer Funds</h2>
          <p className="text-sm text-slate-500">
            Enter the details to transfer funds.
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="fromAccount"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          From account
        </label>

        <select
          id="fromAccount"
          name="fromAccount"
          value={form.fromAccount}
          onChange={update}
          required
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          <option value="">Select your account</option>

          {accounts.map((account) => {
            const accountId = account._id || account.id;

            if (!accountId) return null;

            return (
              <option key={accountId} value={accountId}>
                {account.accountType || "Account"} — ••••
                {String(account.accountNumber || "").slice(-4)}
              </option>
            );
          })}
        </select>

        {accounts.length === 0 && (
          <p className="mt-1 text-sm text-amber-600">
            No accounts available. Please load your bank account first.
          </p>
        )}
      </div>

      <Input
        label="Recipient account number"
        name="beneficiaryAccount"
        value={form.beneficiaryAccount}
        onChange={update}
        placeholder="Enter recipient account number"
        autoComplete="off"
        required
        disabled={isSubmitting}
      />

      <Input
        label="Amount (INR)"
        name="amount"
        type="number"
        min="0.01"
        step="0.01"
        value={form.amount}
        onChange={update}
        placeholder="0.00"
        required
        disabled={isSubmitting}
      />

      <Input
        label="Transfer note (optional)"
        name="note"
        value={form.note}
        onChange={update}
        maxLength={120}
        placeholder="e.g. Monthly payment"
        disabled={isSubmitting}
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="text-sm text-emerald-600">
          {success}
        </p>
      )}

      <p className="text-xs text-slate-500">
        Your transfer will be validated by the server. Verify the recipient
        account number before submitting.
      </p>

      <Button
        type="submit"
        disabled={isSubmitting || accounts.length === 0}
        className="w-full"
      >
        {isSubmitting ? "Processing..." : "Submit Transfer"}
      </Button>
    </form>
  );
}