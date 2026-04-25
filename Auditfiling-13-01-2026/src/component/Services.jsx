import React  from "react";
import { useNavigate } from "react-router-dom";

import { FaBalanceScale,  FaRocket } from "react-icons/fa";
import {
  
  FaCalculator,
  FaShieldAlt,
  FaHandshake,
  FaRegFileAlt,
  FaUserTie
} from "react-icons/fa";

import { motion } from "framer-motion";

function ServicesSection() {
  // const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const services = [
    {
      title: "Income Tax",
      description: "Quick and hassle-free income tax filing with expert support to save time and avoid mistakes",
      icon: <FaCalculator className="text-blue-600 text-4xl" />,
      link: "/income-tax",
    },
    {
      title: "GST",
      description: "Easily manage GST registration, filing, return status, and calculator in one simple place",
      icon: <FaRegFileAlt className="text-green-600 text-4xl" />,
      link: "/gst",
    },
    {
      title: "Startup Registrations",
      description: "Complete DPIIT, Udyam/MSME, and Startup India registration with smooth, end-to-end support",
      icon: <FaRocket className="text-purple-600 text-4xl" />,
      link: "/startup-registrations",
    },
    {
      title: "Company (MCA)",
      description: "Register your company and manage ITR, PF/ESI filings, and MCA compliance with ease",
      icon: <FaUserTie className="text-indigo-600 text-4xl" />,
      link: "/company",
    },
    {
      title: "Trademark",
      description: "Secure your brand with fast Trademark registration and expert help for objections",
      icon: <FaShieldAlt className="text-yellow-600 text-4xl" />,
      link: "/trade-mark",
    },
    {
      title: "Bank Valuation",
      description: "Get accurate bank and business valuation with reliable advisory and wealth solutions",
      icon: <FaBalanceScale className="text-red-600 text-4xl" />,
      link: "/bank-valuation",
    },
    {
      title: "Legal",
      description: "Create legal notices, rent agreements, and access expert legal help quickly and easily",
      icon: <FaHandshake className="text-teal-600 text-4xl" />,
      link: "/legal",
    },
  ];



  return (
    <div className=" ">
      {/* Services Section */}

      <section className="py-3">
        <div className="container mx-auto px-12">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold font-serif text-gray-900 mb-4 relative inline-block">
              Services We Provide
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-600 rounded-full"></span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive legal and financial services to meet all your
              business needs
            </p>
          </div>

          {/* Grid for all except last 3 */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {services.slice(0, services.length - 3).map((service, index) => (
              <motion.div
                onClick={() => navigate(service.link)}

                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer"
                whileHover={{ scale: 1.05, y: -8, boxShadow: "0px 10px 25px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <div className="flex items-center gap-3  mb-4">
                  <div className="p-3 rounded-full bg-gray-100">{service.icon}</div>
                  <h3 className="font-semibold font-serif text-gray-900 text-lg">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm m-2  mb-4">
                  {service.description}
                </p>
                <motion.button
                  onClick={() => navigate(service.link)}
                  whileHover={{ x: 4 }}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-all duration-300 hover:underline"
                >
                  Learn more
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* Last 3 Centered */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-12"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {services.slice(-3).map((service, index) => (
              <motion.div
                onClick={() => navigate(service.link)}

                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer w-full sm:w-80"
                whileHover={{ scale: 1.05, y: -8, boxShadow: "0px 10px 25px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-gray-100">{service.icon}</div>
                  <h3 className="font-semibold font-serif text-gray-900 text-lg">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-base  m-2 mb-4">
                  {service.description}
                </p>
                <motion.button
                  onClick={() => navigate(service.link)}
                  whileHover={{ x: 4 }}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-all duration-300 hover:underline"
                >
                  Learn more
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


    </div>
  );
}

export default ServicesSection;
