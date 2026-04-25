import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import WhatsAppPopup from "../../form/WhatsAppPopup";
import { useNavigate, useLocation } from "react-router-dom";
import { slugify } from "../../utils/slugify";

function BlogPage() {
  const [categories, setCategories] = useState(["All"]);
  const [blogList, setBlogList] = useState([]);
  const [blogId, setBlogId] = useState("id"); // Default to "id", will be updated based on actual data
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [menuData, setMenuData] = useState([]); // Store menu data for mapping
  const perPage = 6;

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Read selected category from navigation state
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ✅ Fetch Menus Dynamically
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/web/menu`);

        let menuArray = [];
        if (Array.isArray(response.data)) menuArray = response.data;
        else if (Array.isArray(response.data.data)) menuArray = response.data.data;
        else if (Array.isArray(response.data.menus)) menuArray = response.data.menus;

        // Store menu data for mapping
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

  // ✅ Function to get category name from menu_id
  const getCategoryFromMenuId = (menuId) => {
    if (!menuId || !menuData.length) return "Uncategorized";

    const menuItem = menuData.find(item => item.id === menuId);
    return menuItem ? (menuItem.name || item.menu_name || item.title) : "Uncategorized";
  };

  // ✅ Enhanced Blog Fetching with Dynamic Categories from menu_id
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/our_stories`,
          { timeout: 10000 }
        );

        let data = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];

        // Process and normalize blog categories using menu_id
        data = data.map(blog => {
          // Get category name from menu_id
          const category = getCategoryFromMenuId(blog.menu_id);

          return {
            ...blog,
            category, // Use the category name from menu
            date: blog.date || blog.created_at || new Date().toISOString()
          };
        });

        // Sort newest first
        const sorted = data.sort((a, b) => {
          const da = new Date(a.date);
          const db = new Date(b.date);
          return db - da;
        });

        setBlogList(sorted);
        setBlogId("id"); // Reset to default ID on error
        console.log(blogId);

      } catch (error) {
        console.error("❌ Error fetching blogs:", error);
        setBlogList([]); // Set empty array on error

      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [menuData]); // Add menuData as dependency

  // ✅ Auto-slide functionality for latest blogs
  useEffect(() => {
    const latestBlogs = blogList.slice(0, 4); // Get first 4 blogs for carousel
    if (latestBlogs.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % latestBlogs.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [blogList]);

  // ✅ Enhanced category filtering
  const filteredBlogs = useMemo(() => {
    return blogList.filter((blog) => {
      // Normalize search and category text
      const searchLower = debouncedSearchTerm.toLowerCase();
      const categoryLower = selectedCategory.toLowerCase();
      const blogId = blog.id; // Fallback ID
      const blogCategory = (blog.category || '').toLowerCase();
      const blogTitle = (blog.title || '').toLowerCase();
      const blogExcerpt = (blog.excerpt || '').toLowerCase();
      const blogContent = (blog.content || '').toLowerCase();
      console.log(blogId);

      // Match categories - now using actual category names from menu
      const matchesCategory =
        selectedCategory === "All" ||
        blogCategory === categoryLower ||
        blogCategory.includes(categoryLower);

      // Match search terms
      const matchesSearch =
        !debouncedSearchTerm ||
        blogTitle.includes(searchLower) ||
        blogExcerpt.includes(searchLower) ||
        blogContent.includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }, [blogList, selectedCategory, debouncedSearchTerm,]);



  // ✅ Memoized derived values
  const { latestBlogs, topReads, totalPages, currentPageItems } = useMemo(() => {
    const latest = filteredBlogs.slice(0, 4);
    const top = filteredBlogs.slice(1, 4);
    const total = Math.ceil(filteredBlogs.length / perPage) || 1;
    const currentItems = filteredBlogs.slice((page - 1) * perPage, page * perPage);

    return {
      latestBlogs: latest,
      topReads: top,
      totalPages: total,
      currentPageItems: currentItems
    };
  }, [filteredBlogs, page, perPage]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleReadMore = (blog) => {
  const slug = `${slugify(blog.title)}`; // ✅ best practice
  console.log(slug);
  
  navigate(`/blog/${slug}`, { state: { blog } });
};


  const handleImageClick = (blog) => {
    handleReadMore(blog);
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setPage(1);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % latestBlogs.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + latestBlogs.length) % latestBlogs.length);
  };

  // Loading Skeleton Components
  const CarouselSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex flex-col lg:flex-row bg-gray-200 rounded-xl overflow-hidden">
        <div className="lg:w-2/3 h-64 lg:h-80 bg-gray-300"></div>
        <div className="lg:w-1/3 p-6 lg:p-8">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-10 bg-gray-300 rounded mt-6"></div>
        </div>
      </div>
    </div>
  );

  const ArticleGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 rounded-2xl overflow-hidden">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-5">
              <div className="h-5 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen mt-30">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold font-serif text-gray-900 mb-3">
            Our Stories
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Expert insights on taxation, compliance, legal matters, and business
            advisory.
          </p>
        </div>

        {/* Search + Categories */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-8">
          <div className="w-full lg:flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto overflow-x-auto">
            <div className="flex flex-nowrap gap-2 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`shrink-0 text-sm px-4 py-2 rounded-full transition ${selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:shadow-sm"
                    }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={resetFilters}
                className="shrink-0 text-sm px-4 py-2 rounded-full bg-white text-gray-600 border border-gray-200 ml-2 hover:bg-gray-100"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="space-y-8">
          {/* Featured Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Latest Articles Carousel */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              {loading ? (
                <CarouselSkeleton />
              ) : latestBlogs.length > 0 ? (
                <div className="relative">
                  {/* Carousel Container */}
                  <div
                    className="relative overflow-hidden rounded-xl"
                    role="region"
                    aria-live="polite"
                    aria-label="Featured articles carousel"
                  >
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {latestBlogs.map((blog, index) => (
                        <div key={blog.id || index} className="w-full shrink-0">
                          <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Clickable Image */}
                            <div
                              className="lg:w-2/3 h-64 lg:h-80 overflow-hidden bg-gray-50 cursor-pointer"
                              onClick={() => handleImageClick(blog)}
                            >
                              <img
                                src={blog.image || "/img/blog-placeholder.jpg"}
                                alt={blog.title}
                                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/img/blog-placeholder.jpg';
                                  e.target.classList.add('object-contain', 'p-4');
                                }}
                              />
                            </div>
                            <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col justify-between">
                              <div>
                                <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4 leading-tight">
                                  {blog.title}
                                </h1>
                                <p className="text-gray-600 line-clamp-3 lg:line-clamp-4 text-sm lg:text-base leading-relaxed">
                                  {blog.excerpt}
                                </p>
                                {/* Display dynamic category */}
                                {blog.category && blog.category !== "Uncategorized" && (
                                  <div className="mt-3">
                                    <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                                      {blog.category}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="mt-6 lg:mt-8">
                                <button
                                  onClick={() => handleReadMore(blog)}
                                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm lg:text-base"
                                >
                                  Read Full Article
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  {latestBlogs.length > 1 && (
                    <>
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
                        aria-label="Previous slide"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
                        aria-label="Next slide"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Dot Indicators */}
                  {latestBlogs.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {latestBlogs.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'bg-blue-600 scale-110'
                            : 'bg-white/80 hover:bg-white'
                            }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-600">
                  No latest articles found
                </div>
              )}
            </div>

            {/* Top Reads Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:sticky lg:top-4">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>Top Reads</span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{topReads.length}</span>
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  {loading ? (
                    [...Array(3)].map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="flex items-start gap-3 p-2">
                          <div className="w-20 h-14 sm:w-24 sm:h-16 bg-gray-300 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : topReads.length > 0 ? (
                    topReads.map((b, idx) => (
                      <div
                        key={b.id || idx}
                        className="group cursor-pointer"
                        onClick={() => handleReadMore(b)}
                      >
                        <div className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                          <img
                            src={b.image || "/img/blog-placeholder.jpg"}
                            alt={b.title}
                            className="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => handleImageClick(b)}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/img/blog-placeholder.jpg'; }}
                          />
                          <div className="flex-1 min-w-0">
                            <h1 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {b.title}
                            </h1>
                            {/* Display dynamic category */}
                            {b.category && b.category !== "Uncategorized" && (
                              <div className="text-xs text-blue-600 font-medium mt-1">
                                {b.category}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                      <div className="mb-2">No top reads available</div>
                      <div className="text-xs">Check back later for popular articles</div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Article Grid */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              All Articles
            </h1>
            <p className="text-sm text-gray-600">
              {filteredBlogs.length}{" "}
              {filteredBlogs.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <ArticleGridSkeleton />
            </div>
          ) : currentPageItems.length > 0 ? (
            <>
              <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
                  {currentPageItems.map((blog, idx) => {
                    const total = currentPageItems.length;
                    const remainder = total % 3;
                    let extraClass = "";

                    if (remainder === 1 && idx === total - 1) {
                      extraClass = "lg:col-start-2 lg:max-w-[40rem] mx-auto";
                    }
                    if (remainder === 2 && idx === total - 2) {
                      extraClass = "lg:col-start-2 lg:max-w-[40rem] mx-auto";
                    }

                    return (
                      <article
                        key={blog.id}
                        className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col ${extraClass}`}
                      >
                        {/* Clickable Image */}
                        <img
                          src={blog.image || "/img/blog-placeholder.jpg"}
                          alt={blog.title}
                          className="w-full h-48 object-cover cursor-pointer"
                          onClick={() => handleImageClick(blog)}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/img/blog-placeholder.jpg';
                            e.target.classList.add('object-contain', 'p-4');
                          }}
                        />
                        <div className="p-5 flex flex-col grow">
                          <h1 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                            {blog.title}
                          </h1>

                          {/* Display dynamic category */}
                          {blog.category && blog.category !== "Uncategorized" && (
                            <div className="mb-2">
                              <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                                {blog.category}
                              </span>
                            </div>
                          )}

                          <p className="text-sm text-gray-600 mb-4 line-clamp-3 grow">
                            {blog.excerpt}
                          </p>

                          <button
                            onClick={() => handleReadMore(blog)}
                            className="text-blue-600 text-sm font-medium hover:underline mt-auto"
                          >
                            Read More →
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <div className="text-sm text-gray-700">
                    Page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </div>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-12 text-gray-600 bg-white rounded-2xl border border-gray-200">
              <div className="text-6xl mb-4">📝</div>
              <h4 className="font-semibold text-xl mb-2">No articles found</h4>
              <p className="mb-6 max-w-md mx-auto">
                Try adjusting your search or category filters to find what you're looking for.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <WhatsAppPopup />
    </div>
  );
}

export default BlogPage;