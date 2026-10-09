
import { Banknote, ShieldCheck } from "lucide-react";
import useAuth from "../hooks/useAuth";
import BankCard from "../components/cards/BankCard";
import { useAccounts } from "../context/AccountContext";

export default function Cards() {
  const { user } = useAuth();
  const { accounts } = useAccounts();

  // Show a login message if no user is logged in.
  if (!user) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold">My Cards</h1>
        <p className="mt-2 text-slate-600">
          Please log in to view your card information.
        </p>
      </div>
    );
  }

  // Get the logged-in user's account number.
  const accountNumber = accounts[0]?.accountNumber || "";

  // Display a personalized card preview.
  const userCard = {
    id: user.id || user._id || user.email,
    holderName: user.name || "Account Holder",
    last4: accountNumber ? accountNumber.slice(-4) : "----",
    status: "Not Issued",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Cards</h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome, {user.name || "Customer"}. Manage your card information.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <BankCard key={userCard.id} card={userCard} />
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            className="mt-1 text-blue-700"
            size={22}
          />

          <div>
            <h2 className="font-semibold text-blue-950">
              Your Card Information
            </h2>

            <p className="mt-1 text-sm text-blue-800">
              This is a personalized preview for{" "}
              {user.name || "the logged-in customer"}. The last four digits
              shown are from your bank account number, not a real debit card
              number. A real card will appear only after your backend issues
              one for this user.
            </p>
          </div>

          <Banknote
            className="ml-auto hidden text-blue-700 sm:block"
            size={25}
          />
        </div>
      </div>
    </div>
  );
}
