import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useLocation } from "react-router-dom";
import * as yup from "yup";

// Validation schema
const companySchema = yup.object({
  // Basic Information
  user_id: yup.number().required("User ID is required"),
  companyName: yup.string().required("Company name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  mobile: yup.string().required("Mobile number is required"),
  landline: yup.string(),

  // Company Details
  registrationNumber: yup.string().required("Registration number is required"),
  companyType: yup.string().required("Company type is required"),
  sector: yup.string().required("Sector is required"),
  establishDate: yup.string().required("Establish date is required"),
  website: yup.string().url("Invalid website URL"),
  gstNo: yup.string(),
  panNo: yup.string(),

  // Address Information
  address1: yup.string().required("Address is required"),
  address2: yup.string(),
  country: yup.string().default("India"),
  state: yup.string().required("State is required"),
  district: yup.string().required("District is required"),
  city: yup.string().required("City is required"),
  pinCode: yup.string().required("PIN code is required"),

  // Additional Information
  parentCompany: yup.string(),
  parentCompanyName: yup.string(),
});

export default function CompanyDetailForm() {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityPincodeMap, setCityPincodeMap] = useState({});
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [sectors, setSectors] = useState([]);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user_id, setUserId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
    reset,
  } = useForm({
    resolver: yupResolver(companySchema),
    defaultValues: {
      country: "India",
    },
    mode: "onBlur",
  });

  const location = useLocation();

  // Watch form values
  const watchState = watch("state");
  const watchDistrict = watch("district");
  const watchCity = watch("city");

  // Get user_id when component mounts
  useEffect(() => {
    const userDataString = sessionStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        if (userData && userData.id) {
          setUserId(userData.id);
          setValue("user_id", userData.id);
          // console.log("User ID set:", userData.id);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [setValue]);

  // If navigated here for editing, prefill form values from location.state.company
  useEffect(() => {
    const navCompany = location?.state?.company;
    if (!navCompany) return;

    // prepare mapped values matching form field names
    const mapped = {
      user_id: navCompany.user_id || navCompany.userId || undefined,
      companyName: navCompany.companyName || navCompany.company_name || "",
      registrationNumber: navCompany.registrationNumber || navCompany.registration_no || "",
      email: navCompany.email || "",
      mobile: navCompany.mobile || "",
      landline: navCompany.landline || "",
      companyType: navCompany.companyType || "",
      sector: navCompany.sector || "",
      establishDate: navCompany.establishDate || navCompany.estDate || "",
      website: navCompany.website || "",
      gstNo: navCompany.gstNo || "",
      panNo: navCompany.panNo || "",
      address1: navCompany.address1 || navCompany.address || "",
      address2: navCompany.address2 || "",
      country: navCompany.country || "India",
      state: navCompany.state || "",
      district: navCompany.district || "",
      city: navCompany.city || "",
      pinCode: navCompany.pinCode || navCompany.pin_code || "",
      parentCompany: navCompany.parentCompany || "",
      parentCompanyName: navCompany.parentCompanyName || "",
    };

    // reset the form with the provided values
    reset(mapped);
  }, [location, reset]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/companies/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionStorage.getItem('user_name')}`,
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();
        // console.log("API Data:", data);

        if (data.company_types) setCompanyTypes(data.company_types);
        if (data.sectors) setSectors(data.sectors);

      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/get_states`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.states)) {
          setStates(data.states);
        } else {
          console.error("Unexpected states data structure:", data);
          setStates([]);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!watchState) {
        setDistricts([]);
        setCities([]);
        setCityPincodeMap({});
        return;
      }

      setIsLoadingDistricts(true);
      setDistricts([]);
      setCities([]);
      setCityPincodeMap({});
      setValue("district", "");
      setValue("city", "");
      setValue("pinCode", "");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/get_district?state=${encodeURIComponent(watchState)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success" && data.districts && typeof data.districts === 'object') {
          const districtNames = Object.keys(data.districts);
          setDistricts(districtNames);
        } else {
          console.error("Unexpected districts data structure:", data);
          setDistricts([]);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
        setDistricts([]);
      } finally {
        setIsLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [watchState, setValue]);

  // Fetch cities when district changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!watchDistrict || !watchState) {
        setCities([]);
        setCityPincodeMap({});
        return;
      }

      setIsLoadingCities(true);
      setCities([]);
      setCityPincodeMap({});
      setValue("city", "");
      setValue("pinCode", "");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/get_city?district=${encodeURIComponent(watchDistrict)}&state=${encodeURIComponent(watchState)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let citiesArray = [];
        let pincodeMap = {};

        if (data.status === "success" && data.cities && typeof data.cities === 'object') {
          citiesArray = Object.keys(data.cities);
          pincodeMap = data.cities;
        } else {
          // console.warn("⚠️ Unexpected cities format:", data);
          citiesArray = [];
        }

        setCities(citiesArray);
        setCityPincodeMap(pincodeMap);
      } catch (error) {
        console.error("❌ Error fetching cities:", error);
        setCities([]);
        setCityPincodeMap({});
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchCities();
  }, [watchDistrict, watchState, setValue]);

  // Auto-fill PIN code when city is selected
  useEffect(() => {
    if (watchCity && cityPincodeMap[watchCity]) {
      const pincode = cityPincodeMap[watchCity];
      setValue("pinCode", pincode);
      trigger("pinCode");


    }
  }, [watchCity, cityPincodeMap, setValue, trigger]);

  // Handle city change manually
  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setValue("city", selectedCity);

    // Auto-fill PIN code if available
    if (selectedCity && cityPincodeMap[selectedCity]) {
      const pincode = cityPincodeMap[selectedCity];
      setValue("pinCode", pincode);
    }

    trigger("city");
  };

  // Handle PIN code change
  const handlePinCodeChange = (e) => {
    setValue("pinCode", e.target.value);
    trigger("pinCode");
  };

  // Handle logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  // Form submission
  const onSubmit = async (formData) => {
    try {
      // console.log("Form data with user_id:", formData.user_id);

      const payload = {
        user_id: formData.user_id,
        name: formData.companyName,
        email: formData.email,
        mobile: formData.mobile,
        landline: formData.landline,
        registration_number: formData.registrationNumber,
        company_type: formData.companyType,
        sector: formData.sector,
        establish_date: formData.establishDate,
        website: formData.website,
        gst_no: formData.gstNo,
        pan_no: formData.panNo,
        address1: formData.address1,
        address2: formData.address2,
        country: formData.country,
        state: formData.state,
        district: formData.district,
        city: formData.city,
        pin_code: formData.pinCode,
        parent_company: formData.parentCompany,
        parent_company_name: formData.parentCompanyName,
      };

      console.log("Payload being sent:", payload);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/companies/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {
        setMessage({ type: "success", text: "Company added successfully!" });
        // Optional: Redirect after success
        setTimeout(() => navigate("/company-details"), 2000);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to add company" });
      }
    } catch (error) {
      console.error("Error submitting company:", error);
      setMessage({ type: "error", text: "Something went wrong." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-4 mt-30 mb-5 border border-gray-100">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Add Company</h1>
        <p className="text-gray-600">Fill in the details below to register your company</p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mt-4 p-3 rounded-lg text-center ${message.type === "success"
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden user_id field */}
        <input
          type="hidden"
          {...register("user_id")}
        />

        {/* Basic Information Section */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Company Name *</label>
              <input
                type="text"
                {...register("companyName")}
                placeholder="Enter Company Name"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email ID *</label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter Company Email Address"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Mobile No. *</label>
              <input
                type="text"
                {...register("mobile")}
                placeholder="Enter Mobile Number"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </div>

            {/* Landline */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Landline No.</label>
              <input
                type="text"
                {...register("landline")}
                placeholder="Enter Landline Number"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Company Details Section */}
        <div className="bg-blue-100 rounded-xl p-4 border-blue-100  ">
          <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Company Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registration Number */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Registration Number *</label>
              <input
                type="text"
                {...register("registrationNumber")}
                placeholder="Enter Registration Number"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Company Type *</label>
              <select
                {...register("companyType")}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
                disabled={loading}
              >
                <option value="">Select Company Type</option>
                {loading ? (
                  <option>Loading...</option>
                ) : (
                  companyTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))
                )}
              </select>
              {errors.companyType && (
                <p className="text-red-500 text-sm mt-1">{errors.companyType.message}</p>
              )}
            </div>

            {/* Sector */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Sector *</label>
              <select
                {...register("sector")}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
                disabled={loading}
              >
                <option value="">Select Sector</option>
                {loading ? (
                  <option>Loading...</option>
                ) : (
                  sectors.map((sector, index) => (
                    <option key={index} value={sector}>{sector}</option>
                  ))
                )}
              </select>
              {errors.sector && (
                <p className="text-red-500 text-sm mt-1">{errors.sector.message}</p>
              )}
            </div>

            {/* Establish Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Establish Date *</label>
              <input
                type="date"
                {...register("establishDate")}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
              {errors.establishDate && (
                <p className="text-red-500 text-sm mt-1">{errors.establishDate.message}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Website</label>
              <input
                type="text"
                {...register("website")}
                placeholder="Enter Website URL"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
              )}
            </div>

            {/* GST No */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">GST No</label>
              <input
                type="text"
                {...register("gstNo")}
                placeholder="Enter GST Number"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
            </div>

            {/* PAN No */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">PAN No</label>
              <input
                type="text"
                {...register("panNo")}
                placeholder="Enter PAN Number"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Address Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address 1 */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Address 1 *</label>
              <input
                type="text"
                {...register("address1")}
                placeholder="Enter Address..."
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
              {errors.address1 && (
                <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>
              )}
            </div>

            {/* Address 2 */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Address 2</label>
              <input
                type="text"
                {...register("address2")}
                placeholder="Enter Address..."
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">State *</label>
              <select
                {...register("state")}
                disabled={isLoadingStates}
                className={`w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white ${errors.state ? "border-red-500" : ""
                  }`}
              >
                <option value="">Select State</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {isLoadingStates && (
                <p className="text-blue-500 text-sm mt-1">Loading states...</p>
              )}
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
              )}
            </div>

            {/* District */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">District *</label>
              <select
                {...register("district")}
                disabled={!watchState || isLoadingDistricts}
                className={`w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white ${errors.district ? "border-red-500" : ""
                  }`}
              >
                <option value="">Select District</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">City *</label>
              <select
                {...register("city")}
                onChange={handleCityChange}
                disabled={!watchDistrict || isLoadingCities}
                className={`w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white ${errors.city ? "border-red-500" : ""
                  }`}
              >
                <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            {/* PIN Code */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">PIN Code *</label>
              <input
                type="text"
                {...register("pinCode")}
                onChange={handlePinCodeChange}
                placeholder="Auto-filled when city is selected"
                className={`w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white ${errors.pinCode ? "border-red-500" : ""
                  }`}
              />
              {errors.pinCode && (
                <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Country</label>
              <input
                type="text"
                {...register("country")}
                readOnly
                className="w-full border border-gray-300 bg-gray-100 px-4 py-3 rounded-lg text-gray-600 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-blue-100 rounded-xl p-4 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Logo Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Logo</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer bg-white"
                onClick={() => document.getElementById('logo-upload').click()}
              >
                <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-gray-600 text-sm">
                  {logoFile ? logoFile.name : "Click to upload logo"}
                </span>
                <input
                  id="logo-upload"
                  type="file"
                  onChange={handleLogoChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Parent Company */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Parent Company</label>
              <select
                {...register("parentCompany")}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              >
                <option value="">Select</option>
                <option>Audit Filing Pvt. Ltd.</option>
                <option>CloudSat Solutions</option>
                <option>TaxEase LLP</option>
              </select>
            </div>

            {/* Parent Company Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Parent Company Name</label>
              <input
                type="text"
                {...register("parentCompanyName")}
                placeholder="Enter Your Parent Company Name"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
              } text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 min-w-40`}
          >
            {isSubmitting ? "Submitting..." : "Submit Company Details"}
          </button>
        </div>
      </form>
    </div>
  );
}          
