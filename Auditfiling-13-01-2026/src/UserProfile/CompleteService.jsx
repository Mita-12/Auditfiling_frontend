import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import logger from '../utils/logger';
import { useNavigate } from "react-router-dom";
import { Search, Download, FileText, Calendar, CreditCard } from "lucide-react";

export default function CompletedService() {
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [completedServices, setCompletedServices] = useState([]);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(null);
  const [paymentStatusMap, setPaymentStatusMap] = useState({});
  const navigate = useNavigate();

  // ✅ Fetch completed services from API
  useEffect(() => {
    const fetchCompletedServices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user identifier from sessionStorage
        let userId = null;
        const userData = sessionStorage.getItem("user");
        if (userData) {
          try {
            const user = JSON.parse(userData);
            userId = user?.id || user?.user_id || user?.userId;
          } catch (e) {
            logger.error("Error parsing user data:", e);
          }
        }

        const identifier = userId || sessionStorage.getItem("user_name");
        if (!identifier) {
          setError("User not authenticated. Please login again.");
          setLoading(false);
          return;
        }

        const token = sessionStorage.getItem("token") || sessionStorage.getItem("user_name");

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/completed_services`,
          { user_id: identifier },
          {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`
            },
          }
        );

        // Handle API response based on the new structure
        if (response.data && response.data.success && Array.isArray(response.data.payments)) {
          const servicesData = response.data.payments;

          // Map API data to your specific field structure
          const formattedServices = servicesData.map((item, index) => {
            const partialPayment = item.customer_partial_payments;
            const isPartial = partialPayment !== null;
            const isPaid = !isPartial || parseFloat(partialPayment.transaction_unpaid_amount || 0) === 0;
            const remainingAmount = isPartial ? parseFloat(partialPayment.transaction_unpaid_amount || 0) : 0;

            return {
              id: item.id || `item_${index}`,
              requestId: item.order_id || `REQ_${index + 1}`,
              service: item.service_name || "Unknown Service",
              date: item.payment_date || new Date().toISOString().split('T')[0],
              status: item.status || "completed",
              fileUrl: item.file_path || null,
              fileName: item.file_name || "document.pdf",
              paymentId: partialPayment?.id || item.id,
              partialPaymentData: partialPayment,
              isPaid: isPaid,
              isPartial: isPartial,
              remainingAmount: remainingAmount
            };
          });

          setCompletedServices(formattedServices);

          // Initialize payment status map
          const initialStatusMap = {};
          formattedServices.forEach(service => {
            initialStatusMap[service.id] = {
              isPaid: service.isPaid,
              isPartial: service.isPartial,
              remainingAmount: service.remainingAmount,
              paymentData: service.partialPaymentData
            };
          });
          setPaymentStatusMap(initialStatusMap);

        } else {
          const errorMsg = response.data?.message || "No completed services data found";
          setError(errorMsg);
        }

      } catch (error) {
        let errorMessage = "Failed to load completed services";

        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = "Authentication failed. Please login again.";
          } else if (error.response.status === 404) {
            errorMessage = "No completed services found for this user.";
          } else if (error.response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message;
          }
        } else if (error.request) {
          errorMessage = "Network error. Please check your internet connection.";
        } else {
          errorMessage = error.message;
        }

        setError(errorMessage);
        setCompletedServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedServices();
  }, []);

  // Filter and paginate data
  const filteredData = useMemo(() => {
    if (!Array.isArray(completedServices)) return [];

    return completedServices.filter(
      (item) =>
        item.requestId.toLowerCase().includes(search.toLowerCase()) ||
        item.service.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, completedServices]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  // ✅ Download handler - only for paid services
  const handleDownload = (item) => {
    try {
      // Check if file URL is available
      if (!item.fileUrl) {
        alert("No document available for download.");
        return;
      }

      const link = document.createElement("a");
      link.href = item.fileUrl;
      link.target = "_blank";
      
      // Use the dynamic file name from API response, fallback to generic name
      const fileName = item.fileName || `document_${item.requestId}.pdf`;
      link.download = fileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  // ✅ Payment button handler for unpaid/partial payments
  const handlePayment = async (item) => {
    try {
      const paymentStatus = paymentStatusMap[item.id];

      if (!paymentStatus) {
        alert("Payment information not available. Please try again.");
        return;
      }

      // ✅ Already paid → download directly
      if (paymentStatus.isPaid) {
        await handleDownload(item);
        return;
      }

      // ✅ Extract details
      const remainingAmount = Number(paymentStatus.remainingAmount || 0);
      const isPartial = Boolean(paymentStatus.isPartial);

      if (remainingAmount <= 0) {
        alert("No payable amount remaining for this service.");
        return;
      }

      // ✅ Build correct API URL
      const baseURL = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
      const apiUrl = `${baseURL}/api/v1/rest_partial_payment`;

      // ✅ Get partial payment ID
      const partialPaymentId = item.partialPaymentData?.id || item.id;

      const payload = {
        partial_payment_id: partialPaymentId,
      };

      const response = await axios.post(apiUrl, payload);

      if (!response.data?.status) {
        alert("Failed to initiate payment session.");
        return;
      }

      // ✅ Prepare navigation data
      const serviceData = {
        id: item.id,
        service_name: item.service || "unknown-service",
      };

      const company = {
        id: item.partialPaymentData?.company_id || null,
      };

      const totalAmount = Number(
        item.partialPaymentData?.transaction_total_amount || remainingAmount
      );

      const partialPercent = isPartial
        ? ((remainingAmount / totalAmount) * 100).toFixed(0)
        : "100";

      const pricing = {
        amount: remainingAmount,
      };

      const paymentType = isPartial ? "partial" : "full";

      // ✅ Navigate to payment page
      navigate(`/service/${serviceData.service_name}/partial-to-payment`, {
        state: {
          serviceData,
          company,
          pricing,
          paymentType,
          partialPercent,
          payableAmount: remainingAmount,
          apiData: response.data,
          partialPaymentId, // ✅ Added partial payment ID
        },
      });
    } catch (error) {
      console.error("❌ Payment initiation error details:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        config: error.config?.url,
      });
      alert(`Failed to process payment: ${error.message}`);
    }
  };

  // ✅ Determine button type based on payment status
  const getActionButton = (item, isMobile = false) => {
    const paymentStatus = paymentStatusMap[item.id];

    // If payment status not loaded yet, use item's initial status
    const status = paymentStatus || {
      isPaid: item.isPaid,
      isPartial: item.isPartial,
      remainingAmount: item.remainingAmount
    };

    // ✅ PAID - Show Download Button
    if (status.isPaid) {
      return item.fileUrl ? (
        <button
          onClick={() => handleDownload(item)}
          className={`inline-flex items-center ${
            isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'
          } bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors`}
        >
          {isMobile ? <Download className="w-4 h-4" /> : 'Download'}
        </button>
      ) : (
        <span className="text-gray-400 text-sm">No file</span>
      );
    }

    // ✅ UNPAID or PARTIAL - Show Payment Button
    const isPartial = status.isPartial;
    const amount = status.remainingAmount;

    return (
      <button
        onClick={() => handlePayment(item)}
        disabled={processingPayment === item.id}
        className={`inline-flex items-center ${
          isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'
        } text-white rounded-lg transition-colors disabled:opacity-50 ${
          isPartial ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {processingPayment === item.id ? (
          <>
            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
            {isMobile ? '' : 'Processing...'}
          </>
        ) : (
          <>
            {isMobile ? <CreditCard className="w-4 h-4" /> : (isPartial ? `Pay ₹${amount}` : 'Pay Now')}
          </>
        )}
      </button>
    );
  };

  // ✅ Get status badge based on payment status
  const getStatusBadge = (item, isMobile = false) => {
    const paymentStatus = paymentStatusMap[item.id];

    // If payment status not loaded yet, use item's initial status
    const status = paymentStatus || {
      isPaid: item.isPaid,
      isPartial: item.isPartial,
      remainingAmount: item.remainingAmount
    };

    if (status.isPaid) {
      return (
        <span className={`inline-flex items-center ${
          isMobile ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-sm'
        } rounded-full font-medium bg-green-100 text-green-800`}>
          {isMobile ? '✅' : '✅ completed'}
        </span>
      );
    }

    if (status.isPartial) {
      return (
        <span className={`inline-flex items-center ${
          isMobile ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-sm'
        } rounded-full font-medium bg-orange-100 text-orange-800`}>
          {isMobile ? `⏳ ₹${status.remainingAmount}` : `⏳ Partial (₹${status.remainingAmount} due)`}
        </span>
      );
    }

    return (
      <span className={`inline-flex items-center ${
        isMobile ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs'
      } rounded-full font-medium bg-red-100 text-red-800`}>
        {isMobile ? '❌' : '❌ Unpaid'}
      </span>
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Mobile Card View Component
  const MobileServiceCard = ({ item }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-blue-500 font-medium text-sm">{item.requestId}</span>
          </div>
          <h3 className="font-medium text-gray-900 text-base mb-1">{item.service}</h3>
        </div>
        {getStatusBadge(item, true)}
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Calendar className="w-4 h-4" />
        <span>{formatDisplayDate(item.date)}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {item.fileUrl ? 'Document available' : 'No document'}
        </div>
        {getActionButton(item, true)}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 mt-30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading completed services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 mt-30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Error Loading Services</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-30 p-3 sm:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 text-center px-2">
          <h1 className="text-2xl sm:text-3xl font-semibold font-serif text-gray-900 mb-2 sm:mb-3">Completed Services</h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            View and download all your successfully completed service documents
          </p>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by Request ID or Service..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              {/* Entries Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                  </select>
                  <span className="text-sm text-gray-600">entries</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-3">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <MobileServiceCard key={item.id} item={item} />
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-gray-400 text-4xl mb-4">📭</div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  {completedServices.length === 0 ? "No completed services found" : "No matching services found"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {search ? "Try adjusting your search terms" : "You haven't completed any services yet"}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Pagination */}
          {filteredData.length > 0 && (
            <div className="flex flex-col items-center gap-4 mt-6 px-2">
              <div className="text-sm text-gray-600 text-center">
                Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm min-w-[80px]"
                >
                  ← Previous
                </button>

                <select
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {[...Array(totalPages)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      Page {index + 1}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm min-w-[80px]"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 border-b border-gray-200 gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-600">entries</span>
                </div>
              </div>

              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by Request ID or Service..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-blue-500 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Request ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Service Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-[15px] text-blue-500 font-medium">
                            {item.requestId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[15px] font-medium ">
                            {item.service}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDisplayDate(item.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(item)}
                        </td>
                        <td className="px-6 py-4">
                          {getActionButton(item)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-400 text-6xl mb-4">📭</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {completedServices.length === 0 ? "No completed services found" : "No matching services found"}
                        </h3>
                        <p className="text-gray-500">
                          {search ? "Try adjusting your search terms" : "You haven't completed any services yet"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-t border-gray-200 gap-4">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredData.length)} of{" "}
                  {filteredData.length} entries
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    ← Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 border rounded-lg transition-colors ${currentPage === index + 1
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}