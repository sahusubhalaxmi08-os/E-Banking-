
import { UserRound, Plus } from "lucide-react";
import Button from "../common/Button";

export default function BeneficiaryList({
  beneficiaries = [],
  onAdd,
}) {
  const safeBeneficiaries = Array.isArray(beneficiaries)
    ? beneficiaries
    : [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-bold text-slate-900">
          Saved Beneficiaries
        </h2>

        <Button onClick={onAdd}>
          <Plus size={17} className="mr-1" />
          Add
        </Button>
      </div>

      {safeBeneficiaries.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No beneficiaries added yet.
        </p>
      ) : (
        <div className="space-y-3">
          {safeBeneficiaries.map((person) => (
            <div
              key={person._id || person.id || person.accountNumber}
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
            >
              <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                <UserRound size={20} />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-slate-800">
                  {person.name || "Unnamed beneficiary"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Account ••••{" "}
                  {String(person.accountNumber || "").slice(-4) || "----"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}