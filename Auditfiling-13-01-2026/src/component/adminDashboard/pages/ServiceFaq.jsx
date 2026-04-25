import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Edit, Trash2, Plus, X, Calendar, CheckCircle, XCircle, HelpCircle, AlertCircle } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const ServiceFAQ = () => {
  const token = sessionStorage.getItem("admin") ? JSON.parse(sessionStorage.getItem("admin")).token : null;
  const [faqs, setFaqs] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editId, setEditId] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({
    menu_id: "",
    menu_name: "",
    question: "",
    answer: "",
    status: "active",
  });

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

  // ✅ Fetch Menus
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

  // ✅ Fetch FAQs
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/faqs`, {
        headers: getHeaders(),
      });
      setFaqs(res.data.faqs || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load FAQs", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchFaqs();
      fetchMenus();
    }
  }, [token]);

  // ✅ Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle menu change
  const handleMenuChange = (e) => {
    const selectedId = e.target.value;
    const selectedMenu = menus.find(menu => menu.id === parseInt(selectedId));
    setFormData({
      ...formData,
      menu_id: selectedId,
      menu_name: selectedMenu ? selectedMenu.menu_name : "",
    });
  };

  // ✅ Calculate word count for answer
  const calculateWordCount = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  // ✅ Handle answer change with word count
  const handleAnswerChange = (value) => {
    setFormData({ ...formData, answer: value });
    calculateWordCount(value);
  };

  // ✅ Add
  const handleAdd = () => {
    setEditId(null);
    setFormData({
      menu_id: "",
      menu_name: "",
      question: "",
      answer: "",
      status: "active",
    });
    setWordCount(0);
    setShowModal(true);
  };

  // ✅ Edit
  const handleEdit = (faq) => {
    setEditId(faq.id);
    setFormData({
      menu_id: faq.menu_id || "",
      menu_name: faq.menu_name || "",
      question: faq.question || "",
      answer: faq.answer || "",
      status: faq.status || "active",
    });
    calculateWordCount(faq.answer || "");
    setShowModal(true);
  };

  // ✅ Submit
  const handleSubmit = async () => {
    if (!formData.menu_id || !formData.question || !formData.answer) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        menu_id: parseInt(formData.menu_id),
        question: formData.question,
        answer: formData.answer,
        status: formData.status,
      };

      if (editId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/faqs/${editId}`,
          payload,
          { headers: getHeaders() }
        );
        showToast("FAQ updated successfully!", "success");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/faqs`,
          payload,
          { headers: getHeaders() }
        );
        showToast("FAQ added successfully!", "success");
      }
      setShowModal(false);
      await fetchFaqs();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Error saving FAQ", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/faqs/${id}`, {
        headers: getHeaders(),
      });
      await fetchFaqs();
      showToast("FAQ deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Error deleting FAQ", "error");
    } finally {
      setLoading(false);
    }
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

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          <CheckCircle size={12} />
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
          <XCircle size={12} />
          Inactive
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-[300px] ${
            toast.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}>
            {toast.type === "success" ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
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
              <X size={16} className={toast.type === "success" ? "text-green-600" : "text-red-600"} />
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
                Service FAQ
              </h1>
              <p className="text-gray-500 mt-1">Manage frequently asked questions for your services</p>
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add FAQ
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SL No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Menu Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Answer</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                 </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500">Loading FAQs...</p>
                      </div>
                    </td>
                  </tr>
                ) : faqs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <HelpCircle size={48} className="text-gray-300" />
                        <p className="text-gray-500 font-medium">No FAQs found</p>
                        <p className="text-gray-400 text-sm">Click "Add FAQ" to create your first FAQ</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  faqs.map((faq, index) => (
                    <tr key={faq.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {faq.menu_name || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {faq.question}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div 
                          className="text-sm text-gray-500 line-clamp-2 max-w-md"
                          dangerouslySetInnerHTML={{ 
                            __html: faq.answer?.substring(0, 80) + (faq.answer?.length > 80 ? '...' : '') || '-' 
                          }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => setViewData(faq)}
                            className="group relative inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-all duration-200"
                            title="View"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleEdit(faq)}
                            className="group relative inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-lg hover:bg-green-100 transition-all duration-200"
                            title="Edit"
                          >
                            <Edit size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(faq.id)}
                            className="group relative inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg hover:bg-red-100 transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setShowModal(false)}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
              <div className=" px-6 py-4 rounded-t-2xl sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editId ? "Edit FAQ" : "Add New FAQ"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {editId ? "Update frequently asked question" : "Create a new frequently asked question"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Menu Name Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="menu_id"
                    value={formData.menu_id}
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
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="question"
                    placeholder="Enter FAQ question"
                    value={formData.question}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Answer with Rich Text Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <style>{`
                    .faq-quill-editor .ql-container {
                      min-height: 200px;
                      max-height: 300px;
                      overflow-y: auto;
                    }
                    .faq-quill-editor .ql-toolbar {
                      position: sticky;
                      top: 0;
                      background: white;
                      z-index: 10;
                      border-bottom: 1px solid #ccc;
                    }
                    .faq-quill-editor {
                      border: 1px solid #d1d5db;
                      border-radius: 0.5rem;
                      overflow: hidden;
                    }
                    .faq-quill-editor .ql-editor {
                      min-height: 200px;
                    }
                  `}</style>
                  <div className="faq-quill-editor">
                    <ReactQuill
                      theme="snow"
                      value={formData.answer}
                      onChange={handleAnswerChange}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Enter FAQ answer..."
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Word count: <span className="font-semibold">{wordCount}</span> words
                    </p>
                    <p className="text-xs text-gray-500">
                      Use the rich text editor to format your answer
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-2xl sticky bottom-0">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : editId ? "Update FAQ" : "Save FAQ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setViewData(null)}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full transform transition-all">
              <div className=" px-6 py-4 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">FAQ Details</h2>
                    <p className="text-gray-500 text-sm mt-1">Complete question and answer details</p>
                  </div>
                  <button
                    onClick={() => setViewData(null)}
                    className="text-white hover:text-gray-300 transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Menu Name</label>
                  <p className="text-gray-900 font-medium mt-1">{viewData.menu_name || "N/A"}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Question</label>
                  <p className="text-gray-900 font-medium mt-1">{viewData.question}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Answer</label>
                  <div 
                    className="text-gray-700 mt-2 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: viewData.answer }}
                  />
                </div>
              </div>

              <div className="flex justify-end px-6 py-4 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setViewData(null)}
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

export default ServiceFAQ;