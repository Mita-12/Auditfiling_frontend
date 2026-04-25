
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import QuickForm from "../../form/QuickForm";
import WhatsAppButton from "../../form/WhatsAppPopup";


export default function IncomeTax({ menuId }) {
  const [menuData, setMenuData] = useState(null);
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [menuIds, setMenuIds] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeSection, setActiveSection] = useState("menu-overview");
  const navigate = useNavigate();
  const location = useLocation();

  

  useEffect(() => {
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  
  // Fetch all menus
  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/web/menu`);
        const data = await res.json();
        const menusData = Array.isArray(data) ? data : data.menus || [];
        setMenus(menusData);

        const ids = menusData.map((m) => m.id);
        setMenuIds(ids);

        // Select first menu by default if no menuId provided
        if (!menuId && ids.length > 0) {
          setActiveService(null);
          fetchMenuDetail(ids[0]);
        }
      } catch (err) {
        console.error("Error fetching menus:", err);
      }
    }
    fetchMenus();
  }, [menuId]);

  // Fetch menu detail dynamically
  const fetchMenuDetail = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/menu/${id}`);
      const data = await res.json();
      const menu = data.menu || data.data || data.menu_data || data || null;

      if (menu) {
        setMenuData(menu);
        const allServices = menu.services || menu.menu_services || menu.items || menu.submenus || [];
        setServices(allServices);
        if (allServices.length > 0) {
          setActiveService(allServices[0]);
          setSelectedService(allServices[0].id || "");
        }
      }
    } catch (err) {
      console.error("Error fetching menu detail:", err);
    }
    setLoading(false);
  };

  // Update menu whenever menuId prop changes
  useEffect(() => {
    if (menuId) fetchMenuDetail(menuId);
  }, [menuId]);

  // Handle service selection from header navigation
  useEffect(() => {
    if (location.state?.selectedService && services.length > 0) {
      const service = services.find(s =>
        s.service_name?.toLowerCase() === location.state.selectedService?.toLowerCase() ||
        s.name?.toLowerCase() === location.state.selectedService?.toLowerCase()
      );

      if (service) {
        const sectionId = `service-${service.id || service.service_id}`;
        setActiveSection(sectionId);

        // Clear the state to prevent repeated triggers
        window.history.replaceState({ ...location.state, selectedService: null }, '');
      }
    }
  }, [location.state, services]);

  // Handle section click - switch content immediately without scrolling
  const handleSectionClick = (id) => {
    setActiveSection(id);
    // No scrolling - content switches immediately
  };

  // Fetch FAQ dynamically
  useEffect(() => {
    const fetchFaqs = async () => {
      if (!menuData?.id) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/faq/${menuData.id}`);
        const data = await res.json();
        setFaqs(Array.isArray(data) ? data : data.faqs || []);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFaqs();
  }, [menuData?.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle proceed to payment
  const handleProceed = async () => {
    const service_id = document.getElementById('service')?.value || selectedService;
    if (!service_id) return;

    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user || !user.id) {
      const serviceObj = services.find((s) => s.id === parseInt(service_id));
      navigate('/', {
        state: {
          redirectTo: '/documents',
          selectedService: service_id,
          serviceData: serviceObj,
          message: 'Please login to access documents',
        },
      });
      return;
    }

    try {
      const serviceId = parseInt(service_id);

      const paymentCheckResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/user/service/payment/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
            "User-ID": user.id,
          },
          body: JSON.stringify({
            user_id: user.id,
            service_id: serviceId,
          }),
        }
      );

      const paymentResult = await paymentCheckResponse.json();
      // console.log("💰 Payment check result:", paymentResult);

      if (paymentResult.success === true) {
        console.log("✅ User already paid, redirecting to documents...");
        navigate("/document", {
          state: { serviceId, message: "Access granted to your documents." },
        });
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/service/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "User-ID": user.id,
          },
        }
      );

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const serviceData = await response.json();
      // console.log("📦 API Response:", serviceData);

      let selectedServiceData = null;
      if (Array.isArray(serviceData.services)) {
        selectedServiceData = serviceData.services.find(
          (s) => s.id === serviceId
        );
      } else if (serviceData.data && Array.isArray(serviceData.data.services)) {
        selectedServiceData = serviceData.data.services.find(
          (s) => s.id === serviceId
        );
      }

      if (
        !selectedServiceData &&
        (serviceData.id === serviceId || serviceData.data?.id === serviceId)
      ) {
        selectedServiceData = serviceData.data || serviceData;
      }

      if (!selectedServiceData)
        throw new Error("Service not found in API response");

      const routeName =
        selectedServiceData.service_content ||
        selectedServiceData.service_name;

      const queryParams = new URLSearchParams({ serviceId }).toString();
      const redirectPath = `/proceed/${routeName}?${queryParams}`;

      // console.log(`➡️ Navigating to: ${redirectPath}`);
      navigate(redirectPath, { state: { serviceData: selectedServiceData } });
    } catch (error) {
      console.error("❌ Error in handleProceed:", error);

      const serviceObj = services.find((s) => s.id === parseInt(service_id));
      if (serviceObj) {
        const routeName = serviceObj.service_name
          ?.toLowerCase()
          ?.replace(/\s+/g, "-")
          ?.replace(/[()]/g, "") || "service";
        const queryParams = new URLSearchParams({ serviceId: service_id }).toString();
        const redirectPath = `/proceed/${routeName}?${queryParams}`;
        console.warn("⚠️ API failed, proceeding with fallback navigation");
        navigate(redirectPath, { state: { serviceData: serviceObj } });
      } else {
        alert("Unable to proceed. Please try again.");
      }
    }
  };

  // Loading & error handling
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!menuData) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load data
      </div>
    );
  }

  // Render only the active content section
  const renderActiveContent = () => {
    switch (activeSection) {
      case "menu-overview":
        return (
          <section className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-center mb-4 text-gray-900">
              {menuData.name || "Income Tax"}
            </h1>
            <div
              className="prose prose-sm sm:prose-base text-justify max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html:
                  menuData.menu_description ||
                  menuData.description ||
                  "<p>No description available.</p>",
              }}
            ></div>
          </section>
        );

      case "faq-section":
        return (
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-gray-900 mb-3 sm:mb-4">
                  Frequently Asked Questions
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                  Find quick answers to common questions about our services
                </p>
              </div>

              {faqs.length > 0 ? (
                <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                  {faqs.map((faq, idx) => (
                    <FAQItem
                      key={faq.id || faq.faq_id || idx}
                      question={faq.question}
                      answer={faq.answer}
                      isMobile={isMobile}
                      index={idx}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 lg:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No FAQs available</h3>
                  <p className="text-gray-500 text-sm sm:text-base">Check back later for frequently asked questions</p>
                </div>
              )}
            </div>
          </section>
        );

      default:
        // Check if it's a service section
        if (activeSection.startsWith("service-")) {
          const serviceId = activeSection.replace("service-", "");
          const service = services.find(s =>
            (s.id || s.service_id)?.toString() === serviceId
          );

          if (service) {
            return (
              <section className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-serif font-semibold text-center mb-12 text-gray-900">
                  {service.service_name || service.name}
                </h1>
                <div
                  className="prose prose-sm sm:prose-base text-justify max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html:
                      service.service_description ||
                      service.description ||
                      "<p>No details available.</p>",
                  }}
                ></div>
              </section>
            );
          }
        }

        // Default to overview if no match
        return (
          <section className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-center mb-4 text-gray-900">
              {menuData.name || "Income Tax"}
            </h1>
            <div
              className="prose prose-sm sm:prose-base text-justify max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html:
                  menuData.menu_description ||
                  menuData.description ||
                  "<p>No description available.</p>",
              }}
            ></div>
          </section>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 mt-20 sm:mt-25 py-6 sm:py-10 flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Fixed Left Sidebar Navigation - Hidden on mobile */}
        {!isMobile && (
          <nav className={`flex-none ${isTablet ? 'lg:w-55' : 'xl:w-70'} sticky top-24 self-start bg-white rounded-xl ml-15 sm:rounded-2xl p-4 sm:p-6 h-auto border border-gray-100 shadow-sm`}>
            <h1 className="text-lg sm:text-xl lg:text-3xl font-serif mb-4 sm:mb-5 text-gray-800">
              {menuData.name || "Income Tax"}
            </h1>

            <ul className="space-y-2 list-none sm:space-y-3">
              {/* Overview Link */}
              <li>
                <button
                  onClick={() => handleSectionClick("menu-overview")}
                  className={`w-full text-left flex items-start py-2 px-3 rounded-lg transition-all duration-200 ${activeSection === "menu-overview"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-sm sm:text-lg leading-tight">Overview</span>
                </button>
              </li>

              {/* Services Links */}
              {services.length > 0 ? (
                services.map((service, idx) => {
                  const sectionId = `service-${service.id || service.service_id || idx}`;
                  return (
                    <li key={sectionId}>
                      <button
                        onClick={() => handleSectionClick(sectionId)}
                        className={`w-full text-left flex items-start py-2 px-2 rounded-lg transition-all duration-200 ${activeSection === sectionId
                          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                          }`}
                      >
                        <span className="text-[15px] leading-tight">
                          {service.service_name || service.name}
                        </span>
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="text-gray-500 text-center py-2">No services found</li>
              )}

              {/* FAQ link */}
              <li>
                <button
                  onClick={() => handleSectionClick("faq-section")}
                  className={`w-full text-left flex items-start py-2 px-3 rounded-lg transition-all duration-200 ${activeSection === "faq-section"
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-[15px] leading-tight">Frequently Asked Questions</span>
                </button>
              </li>
            </ul>
          </nav>
        )}

        {/* Main Content Area - Shows only active section */}
        <main className={`flex-1 ${!isMobile ? 'lg:mx-4' : ''}`}>
          <div className="min-h-[60vh]">
            {renderActiveContent()}
          </div>

          {/* Mobile QuickForm */}
          {isMobile && (
            <div className="mt-6">
              <QuickForm />

              {/* Mobile Payment Section */}
              <div className="bg-white shadow-sm rounded-2xl mt-4 p-4 w-full border border-gray-100">
                <h1 className="text-xl font-serif font-bold mb-2 text-center text-blue-500">
                  Proceed <span className="font-bold text-gray-800">to</span> Service
                </h1>
                <p className="text-center text-[15px] mb-3">
                  Choose your Income Tax service to continue with payment
                </p>

                <div className="mb-3">
                  <label htmlFor="service-mobile" className="block text-gray-700 font-medium mb-1">
                    Select Service
                  </label>
                  <select
                    id="service-mobile"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  >
                    {services.map((service) => (
                      <option key={service.id || service.service_id} value={service.id || service.service_id}>
                        {service.service_name || service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={!selectedService}
                  className={`w-full font-semibold py-3 rounded-lg transition duration-200 ${selectedService
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                  Proceed
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Fixed Right Sidebar - QuickForm & Payment (Desktop & Tablet) */}
         {!isMobile && (
                 <div className={`flex-none ${isTablet ? 'lg:w-55' : 'xl:w-70'} space-y-4 mr-15`}>
                   <div className="sticky top-24 space-y-4">
                     {/* QuickForm - Fixed */}
                     <div className="bg-white shadow-sm rounded-xl border border-gray-200">
                       <QuickForm />
                     </div>
       
                     {/* Payment Sidebar - Fixed */}
                     <div className="bg-white shadow-sm rounded-xl p-4 w-full border border-gray-200">
                       <h1 className="text-lg font-serif font-bold mb-2 text-center text-blue-500">
                         Proceed <span className="font-bold text-gray-800">to</span> Service
                       </h1>
                       <p className="text-center text-sm mb-3 text-gray-600">
                         Choose your Trademark service to continue with payment
                       </p>
       
                       <div className="mb-3">
                         <label htmlFor="service" className="block text-gray-700 font-medium mb-1 text-sm">
                           Select Service
                         </label>
                         <select
                           id="service"
                           value={selectedService}
                           onChange={(e) => setSelectedService(e.target.value)}
                           className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                         >
                           {services.map((service) => (
                             <option key={service.id || service.service_id} value={service.id || service.service_id}>
                               {service.service_name || service.name}
                             </option>
                           ))}
                         </select>
                       </div>
       
                       <button
                         onClick={handleProceed}
                         disabled={!selectedService}
                         className={`w-full font-semibold py-2 rounded-lg transition duration-200 text-sm ${selectedService
                           ? "bg-blue-600 text-white hover:bg-blue-700"
                           : "bg-gray-300 text-gray-600 cursor-not-allowed"
                           }`}
                       >
                         Proceed
                       </button>
                     </div>
                   </div>
                 </div>
               )}
      </div>

      <WhatsAppButton/>
    </div>
  );
}

// FAQ Accordion Item Component
const FAQItem = ({ question, answer, isMobile, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border border-gray-200 rounded-lg sm:rounded-xl transition-all duration-300 ${isOpen ? 'bg-white border-blue-200 shadow-sm' : 'bg-white hover:bg-gray-50'
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 sm:px-2 py-2 sm:py-2 text-left rounded-lg sm:rounded-xl"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div
              className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
            >
              {index + 1}
            </div>

            <h3
              className={`font-semibold text-sm sm:text-base lg:text-lg pr-2 transition-colors ${isOpen ? 'text-blue-900' : 'text-gray-900'
                }`}
            >
              {question}
            </h3>
          </div>

          <div
            className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'
              }`}
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-5 ml-9 sm:ml-12">
          <div className="prose prose-sm sm:prose-base max-w-none">
            <div
              className="mt-2 sm:mt-3 text-gray-700 leading-relaxed border-t border-gray-100 pt-2 sm:pt-3 text-sm sm:text-base"
              dangerouslySetInnerHTML={{
                __html: answer || "No answer available.",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};