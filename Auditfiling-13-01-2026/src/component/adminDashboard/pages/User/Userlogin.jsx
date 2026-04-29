// // import React, { useState } from "react";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom";
// // import { Eye, EyeOff, Smartphone, Mail, Lock, User, ShoppingBag, Briefcase } from "lucide-react";

// // export default function MultiRoleLogin() {
// //   const navigate = useNavigate();
  
// //   // Role selection
// //   const [activeRole, setActiveRole] = useState("customer"); // customer, reseller, service_provider
  
// //   // Common states
// //   const [step, setStep] = useState(1);
// //   const [loginMethod, setLoginMethod] = useState("otp");
// //   const [phone, setPhone] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [otp, setOtp] = useState("");
// //   const [newPassword, setNewPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [otpToken, setOtpToken] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [message, setMessage] = useState("");
// //   const [error, setError] = useState("");
  
// //   // Password visibility
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showNewPassword, setShowNewPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// //   // Role configurations
// //   const roleConfig = {
// //     customer: {
// //       title: "Customer Login",
// //       subtitle: "Access your shopping account",
// //       icon: <User className="w-6 h-6" />,
// //       redirectPath: "/user",
// //       color: "blue",
// //       apiEndpoint: "/api/auth",
// //       roleValue: "user"
// //     },
// //     reseller: {
// //       title: "Reseller Login",
// //       subtitle: "Manage your reseller business",
// //       icon: <ShoppingBag className="w-6 h-6" />,
// //       redirectPath: "/reseller/dashboard",
// //       color: "purple",
// //       apiEndpoint: "/api/auth/reseller",
// //       roleValue: "reseller"
// //     },
// //     service_provider: {
// //       title: "Service Provider Login",
// //       subtitle: "Manage your services",
// //       icon: <Briefcase className="w-6 h-6" />,
// //       redirectPath: "/provider/dashboard",
// //       color: "green",
// //       apiEndpoint: "/api/auth/service-provider",
// //       roleValue: "service_provider"
// //     }
// //   };

// //   const currentRole = roleConfig[activeRole];
// //   const colorClasses = {
// //     blue: {
// //       bg: "bg-blue-600",
// //       hover: "hover:bg-blue-700",
// //       focus: "focus:ring-blue-500",
// //       light: "bg-blue-50",
// //       text: "text-blue-600",
// //       border: "border-blue-200"
// //     },
// //     purple: {
// //       bg: "bg-purple-600",
// //       hover: "hover:bg-purple-700",
// //       focus: "focus:ring-purple-500",
// //       light: "bg-purple-50",
// //       text: "text-purple-600",
// //       border: "border-purple-200"
// //     },
// //     green: {
// //       bg: "bg-green-600",
// //       hover: "hover:bg-green-700",
// //       focus: "focus:ring-green-500",
// //       light: "bg-green-50",
// //       text: "text-green-600",
// //       border: "border-green-200"
// //     }
// //   };

// //   const colors = colorClasses[currentRole.color];

// //   const sendOtp = async (e) => {
// //     e.preventDefault();
// //     if (!phone) {
// //       setError("Phone number is required");
// //       return;
// //     }
    
// //     setLoading(true);
// //     setError("");
// //     setMessage("");

// //     try {
// //       const response = await axios.post(
// //         `${import.meta.env.VITE_BACKEND_BASE_URL}${currentRole.apiEndpoint}/send-otp`,
// //         { phone, role: currentRole.roleValue }
// //       );

// //       setMessage(response.data.message || "OTP sent successfully");
// //       setStep(2);
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Failed to send OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loginWithPassword = async (e) => {
// //     e.preventDefault();
    
// //     const identifier = email || phone;
// //     if (!identifier) {
// //       setError("Email or phone number is required");
// //       return;
// //     }
// //     if (!password) {
// //       setError("Password is required");
// //       return;
// //     }
    
// //     setLoading(true);
// //     setError("");
// //     setMessage("");

// //     try {
// //       const response = await axios.post(
// //         `${import.meta.env.VITE_BACKEND_BASE_URL}${currentRole.apiEndpoint}/login`,
// //         {
// //           email: email || null,
// //           phone: phone || null,
// //           password,
// //           role: currentRole.roleValue
// //         }
// //       );

// //       handleSuccessfulLogin(response.data);
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Invalid credentials");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const verifyOtp = async (e) => {
// //     e.preventDefault();
    
// //     if (!otp) {
// //       setError("OTP is required");
// //       return;
// //     }
    
// //     setLoading(true);
// //     setError("");
// //     setMessage("");

// //     try {
// //       const response = await axios.post(
// //         `${import.meta.env.VITE_BACKEND_BASE_URL}${currentRole.apiEndpoint}/verify-otp`,
// //         {
// //           phone,
// //           otp,
// //           role: currentRole.roleValue
// //         }
// //       );

// //       const authToken = response.data.token;
// //       const user = response.data.user;
// //       const requiresPasswordSetup = response.data.requires_password_setup || !user?.password;

// //       if (requiresPasswordSetup) {
// //         setOtpToken(authToken);
// //         setStep(3);
// //         setMessage("OTP verified. Please set your password.");
// //         return;
// //       }

// //       handleSuccessfulLogin(response.data);
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Invalid OTP");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSetPassword = async (e) => {
// //     e.preventDefault();

// //     if (!newPassword || newPassword.length < 8) {
// //       setError("Password must be at least 8 characters");
// //       return;
// //     }

// //     if (newPassword !== confirmPassword) {
// //       setError("Passwords do not match");
// //       return;
// //     }

// //     setLoading(true);
// //     setError("");
// //     setMessage("");

// //     try {
// //       const response = await axios.post(
// //         `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/set-password`,
// //         { password: newPassword, confirmPassword },
// //         { headers: { Authorization: `Bearer ${otpToken}` } }
// //       );

// //       setMessage("Password set successfully! Redirecting...");
      
// //       setTimeout(() => {
// //         navigate(currentRole.redirectPath);
// //       }, 1500);
// //     } catch (err) {
// //       setError(err.response?.data?.message || "Failed to set password");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleSuccessfulLogin = (data) => {
// //     const { token, user, message: successMsg } = data;
    
// //     setMessage(successMsg || "Login successful");

// //     if (token && user) {
// //       const userData = {
// //         ...user,
// //         token,
// //         role: activeRole,
// //         loggedInAt: new Date().toISOString()
// //       };

// //       localStorage.setItem("user", JSON.stringify(userData));
// //       sessionStorage.setItem("user", JSON.stringify(userData));
      
// //       // Set axios default header for subsequent requests
// //       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //     }

// //     setTimeout(() => {
// //       navigate(currentRole.redirectPath);
// //     }, 1000);
// //   };

// //   const resetForm = () => {
// //     setStep(1);
// //     setPhone("");
// //     setEmail("");
// //     setPassword("");
// //     setOtp("");
// //     setNewPassword("");
// //     setConfirmPassword("");
// //     setMessage("");
// //     setError("");
// //     setOtpToken("");
// //   };

// //   const switchRole = (role) => {
// //     setActiveRole(role);
// //     resetForm();
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
// //       <div className="w-full max-w-md">
// //         {/* Role Selection Tabs */}
// //         <div className="bg-white rounded-t-2xl shadow-sm border-b border-gray-200">
// //           <div className="grid grid-cols-3 gap-1 p-1">
// //             <button
// //               onClick={() => switchRole("customer")}
// //               className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
// //                 activeRole === "customer"
// //                   ? "bg-blue-50 text-blue-600 shadow-sm"
// //                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
// //               }`}
// //             >
// //               <User className="w-5 h-5" />
// //               <span className="text-xs font-medium">Customer</span>
// //             </button>
            
// //             <button
// //               onClick={() => switchRole("reseller")}
// //               className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
// //                 activeRole === "reseller"
// //                   ? "bg-purple-50 text-purple-600 shadow-sm"
// //                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
// //               }`}
// //             >
// //               <ShoppingBag className="w-5 h-5" />
// //               <span className="text-xs font-medium">Reseller</span>
// //             </button>
            
// //             <button
// //               onClick={() => switchRole("service_provider")}
// //               className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
// //                 activeRole === "service_provider"
// //                   ? "bg-green-50 text-green-600 shadow-sm"
// //                   : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
// //               }`}
// //             >
// //               <Briefcase className="w-5 h-5" />
// //               <span className="text-xs font-medium">Service Provider</span>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Login Form */}
// //         <div className="bg-white rounded-b-2xl shadow-xl p-8">
// //           <div className="text-center mb-8">
// //             <div className={`inline-flex p-3 rounded-full ${colors.light} mb-4`}>
// //               {currentRole.icon}
// //             </div>
// //             <h2 className={`text-2xl font-bold ${colors.text}`}>
// //               {currentRole.title}
// //             </h2>
// //             <p className="text-gray-500 mt-2 text-sm">{currentRole.subtitle}</p>
// //           </div>

// //           {/* Login Method Toggle */}
// //           {step !== 3 && (
// //             <div className="flex justify-center mb-6">
// //               <div className="bg-gray-100 p-1 rounded-xl w-full max-w-xs">
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setLoginMethod("otp");
// //                     resetForm();
// //                   }}
// //                   className={`w-1/2 py-2 px-4 rounded-lg font-medium transition-all ${
// //                     loginMethod === "otp"
// //                       ? "bg-white text-gray-800 shadow-sm"
// //                       : "text-gray-600 hover:text-gray-800"
// //                   }`}
// //                 >
// //                   OTP Login
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => {
// //                     setLoginMethod("password");
// //                     resetForm();
// //                   }}
// //                   className={`w-1/2 py-2 px-4 rounded-lg font-medium transition-all ${
// //                     loginMethod === "password"
// //                       ? "bg-white text-gray-800 shadow-sm"
// //                       : "text-gray-600 hover:text-gray-800"
// //                   }`}
// //                 >
// //                   Password Login
// //                 </button>
// //               </div>
// //             </div>
// //           )}

// //           {/* Messages */}
// //           {message && (
// //             <div className="mb-4 rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
// //               {message}
// //             </div>
// //           )}

// //           {error && (
// //             <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
// //               {error}
// //             </div>
// //           )}

// //           {loginMethod === "otp" ? (
// //             <>
// //               {step === 1 && (
// //                 <form onSubmit={sendOtp} className="space-y-5">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Mobile Number
// //                     </label>
// //                     <div className="relative">
// //                       <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
// //                       <input
// //                         type="tel"
// //                         value={phone}
// //                         onChange={(e) => setPhone(e.target.value)}
// //                         placeholder="Enter 10-digit mobile number"
// //                         className={`w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 ${colors.focus} focus:border-transparent`}
// //                         required
// //                         pattern="[0-9]{10}"
// //                       />
// //                     </div>
// //                   </div>

// //                   <button
// //                     type="submit"
// //                     disabled={loading}
// //                     className={`w-full ${colors.bg} ${colors.hover} text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
// //                   >
// //                     {loading ? "Sending OTP..." : "Send OTP"}
// //                   </button>
// //                 </form>
// //               )}

// //               {step === 2 && (
// //                 <form onSubmit={verifyOtp} className="space-y-5">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Mobile Number
// //                     </label>
// //                     <input
// //                       type="tel"
// //                       value={phone}
// //                       disabled
// //                       className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-600"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       OTP Code
// //                     </label>
// //                     <input
// //                       type="text"
// //                       value={otp}
// //                       onChange={(e) => setOtp(e.target.value)}
// //                       placeholder="Enter 6-digit OTP"
// //                       className={`w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${colors.focus} focus:border-transparent`}
// //                       required
// //                       maxLength="6"
// //                     />
// //                     <p className="text-xs text-gray-500 mt-1">
// //                       OTP sent to {phone}
// //                     </p>
// //                   </div>

// //                   <button
// //                     type="submit"
// //                     disabled={loading}
// //                     className={`w-full ${colors.bg} ${colors.hover} text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50`}
// //                   >
// //                     {loading ? "Verifying..." : "Verify & Login"}
// //                   </button>

// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setStep(1);
// //                       setOtp("");
// //                       setError("");
// //                     }}
// //                     className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition duration-300"
// //                   >
// //                     ← Change Mobile Number
// //                   </button>
// //                 </form>
// //               )}

// //               {step === 3 && (
// //                 <form onSubmit={handleSetPassword} className="space-y-5">
// //                   <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
// //                     <p className="text-sm text-yellow-800">
// //                       🔐 Please set a password for your account. This will allow you to login with password in the future.
// //                     </p>
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       New Password
// //                     </label>
// //                     <div className="relative">
// //                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
// //                       <input
// //                         type={showNewPassword ? "text" : "password"}
// //                         value={newPassword}
// //                         onChange={(e) => setNewPassword(e.target.value)}
// //                         placeholder="Minimum 8 characters"
// //                         className={`w-full border border-gray-300 rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 ${colors.focus}`}
// //                         required
// //                       />
// //                       <button
// //                         type="button"
// //                         onClick={() => setShowNewPassword(!showNewPassword)}
// //                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
// //                       >
// //                         {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //                       </button>
// //                     </div>
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Confirm Password
// //                     </label>
// //                     <div className="relative">
// //                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
// //                       <input
// //                         type={showConfirmPassword ? "text" : "password"}
// //                         value={confirmPassword}
// //                         onChange={(e) => setConfirmPassword(e.target.value)}
// //                         placeholder="Confirm your password"
// //                         className={`w-full border border-gray-300 rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 ${colors.focus}`}
// //                         required
// //                       />
// //                       <button
// //                         type="button"
// //                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
// //                         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
// //                       >
// //                         {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //                       </button>
// //                     </div>
// //                   </div>

// //                   <button
// //                     type="submit"
// //                     disabled={loading}
// //                     className={`w-full ${colors.bg} ${colors.hover} text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50`}
// //                   >
// //                     {loading ? "Setting Password..." : "Set Password & Login"}
// //                   </button>
// //                 </form>
// //               )}
// //             </>
// //           ) : (
// //             <form onSubmit={loginWithPassword} className="space-y-5">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Email or Mobile Number
// //                 </label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
// //                   <input
// //                     type="text"
// //                     value={email || phone}
// //                     onChange={(e) => {
// //                       const value = e.target.value;
// //                       if (value.includes("@")) {
// //                         setEmail(value);
// //                         setPhone("");
// //                       } else {
// //                         setPhone(value);
// //                         setEmail("");
// //                       }
// //                     }}
// //                     placeholder="Enter email or mobile number"
// //                     className={`w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 ${colors.focus}`}
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Password
// //                 </label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
// //                   <input
// //                     type={showPassword ? "text" : "password"}
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     placeholder="Enter your password"
// //                     className={`w-full border border-gray-300 rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 ${colors.focus}`}
// //                     required
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
// //                   >
// //                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //                   </button>
// //                 </div>
// //               </div>

// //               <button
// //                 type="submit"
// //                 disabled={loading}
// //                 className={`w-full ${colors.bg} ${colors.hover} text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50`}
// //               >
// //                 {loading ? "Logging in..." : `Login as ${currentRole.title.split(' ')[0]}`}
// //               </button>
// //             </form>
// //           )}

// //           {/* Help Text */}
// //           <div className="mt-6 text-center">
// //             <p className="text-xs text-gray-500">
// //               By continuing, you agree to our Terms of Service and Privacy Policy
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";

// export default function UserLoginForm() {
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1);
//   const [loginMethod, setLoginMethod] = useState("otp"); // "otp" or "password"
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [otpToken, setOtpToken] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
  
//   // Password visibility states
//   const [showPassword, setShowPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const sendOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/send-otp`,
//         {
//           phone,
//         }
//       );

//       setMessage(response.data.message || "OTP sent successfully");
//       setStep(2);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loginWithPassword = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/login`,
//         {
//           email: email || phone,
//           password,
//           login_type: "password",
//         }
//       );

//       setMessage(response.data.message || "Login successful");

//       if (response.data.token && response.data.user) {
//         const userData = {
//           ...response.data.user,
//           token: response.data.token,
//         };

//         localStorage.setItem("user", JSON.stringify(userData));
//         sessionStorage.setItem("user", JSON.stringify(userData));
//       }

//       console.log("Login Response:", response.data);

//       const user = response.data.user;

//       const isProfileIncomplete =
//         !user.first_name ||
//         !user.last_name ||
//         !user.email ||
//         !user.state ||
//         !user.district ||
//         !user.city ||
//         !user.pin ||
//         !user.address;

//     const role = user.role;

// if (isProfileIncomplete && role === "customer") {
//   navigate("/user/profile");
//   return;
// }

// switch (role) {
//   case "customer":
//     navigate("/user");
//     break;
//   case "reseller":
//     navigate("/reseller/dashboard");
//     break;
//   case "service_provider":
//     navigate("/provider/dashboard");
//     break;
//   case "admin":
//     navigate("/admin/dashboard");
//     break;
//   default:
//     navigate("/");
// }
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/verify-otp`,
//         {
//           phone,
//           otp,
//         }
//       );

//       const authToken = response.data.token;
//       const user = response.data.user;
//       const passwordSetupRequired =
//         response.data.requires_password_setup ||
//         response.data.password_setup_required ||
//         response.data.first_time_login ||
//         response.data.first_login ||
//         response.data.is_new_user ||
//         response.data.new_account ||
//         user?.requires_password_setup ||
//         user?.needs_password_setup ||
//         user?.password_set === false ||
//         user?.has_password === false ||
//         user?.is_new_user;

//       if (passwordSetupRequired) {
//         setOtpToken(authToken || "");
//         setStep(3);
//         setMessage(response.data.message || "OTP verified. Please set your password.");
//         return;
//       }

//       setMessage(response.data.message || "Login successful");

//       if (authToken && user) {
//         const userData = {
//           ...user,
//           token: authToken,
//         };

//         localStorage.setItem("user", JSON.stringify(userData));
//         sessionStorage.setItem("user", JSON.stringify(userData));
//       }

//       console.log("Login Response:", response.data);

//       // const isProfileIncomplete =
//       //   !user?.first_name ||
//       //   !user?.last_name ||
//       //   !user?.email ||
//       //   !user?.state ||
//       //   !user?.district ||
//       //   !user?.city ||
//       //   !user?.pin ||
//       //   !user?.address;

//      const role = user.role;

// setTimeout(() => {
//   if (role === "customer") {
//     navigate("/user");
//   } else if (role === "reseller") {
//     navigate("/reseller/dashboard");
//   } else if (role === "service_provider") {
//     navigate("/provider/dashboard");
//   } else if (role === "admin") {
//     navigate("/admin/dashboard");
//   }
// }, 1000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSetPassword = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     if (!newPassword || newPassword.length < 8) {
//       setError("Password must be at least 8 characters");
//       setLoading(false);
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/set-password`,
//         {
//           password: newPassword,
//           confirmPassword: confirmPassword
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${otpToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.data.message) {
//         setMessage(response.data.message || "Password set successfully. Redirecting...");
        
//         const storedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);
//           parsedUser.token = otpToken;
//           parsedUser.password_set = true;
//           sessionStorage.setItem("user", JSON.stringify(parsedUser));
//           localStorage.setItem("user", JSON.stringify(parsedUser));
//         }
        
//         setTimeout(() => navigate("/user/profile"), 1500);
//       }
//     } catch (err) {
//       console.error("Password setup error:", err);
//       setError(err.response?.data?.message || "Failed to set password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-gray-800">User Login</h2>
//           <p className="text-gray-500 mt-2">Choose your login method</p>
//         </div>

//         {/* Login Method Selection */}
//         <div className="flex justify-center mb-6">
//           <div className="bg-gray-100 p-1 rounded-xl w-full max-w-xs">
//             <button
//               type="button"
//               onClick={() => {
//                 setLoginMethod("otp");
//                 setStep(1);
//                 setError("");
//                 setMessage("");
//                 setPassword("");
//                 setEmail("");
//                 setShowPassword(false);
//                 setShowNewPassword(false);
//                 setShowConfirmPassword(false);
//               }}
//               className={`w-1/2 py-2 px-4 rounded-lg font-medium transition-all ${
//                 loginMethod === "otp"
//                   ? "bg-white text-blue-600 shadow-sm"
//                   : "text-gray-600 hover:text-gray-800"
//               }`}
//             >
//               OTP Login
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setLoginMethod("password");
//                 setStep(1);
//                 setError("");
//                 setMessage("");
//                 setOtp("");
//                 setShowPassword(false);
//                 setShowNewPassword(false);
//                 setShowConfirmPassword(false);
//               }}
//               className={`w-1/2 py-2 px-4 rounded-lg font-medium transition-all ${
//                 loginMethod === "password"
//                   ? "bg-white text-blue-600 shadow-sm"
//                   : "text-gray-600 hover:text-gray-800"
//               }`}
//             >
//               Password Login
//             </button>
//           </div>
//         </div>

//         {message && (
//           <div className="mb-4 rounded-xl bg-green-100 text-green-700 px-4 py-3 text-sm">
//             {message}
//           </div>
//         )}

//         {error && (
//           <div className="mb-4 rounded-xl bg-red-100 text-red-700 px-4 py-3 text-sm">
//             {error}
//           </div>
//         )}

//         {loginMethod === "otp" ? (
//           <>
//             {step === 1 && (
//               <form onSubmit={sendOtp} className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Mobile Number
//                   </label>
//                   <input
//                     type="text"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     placeholder="Enter phone number"
//                     className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50"
//                 >
//                   {loading ? "Sending OTP..." : "Send OTP"}
//                 </button>
//               </form>
//             )}

//             {step === 2 && (
//               <form onSubmit={verifyOtp} className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Mobile Number
//                   </label>
//                   <input
//                     type="text"
//                     value={phone}
//                     disabled
//                     className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     OTP
//                   </label>
//                   <input
//                     type="text"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     placeholder="Enter OTP"
//                     className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50"
//                 >
//                   {loading ? "Verifying..." : "Verify OTP"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setStep(1);
//                     setOtp("");
//                     setMessage("");
//                     setError("");
//                   }}
//                   className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition duration-300"
//                 >
//                   Change Mobile Number
//                 </button>
//               </form>
//             )}

//             {step === 3 && (
//               <form onSubmit={handleSetPassword} className="space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Mobile Number
//                   </label>
//                   <input
//                     type="text"
//                     value={phone}
//                     disabled
//                     className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showNewPassword ? "text" : "password"}
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       placeholder="Enter new password"
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowNewPassword(!showNewPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                     >
//                       {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       placeholder="Confirm new password"
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                     >
//                       {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50"
//                 >
//                   {loading ? "Saving password..." : "Set Password"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setStep(2);
//                     setNewPassword("");
//                     setConfirmPassword("");
//                     setError("");
//                     setMessage("");
//                     setShowNewPassword(false);
//                     setShowConfirmPassword(false);
//                   }}
//                   className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-100 transition duration-300"
//                 >
//                   Back to OTP Verification
//                 </button>
//               </form>
//             )}
//           </>
//         ) : (
//           <form onSubmit={loginWithPassword} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email or Mobile Number
//               </label>
//               <input
//                 type="text"
//                 value={email || phone}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value.includes("@")) {
//                     setEmail(value);
//                     setPhone("");
//                   } else {
//                     setPhone(value);
//                     setEmail("");
//                   }
//                 }}
//                 placeholder="Enter email or mobile number"
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Enter your password"
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                 >
//                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50"
//             >
//               {loading ? "Logging in..." : "Login"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Smartphone, ShieldCheck, ArrowRight, KeyRound, User } from "lucide-react";
import axiosInstance from "../../../../utils/axiosInstance";

export default function CustomerLoginForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loginMethod, setLoginMethod] = useState("otp");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const identifier = email ? email : phone;

  const saveAuth = (token, user) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const resetForm = () => {
    setStep(1);
    setError("");
    setMessage("");
    setPassword("");
    setOtp("");
    setPhone("");
    setEmail("");
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!identifier) {
      return setError("Please enter your email or phone number");
    }

    setLoading(true);
    setError("");

    try {
      const body = email ? { email } : { phone };
      const res = await axiosInstance.post("/api/auth/send-otp", body);
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!otp || otp.length < 4) {
      return setError("Please enter a valid OTP");
    }

    setLoading(true);
    setError("");

    try {
      const body = {
        otp,
        role: "customer",
        ...(email ? { email } : { phone }),
      };

      const res = await axiosInstance.post("/api/auth/verify-otp", body);
      const { token, user, requires_password_setup } = res.data;

      saveAuth(token, user);

      if (requires_password_setup) {
        setStep(3);
        setMessage("Please set your password to continue");
        return;
      }

      navigate("/customer/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const loginWithPassword = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!identifier) return setError("Please enter your email or phone number");
    if (!password) return setError("Please enter your password");

    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.post("/api/auth/login", {
        identifier,
        password,
        role: "customer",
      });

      const { token, user } = res.data;
      saveAuth(token, user);
      navigate("/customer/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const setPasswordHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (newPassword.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");

    try {
      await axiosInstance.post("/api/auth/set-password", {
        password: newPassword,
        confirmPassword,
      });
      navigate("/customer/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-2">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="  text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-2 backdrop-blur">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold ">Customer Login</h2>
            <p className=" text-sm mt-1">Welcome back! Please sign in</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Login Method Toggle */}
            <div className="mb-6 bg-gray-100 rounded-xl p-1">
              <div className="flex relative">
                <button
                  onClick={() => {
                    setLoginMethod("otp");
                    resetForm();
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all relative z-10 ${
                    loginMethod === "otp" ? "text-white" : "text-gray-600"
                  }`}
                >
                  <KeyRound className="w-4 h-4 inline mr-2" />
                  OTP Login
                </button>
                <button
                  onClick={() => {
                    setLoginMethod("password");
                    resetForm();
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all relative z-10 ${
                    loginMethod === "password" ? "text-white" : "text-gray-600"
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Password Login
                </button>
                <div
                  className={`absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg transition-transform duration-300 ${
                    loginMethod === "password" ? "translate-x-full" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                  {error}
                </p>
              </div>
            )}
            {message && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-600 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  {message}
                </p>
              </div>
            )}

            {/* Step 1 - Send OTP */}
            {step === 1 && loginMethod === "otp" && (
              <form onSubmit={sendOtp}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email or Phone Number
                  </label>
                  <div className={`relative transition-all duration-200 ${focusedField === "identifier" ? "ring-2 ring-blue-400 ring-offset-0" : ""}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="you@example.com or +1234567890"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors"
                      onFocus={() => setFocusedField("identifier")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        const v = e.target.value;
                        v.includes("@") ? setEmail(v) : setPhone(v);
                      }}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {/* Send OTP */}
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2 - Verify OTP */}
            {step === 2 && (
              <form onSubmit={verifyOtp}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Verification Code
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Code sent to {email || phone}
                  </p>
                  <div className={`relative transition-all duration-200 ${focusedField === "otp" ? "ring-2 ring-blue-400 ring-offset-0" : ""}`}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Smartphone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors text-center tracking-widest text-lg"
                      value={otp}
                      onFocus={() => setFocusedField("otp")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength="6"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-green-200 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 3 - Set New Password */}
            {step === 3 && (
              <form onSubmit={setPasswordHandler}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors"
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Set Password & Continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Password Login Form */}
            {loginMethod === "password" && (
              <form onSubmit={loginWithPassword}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email or Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="you@example.com or +1234567890"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors"
                        onChange={(e) => {
                          const v = e.target.value;
                          v.includes("@") ? setEmail(v) : setPhone(v);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

         
          </div>
        </div>
      </div>
    </div>
  );
}