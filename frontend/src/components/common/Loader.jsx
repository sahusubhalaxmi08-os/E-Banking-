export default function Loader({ message = "Loading..." }) {
  return (
    <div
      className="flex min-h-40 flex-col items-center justify-center gap-3"
      role="status"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}