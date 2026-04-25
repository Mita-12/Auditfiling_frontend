import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const AdminReseller = () => {
  // State Management
  const [resellers, setResellers] = useState([
    {
      id: 1,
      name: "Tech Solutions Inc",
      commission: 15,
      startDate: "2024-01-15",
      totalCustomers: 24,
      customers: [
        { id: 101, name: "John Smith", service: "Web Hosting", status: "active", paymentId: "PAY-12345", amount: 99.99, date: "2024-01-20" },
        { id: 102, name: "Sarah Johnson", service: "Cloud Storage", status: "pending", paymentId: "PAY-12346", amount: 49.99, date: "2024-01-21" },
        { id: 103, name: "Mike Wilson", service: "SSL Certificate", status: "active", paymentId: "PAY-12347", amount: 29.99, date: "2024-01-22" }
      ]
    },
    {
      id: 2,
      name: "Digital Marketing Pro",
      commission: 20,
      startDate: "2024-02-01",
      totalCustomers: 18,
      customers: [
        { id: 201, name: "Emily Brown", service: "SEO Package", status: "active", paymentId: "PAY-22345", amount: 299.99, date: "2024-02-05" },
        { id: 202, name: "David Lee", service: "Social Media", status: "inactive", paymentId: "PAY-22346", amount: 149.99, date: "2024-02-10" }
      ]
    },
    {
      id: 3,
      name: "Cloud Experts Ltd",
      commission: 12,
      startDate: "2024-01-10",
      totalCustomers: 42,
      customers: [
        { id: 301, name: "Lisa Anderson", service: "Cloud Backup", status: "active", paymentId: "PAY-32345", amount: 199.99, date: "2024-01-15" },
        { id: 302, name: "Robert Taylor", service: "VPS Hosting", status: "active", paymentId: "PAY-32346", amount: 79.99, date: "2024-01-18" },
        { id: 303, name: "Maria Garcia", service: "Domain Registration", status: "pending", paymentId: "PAY-32347", amount: 14.99, date: "2024-01-20" }
      ]
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [showResellerDetails, setShowResellerDetails] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [editingReseller, setEditingReseller] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    commission: "",
    startDate: ""
  });

  // Filter Resellers
  const filteredResellers = resellers.filter(reseller =>
    reseller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResellers = filteredResellers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResellers.length / itemsPerPage);

  // Add Reseller
  const handleAddReseller = () => {
    if (!formData.name || !formData.commission || !formData.startDate) {
      alert("Please fill all fields");
      return;
    }

    const newReseller = {
      id: resellers.length + 1,
      name: formData.name,
      commission: parseFloat(formData.commission),
      startDate: formData.startDate,
      totalCustomers: 0,
      customers: []
    };

    if (editingReseller) {
      setResellers(resellers.map(r => r.id === editingReseller.id ? { ...newReseller, id: r.id } : r));
      setEditingReseller(null);
    } else {
      setResellers([...resellers, newReseller]);
    }

    setFormData({ name: "", commission: "", startDate: "" });
    setShowAddModal(false);
  };

  // Edit Reseller
  const handleEditReseller = (reseller) => {
    setEditingReseller(reseller);
    setFormData({
      name: reseller.name,
      commission: reseller.commission,
      startDate: reseller.startDate
    });
    setShowAddModal(true);
  };

  // Delete Reseller
  const handleDeleteReseller = (id) => {
    if (window.confirm("Are you sure you want to delete this reseller?")) {
      setResellers(resellers.filter(r => r.id !== id));
    }
  };

  // View Customers
  const handleViewCustomers = (reseller) => {
    setSelectedReseller(reseller);
    setShowCustomersModal(true);
  };

  // View Reseller Details
  const handleViewResellerDetails = (reseller) => {
    setSelectedReseller(reseller);
    setShowResellerDetails(true);
  };

  // Get Status Badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      inactive: { color: "bg-red-100 text-red-800", icon: AlertCircle }
    };
    const config = statusConfig[status] || statusConfig.inactive;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reseller Management</h1>
        <p className="text-gray-600">Manage all your resellers, commissions, and their customers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Resellers</p>
              <p className="text-2xl font-bold text-gray-800">{resellers.length}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">
                {resellers.reduce((sum, r) => sum + r.totalCustomers, 0)}
              </p>
            </div>
            <Users className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Commission</p>
              <p className="text-2xl font-bold text-gray-800">
                {(resellers.reduce((sum, r) => sum + r.commission, 0) / resellers.length).toFixed(1)}%
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Resellers</p>
              <p className="text-2xl font-bold text-gray-800">{resellers.length}</p>
            </div>
            <Calendar className="w-10 h-10 text-orange-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search and Add Button */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search resellers by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setEditingReseller(null);
              setFormData({ name: "", commission: "", startDate: "" });
              setShowAddModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Reseller
          </button>
        </div>
      </div>

      {/* Resellers Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reseller Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Customers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentResellers.map((reseller) => (
                <tr key={reseller.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewResellerDetails(reseller)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      {reseller.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {reseller.commission}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reseller.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reseller.totalCustomers}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewCustomers(reseller)}
                        className="text-blue-600 hover:text-blue-900 transition"
                        title="View Customers"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditReseller(reseller)}
                        className="text-green-600 hover:text-green-900 transition"
                        title="Edit Reseller"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReseller(reseller.id)}
                        className="text-red-600 hover:text-red-900 transition"
                        title="Delete Reseller"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Reseller Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingReseller ? "Edit Reseller" : "Add New Reseller"}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reseller Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter reseller name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission (%)</label>
                <input
                  type="number"
                  value={formData.commission}
                  onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter commission percentage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReseller}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingReseller ? "Update" : "Add"} Reseller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Customers Modal */}
      {showCustomersModal && selectedReseller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Customers of {selectedReseller.name}</h2>
                <p className="text-sm text-gray-600 mt-1">Total: {selectedReseller.customers.length} customers</p>
              </div>
              <button onClick={() => setShowCustomersModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedReseller.customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{customer.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{customer.service}</td>
                        <td className="px-4 py-3">{getStatusBadge(customer.status)}</td>
                        <td className="px-4 py-3 text-sm font-mono text-gray-600">{customer.paymentId}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">${customer.amount}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{customer.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reseller Details Modal */}
      {showResellerDetails && selectedReseller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Reseller Details</h2>
              <button onClick={() => setShowResellerDetails(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Reseller Name</label>
                  <p className="text-lg font-semibold text-gray-800">{selectedReseller.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Commission</label>
                  <p className="text-lg font-semibold text-green-600">{selectedReseller.commission}%</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Start Date</label>
                  <p className="text-lg font-semibold text-gray-800">{selectedReseller.startDate}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Total Customers</label>
                  <p className="text-lg font-semibold text-blue-600">{selectedReseller.totalCustomers}</p>
                </div>
              </div>
              <div className="border-t pt-4 mt-2">
                <label className="text-sm text-gray-500 block mb-2">Recent Customers</label>
                <div className="space-y-2">
                  {selectedReseller.customers.slice(0, 3).map((customer) => (
                    <div key={customer.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.service}</p>
                      </div>
                      {getStatusBadge(customer.status)}
                    </div>
                  ))}
                  {selectedReseller.customers.length > 3 && (
                    <button
                      onClick={() => {
                        setShowResellerDetails(false);
                        handleViewCustomers(selectedReseller);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                      View all {selectedReseller.customers.length} customers →
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setShowResellerDetails(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReseller;