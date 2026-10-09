import { Bell, CheckCircle2 } from "lucide-react";
import { formatDate } from "../../utils/formatCurrency";

export default function NotificationList({ notifications = [] }) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <Bell className="mx-auto mb-3 text-slate-400" size={28} />
        <p className="text-sm text-slate-500">You're all caught up.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {notifications.map((item) => (
        <article
          key={item._id || item.id}
          className="flex gap-3 p-5"
        >
          <CheckCircle2
            size={21}
            className="mt-0.5 shrink-0 text-blue-600"
          />
          <div>
            <h3 className="font-semibold text-slate-800">
              {item.title || "Account notification"}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {item.message || item.description}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              {formatDate(item.createdAt || item.date)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}