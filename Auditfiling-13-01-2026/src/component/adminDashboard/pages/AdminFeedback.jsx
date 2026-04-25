
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Eye,
  X,
  MessageSquare,
  Star,
  CalendarDays,
  User,
  Phone,
  RefreshCcw,
  Search,
} from "lucide-react";

const FeedbackPage = () => {
  const token = sessionStorage.getItem("admin")
    ? JSON.parse(sessionStorage.getItem("admin")).token
    : null;

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [search, setSearch] = useState("");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/feedback`,
        {
          headers: getHeaders(),
        }
      );

      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const filteredFeedbacks = feedbacks.filter(
    (item) =>
      item.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.feedback?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Customer Feedback
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage all customer reviews and ratings.
            </p>
          </div>

          <button
            onClick={fetchFeedbacks}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition"
          >
            <RefreshCcw size={18} />
            Refresh
          </button>
        </div>

     

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by customer name or feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">#</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Feedback</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Rating</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      Loading feedbacks...
                    </td>
                  </tr>
                ) : filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-5 font-medium text-gray-700">
                        {index + 1}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="text-blue-600" size={16} />
                          </div>
                          <span className="font-semibold text-gray-800">
                            {item.user_name || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-gray-600 max-w-sm">
                        {item.feedback?.length > 60
                          ? item.feedback.slice(0, 60) + "..."
                          : item.feedback}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                          <Star size={14} fill="currentColor" />
                          {item.rating || 0}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-gray-600">
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-6 py-5 text-center">
                        <button
                          onClick={() => setSelectedFeedback(item)}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No feedback found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black/40  flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-fadeIn">

              <div className=" p-6 text-white relative">
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:rotate-90 transition"
                >
                  <X size={24} />
                </button>

                <h2 className="text-2xl font-bold">Feedback Details</h2>
                <p className="text-gray-500 mt-1">
                  Detailed customer review information
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <User size={16} />
                      <span className="text-sm">Customer Name</span>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {selectedFeedback.user_name || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Phone size={16} />
                      <span className="text-sm">Phone Number</span>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {selectedFeedback.phone || "N/A"}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Star size={16} />
                      <span className="text-sm">Rating</span>
                    </div>
                    <p className="font-semibold text-yellow-500">
                      ⭐ {selectedFeedback.rating || 0} / 5
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <CalendarDays size={16} />
                      <span className="text-sm">Date</span>
                    </div>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedFeedback.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 mb-3">
                    <MessageSquare size={18} />
                    <span className="font-semibold">Customer Feedback</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedFeedback.feedback}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;

