export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}) {
  const inputId =
    id || props.name || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className}`}
        {...props}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}