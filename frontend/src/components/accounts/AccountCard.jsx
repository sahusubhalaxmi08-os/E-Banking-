import { CreditCard, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function AccountCard({ account }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 p-6 text-white shadow-md">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-white/10 p-2">
          <Wallet size={22} />
        </div>
        <CreditCard className="text-blue-200" size={25} />
      </div>

      <p className="mt-6 text-sm text-blue-100">
        {account.accountType || "Savings Account"}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {formatCurrency(account.balance, account.currency || "INR")}
      </p>

      <div className="mt-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-blue-200">Account number</p>
          <p className="mt-1 font-medium tracking-wider">
            •••• •••• {String(account.accountNumber || "").slice(-4)}
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
          {account.status || "Active"}
        </span>
      </div>
    </div>
  );
}