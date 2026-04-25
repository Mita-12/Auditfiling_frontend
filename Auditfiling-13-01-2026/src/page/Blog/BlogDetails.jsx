// import React, { useEffect, useState, useRef } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { slugify } from "../../utils/slugify";
// import WhatsAppButton from "../../form/WhatsAppPopup";
// import QuickForm from "../../form/QuickForm";

// function BlogDetailPage() {
//   const { slug } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // State variables
//   const [blogData, setBlogData] = useState(location.state?.blog || null);
//   const [relatedBlogs, setRelatedBlogs] = useState([]);
//   const [allBlogs, setAllBlogs] = useState([]);
//   const [categories, setCategories] = useState(["All"]);
//   const [categoryCounts, setCategoryCounts] = useState({});
//   const [menuData, setMenuData] = useState([]); // Store menu data
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const scrollRef = useRef(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(false);

//   // ✅ 1. Fetch categories from menu API and store menu data
//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/web/menu`);

//         let menuArray = [];
//         if (Array.isArray(response.data)) menuArray = response.data;
//         else if (Array.isArray(response.data.data)) menuArray = response.data.data;
//         else if (Array.isArray(response.data.menus)) menuArray = response.data.menus;

//         // Store the complete menu data
//         setMenuData(menuArray);

//         if (menuArray.length > 0) {
//           const dynamicMenus = menuArray.map((item) => item.name || item.menu_name || item.title);
//           const uniqueMenus = Array.from(new Set(["All", ...dynamicMenus]));
//           setCategories(uniqueMenus);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching menu:", error);
//       }
//     };
//     fetchMenu();
//   }, []);

//   // ✅ 2. Get category name from menu_id
//   const getCategoryFromMenuId = (menuId) => {
//     if (!menuId || !menuData.length) return "Uncategorized";
    
//     const menuItem = menuData.find(item => item.id === menuId);
//     return menuItem ? (menuItem.name || menuItem.menu_name || menuItem.title) : "Uncategorized";
//   };

//   // ✅ 3. Fetch all blogs and find current blog
//   useEffect(() => {
//     const fetchAllBlogs = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}/api/v1/our_stories`
//         );
//         const blogs = Array.isArray(res.data)
//           ? res.data
//           : res.data?.data || [];
//         setAllBlogs(blogs);

//         // Calculate category counts based on menu_id
//         const counts = {};
//         counts["All"] = blogs.length;

//         // Count blogs for each menu category
//         blogs.forEach(blog => {
//           const categoryName = getCategoryFromMenuId(blog.menu_id);
//           counts[categoryName] = (counts[categoryName] || 0) + 1;
//         });

//         // Ensure all categories from menu have counts (even if 0)
//         categories.forEach(cat => {
//           if (cat !== "All" && !counts[cat]) {
//             counts[cat] = 0;
//           }
//         });

//         setCategoryCounts(counts);

//         // Find current blog
//         if (slug) {
//           const found = blogs.find((b) => slugify(b.title) === slug);
//           if (found) {
//             // Enhance blog data with category name
//             const enhancedBlog = {
//               ...found,
//               category: getCategoryFromMenuId(found.menu_id)
//             };
//             setBlogData(enhancedBlog);
//             setError(null);
//           } else {
//             setError("Blog not found");
//             setBlogData(null);
//           }
//         } else if (location.state?.blog) {
//           // Enhance the blog data from state with category name
//           const enhancedBlog = {
//             ...location.state.blog,
//             category: getCategoryFromMenuId(location.state.blog.menu_id)
//           };
//           setBlogData(enhancedBlog);
//           setError(null);
//         } else {
//           setError("No blog data available");
//           setBlogData(null);
//         }

//       } catch (err) {
//         console.error("Error fetching all blogs:", err);
//         setError("Failed to load blogs.");
//         setBlogData(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllBlogs();
//   }, [slug, location.state, categories, menuData]); // Added menuData as dependency

//   // ✅ 4. Fetch related blogs
//   useEffect(() => {
//     const fetchRelatedBlogs = async () => {
//       if (!blogData) return;

//       try {
//         setLoading(true);
//         let blogs = allBlogs;
//         if (blogs.length === 0) {
//           const response = await axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}/api/v1/our_stories`
//           );
//           blogs = Array.isArray(response.data)
//             ? response.data
//             : response.data?.data || [];
//         }

//         // Find related blogs by menu_id (same category)
//         const related = blogs.filter(
//           (blog) =>
//             blog.id !== blogData.id &&
//             blog.menu_id === blogData.menu_id
//         );

//         // Enhance related blogs with category names
//         const enhancedRelated = related.map(blog => ({
//           ...blog,
//           category: getCategoryFromMenuId(blog.menu_id)
//         }));

//         setRelatedBlogs(enhancedRelated);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching related blogs:", err);
//         setError("Failed to load related blogs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRelatedBlogs();
//   }, [blogData, allBlogs, menuData]);

//   // ✅ Scroll handler
//   const handleScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;

//     const { scrollLeft, scrollWidth, clientWidth } = el;
//     setShowLeftArrow(scrollLeft > 0);
//     setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
//   };

//   const scroll = (direction) => {
//     if (scrollRef.current) {
//       const scrollAmount = 350;
//       scrollRef.current.scrollBy({
//         left: direction === "left" ? -scrollAmount : scrollAmount,
//         behavior: "smooth",
//       });
//     }
//   };

//   useEffect(() => {
//     handleScroll();
//   }, [relatedBlogs]);

// // ✅ Category click handler - This is correct
// const handleCategoryClick = (category) => {
//   if (category === "All") {
//     navigate("/blog");
//   } else {
//     navigate("/blog", {
//       state: {
//         selectedCategory: category
//       }
//     });
//   }
// };

//   // ✅ Blog click handler for related articles
//   const handleBlogClick = (blog) => {
//     const slug = slugify(blog.title);
//     // Enhance blog data with category before navigating
//     const enhancedBlog = {
//       ...blog,
//       category: getCategoryFromMenuId(blog.menu_id)
//     };
//     navigate(`/blog/${slug}`, { state: { blog: enhancedBlog } });
//   };

//   // ✅ IMPROVED DATE HANDLING FUNCTIONS
//   const findDateField = (blog) => {
//     const dateFields = [
//       'date', 
//       'created_at', 
//       'updated_at', 
//       'published_at', 
//       'createdAt', 
//       'updatedAt', 
//       'publish_date', 
//       'post_date',
//       'created',
//       'published'
//     ];
    
//     for (let field of dateFields) {
//       if (blog[field]) {
//         return { field, value: blog[field] };
//       }
//     }
//     return null;
//   };

//   const formatDate = (dateValue) => {
//     if (!dateValue) return "Date not available";
    
//     try {
//       let date;
      
//       if (dateValue instanceof Date) {
//         date = dateValue;
//       } else if (typeof dateValue === 'string') {
//         const cleanDateString = dateValue.split('T')[0];
//         date = new Date(cleanDateString);
        
//         if (isNaN(date.getTime())) {
//           date = new Date(dateValue);
//         }
//       } else if (typeof dateValue === 'number') {
//         date = new Date(dateValue);
//       } else {
//         date = new Date(dateValue);
//       }

//       if (isNaN(date.getTime())) {
//         console.warn("Invalid date value:", dateValue);
//         return "Invalid date";
//       }

//       return date.toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       });
//     } catch (error) {
//       console.error("Error formatting date:", error, dateValue);
//       return "Date format error";
//     }
//   };

//   const getDisplayDate = (blog) => {
//     const dateInfo = findDateField(blog);
    
//     if (!dateInfo) {
//       return new Date().toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       });
//     }
    
//     return formatDate(dateInfo.value);
//   };

//   // ✅ Image URL resolver
//   const resolveImageUrl = (url) => {
//     if (!url) return "/img/blog-placeholder.jpg";
//     const trimmed = String(url).trim();
//     if (trimmed.startsWith("http") || trimmed.startsWith("/")) return trimmed;
//     const base = import.meta.env.VITE_API_BASE_URL || "";
//     return `${base.replace(/\/$/, "")}/${trimmed.replace(/^\//, "")}`;
//   };

//   // ✅ Loading state
//   if (loading && !blogData) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-600">
//         Loading blog...
//       </div>
//     );
//   }

//   // ✅ Error state
//   if (error && !blogData) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-600">
//         {error}
//       </div>
//     );
//   }

//   // ✅ No blog data state
//   if (!blogData) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-600">
//         Blog not found
//       </div>
//     );
//   }

//   // ✅ Main Render
//   return (
//     <div className="flex flex-col px-4 md:px-12 lg:px-16 mt-24 min-h-screen">
//       <div className="container mx-auto px-2 lg:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-6">

//         {/* Categories Sidebar - Left Side */}
//         <div className="lg:col-span-2">
//           <div className="sticky top-32 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//             <h1 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//               </svg>
//               Categories
//             </h1>
//             <div className="space-y-1">
//               {categories.map((category) => (
//                 <button
//                   key={category}
//                   onClick={() => handleCategoryClick(category)}
//                   className={`w-full text-left px-2 py-1.5 rounded-md transition-all duration-200 flex items-center justify-between group ${blogData?.category === category
//                       ? "bg-blue-50 text-blue-600 border border-blue-200"
//                       : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
//                     }`}
//                 >
//                   <div className="flex items-center gap-1">
//                     <span className="font-medium text-sm">{category}</span>
//                     <span className={`text-xs px-1 py-0.5 rounded-full ${blogData?.category === category
//                         ? "bg-blue-100 text-blue-600"
//                         : "bg-gray-100 text-gray-500"
//                       }`}>
//                       {categoryCounts[category] || 0}
//                     </span>
//                   </div>
//                   <svg
//                     className={`w-3 h-3 transition-transform duration-200 ${blogData?.category === category
//                         ? "text-blue-600"
//                         : "text-gray-400 group-hover:text-gray-600"
//                       }`}
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               ))}
//             </div>

//             {/* Back to All Blogs */}
//             <div className="mt-4 pt-3 border-t border-gray-200">
//               <button
//                 onClick={() => navigate("/blog")}
//                 className="w-full flex items-center justify-center gap-1 px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
//               >
//                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//                 Back to All Blogs
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Blog Content - Main Area */}
//         <div className="lg:col-span-8">
//           <main className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
//             {/* Blog Header */}
//             <div className="mb-8">
//               <h1 className="text-2xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">
//                 {blogData.title}
//               </h1>
//               <div className="flex items-center gap-4 text-sm text-gray-600">
//                 {/* Date Display */}
//                 <span className="flex items-center gap-1">
//                   <svg
//                     className="w-4 h-4"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                     />
//                   </svg>
//                   {getDisplayDate(blogData)}
//                 </span>
//                 {/* Category Display - Now dynamically from menu_id */}
//                 {blogData.category && blogData.category !== "Uncategorized" && (
//                   <span className="flex items-center gap-1">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
//                       />
//                     </svg>
//                     {blogData.category}
//                     <span className="bg-blue-100 text-blue-600 text-xs px-1.5 py-0.5 rounded-full ml-1">
//                       {categoryCounts[blogData.category] || 0}
//                     </span>
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Rest of your JSX remains the same */}
//             {/* Blog Image */}
//             {blogData.image && (
//               <div className="relative w-full mb-8 flex justify-center bg-gray-50 rounded-2xl p-4">
//                 <img
//                   src={resolveImageUrl(blogData.image)}
//                   alt={blogData.title}
//                   className="max-w-full object-scale-down rounded-xl"
//                   loading="eager"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = "/img/blog-placeholder.jpg";
//                     e.target.className = "max-w-full object-cover rounded-xl";
//                   }}
//                 />
//               </div>
//             )}

//             {/* Blog Content */}
//             <div
//               className="prose prose-lg max-w-none text-justify text-gray-700 px-0 lg:px-10"
//               dangerouslySetInnerHTML={{
//                 __html: blogData.content || blogData.excerpt,
//               }}
//             />

//             {/* Related Blogs */}
//             {relatedBlogs.length > 0 && (
//               <div className="mt-12 pt-8 border-t border-gray-200 relative">
//                 <h1 className="text-2xl font-bold text-gray-900 mb-6">
//                   Related Articles
//                 </h1>

//                 {/* Left Arrow */}
//                 <button
//                   onClick={() => scroll("left")}
//                   className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md p-2 transition-all duration-300 z-10 hover:bg-gray-50 ${showLeftArrow
//                     ? "opacity-100"
//                     : "opacity-0 pointer-events-none"
//                     }`}
//                 >
//                   <ChevronLeft className="w-6 h-6 text-gray-700" />
//                 </button>

//                 {/* Scrollable Container */}
//                 <div
//                   ref={scrollRef}
//                   onScroll={handleScroll}
//                   className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
//                   style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//                 >
//                   {relatedBlogs.map((blog) => (
//                     <article
//                       key={blog.id}
//                       className="min-w-[280px] lg:min-w-[300px] max-w-[320px] shrink-0 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-300 cursor-pointer snap-start border border-gray-200 hover:shadow-md"
//                       onClick={() => handleBlogClick(blog)}
//                     >
//                       {blog.image && (
//                         <div
//                           className="relative w-full h-40 lg:h-48 mb-4 cursor-pointer"
//                         >
//                           <img
//                             src={resolveImageUrl(blog.image)}
//                             alt={blog.title}
//                             className="w-full h-full object-cover rounded-lg bg-gray-100"
//                             loading="lazy"
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = "/img/blog-placeholder.jpg";
//                               e.target.className = "w-full h-full object-cover rounded-lg bg-gray-200";
//                             }}
//                           />
//                         </div>
//                       )}
//                       <h1
//                         className="font-semibold text-gray-900 mb-2 line-clamp-2 text-base hover:text-blue-600 transition-colors cursor-pointer"
//                       >
//                         {blog.title}
//                       </h1>
//                       <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
//                         {blog.excerpt}
//                       </p>
//                       {/* Date for related blogs */}
//                       <div className="mt-2 text-xs text-gray-500">
//                         {getDisplayDate(blog)}
//                       </div>
//                     </article>
//                   ))}
//                 </div>

//                 {/* Right Arrow */}
//                 <button
//                   onClick={() => scroll("right")}
//                   className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-md p-2 transition-all duration-300 z-10 hover:bg-gray-50 ${showRightArrow
//                     ? "opacity-100"
//                     : "opacity-0 pointer-events-none"
//                     }`}
//                 >
//                   <ChevronRight className="w-6 h-6 text-gray-700" />
//                 </button>
//               </div>
//             )}
            
//             {/* Error Message */}
//             {error && (
//               <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
//                 {error}
//               </div>
//             )}
//           </main>
//         </div>

//         {/* QuickForm Sidebar - Right Side */}
//         <div className="lg:col-span-2">
//           <div className="sticky top-32">
//             <QuickForm />
//           </div>
//         </div>
//       </div>
//       <WhatsAppButton />
//     </div>
//   );
// }

// export default BlogDetailPage;
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slugify } from "../../utils/slugify";
import WhatsAppButton from "../../form/WhatsAppPopup";
import QuickForm from "../../form/QuickForm";

function BlogDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State variables
  const [blogData, setBlogData] = useState(location.state?.blog || null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [menuData, setMenuData] = useState([]); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // ✅ ADDED: Update Browser Tab Title & Favicon
  useEffect(() => {
    if (blogData && blogData.title) {
      document.title = `${blogData.title} | My Blog`; // Shows the blog title in the tab
      
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = '/favicon.ico'; // You can change this to blogData.image for dynamic favicon
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    return () => {
      document.title = "My Blog"; // Reset when leaving
    };
  }, [blogData]);

  // ✅ 1. Fetch categories from menu API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/web/menu`);
        let menuArray = [];
        if (Array.isArray(response.data)) menuArray = response.data;
        else if (Array.isArray(response.data.data)) menuArray = response.data.data;
        else if (Array.isArray(response.data.menus)) menuArray = response.data.menus;

        setMenuData(menuArray);
        if (menuArray.length > 0) {
          const dynamicMenus = menuArray.map((item) => item.name || item.menu_name || item.title);
          const uniqueMenus = Array.from(new Set(["All", ...dynamicMenus]));
          setCategories(uniqueMenus);
        }
      } catch (error) {
        console.error("❌ Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  // ✅ 2. Get category name from menu_id
  const getCategoryFromMenuId = (menuId) => {
    if (!menuId || !menuData.length) return "Uncategorized";
    const menuItem = menuData.find(item => item.id === menuId);
    return menuItem ? (menuItem.name || menuItem.menu_name || menuItem.title) : "Uncategorized";
  };

  // ✅ 3. Fetch all blogs and find current blog
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/our_stories`);
        const blogs = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setAllBlogs(blogs);

        const counts = {};
        counts["All"] = blogs.length;
        blogs.forEach(blog => {
          const categoryName = getCategoryFromMenuId(blog.menu_id);
          counts[categoryName] = (counts[categoryName] || 0) + 1;
        });

        categories.forEach(cat => {
          if (cat !== "All" && !counts[cat]) counts[cat] = 0;
        });
        setCategoryCounts(counts);

        if (slug) {
          const found = blogs.find((b) => slugify(b.title) === slug);
          if (found) {
            setBlogData({ ...found, category: getCategoryFromMenuId(found.menu_id) });
            setError(null);
          } else {
            setError("Blog not found");
            setBlogData(null);
          }
        } else if (location.state?.blog) {
          setBlogData({ ...location.state.blog, category: getCategoryFromMenuId(location.state.blog.menu_id) });
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching all blogs:", err);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllBlogs();
  }, [slug, location.state, categories, menuData]);

  // ✅ 4. Fetch related blogs
  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      if (!blogData) return;
      try {
        setLoading(true);
        let blogs = allBlogs;
        const related = blogs.filter(blog => blog.id !== blogData.id && blog.menu_id === blogData.menu_id);
        setRelatedBlogs(related.map(blog => ({ ...blog, category: getCategoryFromMenuId(blog.menu_id) })));
        setError(null);
      } catch (err) {
        setError("Failed to load related blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchRelatedBlogs();
  }, [blogData, allBlogs, menuData]);

  // ✅ Scroll logic
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -350 : 350, behavior: "smooth" });
    }
  };

  useEffect(() => { handleScroll(); }, [relatedBlogs]);

  const handleCategoryClick = (category) => {
    if (category === "All") navigate("/blog");
    else navigate("/blog", { state: { selectedCategory: category } });
  };

  const handleBlogClick = (blog) => {
    const s = slugify(blog.title);
    navigate(`/blog/${s}`, { state: { blog: { ...blog, category: getCategoryFromMenuId(blog.menu_id) } } });
  };

  // ✅ ORIGINAL DATE HANDLING (Keeping every line as requested)
  const findDateField = (blog) => {
    const dateFields = ['date', 'created_at', 'updated_at', 'published_at', 'createdAt', 'updatedAt', 'publish_date', 'post_date', 'created', 'published'];
    for (let field of dateFields) { if (blog[field]) return { field, value: blog[field] }; }
    return null;
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date not available";
    try {
      let date = new Date(typeof dateValue === 'string' ? dateValue.split('T')[0] : dateValue);
      if (isNaN(date.getTime())) date = new Date(dateValue);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    } catch (error) { return "Date format error"; }
  };

  const getDisplayDate = (blog) => {
    const dateInfo = findDateField(blog);
    return dateInfo ? formatDate(dateInfo.value) : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  const resolveImageUrl = (url) => {
    if (!url) return "/img/blog-placeholder.jpg";
    const trimmed = String(url).trim();
    if (trimmed.startsWith("http") || trimmed.startsWith("/")) return trimmed;
    const base = import.meta.env.VITE_API_BASE_URL || "";
    return `${base.replace(/\/$/, "")}/${trimmed.replace(/^\//, "")}`;
  };

  if (loading && !blogData) return <div className="flex justify-center items-center h-screen">Loading blog...</div>;
  if (error && !blogData) return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  if (!blogData) return <div className="flex justify-center items-center h-screen">Blog not found</div>;

  return (
    <div className="flex flex-col px-4 md:px-12 lg:px-16 mt-24 min-h-screen">
      <div className="container mx-auto px-2 lg:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-32 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h1 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">Categories</h1>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full text-left px-2 py-1.5 rounded-md transition-all flex items-center justify-between ${blogData?.category === category ? "bg-blue-50 text-blue-600 border border-blue-200" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className="font-medium text-sm">{category}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100">{categoryCounts[category] || 0}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-8">
          <main className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl lg:text-4xl font-serif font-bold text-gray-900 mb-4">{blogData.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">{getDisplayDate(blogData)}</span>
                {blogData.category && blogData.category !== "Uncategorized" && (
                  <span className="flex items-center gap-1">{blogData.category}</span>
                )}
              </div>
            </div>

            {blogData.image && (
              <div className="relative w-full mb-8 flex justify-center bg-gray-50 rounded-2xl p-4">
                <img src={resolveImageUrl(blogData.image)} alt={blogData.title} className="max-w-full object-scale-down rounded-xl" />
              </div>
            )}

            <div className="prose prose-lg max-w-none text-justify text-gray-700 lg:px-10" dangerouslySetInnerHTML={{ __html: blogData.content || blogData.excerpt }} />

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
              <div className="mt-12 pt-8 border-t relative">
                <h1 className="text-2xl font-bold mb-6">Related Articles</h1>
                <button onClick={() => scroll("left")} className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 z-10 ${showLeftArrow ? "opacity-100" : "opacity-0"}`}><ChevronLeft /></button>
                <div ref={scrollRef} onScroll={handleScroll} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {relatedBlogs.map((blog) => (
                    <article key={blog.id} className="min-w-[280px] bg-gray-50 rounded-xl p-4 border snap-start hover:shadow-md cursor-pointer" onClick={() => handleBlogClick(blog)}>
                      <img src={resolveImageUrl(blog.image)} alt={blog.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                      <h1 className="font-semibold line-clamp-2">{blog.title}</h1>
                      <p className="text-sm text-gray-600 line-clamp-2">{blog.excerpt}</p>
                    </article>
                  ))}
                </div>
                <button onClick={() => scroll("right")} className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 z-10 ${showRightArrow ? "opacity-100" : "opacity-0"}`}><ChevronRight /></button>
              </div>
            )}
          </main>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-32"><QuickForm /></div>
        </div>
      </div>
      <WhatsAppButton />
    </div>
  );
}

export default BlogDetailPage;