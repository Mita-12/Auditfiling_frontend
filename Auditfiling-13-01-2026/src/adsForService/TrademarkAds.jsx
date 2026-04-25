import React, { useEffect, useState } from "react";
import QuickForm from "../form/QuickForm";
import WhatsAppButton from "../form/WhatsAppPopup";

export default function TrademarkAds() {
    const [isMobile, setIsMobile] = useState(false);
    const [showProceed, setShowProceed] = useState(false);
    const [selectedServiceData, setSelectedServiceData] = useState(null);
    const [activeFAQ, setActiveFAQ] = useState(null);

    // Static Trademark data
    const trademarkData = {
        features: [
            {
                icon: "🔍",
                title: "Trademark Search",
                description: "Comprehensive search to ensure your brand name is available and unique"
            },
            {
                icon: "⚡",
                title: "Quick Registration",
                description: "Fast-track trademark registration with expert documentation support"
            },
            {
                icon: "🛡️",
                title: "Legal Protection",
                description: "Complete legal protection for your brand against infringement"
            },
            {
                icon: "🌐",
                title: "Nationwide Coverage",
                description: "Trademark protection across all 29 states and 7 union territories of India"
            }
        ],
        testimonials: [
            {
                name: "Priya Sharma",
                company: "PS Fashion House",
                text: "Excellent service! Got my fashion brand trademark registered in just 2 months. Highly professional team.",
                rating: 5
            },
            {
                name: "Rajesh Kumar",
                company: "TechInnovate Solutions",
                text: "Their trademark search saved me from potential legal issues. Smooth registration process.",
                rating: 5
            },
            {
                name: "Anita Patel",
                company: "Organic Delights",
                text: "Complete trademark protection for my food brand. Great support throughout the process.",
                rating: 4
            }
        ]
    };

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const StarRating = ({ rating }) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    // Trademark Proceed Modal Component
    const TrademarkProceedModal = () => {
        if (!showProceed || !selectedServiceData) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-3xl p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Proceed with Trademark Service</h2>
                                <p className="text-blue-100">Complete your trademark registration</p>
                            </div>
                            <button
                                onClick={() => setShowProceed(false)}
                                className="text-white hover:text-blue-200 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="p-6">
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">{selectedServiceData.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{selectedServiceData.description}</p>
                        </div>

                        {/* Features */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3">Service Includes:</h4>
                            <div className="space-y-2">
                                {selectedServiceData.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-gray-700">
                                        <svg className="w-4 h-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Trademark Proceed Modal */}
            <TrademarkProceedModal />

            {/* AuditFile Logo and Title Section */}
            <section className="pt-6 pb-6 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
                    <div className="flex justify-center">
                        <div className="flex items-center gap-3">
                            <a href="/">
                                <img src="/img/auditfile_logo.png" alt="Logo" className="w-10 h-auto" />
                            </a>
                            <a href="/" className="text-blue-950 text-xl sm:text-2xl md:text-3xl font-medium font-serif">
                                Auditfiling
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hero Section */}
            <section className="pb-16 py-10 bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center lg:text-left font-serif">
                            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Trademark Registration
                                </span>{" "}
                                Services in Odisha
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Complete trademark registration and brand protection solutions for businesses in Odisha.
                                Get expert guidance for trademark search, application filing, and legal protection under
                                the Trademarks Act, 1999. Protect your brand identity with our comprehensive services.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Trademark Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Trademark Objection

                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Trademark Certificate
                                    </li>
                                     <li className="flex items-center text-gray-700">
                                         <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Patent Registration
                                    </li>

                                </ul>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Trademark Renewal
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Trademark Transfer
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Copyright Registration
                                    </li>
                                   

                                </ul>
                            </div>
                        </div>

                        {/* Right Content - QuickForm */}
                        <div className=" rounded-lg shadow-sm bg-white ml-30 p-1 mt-8 mb-8 py-10 transform transition-transform duration-300">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
                                    <span className="text-blue-500 font-medium">Call Now:</span>
                                    <a href="tel:+91 7428600607" className="text-blue-600 font-bold hover:underline">
                                        +91 7428600607
                                    </a>
                                </div>
                            </div>
                            <QuickForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* What is Trademark Registration Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                            What is Trademark Registration?
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Protecting Your Brand Identity in Odisha
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Trademark Registration in Odisha</h3>
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    Trademark registration is the legal process of protecting your brand name, logo, slogan, or symbol
                                    under the Trademarks Act, 1999. It gives you exclusive rights to use your brand identity and prevents
                                    others from using similar marks that could cause confusion in the market.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-blue-500 rounded-full p-2 mr-4 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Legal Protection</h4>
                                            <p className="text-gray-600 text-sm">Exclusive rights to use your brand across India for 10 years</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-blue-500 rounded-full p-2 mr-4 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Brand Recognition</h4>
                                            <p className="text-gray-600 text-sm">Build customer trust and brand loyalty with registered trademark</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-blue-500 rounded-full p-2 mr-4 mt-1">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Asset Creation</h4>
                                            <p className="text-gray-600 text-sm">Trademark becomes a valuable intangible asset for your business</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Types of Trademarks We Register</h3>
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <h4 className="text-lg font-bold mb-2">Word Marks</h4>
                                    <p className="text-gray-600">Protection for brand names, business names, and product names</p>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <h4 className="text-lg font-bold mb-2">Logo Marks</h4>
                                    <p className="text-gray-600">Protection for graphical representations, symbols, and designs</p>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <h4 className="text-lg font-bold mb-2">Slogan Marks</h4>
                                    <p className="text-gray-600">Protection for catchy phrases and advertising taglines</p>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                                    <h4 className="text-lg font-bold mb-2">Sound & Color Marks</h4>
                                    <p className="text-gray-600">Protection for distinctive sounds and specific color combinations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits of Trademark Registration Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                            Benefits of Trademark Registration
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Why trademark registration is crucial for business growth and brand protection in Odisha
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Benefits with Trademark Registration */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500">
                            <div className="flex items-center mb-6">
                                <div className="bg-green-100 rounded-full p-3 mr-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">With Trademark Registration</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Legal Protection</h4>
                                        <p className="text-gray-600 text-sm">Exclusive rights to use your brand nationwide for 10 years</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Brand Value</h4>
                                        <p className="text-gray-600 text-sm">Increases business valuation and attracts investors</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Infringement Protection</h4>
                                        <p className="text-gray-600 text-sm">Legal grounds to take action against copycats</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Business Expansion</h4>
                                        <p className="text-gray-600 text-sm">Essential for franchising, licensing, and global expansion</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Online Protection</h4>
                                        <p className="text-gray-600 text-sm">Helps in domain name disputes and e-commerce brand protection</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Challenges without Trademark Registration */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500">
                            <div className="flex items-center mb-6">
                                <div className="bg-red-100 rounded-full p-3 mr-4">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Without Trademark Registration</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">No Legal Protection</h4>
                                        <p className="text-gray-600 text-sm">Anyone can use your brand name without consequences</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Brand Confusion</h4>
                                        <p className="text-gray-600 text-sm">Customers may confuse your brand with competitors</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Loss of Business</h4>
                                        <p className="text-gray-600 text-sm">Copycats can steal your customers and revenue</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Limited Expansion</h4>
                                        <p className="text-gray-600 text-sm">Difficulty in franchising or expanding business operations</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">No Asset Value</h4>
                                        <p className="text-gray-600 text-sm">Unregistered brand has no intangible asset value</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                            Why Choose Our Trademark Services?
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We make trademark registration simple, fast, and hassle-free with our expert services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {trademarkData.features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100"
                            >
                                <div className="text-3xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-serif text-gray-900 mb-4">
                            What Our Clients Say
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Trusted by hundreds of businesses across Odisha for their trademark registration needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trademarkData.testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-100"
                            >
                                <StarRating rating={testimonial.rating} />
                                <p className="text-gray-700 my-4 italic leading-relaxed">"{testimonial.text}"</p>
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                    <p className="text-gray-600 text-sm">{testimonial.company}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-600">
                            Get answers to common questions about Trademark Registration in Odisha
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* FAQ Item 1 */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveFAQ(activeFAQ === 1 ? null : 1)}
                            >
                                <h3 className="text-xl font-bold text-gray-900">
                                    How long does trademark registration take in India?
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-gray-600 transform transition-transform ${activeFAQ === 1 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeFAQ === 1 && (
                                <div className="px-6 pb-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        The trademark registration process typically takes 6-18 months in India. This includes application filing,
                                        examination, publication, and registration stages. However, with our expert services and proper documentation,
                                        we can help expedite the process and ensure smooth registration.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ Item 2 */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveFAQ(activeFAQ === 2 ? null : 2)}
                            >
                                <h3 className="text-xl font-bold text-gray-900">
                                    What is the validity of a trademark registration?
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-gray-600 transform transition-transform ${activeFAQ === 2 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeFAQ === 2 && (
                                <div className="px-6 pb-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        A trademark registration is valid for 10 years from the date of application. It can be renewed indefinitely
                                        for successive periods of 10 years each by paying the renewal fees. We provide timely renewal reminders
                                        and handle the complete renewal process for our clients.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ Item 3 */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveFAQ(activeFAQ === 3 ? null : 3)}
                            >
                                <h3 className="text-xl font-bold text-gray-900">
                                    What documents are required for trademark registration?
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-gray-600 transform transition-transform ${activeFAQ === 3 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeFAQ === 3 && (
                                <div className="px-6 pb-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        Key documents include applicant's identity proof (PAN, Aadhaar), address proof, business registration certificate
                                        (if applicable), trademark logo/image, and power of attorney. For companies, additional documents like board resolution
                                        and incorporation certificate are required.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ Item 4 */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveFAQ(activeFAQ === 4 ? null : 4)}
                            >
                                <h3 className="text-xl font-bold text-gray-900">
                                    Can I register a trademark for my startup?
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-gray-600 transform transition-transform ${activeFAQ === 4 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeFAQ === 4 && (
                                <div className="px-6 pb-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        Yes, absolutely! In fact, it's highly recommended for startups to register their trademarks early to protect
                                        their brand identity. Startups can benefit from reduced government fees and our special startup packages
                                        that make trademark registration affordable and accessible.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ Item 5 */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveFAQ(activeFAQ === 5 ? null : 5)}
                            >
                                <h3 className="text-xl font-bold text-gray-900">
                                    What is the difference between TM and ® symbols?
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-gray-600 transform transition-transform ${activeFAQ === 5 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeFAQ === 5 && (
                                <div className="px-6 pb-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        The TM symbol can be used for unregistered trademarks to indicate that you're claiming rights to the brand.
                                        The ® symbol can only be used after the trademark is officially registered with the trademark registry.
                                        Using ® for unregistered trademarks is illegal and can lead to penalties.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ Item 6 */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveFAQ(activeFAQ === 6 ? null : 6)}
                            >
                                <h3 className="text-xl font-bold text-gray-900">
                                    What happens if someone objects to my trademark?
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-gray-600 transform transition-transform ${activeFAQ === 6 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeFAQ === 6 && (
                                <div className="px-6 pb-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        If someone files an opposition to your trademark during the publication period, we handle the complete
                                        opposition proceedings including preparing counter-statements, evidence collection, and representing
                                        you in trademark hearings. Our legal experts ensure your rights are protected throughout the process.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* FAQ Item 7 */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <button
                                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveFAQ(activeFAQ === 7 ? null : 7)}
                            >
                                <h3 className="text-xl font-bold text-gray-900">
                                    How much does trademark registration cost in Odisha?
                                </h3>
                                <svg
                                    className={`w-5 h-5 text-gray-600 transform transition-transform ${activeFAQ === 7 ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {activeFAQ === 7 && (
                                <div className="px-6 pb-4">
                                    <p className="text-gray-600 leading-relaxed">
                                        The total cost includes government fees (₹4,500 for individuals/startups, ₹9,000 for companies per class)
                                        and professional fees. Our packages start from ₹1,999 + government fees for basic trademark registration.
                                        We offer transparent pricing with no hidden charges and provide complete service from search to registration.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className=" bg-gray-50">
                <div className="max-w-7xl py-10 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Head Office */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Head Office</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                H No-511, Sarahah Tower, Subhash Nagar,<br />
                                Gurugram, India, 122006
                            </p>
                        </div>

                        {/* Branch Office */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Branch Office</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                <a
                                    href="https://maps.app.goo.gl/GDArGKbynTLdLFUw6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-500  transition-colors duration-200"
                                >
                                    3rd Floor, BMC Panchadeep Market Complex,<br />
                                    Unit 4, Bhouma Nagar,<br />
                                    Bhubaneswar, Odisha 751001

                                </a>
                            </p>
                        </div>

                        {/* Let's Talk */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Let's Talk</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-gray-600">
                                    <span className="font-semibold">Phone:</span>{' '}
                                    <a href="tel:+917428600607" className="text-blue-600 hover:text-blue-800 transition-colors">
                                        +91 74286-00607
                                    </a>
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-semibold">Fax:</span> +91 74286-00607
                                </p>
                            </div>
                        </div>

                        {/* Email Support */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Email Support</h3>
                            </div>
                            <div className="space-y-2">
                                <a href="mailto:audifiling@gmail.com" className="block text-blue-600 hover:text-blue-800 transition-colors">
                                    audifiling@gmail.com
                                </a>
                                <a href="mailto:info@auditfiling.com" className="block text-blue-600 hover:text-blue-800 transition-colors">
                                    info@auditfiling.com
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="mt-12 bg-gray-800 pt-8 pb-5 border-t border-gray-200 text-center">
                    <p className="text-white">
                        © 2025 Auditfiling. All rights reserved.
                    </p>
                </div>
            </footer>

            <WhatsAppButton />
        </div>
    );
}