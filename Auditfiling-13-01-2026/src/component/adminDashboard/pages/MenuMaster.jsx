import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const MenuMaster = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [wordCount, setWordCount] = useState(0);
  const quillRef = useRef(null);
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // New state for meta fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  const itemsPerPage = 10;

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

  const fetchMenus = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/menus`, {
        headers: getHeaders(),
      });

      setServices(response.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        const errorMsg = "Unauthorized. Please login again.";
        setError(errorMsg);
        showToast(errorMsg, "error");
      } else {
        const errorMsg = err.message;
        setError(errorMsg);
        showToast(errorMsg, "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const addService = async () => {
    if (!name || !description) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/menus/createMenu`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            menu_name: name,
            description,
            meta_title: metaTitle,
            meta_description: metaDescription,
            meta_keywords: metaKeywords,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create menu");
      }

      await fetchMenus();
      closeModal();
      showToast("Menu added successfully!", "success");
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateService = async () => {
    if (!name || !description || !editingId) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/menus/${editingId}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            menu_name: name,
            description,
            meta_title: metaTitle,
            meta_description: metaDescription,
            meta_keyword: metaKeywords,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update menu");
      }

      await fetchMenus();
      closeModal();
      showToast("Menu updated successfully!", "success");
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/menus/deleteMenu/${id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete menu");
      }

      await fetchMenus();
      showToast("Menu deleted successfully!", "success");
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingId(service.id);
      setName(service.menu_name);
      setDescription(service.description || "");
      setMetaTitle(service.meta_title || "");
      setMetaDescription(service.meta_description || "");
      setMetaKeywords(service.meta_keyword || "");
      calculateWordCount(service.description || "");
    } else {
      setEditingId(null);
      setName("");
      setDescription("");
      setMetaTitle("");
      setMetaDescription("");
      setMetaKeywords("");
      setWordCount(0);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setError("");
    setWordCount(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateService();
    } else {
      addService();
    }
  };

  const calculateWordCount = (htmlContent) => {
    // Create a temporary div to extract text from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText;
    // Count words (split by whitespace and filter out empty strings)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    calculateWordCount(value);
  };

  // Quill editor modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  // Filter services based on search
  const filteredServices = services.filter(service =>
    service.menu_name?.toLowerCase().includes(search.toLowerCase()) ||
    service.description?.toLowerCase().includes(search.toLowerCase()) ||
    service.meta_title?.toLowerCase().includes(search.toLowerCase()) ||
    service.meta_keywords?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
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
        .custom-quill-editor .ql-container {
          min-height: 250px;
          max-height: 400px;
          overflow-y: auto;
        }
        .custom-quill-editor .ql-toolbar {
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-bottom: 1px solid #ccc;
        }
        .custom-quill-editor {
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
        }
        .custom-quill-editor .ql-editor {
          min-height: 250px;
        }
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Add New Menu
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search menus by name, description, meta title, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      )}

      {/* Menus Table */}
      {!loading && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Menu Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meta Title
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedServices.length > 0 ? (
                  paginatedServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.id}
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.menu_name}
                       </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div 
                          className="line-clamp-2 max-w-md"
                          dangerouslySetInnerHTML={{ 
                            __html: service.description?.substring(0, 100) + (service.description?.length > 100 ? '...' : '') || '' 
                          }}
                        />
                       </td>
                      {/* <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="max-w-xs truncate">
                          {service.meta_title || '-'}
                        </div>
                       </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openModal(service)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="text-red-600 hover:text-red-900 transition duration-200"
                        >
                          Delete
                        </button>
                       </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No menus found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition duration-200"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition duration-200"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingId ? "Edit Menu" : "Add New Menu"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Menu Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter menu name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description *
                </label>
                <div className="custom-quill-editor">
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={description}
                    onChange={handleDescriptionChange}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Enter menu description..."
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">
                    Word count: <span className="font-semibold">{wordCount}</span> words
                  </p>
                  <p className="text-xs text-gray-500">
                    Use the rich text editor to format your content
                  </p>
                </div>
              </div>

              {/* SEO Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h3 className="text-lg font-semibold mb-3">SEO Settings</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter meta title (recommended: 50-60 characters)"
                    maxLength="60"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {metaTitle.length}/60 characters - This appears as the title in search engine results
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter meta description (recommended: 150-160 characters)"
                    maxLength="160"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {metaDescription.length}/160 characters - This appears as the description in search engine results
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter comma-separated keywords (e.g., menu, restaurant, dining)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma-separated keywords relevant to your menu
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {loading ? "Saving..." : editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuMaster;