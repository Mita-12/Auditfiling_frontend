import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Layers,
  ClipboardList,
  DollarSign,
  MessageSquare,
  HelpCircle,
  Phone,
  Activity,
  CreditCard,
  LogOut
} from "lucide-react";

export default function AdminSidebar() {

    const navigate = useNavigate();
 const handleLogout = () => {
    sessionStorage.removeItem("admin");
    localStorage.removeItem("admin");
    navigate("/adminlogin");
  };


  return (
    <div className="w-64 h-screen bg-gray-900 text-gray-200 flex flex-col">

      {/* Logo */}
      <div className="p-5 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* Dashboard */}
        <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          to="/admin/dashboard"
        />

        {/* Lead */}
        <SidebarItem
          icon={<Users size={18} />}
          label="Lead"
          to="/admin/leads"
        />
        <SidebarItem
          icon={<Layers size={18} />}
          label="Menu Master"
          to="/admin/menu-master"
        />
        <SidebarItem
          icon={<Layers size={18} />}
          label="Document Master" 
          to="/admin/document-master"
        />
        <SidebarItem
          icon={<Layers size={18} />} 
          label="Service Master"
          to="/admin/service-master"
        />
        <SidebarItem
          icon={<Layers size={18} />}
          label="Customer Master"
          to="/admin/customer-master"
        />
        <SidebarItem
          icon={<Layers size={18} />}
          label="Employee Master"
          to="/admin/employee-master"
        />
         <SidebarItem
          icon={<Layers size={18} />}
          label="Reseller Master"
          to="/admin/reseller-master"
        />
        <SidebarItem
          icon={<Settings size={18} />}
          label="Payment Settings"
          to="/admin/payment-settings"
        />

        <SidebarItem icon={<FileText size={18} />} label="Offers" to="/admin/offers" />
        <SidebarItem icon={<MessageSquare size={18} />} label="Feedbacks" to="/admin/feedbackpage" />
        <SidebarItem icon={<Phone size={18} />} label="Contact Us" to="/admin/contact" />
        <SidebarItem icon={<ClipboardList size={18} />} label="Our Stories" to="/admin/stories" />
        <SidebarItem icon={<HelpCircle size={18} />} label="FAQ" to="/admin/servicefaq" />
    <SidebarItem icon={<MessageSquare size={18} />} label="Notifications" to="/admin/notifications" />

  


      </div>
      <div className="p-5 border-t border-gray-700"> 
        <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button></div>
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({ icon, label, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800 cursor-pointer"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  );
}

