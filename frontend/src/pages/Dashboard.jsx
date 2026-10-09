import {
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import SummaryCard from "../components/dashboard/SummaryCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import AccountCard from "../components/accounts/AccountCard";
import Loader from "../components/common/Loader";
import { formatCurrency } from "../utils/formatCurrency";
import { useContext } from "react";
import { AccountContext } from "../context/AccountContext";

export default function Dashboard() {
  const { accounts, transactions, totalBalance, loading, error } =
    useContext(AccountContext);

  if (loading) return <Loader message="Loading dashboard..." />;

  const incoming = transactions
    .filter((item) => item.type === "credit")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's an overview of your banking activity.
        </p>
      </section>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          icon={Wallet}
          description="Across loaded accounts"
          color="blue"
        />
        <SummaryCard
          title="Accounts"
          value={accounts.length}
          icon={CreditCard}
          description="Your linked accounts"
          color="purple"
        />
        <SummaryCard
          title="Transactions"
          value={transactions.length}
          icon={ArrowLeftRight}
          description="Loaded transaction records"
          color="orange"
        />
        <SummaryCard
          title="Incoming Credits"
          value={formatCurrency(incoming)}
          icon={TrendingUp}
          description="From loaded records"
          color="green"
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">My Accounts</h2>
          <Link to="/accounts" className="text-sm font-semibold text-blue-600">
            View accounts
          </Link>
        </div>

        {accounts.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {accounts.slice(0, 3).map((account) => (
              <AccountCard key={account._id || account.id} account={account} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No accounts returned by the server.
          </div>
        )}
      </section>

      <RecentTransactions transactions={transactions} />
    </div>
  );
}