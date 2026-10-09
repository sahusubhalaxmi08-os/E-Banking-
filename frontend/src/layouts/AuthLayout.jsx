import { Link, Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center">
          <span className="text-3xl font-extrabold text-slate-900">
            Secure<span className="text-blue-600">Bank</span>
          </span>
          <p className="mt-2 text-sm text-slate-500">
            Simple, secure digital banking
          </p>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Outlet />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Demonstration application — no real banking services.
        </p>
      </div>
    </div>
  );
}