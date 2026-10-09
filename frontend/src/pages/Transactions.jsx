import { useContext, useMemo, useState } from "react";
import { AccountContext } from "../context/AccountContext";
import TransactionTable from "../components/transfers/TransactionTable"
import Input from "../components/common/Input";

export default function Transactions() {
  const { transactions, loading, error } = useContext(AccountContext);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return transactions.filter((item) =>
      [
        item.description,
        item.type,
        item.reference,
        item.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [transactions, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search your available transaction records.
        </p>
      </div>

      <div className="max-w-sm">
        <Input
          label="Search transactions"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Description, reference, status..."
        />
      </div>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Loading transactions...</p>
      ) : (
        <TransactionTable transactions={filtered} />
      )}
    </div>
  );
}