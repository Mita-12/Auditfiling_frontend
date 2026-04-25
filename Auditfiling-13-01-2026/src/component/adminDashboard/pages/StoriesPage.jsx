import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Edit, Trash2, Plus, X, Image as ImageIcon, Calendar, CheckCircle, XCircle, FileText, User, Clock, Briefcase, Link as LinkIcon, Key, AlertCircle } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const StoriesPage = () => {
  const token = sessionStorage.getItem("admin") ? JSON.parse(sessionStorage.getItem("admin")).token : null;
  const [blogs, setBlogs] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  // Status message state
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "", visible: false });

  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "draft",
    menu_id: "",
    image: null,
    author_name: "",
    read_time: "",
    author_designation: "",
    author_photo: null,
    author_short_bio: "",
    author_social_media: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    published_at: "",
  });

  // Keep track of existing images for display
  const [existingImage, setExistingImage] = useState(null);
  const [existingAuthorPhoto, setExistingAuthorPhoto] = useState(null);

  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // Show status message function
  const showStatusMessage = (type, text) => {
    setStatusMessage({ type, text, visible: true });
    setTimeout(() => {
      setStatusMessage(prev => ({ ...prev, visible: false }));
    }, 4000);
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
      showStatusMessage("error", "Failed to fetch menus");
    }
  };

  // ✅ Fetch Blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/blogs`, {
        headers: getHeaders(),
      });
      setBlogs(res.data.blogs || []);
      showStatusMessage("success", "Blogs loaded successfully");
    } catch (err) {
      console.error(err);
      showStatusMessage("error", "Failed to load blogs");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchBlogs();
      fetchMenus();
    }
  }, [token]);

  // ✅ Handle Input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-generate slug from title only if slug field is empty or user hasn't manually edited it
    if (name === "title" && !formData.slugEdited) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  // ✅ Handle slug change
  const handleSlugChange = (e) => {
    const { value } = e.target;
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, slug, slugEdited: true });
  };

  // ✅ Handle File Changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const handleAuthorPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, author_photo: file });
    }
  };

  // ✅ Calculate word count for content
  const calculateWordCount = (htmlContent) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  // ✅ Handle content change
  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
    calculateWordCount(value);
  };

  // ✅ Handle menu change
  const handleMenuChange = (e) => {
    const selectedId = e.target.value;
    setFormData({
      ...formData,
      menu_id: selectedId,
    });
  };

  // ✅ Open Add Modal
  const handleAdd = () => {
    setEditId(null);
    setExistingImage(null);
    setExistingAuthorPhoto(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      status: "draft",
      menu_id: "",
      image: null,
      author_name: "",
      read_time: "",
      author_designation: "",
      author_photo: null,
      author_short_bio: "",
      author_social_media: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      published_at: "",
      slugEdited: false,
    });
    setWordCount(0);
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleEdit = (blog) => {
    setEditId(blog.id);
    setExistingImage(blog.image_url);
    setExistingAuthorPhoto(blog.author_photo_url);
    
    // Convert social media object to JSON string for display
    let socialMediaString = "";
    if (blog.author_social_media && typeof blog.author_social_media === 'object') {
      socialMediaString = JSON.stringify(blog.author_social_media, null, 2);
    } else if (blog.author_social_media) {
      socialMediaString = blog.author_social_media;
    }
    
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      content: blog.content || "",
      status: blog.status || "draft",
      menu_id: blog.menu_id || "",
      image: null,
      author_name: blog.author_name || "",
      read_time: blog.read_time || "",
      author_designation: blog.author_designation || "",
      author_photo: null,
      author_short_bio: blog.author_short_bio || "",
      author_social_media: socialMediaString,
      meta_title: blog.meta_title || "",
      meta_description: blog.meta_description || "",
      meta_keywords: blog.meta_keywords || "",
      published_at: blog.published_at ? blog.published_at.split('T')[0] : "",
      slugEdited: true,
    });
    calculateWordCount(blog.content || "");
    setShowModal(true);
  };

  // ✅ View Blog
  const handleView = (blog) => {
    setViewData(blog);
  };

  // ✅ Submit (Add / Edit)
  const handleSubmit = async () => {
    if (!formData.title || !formData.content || !formData.menu_id) {
      showStatusMessage("error", "Please fill all required fields (Title, Content, and Menu)");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      
      // Add all text fields
      payload.append("title", formData.title);
      payload.append("content", formData.content);
      payload.append("status", formData.status);
      payload.append("menu_id", formData.menu_id);
      payload.append("author_name", formData.author_name);
      payload.append("read_time", formData.read_time);
      payload.append("author_designation", formData.author_designation);
      payload.append("author_short_bio", formData.author_short_bio);
      payload.append("meta_title", formData.meta_title);
      payload.append("meta_description", formData.meta_description);
      payload.append("meta_keywords", formData.meta_keywords);
      
      // Add slug if provided
      if (formData.slug) {
        payload.append("slug", formData.slug);
      }
      
      if (formData.published_at) {
        payload.append("published_at", formData.published_at);
      }
      
      // Add social media as JSON string (validate first)
      if (formData.author_social_media && formData.author_social_media.trim()) {
        try {
          // Validate JSON
          JSON.parse(formData.author_social_media);
          payload.append("author_social_media", formData.author_social_media);
        } catch (e) {
          showStatusMessage("error", "Invalid JSON format for Social Media. Please use valid JSON format.");
          setLoading(false);
          return;
        }
      }
      
      // Add files only if new ones are selected
      if (formData.image) {
        payload.append("image", formData.image);
      }
      if (formData.author_photo) {
        payload.append("author_photo", formData.author_photo);
      }

      const url = editId 
        ? `${import.meta.env.VITE_BACKEND_BASE_URL}/api/blogs/${editId}`
        : `${import.meta.env.VITE_BACKEND_BASE_URL}/api/blogs`;
      
      const method = editId ? "put" : "post";

      const response = await axios({
        method: method,
        url: url,
        data: payload,
        headers: {
          ...getHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      
      setShowModal(false);
      await fetchBlogs();
      
      if (editId) {
        showStatusMessage("success", "Blog updated successfully!");
      } else {
        showStatusMessage("success", `Blog created successfully! Slug: ${response.data.slug}`);
      }
    } catch (err) {
      console.error(err);
      showStatusMessage("error", err.response?.data?.message || "Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;
    setLoading(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/blogs/${id}`, {
        headers: getHeaders(),
      });
      await fetchBlogs();
      showStatusMessage("success", "Blog deleted successfully!");
    } catch (err) {
      console.error(err);
      showStatusMessage("error", err.response?.data?.message || "Error deleting blog");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not published";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format social media for display
  const formatSocialMedia = (socialMedia) => {
    if (!socialMedia) return "No social media links";
    if (typeof socialMedia === 'object') {
      const links = [];
      if (socialMedia.twitter) links.push(`Twitter: ${socialMedia.twitter}`);
      if (socialMedia.linkedin) links.push(`LinkedIn: ${socialMedia.linkedin}`);
      if (socialMedia.facebook) links.push(`Facebook: ${socialMedia.facebook}`);
      if (socialMedia.instagram) links.push(`Instagram: ${socialMedia.instagram}`);
      return links.join(" | ") || "No social media links";
    }
    return socialMedia;
  };

  // Quill editor modules configuration
  const quillModules = {
    toolbar: {
      container: [
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
    },
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
    if (status === "published") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          <CheckCircle size={12} />
          Published
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
          <XCircle size={12} />
          Draft
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Status Message Toast */}
        {statusMessage.visible && (
          <div className={`fixed top-4 right-4 z-50 animate-slide-in-right`}>
            <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${
              statusMessage.type === "success" ? "bg-green-50 border-l-4 border-green-500" :
              statusMessage.type === "error" ? "bg-red-50 border-l-4 border-red-500" :
              "bg-blue-50 border-l-4 border-blue-500"
            }`}>
              {statusMessage.type === "success" && <CheckCircle size={20} className="text-green-500" />}
              {statusMessage.type === "error" && <XCircle size={20} className="text-red-500" />}
              {statusMessage.type === "info" && <AlertCircle size={20} className="text-blue-500" />}
              <span className={`text-sm ${
                statusMessage.type === "success" ? "text-green-700" :
                statusMessage.type === "error" ? "text-red-700" :
                "text-blue-700"
              }`}>{statusMessage.text}</span>
              <button 
                onClick={() => setStatusMessage(prev => ({ ...prev, visible: false }))}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Our Stories
              </h1>
              <p className="text-gray-500 mt-1">Manage blog posts and stories</p>
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add Post
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Posts</p>
                <p className="text-2xl font-bold text-gray-800">{blogs.length}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-2">
                <FileText size={20} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold text-gray-800">
                  {blogs.filter(b => b.status === "published").length}
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-2">
                <CheckCircle size={20} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="text-2xl font-bold text-gray-800">
                  {blogs.filter(b => b.status === "draft").length}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-2">
                <XCircle size={20} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SL No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title / Slug</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Menu</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                 </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-gray-500">Loading stories...</p>
                      </div>
                    </td>
                  </tr>
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileText size={48} className="text-gray-300" />
                        <p className="text-gray-500 font-medium">No stories found</p>
                        <p className="text-gray-400 text-sm">Click "Add Post" to create your first story</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog, index) => (
                    <tr key={blog.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        {blog.image_url ? (
                          <img 
                            src={blog.image_url} 
                            alt={blog.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon size={20} className="text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Slug: {blog.slug}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Views: {blog.view_count || 0}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {blog.author_photo_url ? (
                            <img src={blog.author_photo_url} alt={blog.author_name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User size={14} className="text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{blog.author_name || "Anonymous"}</p>
                            <p className="text-xs text-gray-500">{blog.read_time || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{blog.menu_name || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(blog.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleView(blog)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg hover:bg-blue-100 transition-all duration-200"
                            title="View"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm rounded-lg hover:bg-green-100 transition-all duration-200"
                            title="Edit"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-lg hover:bg-red-100 transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setShowModal(false)}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 px-6 py-4 bg-white border-b border-gray-200 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {editId ? "Edit Post" : "Add New Post"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {editId ? "Update your story" : "Create a new story"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Menu Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.menu_id}
                    onChange={handleMenuChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Slug Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <LinkIcon size={16} />
                      Slug (URL)
                    </div>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="auto-generated-from-title"
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the title. Leave empty for auto-generation.
                  </p>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>
                  {existingImage && !formData.image && (
                    <div className="mb-2">
                      <img src={existingImage} alt="Current featured" className="w-32 h-32 object-cover rounded-lg" />
                      <p className="text-xs text-gray-500 mt-1">Current image</p>
                    </div>
                  )}
                  {formData.image && (
                    <div className="mb-2">
                      <img src={URL.createObjectURL(formData.image)} alt="New featured" className="w-32 h-32 object-cover rounded-lg" />
                      <p className="text-xs text-green-600 mt-1">New image selected</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a featured image for your blog post</p>
                </div>

                {/* Author Information Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User size={20} />
                    Author Information
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                      <input
                        type="text"
                        name="author_name"
                        value={formData.author_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
                      <input
                        type="text"
                        name="read_time"
                        value={formData.read_time}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="5 min read"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Author Designation</label>
                      <input
                        type="text"
                        name="author_designation"
                        value={formData.author_designation}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Senior Developer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Author Photo</label>
                      {existingAuthorPhoto && !formData.author_photo && (
                        <div className="mb-2">
                          <img src={existingAuthorPhoto} alt="Current author" className="w-16 h-16 rounded-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAuthorPhotoChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio</label>
                      <textarea
                        name="author_short_bio"
                        value={formData.author_short_bio}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description about the author"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Links - Single Field */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Media Links
                  </label>
                  <textarea
                    name="author_social_media"
                    value={formData.author_social_media}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="Enter social media links "
                  />
                  {formData.author_social_media && (
                    <div className="mt-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            JSON.parse(formData.author_social_media);
                            showStatusMessage("success", "Valid JSON format!");
                          } catch (e) {
                            showStatusMessage("error", "Invalid JSON format. Please check your syntax.");
                          }
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Validate JSON
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Editor */}
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="blog-quill-editor" style={{ height: '400px' }}>
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={handleContentChange}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Write your story content here..."
                      style={{ height: 'calc(100% - 42px)' }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-1">
                    <p className="text-xs text-gray-500">
                      Word count: <span className="font-semibold">{wordCount}</span> words
                    </p>
                  </div>
                </div>

                {/* Status and Date Row - Fixed overlap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Published Date</label>
                    <input
                      type="datetime-local"
                      name="published_at"
                      value={formData.published_at}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* SEO Section */}
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Key size={18} />
                    SEO Settings
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter meta title (50-60 characters recommended)"
                      maxLength="60"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.meta_title?.length || 0}/60 characters
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter meta description (150-160 characters recommended)"
                      maxLength="160"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.meta_description?.length || 0}/160 characters
                    </p>
                  </div>

                  {/* Meta Keywords Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Key size={14} />
                        Meta Keywords
                      </div>
                    </label>
                    <input
                      type="text"
                      name="meta_keywords"
                      value={formData.meta_keywords}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter comma-separated keywords (e.g., blog, story, article, tutorial)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate keywords with commas. These help search engines understand your content.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer - Sticky */}
              <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
                >
                  {loading ? "Saving..." : editId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewData(null)}></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Hero Image */}
              {viewData.image_url && (
                <div className="relative h-80 overflow-hidden rounded-t-2xl">
                  <img 
                    src={viewData.image_url} 
                    alt={viewData.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              )}
              
              {/* Content Container */}
              <div className="px-8 py-6">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                    <Briefcase size={14} />
                    {viewData.menu_name || "Uncategorized"}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {viewData.title}
                </h1>

                {/* Author Info Bar - authortag style */}
                <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-b border-gray-100 mb-6">
                  <div className="flex items-center gap-3">
                    {viewData.author_photo_url ? (
                      <img 
                        src={viewData.author_photo_url} 
                        alt={viewData.author_name} 
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                        <User size={20} className="text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {viewData.author_name || "Anonymous Author"}
                      </p>
                      {viewData.author_designation && (
                        <p className="text-sm text-gray-500">{viewData.author_designation}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      <span>Published on {formatDate(viewData.published_at || viewData.created_at)}</span>
                    </div>
                    {viewData.read_time && (
                      <div className="flex items-center gap-1.5">
                        <Clock size={16} />
                        <span>{viewData.read_time}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Author Bio (if available) */}
                {viewData.author_short_bio && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-700 italic">
                      "{viewData.author_short_bio}"
                    </p>
                  </div>
                )}

                {/* Social Media Links */}
                {viewData.author_social_media && (
                  <div className="mb-6 flex flex-wrap gap-3">
                    {(() => {
                      const social = typeof viewData.author_social_media === 'object' 
                        ? viewData.author_social_media 
                        : (() => { try { return JSON.parse(viewData.author_social_media); } catch(e) { return {}; } })();
                      
                      const socialLinks = [];
                      if (social.twitter) socialLinks.push({ platform: 'Twitter', url: social.twitter, icon: '𝕏' });
                      if (social.linkedin) socialLinks.push({ platform: 'LinkedIn', url: social.linkedin, icon: 'in' });
                      if (social.facebook) socialLinks.push({ platform: 'Facebook', url: social.facebook, icon: 'f' });
                      if (social.instagram) socialLinks.push({ platform: 'Instagram', url: social.instagram, icon: '📷' });
                      
                      return socialLinks.map((link, idx) => (
                        <a 
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                        >
                          <span className="font-medium">{link.icon}</span>
                          {link.platform}
                        </a>
                      ));
                    })()}
                  </div>
                )}

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none 
                    prose-headings:text-gray-900 prose-headings:font-bold 
                    prose-p:text-gray-700 prose-p:leading-relaxed 
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-xl prose-img:shadow-md
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                    prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
                    prose-pre:bg-gray-900 prose-pre:text-gray-100"
                  dangerouslySetInnerHTML={{ __html: viewData.content }} 
                />

                {/* SEO Meta Information Footer */}
                {(viewData.meta_title || viewData.meta_description || viewData.meta_keywords) && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <details className="group">
                      <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 flex items-center gap-2">
                        <Key size={14} />
                        SEO Information
                      </summary>
                      <div className="mt-3 p-4 bg-gray-50 rounded-lg text-xs space-y-2">
                        {viewData.meta_title && (
                          <div>
                            <span className="font-semibold text-gray-700">Meta Title:</span>
                            <p className="text-gray-600 mt-0.5">{viewData.meta_title}</p>
                          </div>
                        )}
                        {viewData.meta_description && (
                          <div>
                            <span className="font-semibold text-gray-700">Meta Description:</span>
                            <p className="text-gray-600 mt-0.5">{viewData.meta_description}</p>
                          </div>
                        )}
                        {viewData.meta_keywords && (
                          <div>
                            <span className="font-semibold text-gray-700">Meta Keywords:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {viewData.meta_keywords.split(',').map((keyword, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-200 rounded-full text-xs text-gray-600">
                                  {keyword.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </details>
                  </div>
                )}
              </div>

              {/* Close Button - Floating */}
              <button
                onClick={() => setViewData(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
              >
                <X size={20} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS to fix Quill editor scrolling and overlapping */}
      <style jsx global>{`
        .blog-quill-editor {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 400px;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .blog-quill-editor .ql-container {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          font-size: 14px;
        }
        .blog-quill-editor .ql-editor {
          min-height: 200px;
        }
        .blog-quill-editor .ql-toolbar {
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StoriesPage;