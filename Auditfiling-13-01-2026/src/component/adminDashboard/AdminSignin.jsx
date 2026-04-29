// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import loginBg from "../../assets/signin.svg";

// const AdminSignin = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       // ✅ Changed to admin login endpoint
//       const response = await fetch(
//         `${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: email,     // ✅ Using email field name expected by backend
//             password: password,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Invalid credentials");
//         return;
//       }

//       // ✅ Check success flag from backend response
//       if (!data.success) {
//         setError(data.message || "Login failed");
//         return;
//       }

//       const user = data.user;

//       // 🔒 ROLE CHECK (backup validation)
//       if (user.role !== "admin") {
//         setError("Access denied: Admins only");
//         return;
//       }

//       // ✅ Store user data
//       const adminData = {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//         token: data.token,
//       };

//       localStorage.setItem("user", JSON.stringify(adminData));
//       sessionStorage.setItem("user", JSON.stringify(adminData));

//       // ✅ Also store token separately if needed
//       localStorage.setItem("token", data.token);

//       setMessage("Login successful! Redirecting...");

//       setTimeout(() => {
//         navigate("/admin/dashboard");
//       }, 1000);

//     } catch (error) {
//       console.error("Login error:", error);
//       setError("Login failed. Please check your connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
//       style={{ backgroundImage: `url(${loginBg})` }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/40"></div>

//       {/* Card */}
//       <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[380px]">
//         <h2 className="text-2xl font-semibold text-center mb-6">
//           Admin Sign In
//         </h2>

//         {/* Success Message */}
//         {message && (
//           <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
//             {message}
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Email */}
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">
//               Admin Email
//             </label>
//             <input
//               type="email"
//               placeholder="admin@admin.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               required
//               disabled={loading}
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="text-sm text-gray-600 block mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
//                 required
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//               >
//                 {showPassword ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Signing in..." : "Sign in"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminSignin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Smartphone, ShieldCheck, ArrowRight, KeyRound, User } from "lucide-react";
import axiosInstance from "../../.././src/utils/axiosInstance";

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
        role: "admin",
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

      navigate("/admin/dashboard");
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
        role: "admin",
      });

      const { token, user } = res.data;
      saveAuth(token, user);
      navigate("/admin/dashboard");
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
      navigate("/admin/dashboard");
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
            <h2 className="text-2xl font-bold ">Admin Login</h2>
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