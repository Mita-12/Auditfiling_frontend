import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";


export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Right Section */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <AdminHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}