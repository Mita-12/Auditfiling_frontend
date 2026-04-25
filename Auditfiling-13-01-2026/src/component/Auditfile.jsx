import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBuilding, FaSuitcase, FaTruck } from "react-icons/fa";
import { HiOutlineDocumentText, HiOutlineBriefcase } from "react-icons/hi";
import { MdOutlineSupportAgent } from "react-icons/md";
import WhatsAppButton from "../form/WhatsAppPopup";

export default function Auditfile() {
  const [activeTab, setActiveTab] = useState("Organization");
  const [showBar, setShowBar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check screen size
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

  useEffect(() => {
    if (activeTab === "Organization") {
      setShowBar(true);
    } else {
      setShowBar(false);
    }
  }, [activeTab]);

  const tabs = [
    { name: "Organization", icon: <FaSuitcase /> },
    { name: "Enterprise", icon: <FaBuilding /> },
    { name: "Startup", icon: <FaTruck /> },
    { name: "Individuals", icon: <FaUser /> },
  ];

  const tabContent = {
    Enterprise: [
      {
        icon: <HiOutlineDocumentText className="text-blue-600" />,
        title: "GST New Registration",
        desc: "GST registration made easy for your business",
        link: "/gst",
      },
      {
        icon: <FaBuilding className="text-blue-600" />,
        title: "Trademark Registration",
        desc: "GST registration made easy for your business",
        link: "/trade-mark",
      },
      {
        icon: <HiOutlineBriefcase className="text-blue-600" />,
        title: "MSME Registration",
        desc: "Get your MSME certificate and grow faster",
        link: "/startup-registrations",
      },
      {
        icon: <MdOutlineSupportAgent className="text-blue-600" />,
        title: "Trade License",
        desc: "Easily obtain your business trade license today",
        link: "/startup-registrations",
      },
      {
        icon: <MdOutlineSupportAgent className="text-blue-600" />,
        title: "FSSAI Registration",
        desc: "Quick FSSAI license help for food businesses",
        link: "/startup-registrations",
      },
      {
        icon: <MdOutlineSupportAgent className="text-blue-600" />,
        title: "Proprietorship Firm Registration",
        desc: "Hassle-free online proprietorship registration",
        link: "/gst",
      },
    ],

    Individuals: [
      {
        icon: <HiOutlineDocumentText className="text-blue-600" />,
        title: "Salaried Individual",
        desc: "Easy tax filing for salaried professionals",
        link: "/income-tax",
      },
      {
        icon: <MdOutlineSupportAgent className="text-blue-600" />,
        title: "Professionals",
        desc: "Hassle-free tax solutions for working professionals",
        link: "/income-tax",
      },
      {
        icon: <FaUser className="text-blue-600" />,
        title: "Self Employed",
        desc: "Smart legal help tailored for self-employed pros",
        link: "/income-tax",
      },
      {
        icon: <HiOutlineBriefcase className="text-blue-600" />,
        title: "HUF",
        desc: "Trusted experts to manage your HUF process",
        link: "/income-tax",
      },
    ],

    Organization: [
      {
        icon: <HiOutlineBriefcase className="text-blue-600" />,
        title: "GST New Registration",
        desc: "GST registration made easy for your business",
        link: "/gst",
      },
      {
        icon: <HiOutlineDocumentText className="text-blue-600" />,
        title: "New Company Registration",
        desc: "Start your business with quick registration",
        link: "/company",
      },
      {
        icon: <MdOutlineSupportAgent className="text-blue-600" />,
        title: "PF and ESI Registration",
        desc: "Simplify PF and ESI registration with our experts",
        link: "/company",
      },
      {
        icon: <MdOutlineSupportAgent className="text-blue-600" />,
        title: "Trust Registration",
        desc: "Easy register your trust with expert help",
        link: "/startup-registrations",
      },
      {
        icon: <MdOutlineSupportAgent className="text-blue-600" />,
        title: "Partnership Firm Registration",
        desc: "Register your partnership firm quickly online",
        link: "/gst",
      },
      {
        icon: <HiOutlineBriefcase className="text-blue-600" />,
        title: "MSME Registration",
        desc: "Get your MSME certificate and grow faster",
        link: "/startup-registrations",
      },
    ],

    Startup: [
      {
        icon: <FaBuilding className="text-blue-600" />,
        title: "GST Registration",
        desc: "GST registration made easy for your business",
        link: "/gst",
      },
      {
        icon: <HiOutlineDocumentText className="text-blue-600" />,
        title: "MSME Registration",
        desc: "Get your MSME certificate and grow faster",
        link: "/startup-registrations",
      },
      {
        icon: <HiOutlineDocumentText className="text-blue-600" />,
        title: "Trademark Registration",
        desc: "Secure your business identity with a trademark",
        link: "/trade-mark",
      },
      {
        icon: <MdOutlineSupportAgent className="text-blue-600" />,
        title: "Trade License",
        desc: "Easily obtain your business trade license today",
        link: "/startup-registrations",
      },
      {
        icon: <MdOutlineSupportAgent className="text-blue-600" />,
        title: "FSSAI Registration",
        desc: "Quick FSSAI license help for food businesses",
        link: "/company",
      },
      {
        icon: <HiOutlineBriefcase className="text-blue-600" />,
        title: "GEM Registration",
        desc: "Get GeM registration and start selling to Govt.",
        link: "/company",
      },
    ],
  };

  return (
    <section className="bg-white py-6 sm:py-12 lg:py-14 relative">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12 md:mb-16">
          <h1
            id="section-title"
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif text-gray-900 mb-2 sm:mb-4 relative inline-block"
          >
            Made for everyone
            {/* Blue underline bar animation */}
            {showBar && (
              <span className="block w-12 sm:w-16 md:w-20 lg:w-24 h-0.5 sm:h-1 bg-blue-600 mx-auto mt-1 sm:mt-2 md:mt-3 transition-all duration-500"></span>
            )}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 pt-2 sm:pt-3 md:pt-5 leading-relaxed px-2 sm:px-0">
            Whether you're just starting out or running a growing business,
            we're here to make legal work simple and effortless.
          </p>
        </div>

        {/* Tabs - Mobile optimized with horizontal scroll */}
        <div className="flex justify-start sm:justify-center border-b rounded-lg sm:rounded-2xl bg-gray-50 border-gray-200 overflow-x-auto no-scrollbar">
          <div className="flex min-w-max px-2 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 font-medium md:text-lg lg:text-xl font-serif transition-colors border-b-2 whitespace-nowrap shrink-0 ${activeTab === tab.name
                  ? "text-blue-600 border-blue-600 bg-blue-50/50 rounded-t-lg"
                  : "text-gray-900 border-transparent hover:text-blue-600"
                  }`}
              >
                <span className="text-lg sm:text-sl">{tab.icon}</span>
                <span className="hidden xs:inline">{tab.name}</span>
                <span className="xs:hidden text-lg">
                  {tab.name === "Organization" ? "Organization" :
                   tab.name === "Enterprise" ? "Enterprise" :
                   tab.name === "Startup" ? "Startup" : 
                   tab.name === "Individuals" ? "Individuals" : "Individuals"
                   }
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid - Mobile optimized */}
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <div
            className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 
                isTablet ? 'md:grid-cols-2 gap-4 sm:gap-5' : 
                  'lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8'
              }`}
          >
            {Array.isArray(tabContent?.[activeTab]) &&
              tabContent[activeTab].map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl hover:bg-blue-50/80 transition-all duration-300 group border border-gray-100 hover:border-blue-200 hover:shadow-sm sm:hover:shadow-md bg-white"
                >
                  {/* Icon Container */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-blue-50 rounded-lg sm:rounded-xl group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300 shrink-0 shadow-sm">
                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                      {React.cloneElement(item.icon, {
                        className: "w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6",
                      })}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                    <h3 className="text-gray-900 font-semibold text-base sm:text-lg md:text-xl group-hover:text-blue-700 transition-colors duration-300 leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
      <WhatsAppButton/>
    </section>
  );
}