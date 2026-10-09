import { CreditCard, Wifi } from "lucide-react";

export default function BankCard({ card }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950 via-blue-900 to-blue-600 p-6 text-white shadow-lg">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-25px border-white/5" />

      <div className="relative flex items-center justify-between">
        <span className="text-lg font-bold">SecureBank</span>
        <Wifi className="rotate-90" size={24} />
      </div>

      <CreditCard className="relative mt-8" size={34} />

      <p className="relative mt-4 text-lg tracking-[0.2em]">
        •••• •••• •••• {String(card.last4 || "0000").slice(-4)}
      </p>

      <div className="relative mt-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs text-blue-200">CARDHOLDER</p>
          <p className="mt-1 text-sm font-semibold uppercase">
            {card.holderName || "Demo Customer"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-200">STATUS</p>
          <p className="mt-1 text-sm font-semibold">
            {card.status || "Active"}
          </p>
        </div>
      </div>
    </div>
  );
}