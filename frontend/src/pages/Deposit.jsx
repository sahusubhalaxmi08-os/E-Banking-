
import { useState } from "react";
import api from "../services/api";
import { useAccounts } from "../context/AccountContext";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { accounts, totalBalance, refreshAccounts } = useAccounts();

  async function handleDeposit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setError("Please enter a valid deposit amount.");
      return;
    }

    if (Math.round(value * 100) !== value * 100) {
      setError("Enter an amount with at most two decimal places.");
      return;
    }

    if (!accounts.length) {
      setError("No bank account found. Please check your account first.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/transactions/deposit", {
        amount: value,
        accountId: accounts[0]._id || accounts[0].id,
      });

      setMessage(data.message || "Deposit completed successfully.");
      setAmount("");

      // Reload the balance and transaction history.
      await refreshAccounts();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to deposit money. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Deposit Money
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a simulated deposit to your account.
        </p>
      </div>

      <div className="rounded-2xl bg-blue-600 p-6 text-white shadow">
        <p className="text-sm text-blue-100">Current Balance</p>
        <h2 className="mt-2 text-3xl font-bold">
          ₹{Number(totalBalance || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h2>
      </div>

      <form
        onSubmit={handleDeposit}
        className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="depositAmount"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Deposit Amount (₹)
          </label>

          <input
            id="depositAmount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Enter amount, e.g. 1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        {message && (
          <p role="status" className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Processing..." : "Deposit Money"}
        </button>

        <p className="text-xs text-slate-500">
          Demo deposits only. This does not transfer real money.
        </p>
      </form>
    </div>
  );
}

