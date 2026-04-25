import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import storage from "../utils/storage";
import { FileText, Upload, Eye, Download, Calendar, Clock, AlertCircle } from "lucide-react";

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        try {
      setLoading(true);

      // ✅ Dynamically get userId from sessionStorage
      const { userId } = storage.getIds();

      if (!userId) {
        console.warn("⚠️ No userId found in sessionStorage");
        setError("User not logged in");
        setLoading(false);
        return;
      }
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/request`, {
        user_id: userId,
        });

        // console.log("🔍 Full API Response:", response.data);

        if (response.data.success && Array.isArray(response.data.payments)) {
          // ✅ Safely parse request_data if it's a JSON string
          const fixedPayments = response.data.payments.map((p) => {
            let parsedRequestData = {};
            try {
              parsedRequestData =
                typeof p.request_data === "string"
                  ? JSON.parse(p.request_data)
                  : p.request_data || {};
            } catch (err) {
              console.warn("⚠️ Failed to parse request_data for ID", p.id, p.request_data, err);
            }

            return {
              ...p,
              request_data: parsedRequestData,
            };
          });

          setRequests(fixedPayments);
        } else {
          setError("Failed to fetch payment data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Status display mapping
  const getPaymentStatus = (status) => {
    const s = (status || "").toLowerCase().trim();

    switch (s) {
      case "payment_done":
        return { text: "Completed", color: "bg-green-100 text-green-800 border border-green-200" };
      case "file_upload_started":
        return { text: "In Progress", color: "bg-blue-100 text-blue-800 border border-blue-200" };
      case "file_upload_done":
        return { text: "File Uploaded", color: "bg-purple-100 text-purple-800 border border-purple-200" };
      default:
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800 border border-yellow-200" };
    }
  };

  // Mobile Card Component
  const MobileRequestCard = ({ request }) => {
    const rawStatus = request?.request_data?.status
      ? request.request_data.status.trim()
      : "N/A";

    const statusInfo = getPaymentStatus(rawStatus);
    const reason = request?.request_data?.reason
      ? request.request_data.reason
      : "N/A";

    const serviceId =
      request?.service?.id || request?.service?.service_id || request?.service_id || null;
    const userId = request?.user_id || request?.userId || null;
    const rawLower = (rawStatus || "").toLowerCase();
    const docsUploaded = rawLower === "file_upload_done";

    const goToDocumentUpload = () => {
      storage.setIds({
        userId: userId || storage.getIds()?.userId,
        serviceId: serviceId || storage.getIds()?.serviceId,
      });
      navigate("/document");
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="font-semibold text-gray-900">#{request.id}</span>
          </div>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>

        {/* Service Info */}
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 text-sm">
              {request?.service?.service_name || "N/A"}
            </span>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>
              {request.payment_date
                ? new Date(request.payment_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>
              {request.payment_date
                ? new Date(request.payment_date).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-700 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200 flex-1">
              {reason}
            </div>
          </div>
        </div>

        {/* Status Detail */}
        <div className="mb-3">
          <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded text-center">
            {rawStatus}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {docsUploaded ? (
            <>
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition duration-200 flex items-center justify-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition duration-200 flex items-center justify-center space-x-1">
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
              </div>
              <div className="text-xs text-green-600 text-center font-medium bg-green-50 py-1 rounded">
                ✓ Documents Ready
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1.5 rounded-lg border border-red-200 text-center">
                ⚠️ Documents not uploaded
              </div>
              <button
                onClick={goToDocumentUpload}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition duration-200 flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Documents</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 sm:p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-base sm:text-lg text-gray-600 font-medium">Fetching your requests...</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-2">Please wait while we load your data</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4 sm:p-8">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-3xl sm:text-4xl mb-4">⚠️</div>
          <div className="text-red-600 font-semibold text-base sm:text-lg mb-2">Error Loading Data</div>
          <div className="text-gray-600 text-sm sm:text-base">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-200 text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-3 sm:px-6 mt-30 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 font-serif bg-blue-900 bg-clip-text text-transparent">
            My Payment Requests
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Track and manage all your service requests in one place
          </p>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden">
          <div className="space-y-3">
            {requests.length > 0 ? (
              requests.map((request) => (
                <MobileRequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-4xl sm:text-6xl mb-4">📋</div>
                <div className="text-lg sm:text-2xl font-semibold text-gray-600 mb-2">No payment requests found</div>
                <div className="text-gray-500 text-sm sm:text-base max-w-md mx-auto px-4">
                  When you make your first payment request, it will appear here for tracking.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          {/* Main Table Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className=" bg-blue-500 text-white border-b text-sm border-gray-200">
                    <th className="py-4 px-6 text-left font-semibold   uppercase tracking-wider">
                      Request Details
                    </th>
                    <th className="py-4 px-6 text-left font-semibold  uppercase tracking-wider">
                      Service
                    </th>
                    <th className="py-4 px-6 text-left font-semibold   uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="py-4 px-6 text-left font-semibold   uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-4 px-6 text-left font-semibold  uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {requests.map((request) => {
                    const rawStatus = request?.request_data?.status
                      ? request.request_data.status.trim()
                      : "N/A";

                    const statusInfo = getPaymentStatus(rawStatus);
                    const reason = request?.request_data?.reason
                      ? request.request_data.reason
                      : "N/A";

                    const serviceId =
                      request?.service?.id || request?.service?.service_id || request?.service_id || null;
                    const userId = request?.user_id || request?.userId || null;
                    const rawLower = (rawStatus || "").toLowerCase();
                    const docsUploaded = rawLower === "file_upload_done";

                    const goToDocumentUpload = () => {
                      storage.setIds({
                        userId: userId || storage.getIds()?.userId,
                        serviceId: serviceId || storage.getIds()?.serviceId,
                      });
                      navigate("/document");
                    };

                    return (
                      <tr key={request.id} className=" transition-colors duration-200 group">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors"></div>
                            <div>
                              <div className="font-semibold text-gray-900 text-lg">#{request.id}</div>
                              <div className="text-xs text-gray-500 mt-1">Request ID</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-800 font-medium">
                            {request?.service?.service_name || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-700">
                            {request.payment_date
                              ? new Date(request.payment_date).toLocaleString("en-IN", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col space-y-2">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                            <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                              {rawStatus}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            {reason}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col space-y-2 min-w-[200px]">
                            {docsUploaded ? (
                              <>
                                <div className="flex space-x-2">
                                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200 transform hover:scale-105 flex items-center justify-center space-x-1">
                                    <span>👁️</span>
                                    <span>View</span>
                                  </button>
                                  <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200 transform hover:scale-105 flex items-center justify-center space-x-1">
                                    <span>📥</span>
                                    <span>Download</span>
                                  </button>
                                </div>
                                <div className="text-xs text-green-600 text-center font-medium">
                                  ✓ Documents Ready
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-sm text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200 mb-2">
                                  ⚠️ Documents not uploaded
                                </div>
                                <button
                                  onClick={goToDocumentUpload}
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                                >
                                  <span>📤</span>
                                  <span>Upload Documents</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {requests.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <div className="text-2xl font-semibold text-gray-600 mb-2">No payment requests found</div>
                  <div className="text-gray-500 max-w-md mx-auto">
                    When you make your first payment request, it will appear here for tracking.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 sm:mt-8 text-gray-500 text-xs sm:text-sm">
          Need help? Contact our support team for assistance with your requests.
        </div>
      </div>
    </div>
  );
};

export default MyRequests;