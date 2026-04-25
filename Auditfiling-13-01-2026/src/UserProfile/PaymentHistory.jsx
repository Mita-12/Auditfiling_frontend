import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";

// Payment service for API calls
const paymentService = {
  fetchPaymentHistory: async (identifier, token) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/payment/history`,
      { user_id: identifier },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );
    return response.data;
  }
};

// Utility functions (unchanged)
const getUserId = () => {
  let userId = null;
  let userEmail = sessionStorage.getItem("user_name");

  const userData = sessionStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      userId = user?.id || user?.user_id || user?.userId;
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }

  return userId || userEmail;
};

const getToken = () => {
  return sessionStorage.getItem("token") || sessionStorage.getItem("user_name");
};

const getStringValue = (value, defaultValue = "N/A") => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') return value.toString();
  if (value && typeof value === 'object') {
    if (value.service_name) return value.service_name;
    if (value.name) return value.name;
    if (value.title) return value.title;
    return JSON.stringify(value);
  }
  return defaultValue;
};

const formatPaymentData = (paymentData) => {
  return paymentData.map((item, index) => {
    let amountValue = 0;
    let amountDisplay = "₹ 0.00";

    if (item.amount) {
      const amountNum = typeof item.amount === 'string' ? parseFloat(item.amount.replace(/[^0-9.-]+/g, "")) : item.amount;
      amountValue = parseFloat(amountNum) || 0;
      amountDisplay = `₹ ${amountValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (item.price) {
      const priceNum = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, "")) : item.price;
      amountValue = parseFloat(priceNum) || 0;
      amountDisplay = `₹ ${amountValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return {
      id: item.id || item.payment_id || item.order_id || `payment_${index}`,
      slNo: index + 1,
      requestId: getStringValue(item.order_id || item.request_id || item.reference_id, `REQ_${index + 1}`),
      service: getStringValue(item.service_name || item.service_type || item.service, "Unknown Service"),
      amount: amountDisplay,
      amountValue: amountValue,
      paymentStatus: getStringValue(item.payment_status || item.status, "Pending"),
      transactionId: getStringValue(item.transaction_id || item.txn_id, "N/A"),
      transactionDate: getStringValue(item.payment_date || item.created_at || item.date, new Date().toISOString().split('T')[0]),
    };
  });
};

// Main Component - Made mobile responsive
function PaymentHistory() {
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch payment history from API (unchanged)
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const identifier = getUserId();
        const token = getToken();

        if (!identifier) {
          setError("User not authenticated. Please login again.");
          setLoading(false);
          return;
        }

        const data = await paymentService.fetchPaymentHistory(identifier, token);

        if (data && data.success) {
          let paymentData = [];

          if (Array.isArray(data.data)) {
            paymentData = data.data;
          } else if (Array.isArray(data.payments)) {
            paymentData = data.payments;
          } else if (Array.isArray(data.history)) {
            paymentData = data.history;
          } else if (data.data && typeof data.data === 'object') {
            paymentData = Object.values(data.data);
          } else if (Array.isArray(data)) {
            paymentData = data;
          }

          const formattedPayments = formatPaymentData(paymentData);
          setPaymentHistory(formattedPayments);
        } else {
          setError("No payment history data found");
          setPaymentHistory([]);
        }

      } catch (error) {
        let errorMessage = "Failed to load payment history";

        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = "Authentication failed. Please login again.";
          } else if (error.response.status === 404) {
            errorMessage = "No payment history found for this user.";
          } else if (error.response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          }
        } else if (error.request) {
          errorMessage = "Network error. Please check your internet connection.";
        }

        setError(errorMessage);
        setPaymentHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [retryCount]);

  // Status configuration based on actual data (unchanged)
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();

    if (statusLower?.includes('captured') || statusLower?.includes('completed')) {
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: "✅"
      };
    } else if (statusLower?.includes('fail') || statusLower?.includes('reject')) {
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: "❌"
      };
    } else if (statusLower?.includes('pending') || statusLower?.includes('processing')) {
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: "⏳"
      };
    } else {
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: "📝"
      };
    }
  };

  // Handle sorting (unchanged)
  const handleSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort data (unchanged)
  const filteredAndSortedData = useMemo(() => {
    if (!Array.isArray(paymentHistory)) return [];

    let filtered = paymentHistory.filter((item) => {
      const matchesSearch =
        item.requestId.toLowerCase().includes(search.toLowerCase()) ||
        item.service.toLowerCase().includes(search.toLowerCase()) ||
        item.transactionId.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || item.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'amountValue') {
          aVal = a.amountValue;
          bVal = b.amountValue;
        }

        if (sortConfig.key === 'transactionDate') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [search, statusFilter, paymentHistory, sortConfig]);

  // Calculate pagination (unchanged)
  const totalPages = Math.ceil(filteredAndSortedData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + entriesPerPage);

  const handleExportCSV = async () => {
    setLoading(true);

    try {
      const identifier = getUserId();
      const token = getToken();

      if (!identifier) {
        alert("User not authenticated");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/payment/history`,
        { user_id: identifier },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!response.data?.payments?.length) {
        alert("No payment records found!");
        return;
      }

      const invoice = response.data.payments[0];

      let base64Data = invoice.invoice_base64;

      if (!base64Data) {
        alert("Invoice PDF not available!");
        return;
      }

      base64Data = base64Data.replace(/^data:application\/pdf;base64,/, "");

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");

    } catch (error) {
      console.error("❌ Error previewing PDF:", error);
      alert("Failed to preview invoice PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
  };

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        {isMobile ? '←' : '← Previous'}
      </button>
    );

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
      >
        {isMobile ? '→' : 'Next →'}
      </button>
    );

    return buttons;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      if (isMobile) {
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        });
      }
      
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Mobile Card View
  const MobileCardView = ({ data }) => {
    return (
      <div className="space-y-4">
        {data.map((item, idx) => {
          const statusConfig = getStatusConfig(item.paymentStatus);
          return (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {startIndex + idx + 1}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                      <span className="mr-1">{statusConfig.icon}</span>
                      {item.paymentStatus}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {item.amount}
                  </div>
                </div>

                {/* Service Info */}
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">{item.service}</div>
                  <div className="text-xs text-blue-600 font-mono">{item.requestId}</div>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">Transaction ID</div>
                    <div className="font-mono text-xs truncate">{item.transactionId}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Date</div>
                    <div className="text-gray-900">{formatDisplayDate(item.transactionDate)}</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={handleExportCSV}
                    className="w-full inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <span className="mr-2">📥</span>
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 mt-30 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading payment history...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 mt-30 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-12 text-center">
            <div className="text-red-500 text-4xl sm:text-6xl mb-4">❌</div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Error Loading Payment History</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 mt-30 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">Payment History</h1>
          <p className="text-gray-600 text-sm sm:text-base">Track and manage all your payment transactions</p>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col gap-4">
            {/* Entries Selector */}
            <div className="flex items-center justify-between sm:justify-start sm:space-x-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-2 py-1 sm:px-3 sm:py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            {/* Search and Filter */}
            {/* <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by Request ID, Service, or Transaction ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors w-full text-sm"
              />
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              >
                <option value="all">All Status</option>
                <option value="success">captured</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
              </select>
            </div>  */}
          </div>
        </div>

        {/* Data Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isMobile ? (
            // Mobile Card View
            <div className="p-4">
              {paginatedData.length > 0 ? (
                <MobileCardView data={paginatedData} />
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-3">💳</div>
                  <h3 className="text-base font-medium text-gray-900 mb-2">
                    {paymentHistory.length === 0 ? "No payment history found" : "No matching transactions found"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {search || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't made any payments yet"
                    }
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Desktop Table View
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-blue-500 text-white border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors" onClick={() => handleSort('slNo')}>
                        Sl No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors" onClick={() => handleSort('requestId')}>
                        Request ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors" onClick={() => handleSort('service')}>
                        Name of Service
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors" onClick={() => handleSort('amountValue')}>
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors" onClick={() => handleSort('paymentStatus')}>
                        Payment Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-blue-600 transition-colors" onClick={() => handleSort('transactionDate')}>
                        Transaction Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item, idx) => {
                        const statusConfig = getStatusConfig(item.paymentStatus);
                        return (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="text-sm font-semibold text-gray-700">
                                {startIndex + idx + 1}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-mono text-blue-600 font-medium">
                                {item.requestId}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">
                                {item.service}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-base font-bold text-gray-900">
                                {item.amount}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                                <span className="mr-1">{statusConfig.icon}</span>
                                {item.paymentStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-mono text-gray-700">
                                {item.transactionId}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-900">
                                {formatDisplayDate(item.transactionDate)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={handleExportCSV}
                                className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                title="Download invoice"
                              >
                                <span className="mr-1">📥</span>
                                Download
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <div className="text-gray-400 text-6xl mb-4">💳</div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {paymentHistory.length === 0 ? "No payment history found" : "No matching transactions found"}
                          </h3>
                          <p className="text-gray-600">
                            {search || statusFilter !== "all"
                              ? "Try adjusting your search or filter criteria"
                              : "You haven't made any payments yet"
                            }
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Pagination */}
          {filteredAndSortedData.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 border-t border-gray-200 gap-3">
              <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredAndSortedData.length)} of{" "}
                {filteredAndSortedData.length} entries
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                {renderPaginationButtons()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;