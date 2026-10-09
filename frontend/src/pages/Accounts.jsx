import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";
import AccountCard from "../components/accounts/AccountCard";
import Loader from "../components/common/Loader";
import { formatCurrency } from "../utils/formatCurrency";

export default function Accounts() {
  const { accounts, totalBalance, loading, error } =
    useContext(AccountContext);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Accounts</h1>
        <p className="mt-1 text-sm text-slate-500">
          Total balance: {formatCurrency(totalBalance)}
        </p>
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      {accounts.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard key={account._id || account.id} account={account} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-white p-8 text-slate-500">
          No accounts found.
        </p>
      )}
    </div>
  );
}