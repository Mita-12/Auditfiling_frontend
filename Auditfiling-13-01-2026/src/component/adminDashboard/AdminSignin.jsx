import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/signin.svg";

const AdminSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // ✅ Changed to admin login endpoint
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,     // ✅ Using email field name expected by backend
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // ✅ Check success flag from backend response
      if (!data.success) {
        setError(data.message || "Login failed");
        return;
      }

      const user = data.user;

      // 🔒 ROLE CHECK (backup validation)
      if (user.role !== "admin") {
        setError("Access denied: Admins only");
        return;
      }

      // ✅ Store user data
      const adminData = {
        id: user.id,
        email: user.email,
        role: user.role,
        token: data.token,
      };

      localStorage.setItem("user", JSON.stringify(adminData));
      sessionStorage.setItem("user", JSON.stringify(adminData));

      // ✅ Also store token separately if needed
      localStorage.setItem("token", data.token);

      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Card */}
      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[380px]">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Admin Sign In
        </h2>

        {/* Success Message */}
        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Admin Email
            </label>
            <input
              type="email"
              placeholder="admin@admin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white p-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignin;