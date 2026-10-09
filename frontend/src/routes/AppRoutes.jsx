import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Accounts from "../pages/Accounts";
import Transfers from "../pages/Transfers";
import Transactions from "../pages/Transactions";
import Beneficiaries from "../pages/Beneficiaries";
import Cards from "../pages/Cards";
import Profile from "../pages/Profile";
import Notifications from "../pages/Notifications";
import NotFound from "../pages/NotFound";
import Deposit from "../pages/Deposit";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/deposit" element={<Deposit/>} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}