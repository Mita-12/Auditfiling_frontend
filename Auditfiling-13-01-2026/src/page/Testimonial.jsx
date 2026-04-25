
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

const testimonialsData = [
  {
    id: 1,
    title: "Seamless & Efficient Audit Management",
    review:
      "AuditFilling.com has completely transformed the way we handle our audits. The platform is user-friendly, automated, and ensures compliance with all regulations.",
    name: "Akshay Jain",
    company: "Embedded Design Solution",
    rating: 5,
    avatar: "AJ",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Saves Time & Ensures Compliance",
    review:
      "Using AuditFilling.com has made our audit filing process smoother and more efficient. A must-have tool for financial professionals!",
    name: "Anurag Mishra",
    company: "M/S Daba India Generic Pharma",
    rating: 5,
    avatar: "AM",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "User-Friendly & Highly Secure",
    review:
      "What I love about AuditFilling.com is its intuitive interface and top-notch security. Our audit data is well-organized and securely stored.",
    name: "Pitabash Behera",
    company: "Star Services",
    rating: 4,
    avatar: "PB",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Best Audit Management Software in the Market",
    review:
      "AuditFilling.com has revolutionized our auditing process with AI-powered insights and excellent customer support!",
    name: "Partho Ghosh",
    company: "Satyam Shivam Enterprisers",
    rating: 5,
    avatar: "PG",
    color: "bg-orange-500",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Calculate items per slide based on screen size
  const getItemsPerSlide = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  // Calculate slide width based on items per slide
  const getSlideWidth = () => {
    const itemsPerSlide = getItemsPerSlide();
    return 100 / itemsPerSlide;
  };

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + 1) % Math.ceil(testimonialsData.length / getItemsPerSlide())
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile, isTablet]);

  const handleNext = () => {
    const itemsPerSlide = getItemsPerSlide();
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % Math.ceil(testimonialsData.length / itemsPerSlide)
    );
  };

  const handlePrev = () => {
    const itemsPerSlide = getItemsPerSlide();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.ceil(testimonialsData.length / itemsPerSlide) - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden ">
      <div className="max-w-6xl mx-auto text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-gray-800">
          What Our Clients Say
        </h1>
        <span className="block w-16 sm:w-20 lg:w-24 h-0.5 sm:h-1 bg-blue-600 mx-auto mt-2 sm:mt-3 transition-all duration-500"></span>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Trusted by professionals and businesses across industries.
        </p>
      </div>

      <div className="max-w-6xl mx-auto py-6 sm:py-8 lg:py-10 overflow-hidden relative">
        {/* Carousel Wrapper */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * getSlideWidth()}%)`,
            }}
          >
            {testimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`${isMobile ? 'min-w-full' :
                    isTablet ? 'min-w-1/2' :
                      'min-w-1/3'
                  } px-2 sm:px-3`}
              >
                {/* Testimonial Card */}
                <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {/* Title */}
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                    {testimonial.title}
                  </h3>

                  {/* Review */}
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base flex-grow leading-relaxed">
                    {testimonial.review}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-sm sm:text-lg font-semibold shadow-md ${testimonial.color}`}
                    >
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                        {testimonial.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">
                        {testimonial.company}
                      </p>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${i < testimonial.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                              } text-xs sm:text-sm`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows - Show on desktop and tablet */}
        {!isMobile && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 z-10"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-50 z-10"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Navigation Dots */}
        <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
          {[...Array(Math.ceil(testimonialsData.length / getItemsPerSlide()))].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-blue-600 scale-110"
                  : "bg-gray-300 hover:bg-blue-400"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
