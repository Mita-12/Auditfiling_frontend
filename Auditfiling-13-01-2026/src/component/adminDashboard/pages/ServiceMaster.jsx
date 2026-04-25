import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const ServiceMaster = () => {
  const token = sessionStorage.getItem("admin") ? JSON.parse(sessionStorage.getItem("admin")).token : null;

  const [services, setServices] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // ✅ SERVICE MODAL
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [menuId, setMenuId] = useState("");
  const [menuName, setMenuName] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  
  // ✅ SEO Meta Fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");

  // ✅ DOCUMENT MODAL
  const [showDocModal, setShowDocModal] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);

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

  // ✅ FETCH MENUS
  const fetchMenus = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/menus`, {
        headers: getHeaders(),
      });
      setMenus(res.data || []);
    } catch (err) {
      console.error("Error fetching menus:", err);
      showToast("Failed to load menus", "error");
    }
  };

  // ✅ FETCH SERVICES
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/services`, {
        headers: getHeaders(),
      });
      setServices(res.data.services || res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load services", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchServices();
      fetchMenus();
    }
  }, [token]);

  // ✅ ADD SERVICE
  const addService = async () => {
    if (!menuId || !name || !price) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/services/createService`,
        {
          menu_id: parseInt(menuId),
          service_name: name,
          price: price,
          type: type,
          description: description,
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keyword: metaKeywords,
        },
        { headers: getHeaders() }
      );

      // Refresh the entire list to ensure we have the latest data
      await fetchServices();
      resetForm();
      showToast("Service added successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Error adding service", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE SERVICE
  const updateService = async () => {
    if (!menuId || !name || !price) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/services/${editingId}`,
        {
          menu_id: parseInt(menuId),
          service_name: name,
          price: price,
          type: type,
          description: description,
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keyword: metaKeywords,
        },
        { headers: getHeaders() }
      );

      // Refresh the entire list to ensure we have the latest data
      await fetchServices();
      resetForm();
      showToast("Service updated successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Error updating service", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE SERVICE
  const deleteService = async (id) => {
    if (!window.confirm("Delete service?")) return;

    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/services/${id}`, {
        headers: getHeaders(),
      });
      // Refresh the entire list after deletion
      await fetchServices();
      showToast("Service deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Error deleting service", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ EDIT CLICK
  const editService = (service) => {
    setMenuId(service.menu_id || "");
    setMenuName(service.menu_name || "");
    setName(service.service_name || service.name);
    setPrice(service.price || service.service_price);
    setType(service.type || service.service_type || "");
    setDescription(service.description || "");
    setMetaTitle(service.meta_title || "");
    setMetaDescription(service.meta_description || "");
    setMetaKeywords(service.meta_keyword || "");
    setEditingId(service.id);
    setShowModal(true);
    calculateWordCount(service.description || "");
  };

  const resetForm = () => {
    setMenuId("");
    setMenuName("");
    setName("");
    setPrice("");
    setType("");
    setDescription("");
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setWordCount(0);
    setEditingId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateService();
    } else {
      await addService();
    }
  };

  const handleMenuChange = (e) => {
    const selectedId = e.target.value;
    setMenuId(selectedId);
    const selectedMenu = menus.find(menu => menu.id === parseInt(selectedId));
    if (selectedMenu) {
      setMenuName(selectedMenu.menu_name);
    }
  };

  // Calculate word count for description
  const calculateWordCount = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Service Master
              </h1>
              <p className="text-gray-500 mt-1">Manage your services and documents</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add Service
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sl No.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Menu Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {services.map((service, index) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {service.menu_name || service.menu}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{service.service_name || service.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        {service.type || service.service_type || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        ₹{service.price || service.service_price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => editService(service)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          Edit
                        </button>

                        <button
                          onClick={() => deleteService(service.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg hover:bg-red-100 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Delete
                        </button>
    
                        {service.documents && service.documents.length > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedDocs(service.documents);
                              setShowDocModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-lg hover:bg-green-100 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Docs ({service.documents.length})
                          </button>
                        ) : (
                          <button className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-50 text-yellow-700 text-sm rounded-lg hover:bg-yellow-100 transition-colors duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Add Doc
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        )}
      </div>

      {/* ✅ SERVICE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" onClick={resetForm}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className=" px-6 py-4 rounded-t-2xl  top-0 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingId ? "Edit Service" : "Add New Service"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {editingId ? "Update service information" : "Fill in the service details"}
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                  {/* Menu Name Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Menu Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={menuId}
                      onChange={handleMenuChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select a menu</option>
                      {menus.map((menu) => (
                        <option key={menu.id} value={menu.id}>
                          {menu.menu_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter service name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Service Type Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Service Type</option>
                      <option value="both">Both</option>
                      <option value="individual">Individual</option>
                      <option value="business">Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  {/* Description with Rich Text Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <style>{`
                      .service-quill-editor .ql-container {
                        min-height: 200px;
                        max-height: 300px;
                        overflow-y: auto;
                      }
                      .service-quill-editor .ql-toolbar {
                        position: sticky;
                        top: 0;
                        background: white;
                        z-index: 10;
                        border-bottom: 1px solid #ccc;
                      }
                      .service-quill-editor {
                        border: 1px solid #d1d5db;
                        border-radius: 0.5rem;
                        overflow: hidden;
                      }
                      .service-quill-editor .ql-editor {
                        min-height: 200px;
                      }
                    `}</style>
                    <div className="service-quill-editor">
                      <ReactQuill
                        theme="snow"
                        value={description}
                        onChange={handleDescriptionChange}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Enter service description..."
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
                  <div className="border-t border-gray-200 pt-4 mt-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">SEO Settings</h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title
                      </label>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter meta title (recommended: 50-60 characters)"
                        maxLength="60"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {metaTitle.length}/60 characters - This appears as the title in search engine results
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description
                      </label>
                      <textarea
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter meta description (recommended: 150-160 characters)"
                        maxLength="160"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {metaDescription.length}/160 characters - This appears as the description in search engine results
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter comma-separated keywords (e.g., service, consultation, support)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Comma-separated keywords relevant to your service
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl sticky bottom-0">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : editingId ? "Update Service" : "Save Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ✅ DOCUMENT MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setShowDocModal(false)}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all">
              <div className="px-6 py-4 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Document List</h2>
                    <p className="text-gray-500 text-sm mt-1">Associated documents for this service</p>
                  </div>
                  <button
                    onClick={() => setShowDocModal(false)}
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {selectedDocs.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{doc.doc_title}</p>
                          {doc.file_type && (
                            <p className="text-xs text-gray-500 mt-0.5">Type: {doc.file_type}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-gray-500 font-medium">No Documents Available</p>
                    <p className="text-gray-400 text-sm mt-1">No documents are associated with this service</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end px-6 py-4 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animation for toast */}
      <style jsx>{`
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
    </div>
  );
};

export default ServiceMaster;