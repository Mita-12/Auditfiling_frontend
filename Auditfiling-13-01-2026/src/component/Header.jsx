// import React, { useState, useEffect,useRef } from "react";
// import { TiMail } from "react-icons/ti";
// import { MdAddIcCall } from "react-icons/md";
// import { FaUser, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import LoginForm from "../form/LoginForm";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// const MySwal = withReactContent(Swal);

// // ================== NAVBAR ==================
// function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);

//   const DropdownItem = ({ label, onClick }) => (
//     <button
//       onClick={onClick}
//       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//     >
//       {label}
//     </button>
//   );

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // ---------------- Load user safely ----------------
//   useEffect(() => {
//     const loadUser = () => {
//       const savedUser = sessionStorage.getItem("user_name");
//       if (savedUser) {
//         const isJSON = savedUser.startsWith("{") || savedUser.startsWith("[");
//         const userData = isJSON ? JSON.parse(savedUser) : { user_name: savedUser };
//         setUser(userData);
//       }
//     };
//     loadUser();
//   }, []);


//   // ---------------- Listen for user updates ----------------
//   useEffect(() => {
//     const handleUserUpdate = () => {
//       const savedUser = sessionStorage.getItem("user") || sessionStorage.getItem("user_name");
//       if (savedUser) {
//         try {
//           setUser(JSON.parse(savedUser));
//         } catch {
//           setUser({ user_name: savedUser });
//         }
//       } else {
//         setUser(null);
//       }
//     };

//     window.addEventListener("storage", handleUserUpdate);
//     window.addEventListener("userUpdated", handleUserUpdate);

//     return () => {
//       window.removeEventListener("storage", handleUserUpdate);
//       window.removeEventListener("userUpdated", handleUserUpdate);
//     };
//   }, []);

//   // ---------------- Logout with SweetAlert2 ----------------
//   const handleLogout = () => {
//     MySwal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, logout",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         sessionStorage.removeItem("user");
//         sessionStorage.removeItem("user_name");
//         localStorage.removeItem("token");
//         sessionStorage.removeItem("token");
//         setUser(null);
//         setDropdownOpen(false);
//         window.dispatchEvent(new Event("storage"));
//         window.dispatchEvent(new Event("userUpdated"));
//         navigate("/");
//         MySwal.fire({
//           title: "Logged Out!",
//           text: "You have been successfully logged out.",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     });
//   };

//   // ---------------- Fixed Login handler ----------------
//   const handleLogin = (userData) => {
//     const displayUser = userData || {};
//     setUser(displayUser);

//     window.dispatchEvent(new Event("storage"));
//     window.dispatchEvent(new Event("userUpdated"));
//     navigate("/");
//     setShowLogin(false);

//     let displayName = "User";
//     if (displayUser?.name) {
//       displayName = displayUser.name;
//     } else if (displayUser?.user_name) {
//       displayName = displayUser.user_name.includes("@")
//         ? displayUser.user_name.split("@")[0]
//         : displayUser.user_name;
//     } else if (displayUser?.email) {
//       displayName = displayUser.email.split("@")[0];
//     }

//     MySwal.fire({
//       title: `Welcome, ${displayName}!`,
//       icon: "success",
//       timer: 90000,
//       showConfirmButton: false,
//     });
//   };

//   // Handle navigation for dropdown items
//   const handleNavigation = (path) => {
//     navigate(path);
//     setDropdownOpen(false);
//     setMenuOpen(false);
//   };

//   // Handle dropdown toggle
//   const handleDropdownToggle = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   return (
//    <header className="top-0 w-full bg-blue-100 shadow-sm py-3 z-50 relative">
//   <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
//     {/* Logo */}
//     <div className="flex items-center gap-2 w-full md:w-auto justify-between">
//       <div className="flex items-center gap-2">
//         <a href="/">
//           <img src="/img/auditfile_logo1.png" alt="Logo" className="w-45 h-auto"/>
//         </a>
//         {/* <a href="/" className="text-blue-950 text-xl sm:text-2xl md:text-3xl font-medium font-serif">
//           Auditfiling
//         </a> */}
//       </div>

//       {/* Mobile menu button */}
//       <button
//         className="md:hidden text-gray-700 p-2"
//         onClick={() => setMenuOpen(!menuOpen)}
//         aria-label="Toggle menu"
//       >
//         {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//       </button>
//     </div>

//     {/* Menu + Contact */}
//     <div
//       className={`${menuOpen ? "flex" : "hidden md:flex"
//         } flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full md:w-auto mt-4 md:mt-0 bg-white md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none shadow-md md:shadow-none`}
//     >
//       {/* Social Icons */}
//       <div className="flex flex-wrap items-center justify-center gap-3 md:gap-2 mt-2 md:mt-0">
//         {/* Facebook */}
//         <a
//           href="https://www.facebook.com/people/AuditFiling/61585627923484/"
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="Facebook"
//           className="p-2 rounded-full bg-gray-100 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-transform"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//             <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.99 3.66 9.13 8.44 9.88v-6.99H8.06v-2.89h2.24V9.62c0-2.21 1.32-3.43 3.34-3.43.97 0 1.98.17 1.98.17v2.18h-1.12c-1.1 0-1.44.68-1.44 1.38v1.66h2.45l-.39 2.89h-2.06V22c4.78-.75 8.44-4.89 8.44-9.93z" />
//           </svg>
//         </a>

//         {/* Instagram */}
//         <a
//           href="https://www.instagram.com/auditfiling.official/"
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="Instagram"
//           className="p-2 rounded-full bg-gray-100 text-pink-500 hover:bg-pink-100 hover:scale-110 transition-transform"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//             <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5c0 3.3-2.45 5.75-5.75 5.75h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 1.5C5.68 3.5 4 5.18 4 7.25v8.5C4 18.32 5.68 20 7.75 20h8.5c2.07 0 3.75-1.68 3.75-3.75v-8.5C20 5.68 18.32 4 16.25 4h-8.5zm8.75 2a1 1 0 110 2 1 1 0 010-2zm-4.25 1.25a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 1.5a4 4 0 100 8 4 4 0 000-8z" />
//           </svg>
//         </a>

//         {/* LinkedIn */}
//         <a
//           href="https://www.linkedin.com/company/auditfilling/?viewAsMember=true"
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="LinkedIn"
//           className="p-2 rounded-full bg-gray-100 text-blue-700 hover:bg-blue-200 hover:scale-110 transition-transform"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//             <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M8.34 17V10.67H5.67V17H8.34M7 9.5A1.34 1.34 0 1 0 7 6.83A1.34 1.34 0 0 0 7 9.5M18.33 17V13.33C18.33 11.1 16.87 9.83 15 9.83C13.9 9.83 13.1 10.4 12.76 11H12.67V10.67H10V17H12.67V13.67C12.67 12.8 13.33 12.17 14.17 12.17C15 12.17 15.67 12.83 15.67 13.67V17H18.33Z" />
//           </svg>
//         </a>

//         {/* YouTube */}
//         <a
//           href="https://www.youtube.com/@AuditfilingIndia"
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label="YouTube"
//           className="p-2 rounded-full bg-gray-100 text-red-600 hover:bg-red-100 hover:scale-110 transition-transform"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
//             <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.77 3.5 12 3.5 12 3.5s-7.77 0-9.38.58A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12C4.23 20.5 12 20.5 12 20.5s7.77 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.9 31.9 0 0 0 24 12a31.9 31.9 0 0 0-.5-5.8zM9.8 15.5V8.5L16.2 12l-6.4 3.5z" />
//           </svg>
//         </a>
//       </div>

//       {/* User Dropdown or Login */}
//       {user ? (
//         <div ref={dropdownRef} className="relative flex justify-center md:justify-start">
//           <button 
//             className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 transition-colors w-full md:w-auto justify-center text-sm md:text-base"
//             onClick={handleDropdownToggle}
//           >
//             <FaUser className="w-4 h-4" />
//             <span>
//               {(() => {
//                 const email =
//                   typeof user === "string"
//                     ? user
//                     : user?.email || user?.user_name || "";
//                 if (!email) return "User";
//                 if (email.includes("@")) {
//                   const namePart = email.split("@")[0];
//                   return namePart.slice(0, 5);
//                 }
//                 return email.slice(0, 5);
//               })()}
//             </span>
//           </button>

//           {/* Dropdown Menu */}
//           <div className={`
//             absolute top-full left-1/2 transform -translate-x-1/2 md:transform-none md:left-0 mt-3 w-48 bg-white rounded-xl ml-10 shadow-lg py-2 z-50 border border-gray-100
//             ${dropdownOpen ? 'block' : 'hidden'}
//           `}>
//             <button
//               onClick={() => handleNavigation("/profile")}
//               className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
//             >
//               👤 Profile
//             </button>

//             <button
//               onClick={() => handleNavigation("/company-details")}
//               className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
//             >
//               🏢 Company Details
//             </button>

//             <button
//               onClick={() => handleNavigation("/myrequests")}
//               className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
//             >
//               📋 My Request
//             </button>

//             <button
//               onClick={() => handleNavigation("/completed-services")}
//               className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
//             >
//               ✅ Completed Service
//             </button>

//             <button
//               onClick={() => handleNavigation("/payment-history")}
//               className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
//             >
//               💳 Payment History
//             </button>

//             <button
//               onClick={() => handleNavigation("/feedback")}
//               className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
//             >
//               💬 Feedback
//             </button>

//             <div className="border-t border-gray-200 my-1"></div>
//             <button
//               onClick={handleLogout}
//               className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
//             >
//               🚪 Logout
//             </button>
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={() => setShowLogin(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors w-full md:w-auto justify-center text-sm md:text-base"
//         >
//           <FaUser className="w-4 h-4" />
//           <span>SignIn</span>
//         </button>
//       )}
//     </div>
//   </div>

//   {showLogin && (
//     <LoginForm isOpen={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={handleLogin} />
//   )}
// </header>
//   );
// }
// // ================== HEADER ==================
// function Header() {
//   const [menus, setMenus] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileSubmenu, setMobileSubmenu] = useState(null);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const location = useLocation();

//   useEffect(() => {
//     async function fetchMenus() {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/web/menu`);
//         const data = await response.json();
//         let menusData = Array.isArray(data) ? data : data.menus || [];
//         setMenus(menusData);
//       } catch (error) {
//         console.error("Error fetching menus:", error);
//         setMenus([{ id: "blog", name: "Blog", services: [] }]);
//       }
//     }
//     fetchMenus();
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 10);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Function to determine if a menu is active based on current path
//   const isMenuActive = (menuName) => {
//     const currentPath = location.pathname;
//     const normalizedMenu = (menuName || "").toString().trim().toLowerCase();

//     switch (normalizedMenu) {
//       case "income tax":
//         return currentPath === "/income-tax";
//       case "gst":
//         return currentPath === "/gst";
//       case "startup registrations":
//       case "startup":
//         return currentPath === "/startup-registrations";
//       case "company(mca)":
//         return currentPath === "/company";
//       case "legal":
//         return currentPath === "/legal";
//       case "bank valuation":
//         return currentPath === "/bank-valuation";
//       case "trade mark":
//       case "trademark":
//         return currentPath === "/trade-mark";
//       case "blog":
//         return currentPath === "/blog";
//       default:
//         return false;
//     }
//   };

//   const redirectTo = (menuName, serviceName = null) => {
//     const normalizedMenu = (menuName || "").toString().trim().toLowerCase();
//     const normalizedService = (serviceName || "").toString().trim().toLowerCase();

//     let basePath = "/";

//     switch (normalizedMenu) {
//       case "income tax":
//         basePath = "/income-tax";
//         break;
//       case "gst":
//         basePath = "/gst";
//         break;
//       case "startup registrations":
//       case "startup":
//         basePath = "/startup-registrations";
//         break;
//       case "company(mca)":
//         basePath = "/company";
//         break;
//       case "legal":
//         basePath = "/legal";
//         break;
//       case "bank valuation":
//         basePath = "/bank-valuation";
//         break;
//       case "trade mark":
//       case "trademark":
//         basePath = "/trade-mark";
//         break;
//       case "blog":
//         basePath = "/blog";
//         break;
//       default:
//         basePath = "/";
//     }

//     // If service name is provided, pass it as state to show specific service content
//     if (serviceName && basePath !== "/") {
//       return {
//         pathname: basePath,
//         state: {
//           selectedService: serviceName,
//           autoScrollToService: true
//         }
//       };
//     }

//     return basePath;
//   };

//   const handleServiceClick = (menuName, serviceName) => {
//     setDropdownOpen(null);
//     setMobileOpen(false);
//     setMobileSubmenu(null);
//   };

//   // Add static Blog menu to the existing menus
//   const allMenus = [...menus, { id: "blog", name: "Blog", services: [] }];

//   return (
//     <div className={`fixed top-0 left-0 w-full z-50 transition-shadow duration-300 ${isScrolled ? "shadow-sm" : ""}`}>
//       <div className="bg-white shadow-sm">
//         <Navbar />
//       </div>

//       <header className="bg-white shadow-md transition-all duration-300">
//         <div className="container mx-auto flex justify-between md:justify-center items-center px-2 py-3 md:py-4">
//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-6 lg:gap-6 text-base lg:text-lg z-50">
//             {allMenus.map((menu) => (
//               <div key={menu.id} className="relative">
//                 <button
//                   onMouseEnter={() => setDropdownOpen(menu.id)}
//                   onClick={() => setDropdownOpen(dropdownOpen === menu.id ? null : menu.id)}
//                   className={`font-serif tracking-wide text-base lg:text-lg flex items-center gap-1 cursor-pointer transition-colors pb-1 border-b-2 border-transparent ${isMenuActive(menu.name)
//                     ? "text-blue-600 font-semibold border-blue-600"
//                     : "text-gray-700 hover:text-blue-600"
//                     }`}
//                 >
//                   <Link to={redirectTo(menu.name)}>{menu.name}</Link>
//                   {menu.services?.length > 0 && (
//                     <FaChevronDown
//                       size={10}
//                       className={`transition-transform duration-200 ${dropdownOpen === menu.id ? "rotate-180" : "rotate-0"
//                         }`}
//                     />
//                   )}
//                 </button>

//                 {menu.services?.length > 0 && (
//                   <div
//                     onMouseLeave={() => setDropdownOpen(null)}
//                     className={`absolute mt-2 bg-white text-gray-900 rounded-xl shadow-sm font-semibold p-2 lg:p-2 grid grid-cols-2 gap-2 z-50 text-[14px] lg:text-[15px] transform transition-all duration-300
//                   ${dropdownOpen === menu.id
//                         ? "opacity-100 scale-100"
//                         : "opacity-0 scale-95 pointer-events-none"
//                       }
//                 `}
//                     style={{
//                       top: "100%",
//                       left: "50%",
//                       transform: dropdownOpen === menu.id ? "translateX(-50%)" : "translateX(-50%) scale(0.95)",
//                       minWidth: "300px",
//                       maxWidth: "350px",
//                       boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
//                     }}
//                   >
//                     {menu.services.map((service) => (
//                       <Link
//                         key={service.id}
//                         to={redirectTo(menu.name, service.service_name)}
//                         state={{
//                           selectedService: service.service_name,
//                           autoScrollToService: true
//                         }}
//                         className="block text-left p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors"
//                         onClick={() => handleServiceClick(menu.name, service.service_name)}
//                       >
//                         {service.service_name}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </nav>

//           {/* Mobile menu button */}
//           <button
//             className="md:hidden text-gray-900 p-2 item- "
//             onClick={() => setMobileOpen(!mobileOpen)}
//             aria-label="Toggle navigation menu"
//           >
//             {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
//           </button>
//         </div>

//         {/* Mobile Navigation Menu */}
//         {mobileOpen && (
//           <div className="md:hidden bg-white shadow-sm px-4 py-3 transition-all duration-300 max-h-[70vh] overflow-y-auto">
//             <ul className="flex flex-col gap-3 text-left">
//               {allMenus.map((menu) => (
//                 <li key={menu.id} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
//                   <button
//                     onClick={() => setMobileSubmenu(mobileSubmenu === menu.id ? null : menu.id)}
//                     className={`flex items-center justify-between w-full font-serif transition-colors py-2 pl-3 border-l-4 ${isMenuActive(menu.name)
//                       ? "text-blue-600 font-semibold border-blue-600 bg-blue-50"
//                       : "text-gray-800 hover:text-blue-600 border-transparent"
//                       }`}
//                   >
//                     <Link
//                       to={redirectTo(menu.name)}
//                       className="text-base font-medium"
//                       onClick={() => setMobileOpen(false)}
//                     >
//                       {menu.name}
//                     </Link>
//                     {menu.services?.length > 0 && (
//                       <FaChevronDown
//                         size={14}
//                         className={`transition-transform duration-200 ${mobileSubmenu === menu.id ? "rotate-180" : "rotate-0"
//                           }`}
//                       />
//                     )}
//                   </button>

//                   {mobileSubmenu === menu.id && menu.services?.length > 0 && (
//                     <ul className="pl-4 list-none mt-2 flex flex-col gap-2 text-sm text-left border-l-2 border-blue-200 ml-2">
//                       {menu.services.map((service) => (
//                         <li key={service.id}>
//                           <Link
//                             to={redirectTo(menu.name, service.service_name)}
//                             state={{
//                               selectedService: service.service_name,
//                               autoScrollToService: true
//                             }}
//                             className="block hover:text-blue-600 text-left py-2 transition-colors"
//                             onClick={() => {
//                               setMobileOpen(false);
//                               setMobileSubmenu(null);
//                             }}
//                           >
//                             {service.service_name}
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </header>
//     </div>
//   );
// }
// export default Header;

import React, { useState, useEffect, useRef } from "react";
import { TiMail } from "react-icons/ti";
import { MdAddIcCall } from "react-icons/md";
import { FaUser, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "../form/LoginForm";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// ================== NAVBAR ==================
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const DropdownItem = ({ label, onClick }) => (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {label}
    </button>
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ---------------- Load user safely ----------------
  useEffect(() => {
    const loadUser = () => {
      const savedUser = sessionStorage.getItem("user_name");
      if (savedUser) {
        const isJSON = savedUser.startsWith("{") || savedUser.startsWith("[");
        const userData = isJSON ? JSON.parse(savedUser) : { user_name: savedUser };
        setUser(userData);
      }
    };
    loadUser();
  }, []);


  // ---------------- Listen for user updates ----------------
  useEffect(() => {
    const handleUserUpdate = () => {
      const savedUser = sessionStorage.getItem("user") || sessionStorage.getItem("user_name");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser({ user_name: savedUser });
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleUserUpdate);
    window.addEventListener("userUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("storage", handleUserUpdate);
      window.removeEventListener("userUpdated", handleUserUpdate);
    };
  }, []);

  // ---------------- Logout with SweetAlert2 ----------------
  const handleLogout = () => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("user_name");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
        setDropdownOpen(false);
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new Event("userUpdated"));
        navigate("/");
        MySwal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  // ---------------- Fixed Login handler ----------------
  const handleLogin = (userData) => {
    const displayUser = userData || {};
    setUser(displayUser);

    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/");
    setShowLogin(false);

    let displayName = "User";
    if (displayUser?.name) {
      displayName = displayUser.name;
    } else if (displayUser?.user_name) {
      displayName = displayUser.user_name.includes("@")
        ? displayUser.user_name.split("@")[0]
        : displayUser.user_name;
    } else if (displayUser?.email) {
      displayName = displayUser.email.split("@")[0];
    }

    MySwal.fire({
      title: `Welcome, ${displayName}!`,
      icon: "success",
      timer: 90000,
      showConfirmButton: false,
    });
  };

  // Handle navigation for dropdown items
  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  // Handle dropdown toggle
  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="top-0 w-full bg-blue-100 shadow-sm py-3 z-50 relative">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2">
            <a href="/">
              <img src="/img/auditfile_logo1.png" alt="Logo" className="w-45 h-auto" />
            </a>        
             {/* <a href="/" className="text-blue-950 text-xl sm:text-2xl md:text-3xl font-medium font-serif">
        Auditfiling         </a> */}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Menu + Contact */}
        <div
          className={`${menuOpen ? "flex" : "hidden md:flex"
            } flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full md:w-auto mt-4 md:mt-0 bg-white md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none shadow-md md:shadow-none`}
        >
          {/* Social Icons */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-2 mt-2 md:mt-0">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/people/AuditFiling/100075888295123/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 rounded-full bg-gray-100 text-blue-600 hover:bg-blue-100 hover:scale-110 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.99 3.66 9.13 8.44 9.88v-6.99H8.06v-2.89h2.24V9.62c0-2.21 1.32-3.43 3.34-3.43.97 0 1.98.17 1.98.17v2.18h-1.12c-1.1 0-1.44.68-1.44 1.38v1.66h2.45l-.39 2.89h-2.06V22c4.78-.75 8.44-4.89 8.44-9.93z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/auditfiling.official/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full bg-gray-100 text-pink-500 hover:bg-pink-100 hover:scale-110 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M7.75 2h8.5C19.55 2 22 4.45 22 7.75v8.5c0 3.3-2.45 5.75-5.75 5.75h-8.5C4.45 22 2 19.55 2 16.25v-8.5C2 4.45 4.45 2 7.75 2zm0 1.5C5.68 3.5 4 5.18 4 7.25v8.5C4 18.32 5.68 20 7.75 20h8.5c2.07 0 3.75-1.68 3.75-3.75v-8.5C20 5.68 18.32 4 16.25 4h-8.5zm8.75 2a1 1 0 110 2 1 1 0 010-2zm-4.25 1.25a5.5 5.5 0 110 11 5.5 5.5 0 010-11zm0 1.5a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/auditfilling/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="p-2 rounded-full bg-gray-100 text-blue-700 hover:bg-blue-200 hover:scale-110 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M8.34 17V10.67H5.67V17H8.34M7 9.5A1.34 1.34 0 1 0 7 6.83A1.34 1.34 0 0 0 7 9.5M18.33 17V13.33C18.33 11.1 16.87 9.83 15 9.83C13.9 9.83 13.1 10.4 12.76 11H12.67V10.67H10V17H12.67V13.67C12.67 12.8 13.33 12.17 14.17 12.17C15 12.17 15.67 12.83 15.67 13.67V17H18.33Z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@AuditfilingIndia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="p-2 rounded-full bg-gray-100 text-red-600 hover:bg-red-100 hover:scale-110 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.77 3.5 12 3.5 12 3.5s-7.77 0-9.38.58A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12C4.23 20.5 12 20.5 12 20.5s7.77 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.9 31.9 0 0 0 24 12a31.9 31.9 0 0 0-.5-5.8zM9.8 15.5V8.5L16.2 12l-6.4 3.5z" />
              </svg>
            </a>
          </div>

          {/* User Dropdown or Login */}
          {user ? (
            <div ref={dropdownRef} className="relative flex justify-center md:justify-start">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 transition-colors w-full md:w-auto justify-center text-sm md:text-base"
                onClick={handleDropdownToggle}
              >
                <FaUser className="w-4 h-4" />
                <span>
                  {(() => {
                    const email =
                      typeof user === "string"
                        ? user
                        : user?.email || user?.user_name || "";
                    if (!email) return "User";
                    if (email.includes("@")) {
                      const namePart = email.split("@")[0];
                      return namePart.slice(0, 5);
                    }
                    return email.slice(0, 5);
                  })()}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className={`
            absolute top-full left-1/2 transform -translate-x-1/2 md:transform-none md:left-0 mt-3 w-48 bg-white rounded-xl ml-10 shadow-lg py-2 z-50 border border-gray-100
            ${dropdownOpen ? 'block' : 'hidden'}
          `}>
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  👤 Profile
                </button>

                <button
                  onClick={() => handleNavigation("/company-details")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  🏢 Company Details
                </button>

                <button
                  onClick={() => handleNavigation("/myrequests")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  📋 My Request
                </button>

                <button
                  onClick={() => handleNavigation("/completed-services")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  ✅ Completed Service
                </button>

                <button
                  onClick={() => handleNavigation("/payment-history")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  💳 Payment History
                </button>

                <button
                  onClick={() => handleNavigation("/feedback")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  💬 Feedback
                </button>

                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2 transition-colors duration-150"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors w-full md:w-auto justify-center text-sm md:text-base"
            >
              <FaUser className="w-4 h-4" />
              <span>SignIn</span>
            </button>
          )}
        </div>
      </div>

      {showLogin && (
        <LoginForm isOpen={showLogin} onClose={() => setShowLogin(false)} onLoginSuccess={handleLogin} />
      )}
    </header>
  );
}
// ================== HEADER ==================
function Header() {
  const [menus, setMenus] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // useEffect(() => {
  //   async function fetchMenus() {
  //     try {
  //       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/web/menu`);
  //       const data = await response.json();
  //       let menusData = Array.isArray(data) ? data : data.menus || [];
  //       setMenus(menusData);
  //     } catch (error) {
  //       console.error("Error fetching menus:", error);
  //       setMenus([{ id: "accounting", name: "Accounting service", services: [] }]);
  //     }
  //   }
  //   fetchMenus();
  // }, []);

  useEffect(() => {
    async function fetchMenus() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/web/menu`);
        const data = await response.json();
        let menusData = Array.isArray(data) ? data : data.menus || [];

        // Find the Accounting Service menu and add static Accounting Training
        const accountingMenu = menusData.find(menu =>
          menu.name?.toLowerCase().includes('accounting')
        );

        if (accountingMenu) {
          if (!accountingMenu.services) {
            accountingMenu.services = [];
          }

          // Add Accounting Training if it doesn't exist
          const hasTraining = accountingMenu.services.some(
            service => service.service_name?.toLowerCase().includes('accounting training')
          );

          if (!hasTraining) {
            accountingMenu.services.push({
              id: 'accounting-training-static',
              service_name: 'Accounting Training',
              is_static: true // Custom flag to identify static menu
            });
          }
        }

        setMenus(menusData);
      } catch (error) {
        console.error("Error fetching menus:", error);
        // Provide default menu with Accounting Training
        setMenus([{
          id: "accounting",
          name: "Accounting service",
          services: [
            { id: "accounting-training-static", service_name: "Accounting Training", is_static: true }
          ]
        }]);
      }
    }
    fetchMenus();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Function to determine if a menu is active based on current path
  // const isMenuActive = (menuName) => {
  //   const currentPath = location.pathname;
  //   const normalizedMenu = (menuName || "").toString().trim().toLowerCase();

  //   switch (normalizedMenu) {
  //     case "income tax":
  //       return currentPath === "/income-tax";
  //     case "gst":
  //       return currentPath === "/gst";
  //     case "startup registrations":
  //     case "startup":
  //       return currentPath === "/startup-registrations";
  //     case "company(mca)":
  //       return currentPath === "/company";
  //     case "legal":
  //       return currentPath === "/legal";
  //     case "bank valuation":
  //       return currentPath === "/bank-valuation";
  //     case "trade mark":
  //     case "trademark":
  //       return currentPath === "/trade-mark";
  //     case "accounting service":

  //       return currentPath === "/accounting-service";
  //     default:
  //       return false;
  //   }
  // };

  const isMenuActive = (menuName) => {
    const currentPath = location.pathname;
    const normalizedMenu = (menuName || "").toString().trim().toLowerCase();

    switch (normalizedMenu) {
      case "income tax":
        return currentPath === "/income-tax";
      case "gst":
        return currentPath === "/gst";
      case "startup registrations":
      case "startup":
        return currentPath === "/startup-registrations";
      case "company(mca)":
        return currentPath === "/company";
      case "legal":
        return currentPath === "/legal";
      case "bank valuation":
        return currentPath === "/bank-valuation";
      case "trade mark":
      case "trademark":
        return currentPath === "/trade-mark";
      case "accounting service":
        return currentPath === "/accounting-service" || currentPath === "/accounting-training";
      default:
        return false;
    }
  };

  // const redirectTo = (menuName, serviceName = null) => {
  //   const normalizedMenu = (menuName || "").toString().trim().toLowerCase();
  //   const normalizedService = (serviceName || "").toString().trim().toLowerCase();

  //   let basePath = "/";

  //   switch (normalizedMenu) {
  //     case "income tax":
  //       basePath = "/income-tax";
  //       break;
  //     case "gst":
  //       basePath = "/gst";
  //       break;
  //     case "startup registrations":
  //     case "startup":
  //       basePath = "/startup-registrations";
  //       break;
  //     case "company(mca)":
  //       basePath = "/company";
  //       break;
  //     case "legal":
  //       basePath = "/legal";
  //       break;
  //     case "bank valuation":
  //       basePath = "/bank-valuation";
  //       break;
  //     case "trade mark":
  //     case "trademark":
  //       basePath = "/trade-mark";
  //       break;
  //     case "accounting service":
  //       basePath = "/accounting-service";
  //       break;
  //     default:
  //       basePath = "/";
  //   }

  //   // If service name is provided, pass it as state to show specific service content
  //   if (serviceName && basePath !== "/") {
  //     return {
  //       pathname: basePath,
  //       state: {
  //         selectedService: serviceName,
  //         autoScrollToService: true
  //       }
  //     };
  //   }

  //   return basePath;
  // };
  // Update redirectTo to handle accounting training
  const redirectTo = (menuName, serviceName = null) => {
    const normalizedMenu = (menuName || "").toString().trim().toLowerCase();
    const normalizedService = (serviceName || "").toString().trim().toLowerCase();

    // Check if this is Accounting Training
    if (normalizedService.includes('accounting training')) {
      return {
        pathname: '/accounting-training',
        state: {
          selectedService: 'Accounting Training',
          autoScrollToService: true
        }
      };
    }

    let basePath = "/";

    switch (normalizedMenu) {
      case "income tax":
        basePath = "/income-tax";
        break;
      case "gst":
        basePath = "/gst";
        break;
      case "startup registrations":
      case "startup":
        basePath = "/startup-registrations";
        break;
      case "company(mca)":
        basePath = "/company";
        break;
      case "legal":
        basePath = "/legal";
        break;
      case "bank valuation":
        basePath = "/bank-valuation";
        break;
      case "trade mark":
      case "trademark":
        basePath = "/trade-mark";
        break;
      case "accounting service":
        basePath = "/accounting-service";
        break;
      default:
        basePath = "/";
    }

    if (serviceName && basePath !== "/") {
      return {
        pathname: basePath,
        state: {
          selectedService: serviceName,
          autoScrollToService: true
        }
      };
    }

    return basePath;
  };

  // const handleServiceClick = (menuName, serviceName) => {
  //   setDropdownOpen(null);
  //   setMobileOpen(false);
  //   setMobileSubmenu(null);
  // };

  const handleServiceClick = (menuName, serviceName) => {
    setDropdownOpen(null);
    setMobileOpen(false);
    setMobileSubmenu(null);
  };

  // Add static Accounting menu to the existing menus
  const allMenus = [...menus,];

  return (
    <div className={`fixed top-0 left-0 w-full z-50 transition-shadow duration-300 ${isScrolled ? "shadow-sm" : ""}`}>
      <div className="bg-white shadow-sm">
        <Navbar />
      </div>

      <header className="bg-white shadow-md transition-all duration-300">
        <div className="container mx-auto flex justify-between md:justify-center items-center px-2 py-3 md:py-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-6 text-base lg:text-lg z-50">
            {allMenus.map((menu) => (
              <div key={menu.id} className="relative">
                <button
                  onMouseEnter={() => setDropdownOpen(menu.id)}
                  onClick={() => setDropdownOpen(dropdownOpen === menu.id ? null : menu.id)}
                  className={`font-serif tracking-wide text-base lg:text-lg flex items-center gap-1 cursor-pointer transition-colors pb-1 border-b-2 border-transparent ${isMenuActive(menu.name)
                    ? "text-blue-600 font-semibold border-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                    }`}
                >
                  <Link to={redirectTo(menu.name)}>{menu.name}</Link>
                  {menu.services?.length > 0 && (
                    <FaChevronDown
                      size={10}
                      className={`transition-transform duration-200 ${dropdownOpen === menu.id ? "rotate-180" : "rotate-0"
                        }`}
                    />
                  )}
                </button>

                {menu.services?.length > 0 && (
                  <div
                    onMouseLeave={() => setDropdownOpen(null)}
                    className={`absolute mt-2 bg-white text-gray-900 rounded-xl shadow-sm font-semibold p-2 lg:p-2 grid grid-cols-2 gap-2 z-50 text-[14px] lg:text-[15px] transform transition-all duration-300
                  ${dropdownOpen === menu.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                      }
                `}
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: dropdownOpen === menu.id ? "translateX(-50%)" : "translateX(-50%) scale(0.95)",
                      minWidth: "300px",
                      maxWidth: "350px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                  >
                    {menu.services.map((service) => (
                      <Link
                        key={service.id}
                        to={redirectTo(menu.name, service.service_name)}
                        state={{
                          selectedService: service.service_name,
                          autoScrollToService: true
                        }}
                        className="block text-left p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => handleServiceClick(menu.name, service.service_name)}
                      >
                        {service.service_name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-900 p-2 item- "
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white shadow-sm px-4 py-3 transition-all duration-300 max-h-[70vh] overflow-y-auto">
            <ul className="flex flex-col gap-3 text-left">
              {allMenus.map((menu) => (
                <li key={menu.id} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
                  <button
                    onClick={() => setMobileSubmenu(mobileSubmenu === menu.id ? null : menu.id)}
                    className={`flex items-center justify-between w-full font-serif transition-colors py-2 pl-3 border-l-4 ${isMenuActive(menu.name)
                      ? "text-blue-600 font-semibold border-blue-600 bg-blue-50"
                      : "text-gray-800 hover:text-blue-600 border-transparent"
                      }`}
                  >
                    <Link
                      to={redirectTo(menu.name)}
                      className="text-base font-medium"
                      onClick={() => setMobileOpen(false)}
                    >
                      {menu.name}
                    </Link>
                    {menu.services?.length > 0 && (
                      <FaChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${mobileSubmenu === menu.id ? "rotate-180" : "rotate-0"
                          }`}
                      />
                    )}
                  </button>

                  {mobileSubmenu === menu.id && menu.services?.length > 0 && (
                    <ul className="pl-4 list-none mt-2 flex flex-col gap-2 text-sm text-left border-l-2 border-blue-200 ml-2">
                      {menu.services.map((service) => (
                        <li key={service.id}>
                          <Link
                            to={redirectTo(menu.name, service.service_name)}
                            state={{
                              selectedService: service.service_name,
                              autoScrollToService: true
                            }}
                            className="block hover:text-blue-600 text-left py-2 transition-colors"
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileSubmenu(null);
                            }}
                          >
                            {service.service_name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}
export default Header;