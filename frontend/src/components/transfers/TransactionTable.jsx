import { formatCurrency, formatDate } from "../../utils/formatCurrency";

export default function TransactionTable({ transactions = [] }) {
  if (!transactions.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
        No transactions to display.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-650px text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-4">Transaction</th>
            <th className="px-5 py-4">Date</th>
            <th className="px-5 py-4">Reference</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Amount</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {transactions.map((transaction) => {
            const outgoing =
              transaction.type === "debit" ||
              transaction.type === "transfer" ||
              transaction.direction === "outgoing";

            return (
              <tr key={transaction._id || transaction.id}>
                <td className="px-5 py-4 font-medium text-slate-800">
                  {transaction.description || transaction.type || "Transfer"}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {formatDate(transaction.createdAt || transaction.date)}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {transaction.reference || transaction._id || "—"}
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {transaction.status || "Completed"}
                  </span>
                </td>
                <td
                  className={`px-5 py-4 text-right font-semibold ${
                    outgoing ? "text-slate-900" : "text-emerald-600"
                  }`}
                >
                  {outgoing ? "−" : "+"}
                  {formatCurrency(
                    transaction.amount,
                    transaction.currency || "INR"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}