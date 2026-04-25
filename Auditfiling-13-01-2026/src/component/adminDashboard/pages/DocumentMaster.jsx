import React, { useState, useEffect } from "react";
import axios from "axios";

const DocumentMaster = () => {
  const [documents, setDocuments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [fileType, setFileType] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const token = sessionStorage.getItem("admin") 
    ? JSON.parse(sessionStorage.getItem("admin")).token
    : null;
    
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  // Show toast message
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/documents`, { headers: getHeaders() });
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error("Document Fetch Error:", err);
      showToast("Failed to load documents", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/services`, { headers: getHeaders() });
      setServices(res.data || []);
    } catch (err) {
      console.error("Service Fetch Error:", err);
      showToast("Failed to load services", "error");
    }
  };

  useEffect(() => {
    if (token) {
      fetchDocuments();
      fetchServices();
    }
  }, [token]);

  const handleSave = async () => {
    if (!docTitle || !fileType || !serviceId) {
      showToast("All fields are required", "error");
      return;
    }

    try {
      const payload = {
        service_id: serviceId,
        doc_title: docTitle,
        file_type: fileType,
      };

      if (editId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/documents/${editId}`, payload, { headers: getHeaders() });
        showToast("Document updated successfully!", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/documents`, payload, { headers: getHeaders() });
        showToast("Document added successfully!", "success");
      }

      fetchDocuments();
      resetForm();
    } catch (err) {
      console.error("Save Error:", err);
      showToast(err.response?.data?.message || "Error saving document", "error");
    }
  };

  const deleteDocument = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/documents/${id}`, { headers: getHeaders() });
      fetchDocuments();
      showToast("Document deleted successfully!", "success");
    } catch (err) {
      console.error("Delete Error:", err);
      showToast(err.response?.data?.message || "Error deleting document", "error");
    }
  };

  const editDocument = (doc) => {
    setDocTitle(doc.doc_title);
    setFileType(doc.file_type);
    setServiceId(doc.service_id);
    setEditId(doc.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setDocTitle("");
    setFileType("");
    setServiceId("");
    setEditId(null);
    setShowModal(false);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.doc_title?.toLowerCase().includes(search.toLowerCase())
  );

  const getServiceName = (doc) => {
    if (doc.service_name) return doc.service_name;
    const service = services.find((s) => Number(s.id) === Number(doc.service_id));
    return service?.service_name || "N/A";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] ${
            toast.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}>
            {toast.type === "success" ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            )}
            <p className={`text-sm font-medium ${
              toast.type === "success" ? "text-green-800" : "text-red-800"
            }`}>
              {toast.message}
            </p>
            <button
              onClick={() => setToast({ show: false, message: "", type: "success" })}
              className="ml-auto"
            >
              <svg className={`w-4 h-4 ${toast.type === "success" ? "text-green-600" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
              <p className="text-gray-600 mt-1">Manage and organize your documents</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Document
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Document</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">File Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600 mb-3"></div>
                        <p className="text-gray-500">Loading documents...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="text-gray-500 font-medium">No documents found</p>
                        <p className="text-gray-400 text-sm mt-1">Click "Add Document" to create one</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 rounded-lg p-2 mr-3">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{getServiceName(doc)}</span>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{doc.doc_title}</span>
                       </td>
                      <td className="px-6 py-4">
                        {doc.file_type ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {doc.file_type}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editDocument(doc)}
                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg hover:bg-red-100 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Delete
                          </button>
                        </div>
                       </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" onClick={resetForm}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
              <div className=" px-6 py-4 rounded-t-2xl">
                <h2 className="text-xl font-bold text-white">
                  {editId ? "Edit Document" : "Add New Document"}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {editId ? "Update document information" : "Fill in the document details"}
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                  >
                    <option value="">Select Service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.service_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Title *</label>
                  <input
                    type="text"
                    placeholder="Enter document title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Type *</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                  >
                    <option value="">Select File Type</option>
                    <option value="document">Document</option>
                    <option value="text">Text</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {editId ? "Update Document" : "Save Document"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentMaster;