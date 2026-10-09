import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency, formatDate } from "../../utils/formatCurrency";

export default function RecentTransactions({ transactions = [] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-bold text-slate-900">Recent Transactions</h2>
        <Link
          to="/transactions"
          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          View all
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No transactions found.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 5).map((transaction) => {
            const outgoing =
              transaction.type === "debit" ||
              transaction.type === "transfer" ||
              transaction.direction === "outgoing";

            return (
              <div
                key={transaction._id || transaction.id}
                className="flex items-center justify-between gap-3 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      outgoing
                        ? "bg-orange-50 text-orange-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {outgoing ? (
                      <ArrowUpRight size={19} />
                    ) : (
                      <ArrowDownLeft size={19} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {transaction.description ||
                        transaction.type ||
                        "Transaction"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(transaction.createdAt || transaction.date)}
                    </p>
                  </div>
                </div>

                <p
                  className={`shrink-0 text-sm font-bold ${
                    outgoing ? "text-slate-900" : "text-emerald-600"
                  }`}
                >
                  {outgoing ? "−" : "+"}
                  {formatCurrency(
                    transaction.amount,
                    transaction.currency || "INR"
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}