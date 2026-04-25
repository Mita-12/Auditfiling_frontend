import React, { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Calendar,
  RefreshCw,
  FileText,
  AlertCircle,
  Receipt,
  DollarSign,
  TrendingUp,
  TrendingDown,
  X,
  Copy,
  Share2
} from 'lucide-react';

const UserPaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Sample payment history data
  const [payments, setPayments] = useState([
    {
      slNo: 1,
      requestId: 'SR-2024-001',
      serviceName: 'Website Development',
      amount: 2500,
      paymentStatus: 'success',
      transactionId: 'TXN_20240115_001',
      transactionDate: '2024-01-15T10:30:00',
      paymentMethod: 'Credit Card',
      customerName: 'John Smith',
      customerEmail: 'john.smith@example.com',
      invoiceUrl: '#',
      description: 'Complete e-commerce website development with payment gateway integration'
    },
    {
      slNo: 2,
      requestId: 'SR-2024-002',
      serviceName: 'SEO Optimization',
      amount: 800,
      paymentStatus: 'pending',
      transactionId: 'TXN_20240114_002',
      transactionDate: '2024-01-14T14:15:00',
      paymentMethod: 'PayPal',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@example.com',
      invoiceUrl: '#',
      description: 'On-page and off-page SEO optimization for existing website'
    },
    {
      slNo: 3,
      requestId: 'SR-2024-003',
      serviceName: 'Cloud Migration',
      amount: 5000,
      paymentStatus: 'failed',
      transactionId: 'TXN_20240113_003',
      transactionDate: '2024-01-13T09:00:00',
      paymentMethod: 'Bank Transfer',
      customerName: 'Michael Brown',
      customerEmail: 'michael.b@example.com',
      invoiceUrl: '#',
      description: 'Migration of on-premise servers to AWS cloud infrastructure'
    },
    {
      slNo: 4,
      requestId: 'SR-2024-004',
      serviceName: 'Mobile App Development',
      amount: 8500,
      paymentStatus: 'success',
      transactionId: 'TXN_20240112_004',
      transactionDate: '2024-01-12T11:20:00',
      paymentMethod: 'Credit Card',
      customerName: 'Emily Davis',
      customerEmail: 'emily.d@example.com',
      invoiceUrl: '#',
      description: 'Cross-platform mobile app for iOS and Android'
    },
    {
      slNo: 5,
      requestId: 'SR-2024-005',
      serviceName: 'Cybersecurity Audit',
      amount: 1200,
      paymentStatus: 'pending',
      transactionId: 'TXN_20240111_005',
      transactionDate: '2024-01-11T16:45:00',
      paymentMethod: 'PayPal',
      customerName: 'David Wilson',
      customerEmail: 'david.w@example.com',
      invoiceUrl: '#',
      description: 'Complete security audit and penetration testing'
    },
    {
      slNo: 6,
      requestId: 'SR-2024-006',
      serviceName: 'Data Backup Solution',
      amount: 450,
      paymentStatus: 'refunded',
      transactionId: 'TXN_20240110_006',
      transactionDate: '2024-01-10T13:30:00',
      paymentMethod: 'Credit Card',
      customerName: 'Lisa Anderson',
      customerEmail: 'lisa.a@example.com',
      invoiceUrl: '#',
      description: 'Automated backup solution for business data'
    },
    {
      slNo: 7,
      requestId: 'SR-2024-007',
      serviceName: 'CRM Implementation',
      amount: 3200,
      paymentStatus: 'success',
      transactionId: 'TXN_20240109_007',
      transactionDate: '2024-01-09T10:00:00',
      paymentMethod: 'Bank Transfer',
      customerName: 'Robert Taylor',
      customerEmail: 'robert.t@example.com',
      invoiceUrl: '#',
      description: 'Custom CRM system implementation and training'
    },
    {
      slNo: 8,
      requestId: 'SR-2024-008',
      serviceName: 'UI/UX Design',
      amount: 1800,
      paymentStatus: 'pending',
      transactionId: 'TXN_20240108_008',
      transactionDate: '2024-01-08T15:20:00',
      paymentMethod: 'PayPal',
      customerName: 'Jennifer White',
      customerEmail: 'jennifer.w@example.com',
      invoiceUrl: '#',
      description: 'Complete UI/UX redesign for web application'
    }
  ]);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'refunded':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
      default:
        return status;
    }
  };

  const handleViewInvoice = (payment) => {
    setSelectedPayment(payment);
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = (payment) => {
    // In real application, this would trigger PDF download
    alert(`Downloading invoice for transaction: ${payment.transactionId}`);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleCopyTransactionId = (transactionId) => {
    navigator.clipboard.writeText(transactionId);
    alert('Transaction ID copied to clipboard!');
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.paymentStatus === statusFilter;
    
    const matchesDateRange = () => {
      if (!dateRange.start && !dateRange.end) return true;
      const transDate = new Date(payment.transactionDate);
      if (dateRange.start && new Date(dateRange.start) > transDate) return false;
      if (dateRange.end && new Date(dateRange.end) < transDate) return false;
      return true;
    };
    
    return matchesSearch && matchesStatus && matchesDateRange();
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Stats calculation
  const stats = {
    totalTransactions: payments.length,
    totalRevenue: payments.reduce((sum, p) => p.paymentStatus === 'success' ? sum + p.amount : sum, 0),
    successCount: payments.filter(p => p.paymentStatus === 'success').length,
    pendingCount: payments.filter(p => p.paymentStatus === 'pending').length,
    averageTransaction: payments.reduce((sum, p) => sum + p.amount, 0) / payments.length
  };

  const InvoiceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Invoice Details</h3>
          <button 
            onClick={() => setShowInvoiceModal(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {selectedPayment && (
          <div className="p-6" id="invoice-content">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
                <p className="text-gray-500 mt-1">#INV-{selectedPayment.transactionId}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Receipt className="w-12 h-12 text-blue-600" />
                </div>
                <p className="text-sm text-gray-500 mt-1">Your Company Name</p>
                <p className="text-sm text-gray-500">123 Business Street</p>
                <p className="text-sm text-gray-500">New York, NY 10001</p>
              </div>
            </div>

            {/* Bill To & Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h4>
                <p className="text-gray-800 font-medium">{selectedPayment.customerName}</p>
                <p className="text-gray-600 text-sm">{selectedPayment.customerEmail}</p>
              </div>
              <div className="md:text-right">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-500">Invoice Date:</p>
                  <p className="text-gray-800">{formatDate(selectedPayment.transactionDate)}</p>
                  <p className="text-gray-500">Transaction ID:</p>
                  <p className="text-gray-800 font-mono">{selectedPayment.transactionId}</p>
                  <p className="text-gray-500">Payment Method:</p>
                  <p className="text-gray-800">{selectedPayment.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <table className="w-full mb-8">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody className="border-b border-gray-200">
                <tr>
                  <td className="px-4 py-3 text-gray-700">
                    {selectedPayment.serviceName}
                    <p className="text-xs text-gray-500 mt-1">{selectedPayment.description}</p>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(selectedPayment.amount)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">Total:</td>
                  <td className="px-4 py-3 text-right text-xl font-bold text-blue-600">{formatCurrency(selectedPayment.amount)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Payment Status */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedPayment.paymentStatus)} mb-6`}>
              {getPaymentStatusIcon(selectedPayment.paymentStatus)}
              {getPaymentStatusText(selectedPayment.paymentStatus)}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 mt-6 text-center text-sm text-gray-400">
              <p>Thank you for your business!</p>
              <p className="mt-1">For any questions regarding this invoice, please contact support@yourcompany.com</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrintInvoice}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => handleDownloadInvoice(selectedPayment)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
                Payment History
              </h1>
              <p className="text-gray-600 mt-2">Track and manage all payment transactions</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalTransactions}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.successCount}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Transaction</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.averageTransaction)}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Request ID, Service Name, Transaction ID, or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
          
          {/* Date Range Filter */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Start Date"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="End Date"
              />
            </div>
            {(dateRange.start || dateRange.end) && (
              <button
                onClick={() => setDateRange({ start: '', end: '' })}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Sl No.</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Request ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name of Service</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Payment Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Transaction Date</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment, index) => (
                  <tr key={payment.transactionId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {payment.requestId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.serviceName}</p>
                        <p className="text-xs text-gray-500">{payment.customerName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.paymentStatus)}`}>
                        {getPaymentStatusIcon(payment.paymentStatus)}
                        {getPaymentStatusText(payment.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-600">{payment.transactionId}</span>
                        <button
                          onClick={() => handleCopyTransactionId(payment.transactionId)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy Transaction ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{formatDate(payment.transactionDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewInvoice(payment)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadInvoice(payment)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handlePrintInvoice}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPayments.length === 0 && (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payment records found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {filteredPayments.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {filteredPayments.length} of {payments.length} transactions
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                  Previous
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Invoice Modal */}
        {showInvoiceModal && <InvoiceModal />}
      </div>
    </div>
  );
};

export default UserPaymentHistory;