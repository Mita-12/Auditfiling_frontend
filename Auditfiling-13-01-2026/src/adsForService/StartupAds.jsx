import React, { useEffect, useState } from "react";
import QuickForm from "../form/QuickForm";
import WhatsAppButton from "../form/WhatsAppPopup";

export default function StartupAds() {
    const [isMobile, setIsMobile] = useState(false);
    const [showProceed, setShowProceed] = useState(false);
    const [selectedServiceData, setSelectedServiceData] = useState(null);
    const [activeFAQ, setActiveFAQ] = useState(null);

    // Static GST data
    const gstData = {

        features: [
            {
                icon: "📋",
                title: "Easy Registration",
                description: "Simple 3-step process for GST registration with expert guidance"
            },
            {
                icon: "⚡",
                title: "Quick Processing",
                description: "Get your GSTIN within 3-5 working days with fast-track options"
            },
            {
                icon: "🛡️",
                title: "100% Compliance",
                description: "Ensure complete compliance with latest GST rules and regulations"
            },
            {
                icon: "💼",
                title: "Expert Support",
                description: "Dedicated GST professionals for ongoing support and consultation"
            }
        ],
        testimonials: [
            {
                name: "Rajesh Kumar",
                company: "RK Traders",
                text: "Excellent service! Got my GST registration done in just 3 days without any hassle.",
                rating: 5
            },
            {
                name: "Priya Sharma",
                company: "PS Enterprises",
                text: "Their team helped me with GST filing and saved me from penalties. Highly recommended!",
                rating: 5
            },
            {
                name: "Amit Patel",
                company: "Patel & Co.",
                text: "Professional service with timely updates. Made GST compliance so much easier.",
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

    // GST Proceed Modal Component
    const GstProceedModal = () => {
        if (!showProceed || !selectedServiceData) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full transform transition-all">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-3xl p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Proceed with GST Service</h2>
                                <p className="text-blue-100">Complete your service registration</p>
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
            {/* GST Proceed Modal */}
            <GstProceedModal />

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
                                {/* Professional{" "} */}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    Startup Registration
                                </span>{" "}
                                Services in Odisha
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Complete startup registration and incorporation solutions for entrepreneurs in Odisha. Get expert guidance for DPIIT recognition,
                                tax benefits, compliance management, and access to government schemes under Startup India initiative.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Proprietorship Firm Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Partnership Firm Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Trust Registration (IGR)
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Startup India Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Trade License
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        FSSAI Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        FSSAI Renewal
                                    </li>

                                </ul>
                                <ul className=" space-y-3">
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Import Export Code
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        ISO Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        PF Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        ESI Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        TDS Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-orange-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        MSME Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        GEM Registration
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Shop And Commercial Registration
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

{/* What is Startup Registration Section */}
<section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                What is Startup Registration?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Building Your Business Foundation in Odisha
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Startup India Registration</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Startup Registration under the Government of India's Startup India initiative provides official recognition 
                        and numerous benefits to emerging businesses. It offers tax exemptions, easier compliance, funding opportunities, 
                        and IPR support to help startups grow and scale their operations effectively in Odisha.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="bg-blue-500 rounded-full p-2 mr-4 mt-1">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">DPIIT Recognition</h4>
                                <p className="text-gray-600 text-sm">Get official recognition from Department for Promotion of Industry and Internal Trade</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-blue-500 rounded-full p-2 mr-4 mt-1">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Tax Benefits</h4>
                                <p className="text-gray-600 text-sm">Enjoy tax holiday for 3 consecutive years out of first 10 years of operation</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="bg-blue-500 rounded-full p-2 mr-4 mt-1">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Funding Support</h4>
                                <p className="text-gray-600 text-sm">Access to government funds, venture capital, and angel investor networks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Types of Business Entities</h3>
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <h4 className="text-lg font-bold mb-2">Private Limited Company</h4>
                        <p className="text-gray-600">Most popular for startups with separate legal entity and limited liability protection</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <h4 className="text-lg font-bold mb-2">Limited Liability Partnership (LLP)</h4>
                        <p className="text-gray-600">Combines benefits of partnership and corporate structure with limited liability</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <h4 className="text-lg font-bold mb-2">One Person Company (OPC)</h4>
                        <p className="text-gray-600">Single promoter company with limited liability and separate legal identity</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                        <h4 className="text-lg font-bold mb-2">Partnership Firm</h4>
                        <p className="text-gray-600">Ideal for small businesses with multiple partners and shared responsibility</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

{/* Benefits of Startup Registration Section */}
<section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Benefits of Startup Registration
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Why registering your startup is crucial for business growth and success in Odisha
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Benefits with Startup Registration */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-green-500">
                <div className="flex items-center mb-6">
                    <div className="bg-green-100 rounded-full p-3 mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">With Startup Registration</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-gray-900">Tax Exemptions</h4>
                            <p className="text-gray-600 text-sm">100% tax rebate on profits for 3 years in first 7 years of operation</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-gray-900">IPR Fast-tracking</h4>
                            <p className="text-gray-600 text-sm">80% rebate on patent fees and fast-track examination of applications</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-gray-900">Funding Opportunities</h4>
                            <p className="text-gray-600 text-sm">Access to ₹10,000 crore Fund of Funds and venture capital networks</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-gray-900">Easier Compliance</h4>
                            <p className="text-gray-600 text-sm">Self-certification under labor and environmental laws for 3 years</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-gray-900">Government Tenders</h4>
                            <p className="text-gray-600 text-sm">Preference in government procurement and tendering processes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Challenges without Startup Registration */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-red-500">
                <div className="flex items-center mb-6">
                    <div className="bg-red-100 rounded-full p-3 mr-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Without Startup Registration</h3>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-gray-900">No Tax Benefits</h4>
                            <p className="text-gray-600 text-sm">Miss out on significant tax savings and exemptions available to registered startups</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-gray-900">Limited Funding Access</h4>
                            <p className="text-gray-600 text-sm">Difficulty in accessing government funds and investor networks</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-gray-900">Higher Compliance Burden</h4>
                            <p className="text-gray-600 text-sm">Regular inspections and stricter compliance requirements</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-gray-900">Reduced Credibility</h4>
                            <p className="text-gray-600 text-sm">Lower trust among customers, partners, and financial institutions</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-red-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-gray-900">Missed Opportunities</h4>
                            <p className="text-gray-600 text-sm">Cannot participate in government tenders and startup-specific programs</p>
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
                            Why Choose Our GST Services?
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We make GST compliance simple, fast, and hassle-free with our expert services
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {gstData.features.map((feature, index) => (
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
                            Trusted by hundreds of businesses across India for their GST compliance needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gstData.testimonials.map((testimonial, index) => (
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
                Get answers to common questions about Startup Registration in Odisha
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
                        Who is eligible for Startup India registration?
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
                            Any entity incorporated as a Private Limited Company, Partnership firm, or Limited Liability Partnership (LLP) 
                            with turnover less than ₹100 crores in any of the previous financial years, and working towards innovation, 
                            development, or commercialization of new products/processes/services is eligible. The business should be less than 10 years old.
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
                        What documents are required for startup registration in Odisha?
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
                            Key documents include Certificate of Incorporation, PAN card, Aadhaar of directors/partners, 
                            business address proof, bank account details, board resolution for startup registration, 
                            brief description of business innovation, and financial projections. Our team provides complete 
                            documentation support and verification.
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
                        How long does startup registration take in Odisha?
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
                            Typically, startup registration with DPIIT takes 2-3 working days after document submission. 
                            However, the complete process including company incorporation and other registrations may take 
                            7-15 days depending on document verification and approval timelines. Our experts ensure fastest 
                            processing with proper follow-ups.
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
                        What tax benefits do registered startups get?
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
                            Registered startups get 100% tax rebate on profits for 3 consecutive years out of the first 10 years since incorporation. 
                            They also enjoy tax benefits under Section 56 of Income Tax Act (Angel Tax exemptions), 80% rebate on patent filing fees, 
                            and various state-specific incentives offered by Odisha government for startups.
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
                        Can a sole proprietorship register as a startup?
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
                            No, sole proprietorship firms cannot directly register under Startup India scheme. However, you can first convert 
                            your proprietorship to a Private Limited Company, Limited Liability Partnership (LLP), or Partnership Firm, 
                            and then apply for startup registration. We assist with both conversion and subsequent startup registration process.
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
                        What support does Odisha government provide to startups?
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
                            Odisha government offers various incentives through Startup Odisha initiative including seed funding up to ₹25 lakhs, 
                            incubation support, mentorship programs, subsidized office space in government hubs, reimbursement of patent filing costs, 
                            and preference in government procurement. We help startups access all these state-specific benefits along with central government schemes.
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
                        Is there any fee for startup registration?
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
                            There is no government fee for DPIIT startup registration itself. However, there are nominal fees for company incorporation 
                            (₹1,000-₹10,000 depending on authorized capital) and professional charges for documentation and compliance support. 
                            Our service includes complete guidance with transparent pricing for all associated costs.
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