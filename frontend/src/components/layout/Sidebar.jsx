
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  History,
  Users,
  CreditCard,
  UserRound,
  Bell,
  X,
  HandCoins,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/accounts", label: "My Accounts", icon: Wallet },
  { to: "/deposit", label: "Deposit Money", icon: HandCoins },
  { to: "/transfers", label: "Fund Transfer", icon: ArrowLeftRight },
  { to: "/transactions", label: "Transactions", icon: History },
  { to: "/beneficiaries", label: "Beneficiaries", icon: Users },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/profile", label: "My Profile", icon: UserRound },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          aria-label="Close navigation overlay"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div>
            <p className="text-xl font-bold tracking-wide">
              Secure<span className="text-blue-400">Bank</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Digital banking
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4 text-xs text-slate-400">
          E-Banking Management System
          <br />
          Portfolio demonstration
        </div>
      </aside>
    </>
  );
}
