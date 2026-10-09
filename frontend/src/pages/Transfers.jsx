
import { useContext, useState } from "react";
import TransferForm from "../components/transfers/TransferForm";
import { transferMoney } from "../services/bankingService.js";
import { AccountContext } from "../context/AccountContext";

export default function Transfers() {
  const { accounts, refreshAccounts } = useContext(AccountContext);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submitTransfer(form) {
    setSubmitting(true);
    setError("");

    try {
      await transferMoney(form);
      await refreshAccounts();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to submit transfer.";

      setError(message);
      throw new Error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fund Transfer</h1>
        <p className="mt-1 text-sm text-slate-500">
          Transfer funds using the connected banking API.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <TransferForm
        accounts={accounts}
        onTransfer={submitTransfer}
        submitting={submitting}
      />
    </div>
  );
}