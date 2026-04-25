import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, CalendarDays, Newspaper, PlusCircle, X, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function NotificationPage() {
  const token = sessionStorage.getItem("admin") ? JSON.parse(sessionStorage.getItem("admin")).token : null;
// console.log(token);


  const [notifications, setNotifications] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const [formData, setFormData] = useState({
    type: "latest_news",
    title: "",
    description: "",
    menu_id: "",
    menu_name: "",
    due_date: "",
    is_active: 1,
  });

  useEffect(() => {
    fetchNotifications();
    fetchMenus();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/notifications`,
        { headers: getHeaders() }
      );

      if (response.data.success) {
        console.log("Notifications:", response.data.notifications);
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
const fetchMenus = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/menus`,
      { headers: getHeaders() }
    );
    console.log("Menus response:", response.data);

    // Fix: The API returns an array directly
    if (Array.isArray(response.data)) {
      setMenus(response.data);
      console.log("Menus set successfully:", response.data);
    } else if (response.data.success && Array.isArray(response.data.menus)) {
      // Fallback in case structure changes
      setMenus(response.data.menus);
    } else {
      setMenus([]);
    }
  } catch (error) {
    console.error("Error fetching menus:", error);
    setMenus([]);
  }
};
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showStatusMessage("Please enter title", "error");
      return;
    }

    if (!formData.description.trim()) {
      showStatusMessage("Please enter description", "error");
      return;
    }

    if (formData.type === "due_date") {
      if (!formData.menu_id) {
        showStatusMessage("Please select menu", "error");
        return;
      }

      if (!formData.due_date) {
        showStatusMessage("Please select due date", "error");
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        menu_id: formData.menu_id ? Number(formData.menu_id) : null,
        due_date: formData.due_date || null,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/notifications`,
        payload,
        { headers: getHeaders() }
      );

      if (response.data.success) {
        showStatusMessage("Notification created successfully!", "success");

        setFormData({
          type: "latest_news",
          title: "",
          description: "",
          menu_id: "",
          menu_name: "",
          due_date: "",
          is_active: 1,
        });

        setShowForm(false);
        fetchNotifications();
      }
    } catch (error) {
      console.error("Create Notification Error:", error);
      showStatusMessage(error.response?.data?.message || "Failed to create notification", "error");
    } finally {
      setLoading(false);
    }
  };

  const showStatusMessage = (message, type) => {
    setNotificationStatus({ message, type });
    setTimeout(() => setNotificationStatus(null), 3000);
  };

  const dueDateNotifications = notifications.filter(
    (item) => item.type === "due_date"
  );

  const latestUpdates = notifications.filter(
    (item) => item.type === "latest_news"
  );

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isDueDateOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Status Message */}
        {notificationStatus && (
          <div className={`fixed top-24 right-6 z-50 animate-slide-in rounded-2xl shadow-lg p-4 flex items-center gap-3 ${
            notificationStatus.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}>
            {notificationStatus.type === "success" ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
            )}
            <p className={notificationStatus.type === "success" ? "text-green-800" : "text-red-800"}>
              {notificationStatus.message}
            </p>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <Bell className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Notification Management
              </h1>
              <p className="text-gray-500 text-sm">
                Create and manage latest updates and due date notifications
              </p>
            </div>
          </div>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <PlusCircle size={20} />
              Create Notification
            </button>
          )}
        </div>

        {/* Create Notification Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
              <div className=" px-6 py-5 flex items-center justify-between sticky top-0">
                <div className="flex items-center gap-3">
                  <PlusCircle className="text-white" size={20} />
                  <h2 className="text-2xl font-semibold text-white">
                    Create Notification
                  </h2>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notification Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="latest_news">📰 Latest Update</option>
                    <option value="due_date">📅 Due Date</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter notification title"
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter notification description"
                    className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Due Date Fields */}
                {formData.type === "due_date" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Menu
                      </label>
                      <select
                        name="menu_id"
                        value={formData.menu_id}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Menu</option>
                        {menus.map((menu) => (
                          <option key={menu.id} value={menu.id}>
                            {menu.menu_name}
                            
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {/* Form Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-2xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Notification"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Notifications</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{notifications.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Bell className="text-blue-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Latest Updates</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{latestUpdates.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Newspaper className="text-green-600" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Due Dates</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{dueDateNotifications.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <CalendarDays className="text-orange-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Latest Updates */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md">
                    <Newspaper className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Latest Updates
                    </h2>
                    <p className="text-sm text-gray-500">
                      Recent news and announcements
                    </p>
                  </div>
                </div>
                <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
                  {latestUpdates.length}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {latestUpdates.length > 0 ? (
                latestUpdates.map((item, index) => (
                  <div
                    key={item.id}
                    className="group bg-gradient-to-r from-blue-50/50 to-white border border-blue-100 rounded-2xl p-3 hover:shadow-lg transition-all duration-300 hover:border-blue-200 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="bg-green-100 px-2 py-1 rounded-full text-xs font-semibold text-green-700">
                        Active
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-6 mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200 pt-3">
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>Updated: {formatDate(item.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <Bell className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-400">No latest updates found</p>
                </div>
              )}
            </div>
          </div>

          {/* Due Dates */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-100 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-600 to-red-600 p-2 rounded-xl shadow-md">
                    <CalendarDays className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Due Dates
                    </h2>
                    <p className="text-sm text-gray-500">
                      Upcoming due date reminders
                    </p>
                  </div>
                </div>
                <span className="bg-red-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
                  {dueDateNotifications.length}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {dueDateNotifications.length > 0 ? (
                dueDateNotifications.map((item, index) => {
                  const isOverdue = isDueDateOverdue(item.due_date);
                  return (
                    <div
                      key={item.id}
                      className={`group rounded-2xl p-3 hover:shadow-lg transition-all duration-300 animate-fade-in-up ${
                        isOverdue 
                          ? "bg-gradient-to-r from-red-50 to-white border border-red-200" 
                          : "bg-gradient-to-r from-orange-50 to-white border border-orange-100"
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                          {item.title}
                        </h3>
                        {isOverdue && (
                          <div className="bg-red-100 px-2 py-1 rounded-full text-xs font-semibold text-red-700">
                            Overdue
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 leading-6">
                        {item.description}
                      </p>

                      <div className="space-y-2 text-sm border-t pt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-700">Menu Name:</span>
                          {/* FIXED: Use menu_name directly from the API response */}
                          <span className="text-gray-600">{item.menu_name || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-700">Due Date:</span>
                          <span className={`font-semibold ${isOverdue ? "text-red-600" : "text-orange-600"}`}>
                            {formatDate(item.due_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <CalendarDays className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-400">No due date notifications found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
          opacity: 0;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}