import React, { useState, useEffect } from 'react';
import { Mail, Phone, User, Search, Eye, Trash2, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
const ContactPage = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLead, setSelectedLead] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [error, setError] = useState(null);
    const [adminData, setAdminData] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);

    // Get admin data from sessionStorage
    useEffect(() => {
        const getAdminData = () => {
            const savedAdmin = sessionStorage.getItem('admin');
            if (savedAdmin) {
                setAdminData(JSON.parse(savedAdmin));
            } else {
                setError('Authentication required. Please login again.');
                setLoading(false);
            }
        };
        getAdminData();
    }, []);

    // Fetch leads from API with token
    useEffect(() => {
        if (adminData) {
            fetchLeads();
        }
    }, [adminData, currentPage]);

    const getAuthHeaders = () => {
        return {
            'Authorization': `Bearer ${adminData?.token}`,
            'Content-Type': 'application/json',
        };
    };


const fetchLeads = async () => {
    if (!adminData?.token) {
        setError('Authentication token missing');
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_BASE_URL}/api/contact`,
            {
                headers: getAuthHeaders(),
            }
        );

        console.log("API Response:", response.data);

        setLeads(response.data.contacts || []);
        setTotalPages(response.data.total_pages || 1);
        setTotalLeads(response.data.total || 0);

    } catch (error) {
        console.error("Error fetching leads:", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
            setError('Session expired. Please login again.');
            sessionStorage.removeItem('admin');
            setAdminData(null);

            setTimeout(() => {
                window.location.href = '/adminlogin';
            }, 2000);
        } else {
            setError('Failed to fetch leads.');
        }
    } finally {
        setLoading(false);
    }
};
    const handleDeleteLead = async (id) => {
        if (!adminData?.token) return;
        
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/contact/${id}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders(),
                });
                console.log(response);
                
                
                if (response.status === 401 || response.status === 403) {
                    setError('Session expired. Please login again.');
                    sessionStorage.removeItem('admin');
                    setTimeout(() => {
                        window.location.href = '/adminlogin';
                    }, 2000);
                    return;
                }
                
                if (!response.ok) {
                    throw new Error('Failed to delete lead');
                }
                
                // Refresh the leads list
                fetchLeads();
                alert('Lead deleted successfully!');
            } catch (error) {
                console.error('Error deleting lead:', error);
                alert('Failed to delete lead. Please try again.');
            }
        }
    };

    const handleViewMessage = (lead) => {
        setSelectedLead(lead);
        setShowMessageModal(true);
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (!adminData?.token) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/contact/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status: newStatus }),
            });
            
            // if (response.status === 401 || response.status === 403) {
            //     setError('Session expired. Please login again.');
            //     sessionStorage.removeItem('admin');
            //     setTimeout(() => {
            //         window.location.href = '/adminlogin';
            //     }, 2000);
            //     return;
            // }
            
            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            
            // Refresh the leads list
            fetchLeads();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update lead status.');
        }
    };


    if (!adminData && !loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-4">Please login to access leads</p>
                    <button
                        onClick={() => window.location.href = '/adminlogin'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
                    <p className="text-gray-600 mt-1">Manage and track all your leads</p>
                </div>
                <button
                    onClick={fetchLeads}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 flex-1">{error}</p>
                    <button
                        onClick={fetchLeads}
                        className="text-red-600 hover:text-red-800 font-medium"
                    >
                        Retry
                    </button>
                </div>
            )}

          

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or service..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                   
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : leads.length === 0 ? (
                    <div className="text-center py-12">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No leads found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <User className="w-5 h-5 text-gray-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-900">{lead.name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-600">{lead.phone || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="text-sm text-gray-600">{lead.email || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">{lead.service_name || 'N/A'}</span>
                                            </td>
                                       
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleViewMessage(lead)}
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    View Message
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Message Modal */}
            {showMessageModal && selectedLead && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Lead Message</h2>
                                <button
                                    onClick={() => setShowMessageModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <p className="text-gray-900">{selectedLead.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                    <p className="text-gray-900">{selectedLead.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <p className="text-gray-900">{selectedLead.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Required</label>
                                    <p className="text-gray-900">{selectedLead.service || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-800 whitespace-pre-wrap">{selectedLead.message || 'No message provided'}</p>
                                    </div>
                                </div>
                  
                               
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleUpdateStatus(selectedLead.id, 'contacted');
                                    setShowMessageModal(false);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Mark as Contacted
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;