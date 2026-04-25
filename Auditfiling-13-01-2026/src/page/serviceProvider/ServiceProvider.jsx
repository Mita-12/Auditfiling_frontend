import React, { useState, useEffect } from "react";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function ServiceProviderForm() {
  const [formData, setFormData] = useState({
    name: "",
    mailid: "",
    mobile: "",
    image: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const navigate = useNavigate();

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password validation states
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // Validate password and update validation states
  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };
    
    setPasswordValidations(validations);
    
    // Return overall validation result
    return Object.values(validations).every(v => v === true);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.mailid) newErrors.mailid = "Email is required";
    else if (!mailRegex.test(formData.mailid)) newErrors.mailid = "Please enter a valid email";

    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    else if (!phoneRegex.test(formData.mobile.replace(/[\s\-)]/g, ""))) newErrors.mobile = "Please enter a valid mobile number";
    else if (!isOtpVerified) newErrors.mobile = "Please verify your mobile number with OTP";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password does not meet all requirements";
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    if (formData.image) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(formData.image.type)) newErrors.image = "Please select a valid image (JPEG, PNG, GIF)";
      if (formData.image.size > 5 * 1024 * 1024) newErrors.image = "Image size must be less than 5MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "password") {
      validatePassword(value);
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Send OTP API
  const sendOtp = async () => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    if (!formData.mobile || !phoneRegex.test(formData.mobile.replace(/[\s\-)]/g, ""))) {
      setErrors({ ...errors, mobile: "Please enter a valid mobile number first" });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/service_provider/custom_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: formData.mobile }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        setOtpCountdown(60);
        
        // Show SweetAlert for OTP sent
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent!',
          text: data.message || 'OTP has been sent to your mobile number.',
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: data.message || 'Failed to send OTP',
        });
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send OTP. Please try again.',
      });
    }
  };

  // Verify OTP API
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setErrors({ ...errors, otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/service_provider/custom_otp/store`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: formData.mobile, custom_otp: otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpVerified(true);
        setErrors({ ...errors, otp: "", mobile: "" });
        
        // Show SweetAlert for OTP verification
        Swal.fire({
          icon: 'success',
          title: 'Verified!',
          text: data.message || 'Mobile number verified successfully.',
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        setIsOtpVerified(false);
        setOtp("");
        setErrors({ ...errors, otp: data.message || "OTP verification failed" });
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: data.message || 'OTP verification failed. Please try again.',
        });
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      setIsOtpVerified(false);
      setOtp("");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'OTP verification failed. Please try again.',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) setErrors({ ...errors, [name]: "" });
    }
  };

  // Registration API - MODIFIED FOR SWEETALERT
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const submissionData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "image" && formData.image) submissionData.append(key, formData.image);
        else submissionData.append(key, formData[key]);
      });
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/service_provider/registration`, {
        method: "POST",
        body: submissionData,
      });

      const data = await response.json();
      if (response.ok) {
        // Show SweetAlert for successful registration
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          html: `
            <div style="text-align: center;">
              <p style="font-size: 18px; margin-bottom: 20px;">Thank you for registering as a Service Provider!</p>
              <p style="font-size: 16px; color: #666; margin-bottom: 25px;">
                Your account has been created successfully. Please proceed to login.
              </p>
              <div style="margin-top: 10px;">
                <button 
                  id="loginButton" 
                  style="
                    background: linear-gradient(to right, #2563eb, #4f46e5);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                  "
                  onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(37, 99, 235, 0.3)'"
                  onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                >
                  Go to Login
                </button>
              </div>
            </div>
          `,
          showConfirmButton: false,
          allowOutsideClick: false,
          willOpen: () => {
            // Add event listener for the custom button
            setTimeout(() => {
              const loginButton = document.getElementById('loginButton');
              if (loginButton) {
                loginButton.addEventListener('click', () => {
                  Swal.close();
                  navigate(`${import.meta.env.VITE_API_BASE_URL}/login`); // Navigate to login page
                });
              }
            }, 100);
          },
          didClose: () => {
            // Navigate to login when alert is closed
            navigate(`${import.meta.env.VITE_API_BASE_URL}/login`);
          }
        });
        
        // Reset form after successful registration
        setFormData({
          name: "",
          mailid: "",
          mobile: "",
          image: null,
          password: "",
          password_confirmation: "",
        });
        setImagePreview(null);
        setErrors({});
        setIsOtpSent(false);
        setIsOtpVerified(false);
        setOtp("");
        setPasswordValidations({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          specialChar: false,
        });
        
      } else {
        // Show error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: data.message || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Registration failed. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  // Password validation component
  const PasswordValidationIndicator = () => (
    <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
      <ul className="space-y-1">
        <li className="flex items-center">
          <span className={`inline-flex items-center justify-center w-4 h-4 mr-2 rounded-full ${passwordValidations.length ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {passwordValidations.length ? '✓' : '•'}
          </span>
          <span className={`text-sm ${passwordValidations.length ? 'text-green-600' : 'text-gray-600'}`}>
            At least 8 characters
          </span>
        </li>
        <li className="flex items-center">
          <span className={`inline-flex items-center justify-center w-4 h-4 mr-2 rounded-full ${passwordValidations.uppercase ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {passwordValidations.uppercase ? '✓' : '•'}
          </span>
          <span className={`text-sm ${passwordValidations.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
            At least one uppercase letter (A-Z)
          </span>
        </li>
        <li className="flex items-center">
          <span className={`inline-flex items-center justify-center w-4 h-4 mr-2 rounded-full ${passwordValidations.lowercase ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {passwordValidations.lowercase ? '✓' : '•'}
          </span>
          <span className={`text-sm ${passwordValidations.lowercase ? 'text-green-600' : 'text-gray-600'}`}>
            At least one lowercase letter (a-z)
          </span>
        </li>
        <li className="flex items-center">
          <span className={`inline-flex items-center justify-center w-4 h-4 mr-2 rounded-full ${passwordValidations.number ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {passwordValidations.number ? '✓' : '•'}
          </span>
          <span className={`text-sm ${passwordValidations.number ? 'text-green-600' : 'text-gray-600'}`}>
            At least one number (0-9)
          </span>
        </li>
        <li className="flex items-center">
          <span className={`inline-flex items-center justify-center w-4 h-4 mr-2 rounded-full ${passwordValidations.specialChar ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {passwordValidations.specialChar ? '✓' : '•'}
          </span>
          <span className={`text-sm ${passwordValidations.specialChar ? 'text-green-600' : 'text-gray-600'}`}>
            At least one special character (@$!%*?&)
          </span>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <div className="flex justify-center items-center py-12 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200 mt-20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Service Provider Registration
            </h2>
            <p className="text-gray-600">Join our exclusive service provider program and grow your business</p>
          </div>

          {/* ... (rest of the form remains exactly the same) ... */}
          {/* All your existing form fields remain unchanged */}
          
          {/* Personal Information Section */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {errors.name}
                  </p>
                )}
              </div>

              {/* mailid Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="mailid"
                  value={formData.mailid}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.mailid
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                    }`}
                  placeholder="auditfiling@gmail.com"
                />
                {errors.mailid && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {errors.mailid}
                  </p>
                )}
              </div>

              {/* mobile Field with OTP */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Mobile Number *
                </label>
                <div className="flex gap-3">
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                    required
                    disabled={isOtpVerified}
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${errors.mobile
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      } ${isOtpVerified ? 'bg-green-50 border-green-500' : ''}`}
                    placeholder="+91 742-860-0607"
                  />
                  {!isOtpVerified && (
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={otpCountdown > 0}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${otpCountdown > 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                      {otpCountdown > 0 ? `${otpCountdown}s` : "Send OTP"}
                    </button>
                  )}
                </div>
                {errors.mobile && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {errors.mobile}
                  </p>
                )}

                {/* OTP Input Section */}
                {isOtpSent && !isOtpVerified && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Enter OTP *
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="custom_otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="Enter 6-digit OTP"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={verifyOtp}
                        className="px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Verify OTP
                      </button>
                    </div>
                    {errors.otp && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="mr-1">⚠</span> {errors.otp}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      OTP sent to {formData.mobile}. Didn't receive?{" "}
                      {otpCountdown === 0 ? (
                        <button
                          type="button"
                          onClick={sendOtp}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <span className="text-gray-500">Resend in {otpCountdown}s</span>
                      )}
                    </p>
                  </div>
                )}

                {/* OTP Verified Success */}
                {isOtpVerified && (
                  <div className="mt-2 flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Mobile number verified successfully</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Image Field */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 ">
              Profile Image
            </h3>
            <div className="mb-4">
              {imagePreview ? (
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                  />
                  <div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="text-sm text-red-600 hover:text-red-800 font-medium block mb-1"
                    >
                      Remove Image
                    </button>
                    <p className="text-xs text-gray-500">Click to change image</p>
                  </div>
                </div>
              ) : null}

              <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${imagePreview ? 'hidden' : 'block'}`}>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <div className="text-gray-500 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-blue-600 font-medium">Upload profile photo</span>
                  <span className="text-gray-500 text-sm block mt-1">JPEG, PNG, GIF (max 5MB)</span>
                </label>
              </div>
              {errors.image && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span> {errors.image}
                </p>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Field */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-10 ${errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Password Validation Indicator */}
                {formData.password && <PasswordValidationIndicator />}
                
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-10 ${errors.password_confirmation
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.password_confirmation && (
                  <div className="mt-2">
                    {formData.password === formData.password_confirmation ? (
                      <p className="text-sm text-green-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Passwords match
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Passwords do not match
                      </p>
                    )}
                  </div>
                )}
                
                {errors.password_confirmation && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">⚠</span> {errors.password_confirmation}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Password Strength Indicator (optional) */}
          {formData.password && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                <span className="text-sm font-medium">
                  {Object.values(passwordValidations).filter(v => v).length === 5 ? "Strong" :
                   Object.values(passwordValidations).filter(v => v).length >= 3 ? "Medium" : "Weak"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    Object.values(passwordValidations).filter(v => v).length === 5 ? "bg-green-500" :
                    Object.values(passwordValidations).filter(v => v).length >= 3 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${(Object.values(passwordValidations).filter(v => v).length / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isOtpVerified}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${isSubmitting || !isOtpVerified
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : !isOtpVerified ? (
              "Verify Mobile to Continue"
            ) : (
              "Create Service Provider Account"
            )}
          </button>

          {/* Terms Notice */}
          <p className="text-center text-gray-500 text-xs mt-6">
            By registering, you agree to our{" "}
            <a href="/term-condition" className="text-blue-600 hover:text-blue-800 font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 font-medium">
              Privacy Policy
            </a>
          </p>
        </form>
      </div>

    </div>
  );
}