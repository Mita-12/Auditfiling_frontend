

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import state_city from "../../../../assets/state_city.json";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Building2,
//   FileText,
//   Camera,
//   Save,
//   Globe,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   CreditCard,
//   Calendar,
// } from "lucide-react";

// export default function UserProfilePage() {
//   const [profile, setProfile] = useState({
//     full_name: "",
//     email: "",
//     phone: "",
//     country: "India",
//     state: "",
//     district: "",
//     city: "",
//     pin: "",
//     address_line_1: "",
//     address_line_2: "",
//     dob: "",
//     gender: "",
//     aadhaar_no: "",
//     pan_no: "",
//     photo: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [saveStatus, setSaveStatus] = useState({
//     show: false,
//     type: "",
//     message: "",
//   });

//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [pins, setPins] = useState([]);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [photoFile, setPhotoFile] = useState(null);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     setStates(Object.keys(state_city));
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const userStr = sessionStorage.getItem("user");
//       const token = userStr ? JSON.parse(userStr).token : null;

//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/profile`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const userData = response.data.user || response.data;

//       setProfile({
//         full_name: userData.full_name || "",
//         email: userData.email || "",
//         phone: userData.phone || "",
//         country: userData.country || "India",
//         state: userData.state || "",
//         district: userData.district || "",
//         city: userData.city || "",
//         pin: userData.pin || userData.pincode || "",
//         address_line_1: userData.address_line_1 || "",
//         address_line_2: userData.address_line_2 || "",
//         dob: userData.dob ? userData.dob.split("T")[0] : "",
//         gender: userData.gender || "",
//         aadhaar_no: userData.aadhaar_no || "",
//         pan_no: userData.pan_no || "",
//         photo: userData.photo || "",
//       });

//       if (userData.photo) {
//         setPhotoPreview(userData.photo);
//       }
//     } catch (error) {
//       console.error("Profile Fetch Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (profile.state) {
//       setDistricts(Object.keys(state_city[profile.state] || {}));
//     } else {
//       setDistricts([]);
//       setCities([]);
//       setPins([]);
//     }
//   }, [profile.state]);

//   useEffect(() => {
//     if (profile.state && profile.district) {
//       setCities(
//         Object.keys(state_city[profile.state]?.[profile.district] || {})
//       );
//     } else {
//       setCities([]);
//       setPins([]);
//     }
//   }, [profile.state, profile.district]);

//   // Auto-populate PIN code when city is selected
//   useEffect(() => {
//     if (profile.state && profile.district && profile.city) {
//       const selectedPin =
//         state_city[profile.state]?.[profile.district]?.[profile.city] || "";

//       // Auto-select the PIN if available (most cities have one PIN)
//       const pinArray = Array.isArray(selectedPin)
//         ? selectedPin
//         : selectedPin
//         ? [selectedPin]
//         : [];

//       setPins(pinArray);

//       // Auto-populate PIN field if there's exactly one PIN for this city
//       if (pinArray.length === 1 && profile.pin !== pinArray[0]) {
//         setProfile(prev => ({ ...prev, pin: pinArray[0] }));
//       }
//     } else {
//       setPins([]);
//     }
//   }, [profile.state, profile.district, profile.city]);

//   const validateForm = () => {
//     const newErrors = {};

//     if (!profile.full_name.trim()) {
//       newErrors.full_name = "Full name is required";
//     }

//     if (!profile.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
//       newErrors.email = "Invalid email address";
//     }

//     if (!profile.phone.trim()) {
//       newErrors.phone = "Phone number is required";
//     } else if (!/^[0-9]{10}$/.test(profile.phone)) {
//       newErrors.phone = "Phone number must be 10 digits";
//     }



//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setProfile((prev) => {
//       const updated = { ...prev, [name]: value };

//       if (name === "state") {
//         updated.district = "";
//         updated.city = "";
//         updated.pin = "";
//       }

//       if (name === "district") {
//         updated.city = "";
//         updated.pin = "";
//       }

//       if (name === "city") {
//         // When city changes, we'll auto-populate PIN via useEffect
//         updated.pin = "";
//       }

//       return updated;
//     });

//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     if (file.size > 2 * 1024 * 1024) {
//       setErrors((prev) => ({
//         ...prev,
//         photo: "Photo size must be less than 2MB",
//       }));
//       return;
//     }

//     setPhotoFile(file);
//     setPhotoPreview(URL.createObjectURL(file));
//   };

//   const handleSave = async () => {
//     if (!validateForm()) return;

//     try {
//       setSaving(true);

//       const userStr = sessionStorage.getItem("user");
//       const token = userStr ? JSON.parse(userStr).token : null;

//       const formData = new FormData();

//       Object.keys(profile).forEach((key) => {
//         if (key !== "photo") {
//           formData.append(key, profile[key]);
//         }
//       });

//       if (photoFile) {
//         formData.append("photo", photoFile);
//       }

//       await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/profile`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setSaveStatus({
//         show: true,
//         type: "success",
//         message: "Profile updated successfully",
//       });
//     } catch (error) {
//       console.error(error);
//       setSaveStatus({
//         show: true,
//         type: "error",
//         message: "Failed to update profile",
//       });
//     } finally {
//       setSaving(false);
//       setTimeout(() => {
//         setSaveStatus({ show: false, type: "", message: "" });
//       }, 3000);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-100">
//         <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   return (
//  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-4 px-4">
//   <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
//     {/* Header Section */}
//     <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 px-5 py-2 text-white">
//       <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//         <div>
//           <h1 className="text-xl font-bold tracking-tight">My Profile</h1>
//           <p className="text-blue-100 mt-2 text-sm">
//             View and manage your personal & business information
//           </p>
//         </div>

//         <div className="relative">
//           <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
//             {photoPreview ? (
//               <img
//                 src={photoPreview}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
//                 <User className="w-12 h-12 text-slate-400" />
//               </div>
//             )}
//           </div>

//           <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-slate-100 transition-all">
//             <Camera className="w-3 h-3 text-slate-600" />
//             <input
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={handlePhotoChange}
//             />
//           </label>
//         </div>
//       </div>
//     </div>

//     {/* Main Content */}
//     <div className="p-6">
//       {/* Status Alert */}
//       {saveStatus.show && (
//         <div
//           className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
//             saveStatus.type === "success"
//               ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
//               : "bg-rose-50 text-rose-700 border border-rose-200"
//           }`}
//         >
//           {saveStatus.type === "success" ? (
//             <CheckCircle className="w-5 h-5" />
//           ) : (
//             <AlertCircle className="w-5 h-5" />
//           )}
//           <span className="font-medium">{saveStatus.message}</span>
//         </div>
//       )}

//      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//   {/* Personal Information Card - Takes 2/3 width (larger) */}
//   <div className="lg:col-span-1 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
//     <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-200">
//       <User className="w-5 h-5 text-blue-600" />
//       <h2 className="text-lg font-semibold text-slate-800">Personal Information</h2>
//     </div>

//     <div className="space-y-4">
//       {/* Full Name */}
//       <div className="md:col-span-2">
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           Full Name
//         </label>
//         <div className="relative">
//           <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="text"
//             name="full_name"
//             value={profile.full_name}
//             onChange={handleChange}
//             placeholder="Enter your full name"
//             className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
//           />
//         </div>
//       </div>

//       {/* Email */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           Email Address
//         </label>
//         <div className="relative">
//           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="email"
//             name="email"
//             value={profile.email}
//             onChange={handleChange}
//             placeholder="your@email.com"
//             className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//           />
//         </div>
//       </div>

//       {/* Phone */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           Phone Number
//         </label>
//         <div className="relative">
//           <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="tel"
//             name="phone"
//             value={profile.phone}
//             onChange={handleChange}
//             placeholder="10-digit mobile number"
//             className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//           />
//         </div>
//       </div>

//       {/* Date of Birth */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           Date of Birth
//         </label>
//         <div className="relative">
//           <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input
//             type="date"
//             name="dob"
//             value={profile.dob}
//             onChange={handleChange}
//             className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//           />
//         </div>
//       </div>

//       {/* Gender */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           Gender
//         </label>
//         <select
//           name="gender"
//           value={profile.gender}
//           onChange={handleChange}
//           className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//         >
//           <option value="">Select gender</option>
//           <option value="Male">Male</option>
//           <option value="Female">Female</option>
//           <option value="Other">Other</option>
//         </select>
//       </div>
//     </div>
//   </div>

//   {/* Address Information Card - Takes 2/3 width (larger) */}
//   <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
//     <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-200">
//       <MapPin className="w-5 h-5 text-blue-600" />
//       <h2 className="text-lg font-semibold text-slate-800">Address Information</h2>
//     </div>

//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Address Line 1 */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           Address Line 1
//         </label>
//         <textarea
//           name="address_line_1"
//           value={profile.address_line_1}
//           onChange={handleChange}
//           rows="2"
//           placeholder="House number, building name, street"
//           className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white resize-none"
//         />
//       </div>

//       {/* Address Line 2 */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           Address Line 2 <span className="text-slate-400 text-xs normal-case">(Optional)</span>
//         </label>
//         <textarea
//           name="address_line_2"
//           value={profile.address_line_2}
//           onChange={handleChange}
//           rows="2"
//           placeholder="Landmark, area, locality"
//           className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white resize-none"
//         />
//       </div>

//       {/* State */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           State
//         </label>
//         <select
//           name="state"
//           value={profile.state}
//           onChange={handleChange}
//           className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//         >
//           <option value="">Select state</option>
//           {states.map((state) => (
//             <option key={state} value={state}>
//               {state}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* District */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           District
//         </label>
//         <select
//           name="district"
//           value={profile.district}
//           onChange={handleChange}
//           className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//           disabled={!profile.state}
//         >
//           <option value="">Select district</option>
//           {districts.map((district) => (
//             <option key={district} value={district}>
//               {district}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* City */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           City / Town
//         </label>
//         <select
//           name="city"
//           value={profile.city}
//           onChange={handleChange}
//           className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//           disabled={!profile.district}
//         >
//           <option value="">Select city</option>
//           {cities.map((city) => (
//             <option key={city} value={city}>
//               {city}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* PIN Code - Auto-populated */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           PIN Code
//         </label>
//         <select
//           name="pin"
//           value={profile.pin}
//           onChange={handleChange}
//           className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//           disabled={!profile.city || pins.length === 0}
//         >
//           <option value="">
//             {!profile.city 
//               ? "Select city first" 
//               : pins.length === 0 
//               ? "No PIN code available" 
//               : "Select PIN code"}
//           </option>
//           {pins.map((pin) => (
//             <option key={pin} value={pin}>
//               {pin}
//             </option>
//           ))}
//         </select>
//         {profile.city && pins.length === 1 && (
//           <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
//             <CheckCircle className="w-3 h-3" />
//             PIN code automatically selected
//           </p>
//         )}
//       </div>

//       {/* Aadhaar Number */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           Aadhaar Number
//         </label>
//         <input
//           type="text"
//           name="aadhaar_no"
//           value={profile.aadhaar_no}
//           onChange={handleChange}
//           placeholder="XXXX XXXX XXXX"
//           className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
//         />
//       </div>

//       {/* PAN Number */}
//       <div>
//         <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
//           PAN Number
//         </label>
//         <input
//           type="text"
//           name="pan_no"
//           value={profile.pan_no}
//           onChange={handleChange}
//           placeholder="ABCDE1234F"
//           className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white uppercase"
//         />
//       </div>
//     </div>
//   </div>

//   {/* Save Button - Spans both columns */}
//   <div className="lg:col-span-3 flex justify-end mt-4">
//     <button
//       onClick={handleSave}
//       disabled={saving}
//       className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
//     >
//       {saving ? (
//         <Loader2 className="w-4 h-4 animate-spin" />
//       ) : (
//         <Save className="w-4 h-4" />
//       )}
//       {saving ? "Saving..." : "Save Changes"}
//     </button>
//   </div>
// </div>
//     </div>
//   </div>
// </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import state_city from "../../../../assets/state_city.json";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Camera,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function UserProfilePage() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "India",
    state: "",
    district: "",
    city: "",
    pin: "",
    address_line_1: "",
    address_line_2: "",
    dob: "",
    gender: "",
    aadhaar_no: "",
    pan_no: "",
    photo: "",
    has_password: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [pins, setPins] = useState([]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Password state - integrated with profile save
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setStates(Object.keys(state_city));
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userStr = sessionStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).token : null;

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = response.data.user || response.data;

      setProfile({
        full_name: userData.full_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        country: userData.country || "India",
        state: userData.state || "",
        district: userData.district || "",
        city: userData.city || "",
        pin: userData.pin || userData.pincode || "",
        address_line_1: userData.address_line_1 || "",
        address_line_2: userData.address_line_2 || "",
        dob: userData.dob ? userData.dob.split("T")[0] : "",
        gender: userData.gender || "",
        aadhaar_no: userData.aadhaar_no || "",
        pan_no: userData.pan_no || "",
        photo: userData.photo || "",
        has_password: !!userData.password,
      });

      if (userData.photo) {
        setPhotoPreview(userData.photo);
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      setSaveStatus({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Failed to load profile",
      });
      setTimeout(() => {
        setSaveStatus({ show: false, type: "", message: "" });
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile.state && state_city[profile.state]) {
      setDistricts(Object.keys(state_city[profile.state] || {}));
    } else {
      setDistricts([]);
      setCities([]);
      setPins([]);
    }
  }, [profile.state]);

  useEffect(() => {
    if (profile.state && profile.district && state_city[profile.state]?.[profile.district]) {
      setCities(
        Object.keys(state_city[profile.state][profile.district] || {})
      );
    } else {
      setCities([]);
      setPins([]);
    }
  }, [profile.state, profile.district]);

  useEffect(() => {
    if (profile.state && profile.district && profile.city) {
      const selectedPin =
        state_city[profile.state]?.[profile.district]?.[profile.city] || "";

      const pinArray = Array.isArray(selectedPin)
        ? selectedPin
        : selectedPin
          ? [selectedPin]
          : [];

      setPins(pinArray);

      if (pinArray.length === 1 && profile.pin !== pinArray[0]) {
        setProfile(prev => ({ ...prev, pin: pinArray[0] }));
      }
    } else {
      setPins([]);
    }
  }, [profile.state, profile.district, profile.city]);

  // Real-time password confirmation validation
  useEffect(() => {
    if (passwordData.confirm_password) {
      if (passwordData.new_password !== passwordData.confirm_password) {
        setPasswordErrors(prev => ({
          ...prev,
          confirm_password: "Passwords do not match"
        }));
      } else {
        setPasswordErrors(prev => ({
          ...prev,
          confirm_password: ""
        }));
      }
    }
  }, [passwordData.new_password, passwordData.confirm_password]);

  const validateForm = () => {
    const newErrors = {};

    if (!profile.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!profile.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!profile.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(profile.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (profile.aadhaar_no && !/^[0-9]{12}$/.test(profile.aadhaar_no.replace(/\s/g, ''))) {
      newErrors.aadhaar_no = "Aadhaar number must be 12 digits";
    }

    if (profile.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(profile.pan_no)) {
      newErrors.pan_no = "Invalid PAN number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    // If no password is being set/changed, return true
    if (!passwordData.new_password && !passwordData.confirm_password) {
      return true;
    }

    const newErrors = {};

    // If user already has a password and trying to change it, current password is required
    if (profile.has_password && passwordData.new_password && !passwordData.current_password) {
      newErrors.current_password = "Current password is required to change password";
    }

    if (passwordData.new_password) {
      if (passwordData.new_password.length < 8) {
        newErrors.new_password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(passwordData.new_password)) {
        newErrors.new_password = "Password must contain uppercase, lowercase, number and special character";
      }
    }

    if (passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "state") {
        updated.district = "";
        updated.city = "";
        updated.pin = "";
      }

      if (name === "district") {
        updated.city = "";
        updated.pin = "";
      }

      if (name === "city") {
        updated.pin = "";
      }

      return updated;
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "Photo size must be less than 2MB",
      }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        photo: "Please upload an image file",
      }));
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, photo: "" }));
  };

  // Single save function that handles both profile and password updates
  const handleSaveAll = async () => {
    // Validate both forms
    const isProfileValid = validateForm();
    const isPasswordValid = validatePasswordForm();

    if (!isProfileValid || !isPasswordValid) {
      setSaveStatus({
        show: true,
        type: "error",
        message: "Please fix the validation errors before saving",
      });
      setTimeout(() => {
        setSaveStatus({ show: false, type: "", message: "" });
      }, 3000);
      return;
    }

    try {
      setSaving(true);

      const userStr = sessionStorage.getItem("user");
      const token = userStr ? JSON.parse(userStr).token : null;

      if (!token) {
        throw new Error("No authentication token found");
      }

      // Step 1: Update Profile
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        if (key !== "photo" && key !== "has_password" && profile[key]) {
          formData.append(key, profile[key]);
        }
      });
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await axios.put(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Step 2: Update Password if user provided new password
      if (passwordData.new_password) {
        const passwordPayload = profile.has_password
          ? {
              current_password: passwordData.current_password,
              new_password: passwordData.new_password,
            }
          : {
              new_password: passwordData.new_password,
            };

        await axios.put(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/change-password`,
          passwordPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Update has_password status if it was first time setup
        if (!profile.has_password) {
          setProfile(prev => ({ ...prev, has_password: true }));
        }

        // Clear password fields after successful update
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
        
        // Reset visibility toggles
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      }

      // Success message
      const successMessage = passwordData.new_password
        ? profile.has_password
          ? "Profile and password updated successfully!"
          : "Profile updated and password set successfully!"
        : "Profile updated successfully!";

      setSaveStatus({
        show: true,
        type: "success",
        message: successMessage,
      });

      // Refresh profile data
      await fetchProfile();

      // Update session storage with updated user data
      const updatedUserStr = sessionStorage.getItem("user");
      if (updatedUserStr) {
        const updatedUser = JSON.parse(updatedUserStr);
        updatedUser.has_password = !profile.has_password && passwordData.new_password ? true : profile.has_password;
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }

    } catch (error) {
      console.error("Save Error:", error);
      setSaveStatus({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Failed to save changes",
      });
    } finally {
      setSaving(false);
      setTimeout(() => {
        setSaveStatus({ show: false, type: "", message: "" });
      }, 3000);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { text: '', color: '', width: '0%' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const strengths = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['#ef4444', '#f59e0b', '#eab308', '#3b82f6', '#10b981'];

    return {
      text: strengths[strength - 1] || 'Very Weak',
      color: colors[strength - 1] || '#ef4444',
      width: `${(strength / 5) * 100}%`
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 py-4 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 px-5 py-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
              <p className="text-blue-100 mt-1 text-sm">
                View and manage your personal & business information
              </p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <User className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>

              <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-slate-100 transition-all">
                <Camera className="w-4 h-4 text-slate-600" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Status Alert */}
          {saveStatus.show && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                saveStatus.type === "success"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {saveStatus.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{saveStatus.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information Card */}
            <div className="lg:col-span-1 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-200">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-800">Personal Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                        errors.full_name ? 'border-red-500' : 'border-slate-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all`}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                        errors.email ? 'border-red-500' : 'border-slate-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border ${
                        errors.phone ? 'border-red-500' : 'border-slate-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      name="dob"
                      value={profile.dob}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Address Information Card */}
            <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-200">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-800">Address Information</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    Address Line 1
                  </label>
                  <textarea
                    name="address_line_1"
                    value={profile.address_line_1}
                    onChange={handleChange}
                    rows="2"
                    placeholder="House number, building name, street"
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white resize-none"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    Address Line 2 <span className="text-slate-400 text-xs normal-case">(Optional)</span>
                  </label>
                  <textarea
                    name="address_line_2"
                    value={profile.address_line_2}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Landmark, area, locality"
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    State
                  </label>
                  <select
                    name="state"
                    value={profile.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select state</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    District
                  </label>
                  <select
                    name="district"
                    value={profile.district}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    disabled={!profile.state}
                  >
                    <option value="">Select district</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    City / Town
                  </label>
                  <select
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    disabled={!profile.district}
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    PIN Code
                  </label>
                  <select
                    name="pin"
                    value={profile.pin}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    disabled={!profile.city || pins.length === 0}
                  >
                    <option value="">
                      {!profile.city
                        ? "Select city first"
                        : pins.length === 0
                          ? "No PIN code available"
                          : "Select PIN code"}
                    </option>
                    {pins.map((pin) => (
                      <option key={pin} value={pin}>
                        {pin}
                      </option>
                    ))}
                  </select>
                  {profile.city && pins.length === 1 && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      PIN code automatically selected
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    name="aadhaar_no"
                    value={profile.aadhaar_no}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX"
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border ${
                      errors.aadhaar_no ? 'border-red-500' : 'border-slate-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white`}
                  />
                  {errors.aadhaar_no && (
                    <p className="text-red-500 text-xs mt-1">{errors.aadhaar_no}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="pan_no"
                    value={profile.pan_no}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className={`w-full px-4 py-2.5 text-sm rounded-lg border ${
                      errors.pan_no ? 'border-red-500' : 'border-slate-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white uppercase`}
                  />
                  {errors.pan_no && (
                    <p className="text-red-500 text-xs mt-1">{errors.pan_no}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Password Management Card - Integrated with visibility toggles */}
            <div className="lg:col-span-3 bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-200">
                <Lock className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-800">
                  {profile.has_password ? "Change Password (Optional)" : "Set Password (Optional)"}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Password - Only show if user has existing password */}
                {profile.has_password && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password"
                        className={`w-full pl-10 pr-12 py-2.5 text-sm rounded-lg border ${
                          passwordErrors.current_password ? 'border-red-500' : 'border-slate-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordErrors.current_password && (
                      <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password}</p>
                    )}
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    New Password {passwordData.new_password && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      placeholder={profile.has_password ? "Enter new password" : "Create a strong password (optional)"}
                      className={`w-full pl-10 pr-12 py-2.5 text-sm rounded-lg border ${
                        passwordErrors.new_password ? 'border-red-500' : 'border-slate-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.new_password && (
                    <p className="text-red-500 text-xs mt-1">{passwordErrors.new_password}</p>
                  )}

                  {/* Password requirements */}
                  {passwordData.new_password && (
                    <ul className="mt-2 text-xs text-slate-500 flex flex-wrap gap-3">
                      <li className={passwordData.new_password.length >= 8 ? "text-green-600" : ""}>
                        8+ characters
                      </li>
                      <li className={/[A-Z]/.test(passwordData.new_password) ? "text-green-600" : ""}>
                        Uppercase
                      </li>
                      <li className={/[a-z]/.test(passwordData.new_password) ? "text-green-600" : ""}>
                        Lowercase
                      </li>
                      <li className={/[0-9]/.test(passwordData.new_password) ? "text-green-600" : ""}>
                        Number
                      </li>
                      <li className={/[@$!%*?&]/.test(passwordData.new_password) ? "text-green-600" : ""}>
                        Special char
                      </li>
                    </ul>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
                    Confirm Password {passwordData.confirm_password && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      placeholder="Confirm your password"
                      className={`w-full pl-10 pr-12 py-2.5 text-sm rounded-lg border ${
                        passwordErrors.confirm_password ? 'border-red-500' : 'border-slate-300'
                      } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordErrors.confirm_password && (
                    <p className="text-red-500 text-xs mt-1">{passwordErrors.confirm_password}</p>
                  )}

                  {/* Password Strength Indicator */}
                  {passwordData.new_password && (
                    <div className="mt-4">
                      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-300 rounded-full"
                          style={{
                            width: getPasswordStrength(passwordData.new_password).width,
                            backgroundColor: getPasswordStrength(passwordData.new_password).color
                          }}
                        />
                      </div>
                      <p className="text-xs mt-1" style={{ color: getPasswordStrength(passwordData.new_password).color }}>
                        Strength: {getPasswordStrength(passwordData.new_password).text}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-slate-500 mt-3">
                * Leave password fields empty if you don't want to change/set a password
              </p>
            </div>

            {/* Single Save Button */}
            <div className="lg:col-span-3 flex justify-end mt-4">
              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saving ? "Saving Changes..." : "Save All Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}