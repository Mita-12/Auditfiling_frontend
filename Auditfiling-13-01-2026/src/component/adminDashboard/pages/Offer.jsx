import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Tag,
  CalendarDays,
  Percent,
  CheckCircle,
  XCircle,
  Search,
  RefreshCcw,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
} from "lucide-react";

export default function OfferPage() {
  const token = sessionStorage.getItem("admin")
    ? JSON.parse(sessionStorage.getItem("admin")).token
    : null;
  
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    coupon_code: "",
    discount_per: "",
    from_dt: "",
    to_dt: "",
    status: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/offers`, {
        headers: getHeaders()
      });

      if (response.data.success) {
        setOffers(response.data.data);
      } else {
        setError("Failed to fetch offers");
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError(error.response?.data?.message || "Network error occurred");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchOffers();
    } else {
      setError("Authentication required. Please login again.");
      setLoading(false);
    }
  }, [fetchOffers, token]);

  const filteredOffers = offers.filter((offer) =>
    offer.coupon_code?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  const isOfferCurrentlyActive = (offer) => {
    const now = new Date();
    const startDate = new Date(offer.from_dt);
    const endDate = new Date(offer.to_dt);
    return offer.status === 0 && now >= startDate && now <= endDate;
  };

  const activeOffers = offers.filter(offer => isOfferCurrentlyActive(offer));
  const inactiveOffers = offers.filter(offer => !isOfferCurrentlyActive(offer));

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.coupon_code.trim()) {
      errors.coupon_code = "Coupon code is required";
    } else if (formData.coupon_code.length < 3) {
      errors.coupon_code = "Coupon code must be at least 3 characters";
    }
    if (!formData.discount_per) {
      errors.discount_per = "Discount percentage is required";
    } else if (formData.discount_per < 0 || formData.discount_per > 100) {
      errors.discount_per = "Discount must be between 0 and 100";
    }
    if (!formData.from_dt) {
      errors.from_dt = "Start date is required";
    }
    if (!formData.to_dt) {
      errors.to_dt = "End date is required";
    } else if (formData.from_dt && new Date(formData.to_dt) <= new Date(formData.from_dt)) {
      errors.to_dt = "End date must be after start date";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add/Update offer
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      let response;
      
      if (editingOffer) {
        // Update existing offer - FIXED: headers should be third parameter
        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/offers/${editingOffer.id}`,
          formData,
          { headers: getHeaders() }
        );
        if (response.data.success) {
          await fetchOffers();
          closeModal();
        }
      } else {
        // Add new offer - FIXED: headers should be third parameter
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/offers`,
          formData,
          { headers: getHeaders() }
        );
        if (response.data.success) {
          await fetchOffers();
          closeModal();
        }
      }
    } catch (error) {
      console.error("Error saving offer:", error);
      setError(error.response?.data?.message || "Failed to save offer");
    } finally {
      setLoading(false);
    }
  };

  // Delete offer
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/offers/${id}`,
        { headers: getHeaders() }
      );
      if (response.data.success) {
        await fetchOffers();
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      setError(error.response?.data?.message || "Failed to delete offer");
    } finally {
      setLoading(false);
    }
  };

  // Open modal for add/edit
  const openModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        coupon_code: offer.coupon_code,
        discount_per: offer.discount_per,
        from_dt: formatDateForInput(offer.from_dt),
        to_dt: formatDateForInput(offer.to_dt),
        status: offer.status,
      });
    } else {
      setEditingOffer(null);
      setFormData({
        coupon_code: "",
        discount_per: "",
        from_dt: "",
        to_dt: "",
        status: 0,
      });
    }
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOffer(null);
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Offer Management</h1>
            <p className="text-gray-500 mt-1">
              Manage coupon codes and discounts easily.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-md transition"
            >
              <Plus size={18} />
              Add Offer
            </button>
            <button
              onClick={fetchOffers}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-xl shadow-md transition"
            >
              <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Offers</p>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {offers.length}
                </h2>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Tag className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Offers</p>
                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {activeOffers.length}
                </h2>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Inactive Offers</p>
                <h2 className="text-3xl font-bold text-red-600 mt-2">
                  {inactiveOffers.length}
                </h2>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search coupon code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Offer Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Coupon Code
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Discount
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Start Date
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    End Date
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      <div className="flex justify-center items-center gap-2">
                        <RefreshCcw size={20} className="animate-spin" />
                        Loading offers...
                      </div>
                    </td>
                  </tr>
                ) : filteredOffers.length > 0 ? (
                  filteredOffers.map((offer) => (
                    <tr
                      key={offer.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Tag className="text-blue-600" size={18} />
                          </div>
                          <span className="font-semibold text-gray-800 tracking-wide uppercase">
                            {offer.coupon_code}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                          <Percent size={16} className="text-green-600" />
                          {offer.discount_per}% Off
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={16} className="text-gray-400" />
                          {formatDate(offer.from_dt)}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={16} className="text-gray-400" />
                          {formatDate(offer.to_dt)}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        {isOfferCurrentlyActive(offer) ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                            <CheckCircle size={14} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                            <XCircle size={14} /> Inactive
                          </span>
                        )}
                       </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openModal(offer)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(offer)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                       </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      {search ? "No matching offers found." : "No offers available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingOffer ? "Edit Offer" : "Add New Offer"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formData.coupon_code}
                  onChange={(e) =>
                    setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.coupon_code ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., SAVE20"
                />
                {formErrors.coupon_code && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.coupon_code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage *
                </label>
                <input
                  type="number"
                  value={formData.discount_per}
                  onChange={(e) =>
                    setFormData({ ...formData, discount_per: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.discount_per ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., 20"
                  min="0"
                  max="100"
                  step="1"
                />
                {formErrors.discount_per && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.discount_per}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.from_dt}
                  onChange={(e) =>
                    setFormData({ ...formData, from_dt: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.from_dt ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.from_dt && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.from_dt}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.to_dt}
                  onChange={(e) =>
                    setFormData({ ...formData, to_dt: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.to_dt ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.to_dt && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.to_dt}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Active</option>
                  <option value={1}>Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition"
                >
                  {loading ? (
                    <RefreshCcw size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {editingOffer ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Delete Offer</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the offer{" "}
                <span className="font-semibold">{deleteConfirm.coupon_code}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition"
                >
                  {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Trash2 size={18} />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}