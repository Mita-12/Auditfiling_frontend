import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAdmin } from "../../../hooks/useAdmin";

export default function AdminHeader() {
  const navigate = useNavigate();
  const adminData = useAdmin();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    localStorage.removeItem("admin");
    navigate("/adminlogin");
  };

  return (
    <div className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-6 relative">
      <h2 className="text-lg font-semibold text-gray-700">
        Admin Dashboard
      </h2>

      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer text-gray-600" />

        <div className="relative">
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            <User size={20} />
            <span className="text-sm font-medium">
              {adminData?.name || adminData?.username || "Admin"}
            </span>
            <ChevronDown size={16} />
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-amber-50 rounded-lg shadow-lg z-50">
              <div className="px-3 py-2 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700">
                  {adminData?.name || adminData?.username || "Admin"}
                </p>
              
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}