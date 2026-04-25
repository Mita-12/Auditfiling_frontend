// import { Outlet, NavLink } from "react-router-dom";
// import {
//   Building2,
//   FileText,
//   CheckCircle,
//   CreditCard,
//   MessageSquare,
//   LayoutDashboard,
//   LogOut,
//   User,
//   Bell,
//   Menu,
//   X,
// } from "lucide-react";
// import { useState, useEffect } from "react";

// export default function UserLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Get user data from sessionStorage (not localStorage)
//     const userStr = sessionStorage.getItem("user");
//     if (userStr) {
//       try {
//         const userData = JSON.parse(userStr);
//         setUser(userData);
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//       }
//     }
//   }, []);

//   const menuItems = [
//     {
//       name: "Profile",
//       icon: User,
//       path: "/user/profile",
//     },
//     {
//       name: "Company Details",
//       icon: Building2,
//       path: "/user/company-details",
//     },
//     {
//       name: "Service Requests",
//       icon: FileText,
//       path: "/user/service-requests",
//     },
//     {
//       name: "Completed Services",
//       icon: CheckCircle,
//       path: "/user/completed-services",
//     },
//     {
//       name: "Payment History",
//       icon: CreditCard,
//       path: "/user/payment-history",
//     },
//     {
//       name: "Feedback",
//       icon: MessageSquare,
//       path: "/user/feedback",
//     },
//        {
//       name: "services",
//       icon: MessageSquare,
//       path: "/user/service",
//     },
//         {
//       name: "subscription",
//       icon: MessageSquare,
//       path: "/user/subscription",
//     },
//   ];

//   const handleLogout = () => {
//     // Clear session storage
//     sessionStorage.removeItem("user");
//     sessionStorage.removeItem("token");
//     // Redirect to login page
//     window.location.href = "/userlogin";
//   };

//   return (
//     <div className="min-h-screen flex bg-slate-100">
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:sticky top-0 left-0 z-50 w-72 h-screen overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl transform transition-transform duration-300 ${
//           sidebarOpen
//             ? "translate-x-0"
//             : "-translate-x-full lg:translate-x-0"
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Sidebar Top */}
//           <div>
//             {/* Logo / Title */}
//             <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-700">
//               <div>
//                 <h2 className="text-xl font-bold  text-white">
//                   User Panel
//                 </h2>
           
//               </div>

//               <button
//                 className="lg:hidden text-slate-300 hover:text-white"
//                 onClick={() => setSidebarOpen(false)}
//               >
//                 <X size={22} />
//               </button>
//             </div>

//             {/* Navigation */}
//             <nav className="p-3 space-y-2">
//               {menuItems.map((item, index) => {
//                 const Icon = item.icon;

//                 return (
//                   <NavLink
//                     key={index}
//                     to={item.path}
//                     onClick={() => setSidebarOpen(false)}
//                     className={({ isActive }) =>
//                       `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
//                         isActive
//                           ? "bg-blue-600 text-white shadow-lg"
//                           : "text-slate-300 hover:bg-slate-700 hover:text-white"
//                       }`
//                     }
//                   >
//                     <Icon size={20} />
//                     <span className="font-medium">{item.name}</span>
//                   </NavLink>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Logout Button */}
//           <div className="mt-auto p-4 border-t border-slate-700 bg-slate-900 sticky bottom-0">
//             <button 
//               onClick={handleLogout}
//               className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 transition-all duration-300 font-medium text-white"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col min-h-screen">
//         {/* Header */}
//         <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
//           <div className="flex items-center gap-4">
//             <button
//               className="lg:hidden text-slate-700"
//               onClick={() => setSidebarOpen(true)}
//             >
//               <Menu size={26} />
//             </button>

//             <div>
//               <h1 className="text-2xl font-bold text-slate-800">
//                 User Dashboard
//               </h1>
//               <p className="text-sm text-slate-500">
//                 Welcome back to your dashboard
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Notification */}
//             <button className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-300">
//               <Bell size={20} className="text-slate-700" />
//               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
//             </button>

//             {/* Profile */}
//             <div className="hidden sm:flex items-center gap-3 bg-slate-100 rounded-xl px-3 py-1">
//               <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
//                 <User size={20} className="text-blue-600" />
//               </div>

//               <div>
//                 <p className="font-semibold text-slate-800 text-sm">
//                   {user?.full_name || "Loading..."}
//                 </p>
//                 {/* <p className="text-xs text-slate-500">
//                   {user?.role || "User"} Account
//                 </p> */}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-4 overflow-y-auto">
//           <div className="bg-white rounded-lg shadow-sm min-h-full p-4">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Building2,
  FileText,
  CheckCircle,
  CreditCard,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  User,
  Bell,
  Menu,
  X,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Settings,
  DollarSign,
  ClipboardList,
  Truck,
  BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";

export default function RoleBasedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from sessionStorage
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Redirect if no user or invalid role
        if (!userData || !userData.role) {
          navigate("/userlogin");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/userlogin");
      }
    } else {
      navigate("/userlogin");
    }
  }, [navigate]);

  // Menu items based on role
  const getMenuItems = () => {
    const role = user?.role || "customer";
    
    const commonItems = [
      {
        name: "Profile",
        icon: User,
        path: `/${role}/profile`,
      },
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: `/${role}/dashboard`,
      },
    ];

    const roleSpecificItems = {
      customer: [
        {
          name: "Service Requests",
          icon: FileText,
          path: "/user/service-requests",
        },
        {
          name: "Completed Services",
          icon: CheckCircle,
          path: "/user/completed-services",
        },
        {
          name: "Payment History",
          icon: CreditCard,
          path: "/user/payment-history",
        },
        {
          name: "Feedback",
          icon: MessageSquare,
          path: "/user/feedback",
        },
        {
          name: "Services",
          icon: Building2,
          path: "/user/service",
        },
        {
          name: "Subscription",
          icon: Calendar,
          path: "/user/subscription",
        },
      ],
      reseller: [
        {
          name: "Commission",
          icon: TrendingUp,
          path: "/reseller/commission",
        },
        {
          name: "My Customers",
          icon: Users,
          path: "/reseller/customers",
        },
        {
          name: "Sales Report",
          icon: BarChart3,
          path: "/reseller/sales",
        },
        {
          name: "Payout History",
          icon: DollarSign,
          path: "/reseller/payouts",
        },
        {
          name: "Affiliate Link",
          icon: ClipboardList,
          path: "/reseller/affiliate",
        },
        {
          name: "Support",
          icon: MessageSquare,
          path: "/reseller/support",
        },
      ],
      service_provider: [
        {
          name: "Assigned Services",
          icon: ClipboardList,
          path: "/provider/assigned-services",
        },
        {
          name: "Completed Services",
          icon: CheckCircle,
          path: "/provider/completed-services",
        },
        {
          name: "Today's Schedule",
          icon: Calendar,
          path: "/provider/schedule",
        },
        {
          name: "Earnings",
          icon: DollarSign,
          path: "/provider/earnings",
        },
        {
          name: "Service History",
          icon: FileText,
          path: "/provider/history",
        },
        {
          name: "Ratings",
          icon: Star,
          path: "/provider/ratings",
        },
        {
          name: "Settings",
          icon: Settings,
          path: "/provider/settings",
        },
      ],
    };

    return [...commonItems, ...(roleSpecificItems[role] || [])];
  };

  const handleLogout = () => {
    // Clear all storage
    sessionStorage.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Clear axios defaults if using
    delete window.axios?.defaults?.headers?.common["Authorization"];
    
    // Redirect to login
    navigate("/userlogin");
  };

  const getRoleTitle = () => {
    const role = user?.role;
    switch(role) {
      case "reseller": return "Reseller Panel";
      case "service_provider": return "Service Provider Panel";
      default: return "Customer Panel";
    }
  };

  const getRoleColor = () => {
    const role = user?.role;
    switch(role) {
      case "reseller": return "from-purple-900 to-purple-800";
      case "service_provider": return "from-green-900 to-green-800";
      default: return "from-slate-900 to-slate-800";
    }
  };

  const getAccentColor = () => {
    const role = user?.role;
    switch(role) {
      case "reseller": return "purple";
      case "service_provider": return "green";
      default: return "blue";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const accentColor = getAccentColor();
  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-72 h-screen overflow-y-auto bg-gradient-to-b ${getRoleColor()} text-white shadow-xl transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Top */}
          <div>
            {/* Logo / Title */}
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {getRoleTitle()}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  {user?.email || user?.phone}
                </p>
              </div>

              <button
                className="lg:hidden text-slate-300 hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            {/* User Info Card */}
            <div className="m-4 p-3 bg-white/10 rounded-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  {user?.photo ? (
                    <img src={user.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={24} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-xs text-slate-300 capitalize">
                    {user?.role?.replace("_", " ") || "Customer"}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="px-3 space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? `bg-${accentColor}-600 text-white shadow-lg`
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="mt-auto p-4 border-t border-slate-700 bg-slate-900/50 sticky bottom-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 transition-all duration-300 font-medium text-white"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-slate-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={26} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome, {user?.full_name?.split(" ")[0] || "User"}!
              </h1>
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString("en-US", { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification */}
            <button className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-all duration-300">
              <Bell size={20} className="text-slate-700" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-100 rounded-xl px-3 py-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                {user?.photo ? (
                  <img src={user.photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={20} className="text-blue-600" />
                )}
              </div>

              <div>
                <p className="font-semibold text-slate-800 text-sm">
                  {user?.full_name || "User"}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role?.replace("_", " ") || "Customer"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}