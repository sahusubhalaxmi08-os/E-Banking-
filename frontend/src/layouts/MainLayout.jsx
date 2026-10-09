import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-[calc(100vh-9rem)] p-4 sm:p-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}