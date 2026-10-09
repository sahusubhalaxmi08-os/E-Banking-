
import { useCallback, useEffect, useState } from "react";

import {
  getBeneficiaries,
  addBeneficiary as createBeneficiary,
} from "../services/bankingService.js";

import BeneficiaryList from "../components/beneficiaries/BeneficiaryList";
import Modal from "../components/common/Modal";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    accountNumber: "",
  });

  const loadBeneficiaries = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getBeneficiaries();

      const list = Array.isArray(result)
        ? result
        : result?.beneficiaries;

      setBeneficiaries(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load beneficiaries. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBeneficiaries();
  }, [loadBeneficiaries]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleAddBeneficiary(event) {
    event.preventDefault();

    if (saving) return;

    setError("");

    const name = form.name.trim();
    const accountNumber = form.accountNumber.trim();

    if (!name || !accountNumber) {
      setError("Please enter the beneficiary name and account number.");
      return;
    }

    try {
      setSaving(true);

      // Send the exact field names expected by the backend.
      const payload = {
        name,
        accountNumber,
      };

      console.log("Beneficiary request payload:", payload);

      await createBeneficiary(payload);

      setForm({
        name: "",
        accountNumber: "",
      });

      setOpen(false);

      await loadBeneficiaries();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to add beneficiary. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCloseModal() {
    if (saving) return;

    setOpen(false);
    setError("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Beneficiaries</h1>

        <Button
          type="button"
          onClick={() => {
            setError("");
            setOpen(true);
          }}
        >
          Add Beneficiary
        </Button>
      </div>

      {error && !open && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}

          {!loading && (
            <button
              type="button"
              className="ml-3 font-semibold underline"
              onClick={loadBeneficiaries}
            >
              Retry
            </button>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">
          Loading beneficiaries...
        </p>
      ) : (
        <BeneficiaryList
          beneficiaries={beneficiaries}
          onAdd={() => {
            setError("");
            setOpen(true);
          }}
        />
      )}

      <Modal
        open={open}
        onClose={handleCloseModal}
        title="Add Beneficiary"
      >
        <form onSubmit={handleAddBeneficiary} className="space-y-4">
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <Input
            label="Beneficiary name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            autoComplete="name"
            required
          />

          <Input
            label="Account number"
            name="accountNumber"
            value={form.accountNumber}
            onChange={handleInputChange}
            autoComplete="off"
            required
          />

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Beneficiary"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}