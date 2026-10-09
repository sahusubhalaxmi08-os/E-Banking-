import { Bell, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <p className="font-semibold text-slate-900">Welcome back!</p>
          <p className="text-xs text-slate-500">
            Manage your finances securely.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
        >
          <Bell size={20} />
        </Link>

        <Link to="/profile" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name || "Customer"}
            </p>
            <p className="text-xs text-slate-500">Banking customer</p>
          </div>
        </Link>
      </div>
    </header>
  );
}