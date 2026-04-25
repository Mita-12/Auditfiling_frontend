import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function QuickForm() {
  const location = useLocation();
  const isContactPage = location.pathname === "/contact-us"; // 👈 detect contact page

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    service_id: "",
    message: "",
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/web/menu`
        );
        let servicesData = [];

        if (Array.isArray(response.data.data)) {
          servicesData = response.data.data;
        } else if (Array.isArray(response.data.menu)) {
          servicesData = response.data.menu;
        } else if (Array.isArray(response.data.services)) {
          servicesData = response.data.services;
        } else if (response.data.data && typeof response.data.data === "object") {
          servicesData = Object.values(response.data.data);
        } else if (Array.isArray(response.data)) {
          servicesData = response.data;
        } else {
          for (let key in response.data) {
            if (Array.isArray(response.data[key])) {
              servicesData = response.data[key];
              break;
            }
          }
        }

        const menuCategories = servicesData.map((item) => ({
          id: item.id,
          name: item.name,
        }));

        setServices(menuCategories);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mobileRegex.test(formData.mobile)) {
      alert("⚠️ Please enter a valid 10-digit mobile number");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      alert("⚠️ Please enter a valid email address");
      return;
    }

    if (!formData.service_id) {
      alert("⚠️ Please select a service");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/contact_us/store`,
        formData
      );

      if (response.data.success) {
        alert("✅ Your request has been submitted successfully!");
        setFormData({
          name: "",
          mobile: "",
          email: "",
          service_id: "",
          message: "",
        });
      } else {
        const errorMessages = response.data.errors
          ? Object.values(response.data.errors).flat().join(", ")
          : response.data.message || "Something went wrong.";
        alert(`❌ ${errorMessages}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("⚠️ Failed to submit. Please try again later.");
    }
  };

return (
  <aside
    className={`bg-white rounded-lg shadow-sm transition-all duration-300 mx-auto
      ${
        isContactPage
          ? "w-full h-auto lg:h-[100%] p-6" // ✅ Full width + comfortable padding on contact page
          : "w-full max-w-sm p-1" // ✅ Compact elsewhere
      }
      ${isContactPage ? "relative" : "lg:sticky top-28"}
    `}
  >
    <div className={`${isContactPage ? "max-w-2xl mx-auto" : ""}`}>
      <h1
        className={`text-xl font-serif font-bold mb-4 text-center text-gray-800 ${
          isContactPage ? "text-2xl md:text-3xl mb-6" : ""
        }`}
      >
        Get <span className="font-bold text-blue-500">Free</span> Consultation
      </h1>

      <form
        className={`space-y-3 flex flex-col ${
          isContactPage ? "items-stretch" : "items-center"
        }`}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`border border-gray-300 placeholder:text-sm placeholder:pl-5 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition-colors ${
            isContactPage ? "w-full p-3" : "w-[90%]"
          }`}
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={handleChange}
          required
          maxLength="10"
          className={`border border-gray-300 placeholder:text-sm placeholder:pl-5 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition-colors ${
            isContactPage ? "w-full p-3" : "w-[90%]"
          }`}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className={`border border-gray-300 placeholder:text-sm placeholder:pl-5 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition-colors ${
            isContactPage ? "w-full p-3" : "w-[90%]"
          }`}
        />

        <select
          name="service_id"
          value={formData.service_id}
          onChange={handleChange}
          required
          className={`border border-gray-300 rounded-md placeholder:pl-5 focus:ring-2 focus:ring-blue-400 outline-none bg-white transition-colors ${
            isContactPage ? "w-full p-3" : "w-[90%]"
          }`}
        >
          <option value="">Select Service</option>
          {loading ? (
            <option disabled>Loading services...</option>
          ) : error ? (
            <option disabled>{error}</option>
          ) : services.length > 0 ? (
            services.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : (
            <option disabled>No services available</option>
          )}
        </select>

        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          rows="3"
          className={`border border-gray-300 placeholder:text-sm placeholder:pl-5 rounded-md focus:ring-2 focus:ring-blue-400 outline-none transition-colors resize-none ${
            isContactPage ? "w-full p-3" : "w-[90%]"
          }`}
        />

        <button
          type="submit"
          className={`bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-all disabled:opacity-50 ${
            isContactPage ? "w-full mt-2" : "w-[90%] mt-1"
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  </aside>
);

}
