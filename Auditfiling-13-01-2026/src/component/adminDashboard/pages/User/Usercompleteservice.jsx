import React, { useState, useRef } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown,
  Eye,
  Download,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Calendar,
  RefreshCw,
  FileText,
  MoreVertical,
  AlertCircle,
  Upload,
  FileCheck,
  File,
  X,
  FolderOpen
} from 'lucide-react';

const UserCompletedService = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentRequestId, setDocumentRequestId] = useState(null);
  const fileInputRef = useRef(null);

  // Sample service requests data with final documents
  const [requests, setRequests] = useState([
    {
      id: 'SR-2024-001',
      serviceName: 'Website Development',
      date: '2024-01-15',
      paymentStatus: 'paid',
      amount: '$2,500',
      customerName: 'John Smith',
      description: 'Complete e-commerce website development with payment gateway integration',
      finalDocument: {
        name: 'website_development_final.pdf',
        size: '2.4 MB',
        uploadDate: '2024-01-20',
        url: '#'
      }
    },
    {
      id: 'SR-2024-002',
      serviceName: 'SEO Optimization',
      date: '2024-01-14',
      paymentStatus: 'pending',
      amount: '$800',
      customerName: 'Sarah Johnson',
      description: 'On-page and off-page SEO optimization for existing website',
      finalDocument: null
    },
    {
      id: 'SR-2024-003',
      serviceName: 'Cloud Migration',
      date: '2024-01-13',
      paymentStatus: 'failed',
      amount: '$5,000',
      customerName: 'Michael Brown',
      description: 'Migration of on-premise servers to AWS cloud infrastructure',
      finalDocument: {
        name: 'cloud_migration_report.pdf',
        size: '5.1 MB',
        uploadDate: '2024-01-18',
        url: '#'
      }
    },
    {
      id: 'SR-2024-004',
      serviceName: 'Mobile App Development',
      date: '2024-01-12',
      paymentStatus: 'paid',
      amount: '$8,500',
      customerName: 'Emily Davis',
      description: 'Cross-platform mobile app for iOS and Android',
      finalDocument: {
        name: 'mobile_app_source_code.zip',
        size: '15.3 MB',
        uploadDate: '2024-01-25',
        url: '#'
      }
    },
    {
      id: 'SR-2024-005',
      serviceName: 'Cybersecurity Audit',
      date: '2024-01-11',
      paymentStatus: 'pending',
      amount: '$1,200',
      customerName: 'David Wilson',
      description: 'Complete security audit and penetration testing',
      finalDocument: null
    },
    {
      id: 'SR-2024-006',
      serviceName: 'Data Backup Solution',
      date: '2024-01-10',
      paymentStatus: 'refunded',
      amount: '$450',
      customerName: 'Lisa Anderson',
      description: 'Automated backup solution for business data',
      finalDocument: {
        name: 'backup_configuration.pdf',
        size: '1.2 MB',
        uploadDate: '2024-01-15',
        url: '#'
      }
    }
  ]);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
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
      case 'paid':
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
      case 'paid':
        return 'Paid';
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

  const handleDeleteRequest = (requestId) => {
    if (window.confirm('Are you sure you want to delete this service request?')) {
      setRequests(requests.filter(req => req.id !== requestId));
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handlePaymentAction = (requestId, action) => {
    setRequests(requests.map(req => {
      if (req.id === requestId) {
        let newStatus = req.paymentStatus;
        if (action === 'mark_paid') newStatus = 'paid';
        if (action === 'mark_pending') newStatus = 'pending';
        if (action === 'mark_failed') newStatus = 'failed';
        if (action === 'refund') newStatus = 'refunded';
        return { ...req, paymentStatus: newStatus };
      }
      return req;
    }));
  };

  const handleUploadDocument = (requestId, file) => {
    if (file) {
      const newDocument = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(file)
      };
      
      setRequests(requests.map(req => {
        if (req.id === requestId) {
          return { ...req, finalDocument: newDocument };
        }
        return req;
      }));
      setShowDocumentModal(false);
      setDocumentRequestId(null);
    }
  };

  const handleDeleteDocument = (requestId) => {
    if (window.confirm('Are you sure you want to delete the final document?')) {
      setRequests(requests.map(req => {
        if (req.id === requestId) {
          return { ...req, finalDocument: null };
        }
        return req;
      }));
    }
  };

  const handleDownloadDocument = (document) => {
    // In a real application, this would trigger a file download
    alert(`Downloading: ${document.name}`);
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = paymentFilter === 'all' || request.paymentStatus === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Stats calculation
  const stats = {
    total: requests.length,
    paid: requests.filter(r => r.paymentStatus === 'paid').length,
    pending: requests.filter(r => r.paymentStatus === 'pending').length,
    withDocuments: requests.filter(r => r.finalDocument !== null).length,
    totalAmount: requests.reduce((sum, r) => sum + parseFloat(r.amount.replace('$', '').replace(',', '')), 0)
  };

  const DetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Service Request Details</h3>
          <button 
            onClick={() => setShowDetailsModal(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {selectedRequest && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Request ID</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedRequest.id}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Name</label>
                <p className="text-lg font-semibold text-gray-900 mt-1">{selectedRequest.serviceName}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</label>
                <p className="text-gray-700 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {formatDate(selectedRequest.date)}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Status</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedRequest.paymentStatus)}`}>
                    {getPaymentStatusIcon(selectedRequest.paymentStatus)}
                    {getPaymentStatusText(selectedRequest.paymentStatus)}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</label>
                <p className="text-2xl font-bold text-gray-900 mt-1">{selectedRequest.amount}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Name</label>
                <p className="text-gray-700 mt-1">{selectedRequest.customerName}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</label>
                <p className="text-gray-700 mt-1 leading-relaxed">{selectedRequest.description}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Final Document</label>
                {selectedRequest.finalDocument ? (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedRequest.finalDocument.name}</p>
                        <p className="text-xs text-gray-500">{selectedRequest.finalDocument.size} • Uploaded {formatDate(selectedRequest.finalDocument.uploadDate)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadDocument(selectedRequest.finalDocument)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                    <p className="text-sm text-gray-500">No final document uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setDocumentRequestId(selectedRequest.id);
                  setShowDocumentModal(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {selectedRequest.finalDocument ? 'Update Document' : 'Upload Document'}
              </button>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const DocumentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">Upload Final Document</h3>
          <button 
            onClick={() => {
              setShowDocumentModal(false);
              setDocumentRequestId(null);
            }}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-400">PDF, DOC, DOCX, ZIP, JPG, PNG (Max 20MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png"
              onChange={(e) => handleUploadDocument(documentRequestId, e.target.files[0])}
              className="hidden"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => {
                setShowDocumentModal(false);
                setDocumentRequestId(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                Service Request Manager
              </h1>
              <p className="text-gray-600 mt-2">Manage service requests, track payments, and store final documents</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
              <FileText className="w-4 h-4" />
              New Request
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Paid Requests</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">With Documents</p>
                <p className="text-2xl font-bold text-purple-600">{stats.withDocuments}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${stats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Request ID, Service Name, or Customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white outline-none"
                >
                  <option value="all">All Payment Status</option>
                  <option value="paid">Paid</option>
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
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Request ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Service Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Payment Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Final Document</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition group">
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {request.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.serviceName}</p>
                        <p className="text-xs text-gray-500">{request.customerName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{formatDate(request.date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          const actions = ['paid', 'pending', 'failed', 'refunded'];
                          const currentIndex = actions.indexOf(request.paymentStatus);
                          const nextStatus = actions[(currentIndex + 1) % actions.length];
                          handlePaymentAction(request.id, nextStatus);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition hover:opacity-80 ${getPaymentStatusColor(request.paymentStatus)}`}
                        title="Click to change status"
                      >
                        {getPaymentStatusIcon(request.paymentStatus)}
                        {getPaymentStatusText(request.paymentStatus)}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {request.finalDocument ? (
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-gray-600 truncate max-w-[150px]">
                            {request.finalDocument.name}
                          </span>
                          <button
                            onClick={() => handleDownloadDocument(request.finalDocument)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition"
                            title="Download"
                          >
                            <Download className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(request.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setDocumentRequestId(request.id);
                            setShowDocumentModal(true);
                          }}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Upload className="w-3 h-3" />
                          Upload
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition"
                          title="More Options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No service requests found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
            </div>
          )}

          {/* Pagination */}
          {filteredRequests.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {filteredRequests.length} of {requests.length} requests
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

        {/* Modals */}
        {showDetailsModal && <DetailsModal />}
        {showDocumentModal && <DocumentModal />}
      </div>
    </div>
  );
};

export default UserCompletedService;