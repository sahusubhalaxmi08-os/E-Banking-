export default function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
  color = "blue",
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            {value}
          </h3>
          <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color] || colors.blue}`}>
          {Icon && <Icon size={22} />}
        </div>
      </div>
    </div>
  );
}