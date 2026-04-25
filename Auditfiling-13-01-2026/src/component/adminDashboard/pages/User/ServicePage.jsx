// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   FileText, 
//   CheckCircle, 
//   Clock, 
//   CreditCard, 
//   Shield, 
//   Users,
//   ChevronRight,
//   Star,
//   Download,
//   HelpCircle,
//   ArrowRight,
//   Loader,
//   AlertCircle,
//   X,
//   Tag,
//   Gift,
//   ChevronLeft
// } from 'lucide-react';

// // ============================================================
// // API Service with improved error handling
// // ============================================================
// const apiService = {
//   baseURL: 'http://localhost:5000/api',

//   async fetchServices() {
//     try {
//       const response = await fetch(`${this.baseURL}/services`, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Non-JSON response:', text.substring(0, 200));
//         throw new Error('Server returned HTML instead of JSON. Please check if backend is running.');
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Fetch services error:', error);
//       if (error.message.includes('Failed to fetch')) {
//         throw new Error('Cannot connect to server. Please ensure backend is running on port 5000');
//       }
//       throw error;
//     }
//   },

//   async applyCoupon(couponCode, amount) {
//     try {
//       const response = await fetch(`${this.baseURL}/offers/apply`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           coupon_code: couponCode,
//           amount: amount,
//           total_amount: amount
//         }),
//       });

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         const text = await response.text();
//         console.error('Non-JSON response:', text.substring(0, 200));
//         throw new Error('Server error. Please check if backend is running.');
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to apply coupon');
//       }

//       if (!data.success) {
//         throw new Error(data.message || 'Invalid coupon code');
//       }

//       return {
//         code: data.coupon,
//         discountType: 'percentage',
//         discountValue: data.discount_per,
//         discountAmount: data.discount_amount,
//         finalPrice: data.final_amount,
//         message: 'Coupon applied successfully!',
//         original_amount: data.original_amount
//       };
//     } catch (error) {
//       console.error('Apply coupon error:', error);
//       throw error;
//     }
//   },

//   // Razorpay payment integration with detailed error logging
//   async createOrder(amount, serviceId, serviceName, userId, couponCode = null) {
//     try {
//       // Validate required fields
//       if (!userId) {
//         throw new Error('User ID is required');
//       }
//       if (!serviceId) {
//         throw new Error('Service ID is required');
//       }
//       if (!amount || amount <= 0) {
//         throw new Error('Valid amount is required');
//       }

//       const requestBody = {
//         amount: Math.round(amount ), // Convert to paise (Razorpay expects amount in paise)
//         currency: 'INR',
//         user_id: userId,
//         service_id: serviceId,
//         service_name: serviceName,
//       };

//       // Only add coupon_code if it exists
//       if (couponCode) {
//         requestBody.coupon_code = couponCode;
//       }

//       console.log('Creating order with data:', JSON.stringify(requestBody, null, 2));

//       const response = await fetch(`${this.baseURL}/payments/create-order`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody),
//       });

//       console.log('Response status:', response.status);

//       // Try to get response text first for better error handling
//       const responseText = await response.text();
//       console.log('Raw response:', responseText);

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         console.error('Failed to parse JSON response:', e);
//         throw new Error(`Invalid response from server: ${responseText.substring(0, 200)}`);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
//       }

//       if (!data.success) {
//         throw new Error(data.message || 'Failed to create order');
//       }

//       if (!data.order?.id) {
//         throw new Error('No order_id received from server');
//       }

//       // Map backend response to frontend format
//       return {
//         order_id: data.order.id,
//         amount: data.order.amount, // in paise
//         currency: data.order.currency || 'INR',
//         payment_id: data.payment_id,
//         key: data.key,
//         total_amount: data.total_amount,
//         payable_amount: data.payable_amount,
//         remaining_amount: data.remaining_amount
//       };
//     } catch (error) {
//       console.error('Create order error details:', {
//         message: error.message,
//         stack: error.stack,
//         userId,
//         serviceId,
//         amount
//       });
//       throw error;
//     }
//   },

//   async verifyPayment(paymentData) {
//     try {
//       console.log('Verifying payment with data:', paymentData);

//       const response = await fetch(`${this.baseURL}/payments/verify`, {
//         method: 'POST',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(paymentData),
//       });

//       const responseText = await response.text();
//       console.log('Verify response:', responseText);

//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         console.error('Failed to parse verify response:', e);
//         throw new Error('Invalid response from server during verification');
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Payment verification failed');
//       }

//       return data;
//     } catch (error) {
//       console.error('Verify payment error:', error);
//       throw error;
//     }
//   }
// };

// // ============================================================
// // Helper Functions
// // ============================================================
// const normalizeService = (service) => {
//   const documentsList = service.documents && Array.isArray(service.documents) 
//     ? service.documents.map(doc => doc.doc_title || doc.title || 'Document')
//     : [];

//   const uniqueDocuments = [...new Map(documentsList.map(doc => [doc, doc])).values()];

//   let features = [];
//   if (service.description && typeof service.description === 'string') {
//     const listItems = service.description.match(/<li>(.*?)<\/li>/g);
//     if (listItems && listItems.length > 0) {
//       features = listItems.slice(0, 4).map(item => 
//         item.replace(/<li>|<\/li>/g, '').substring(0, 100)
//       );
//     } else {
//       features = getDefaultFeatures(service.menu_name);
//     }
//   } else {
//     features = getDefaultFeatures(service.menu_name);
//   }

//   return {
//     id: service.id?.toString() || Math.random().toString(),
//     name: service.service_name || service.name || 'Service',
//     menu_name: service.menu_name || 'Other',
//     price: `₹${parseFloat(service.price).toLocaleString('en-IN')}`,
//     price_raw: parseFloat(service.price),
//     description: stripHtmlTags(service.description || ''),
//     description_raw: service.description || '',
//     documents: uniqueDocuments,
//     popular: service.popular || false,
//     features: features,
//     menu_id: service.menu_id,
//     type: service.type,
//     meta_title: service.meta_title,
//     meta_keyword: service.meta_keyword,
//     meta_description: service.meta_description,
//     created_at: service.created_at,
//     updated_at: service.updated_at
//   };
// };

// const getDefaultFeatures = (menuName) => {
//   const featuresMap = {
//     'Income Tax': [
//       "Expert Tax Consultation",
//       "Maximum Refund Guarantee",
//       "Audit Support",
//       "Year-round Support"
//     ],
//     'GST': [
//       "GST Return Filing",
//       "Input Tax Credit",
//       "GST Registration",
//       "Annual Compliance"
//     ],
//     'Business': [
//       "Business Registration",
//       "Legal Compliance",
//       "Tax Planning",
//       "Annual Filings"
//     ],
//     'Legal': [
//       "Legal Documentation",
//       "Expert Advice",
//       "Court Representation",
//       "Document Verification"
//     ]
//   };

//   return featuresMap[menuName] || [
//     "Professional Service",
//     "Expert Consultation",
//     "Quick Turnaround",
//     "24/7 Support"
//   ];
// };

// const getMenuIcon = (menuName) => {
//   const iconMap = {
//     'Income Tax': <CreditCard size={18} />,
//     'GST': <Shield size={18} />,
//     'Business': <Users size={18} />,
//     'Legal': <FileText size={18} />
//   };
//   return iconMap[menuName] || <Shield size={18} />;
// };

// const getMenuColor = (menuName) => {
//   const colorMap = {
//     'Income Tax': 'from-blue-600 to-blue-400',
//     'GST': 'from-purple-600 to-purple-400',
//     'Business': 'from-green-600 to-green-400',
//     'Legal': 'from-red-600 to-red-400'
//   };
//   return colorMap[menuName] || 'from-gray-600 to-gray-400';
// };

// const stripHtmlTags = (html) => {
//   if (!html) return '';
//   const temp = document.createElement('div');
//   temp.innerHTML = html;
//   return temp.textContent || temp.innerText || '';
// };

// const getUniqueMenuNames = (services) => {
//   const menus = new Set();
//   services.forEach(service => {
//     if (service.menu_name) {
//       menus.add(service.menu_name);
//     }
//   });
//   return Array.from(menus).sort();
// };

// const formatPrice = (price) => {
//   return `₹${price.toLocaleString('en-IN')}`;
// };

// // Helper function to get user ID from session storage
// const getUserIdFromSession = () => {
//   const userData = sessionStorage.getItem('user');
//   if (userData) {
//     try {
//       const user = JSON.parse(userData);
//       return user.id || user.user_id || null;
//     } catch (e) {
//       console.error('Error parsing user data from session storage:', e);
//       return null;
//     }
//   }
//   return null;
// };

// // ============================================================
// // Main Component: ServicePage with Razorpay Integration
// // ============================================================
// const ServicePage = () => {
//   const [services, setServices] = useState([]);
//   const [filteredServices, setFilteredServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedMenu, setSelectedMenu] = useState('all');
//   const [menuList, setMenuList] = useState([]);
//   const [selectedServiceId, setSelectedServiceId] = useState(null);

//   const [appliedCoupons, setAppliedCoupons] = useState({});
//   const [couponInputs, setCouponInputs] = useState({});
//   const [couponErrors, setCouponErrors] = useState({});
//   const [couponLoading, setCouponLoading] = useState({});
//   const [couponSuccess, setCouponSuccess] = useState({});
//   const [showCouponInput, setShowCouponInput] = useState({});

//   // Payment states
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   const [paymentError, setPaymentError] = useState(null);
//   const [paymentSuccess, setPaymentSuccess] = useState(null);
//   const [userId, setUserId] = useState(null);

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);

//   const navigate = useNavigate();

//   // Load Razorpay script on component mount
//   useEffect(() => {
//     const loadRazorpayScript = () => {
//       return new Promise((resolve, reject) => {
//         if (document.querySelector('#razorpay-script')) {
//           setRazorpayLoaded(true);
//           resolve(true);
//           return;
//         }

//         const script = document.createElement('script');
//         script.id = 'razorpay-script';
//         script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//         script.onload = () => {
//           setRazorpayLoaded(true);
//           resolve(true);
//         };
//         script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
//         document.body.appendChild(script);
//       });
//     };

//     loadRazorpayScript().catch(console.error);
//   }, []);

//   // Get user ID from session storage
//   useEffect(() => {
//     const fetchUserId = () => {
//       const id = getUserIdFromSession();
//       if (id) {
//         setUserId(id);
//         console.log('User ID retrieved from session storage:', id);
//       } else {
//         console.warn('No user ID found in session storage');
//         setError('User not logged in. Please login to continue.');
//       }
//     };

//     fetchUserId();
//   }, []);

//   // Fetch services on mount
//   useEffect(() => {
//     fetchServices();
//   }, []);

//   // Filter services when menu or services change
//   useEffect(() => {
//     if (selectedMenu === 'all') {
//       setFilteredServices(services);
//     } else {
//       setFilteredServices(services.filter(service => service.menu_name === selectedMenu));
//     }
//   }, [selectedMenu, services]);

//   // Update menu list when services change
//   useEffect(() => {
//     const menus = getUniqueMenuNames(services);
//     setMenuList(menus);
//   }, [services]);

//   // Auto-select first service when filtered services change
//   useEffect(() => {
//     if (filteredServices.length > 0) {
//       const stillExists = filteredServices.some(s => s.id === selectedServiceId);
//       if (!stillExists || !selectedServiceId) {
//         setSelectedServiceId(filteredServices[0]?.id);
//       }
//     }
//   }, [filteredServices, selectedServiceId]);

//   const fetchServices = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await apiService.fetchServices();

//       if (!data) {
//         throw new Error('No data received from server');
//       }

//       const normalizedData = Array.isArray(data) ? data.map(normalizeService) : [];
//       setServices(normalizedData);

//       if (normalizedData.length === 0) {
//         setError('No services found. Please check your database.');
//       }
//     } catch (err) {
//       console.error('API fetch failed:', err);

//       if (err.message.includes('Failed to fetch') || err.message.includes('Cannot connect')) {
//         setError('Cannot connect to server. Please make sure the backend is running on http://localhost:5000');
//       } else if (err.message.includes('JSON') || err.message.includes('HTML')) {
//         setError('Server response error. Please check if backend API is working correctly.');
//       } else {
//         setError(err.message || 'Failed to fetch services. Please check your connection.');
//       }

//       setServices([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApplyCoupon = async (serviceId, price) => {
//     const couponCode = couponInputs[serviceId];

//     if (!couponCode || !couponCode.trim()) {
//       setCouponErrors(prev => ({ ...prev, [serviceId]: 'Please enter a coupon code' }));
//       return;
//     }

//     setCouponLoading(prev => ({ ...prev, [serviceId]: true }));
//     setCouponErrors(prev => ({ ...prev, [serviceId]: '' }));
//     setCouponSuccess(prev => ({ ...prev, [serviceId]: '' }));

//     try {
//       const result = await apiService.applyCoupon(couponCode.trim(), price);

//       setAppliedCoupons(prev => ({
//         ...prev,
//         [serviceId]: {
//           code: result.code,
//           discountType: result.discountType,
//           discountValue: result.discountValue,
//           discountAmount: result.discountAmount,
//           finalPrice: result.finalPrice,
//           message: result.message,
//           original_amount: result.original_amount
//         }
//       }));

//       setCouponSuccess(prev => ({ 
//         ...prev, 
//         [serviceId]: result.message || `Coupon ${couponCode} applied successfully!` 
//       }));

//       setCouponInputs(prev => ({ ...prev, [serviceId]: '' }));
//       setShowCouponInput(prev => ({ ...prev, [serviceId]: false }));

//       setTimeout(() => {
//         setCouponSuccess(prev => ({ ...prev, [serviceId]: '' }));
//       }, 5000);

//     } catch (err) {
//       setCouponErrors(prev => ({ 
//         ...prev, 
//         [serviceId]: err.message || 'Invalid or expired coupon code' 
//       }));

//       setTimeout(() => {
//         setCouponErrors(prev => ({ ...prev, [serviceId]: '' }));
//       }, 5000);
//     } finally {
//       setCouponLoading(prev => ({ ...prev, [serviceId]: false }));
//     }
//   };

//   const handleRemoveCoupon = (serviceId) => {
//     setAppliedCoupons(prev => {
//       const newState = { ...prev };
//       delete newState[serviceId];
//       return newState;
//     });
//     setCouponSuccess(prev => ({ ...prev, [serviceId]: '' }));
//   };

//   const getDiscountedPriceForService = (service) => {
//     const appliedCoupon = appliedCoupons[service.id];
//     if (!appliedCoupon) return service.price_raw;
//     return appliedCoupon.finalPrice;
//   };

//   const getDiscountAmountForService = (service) => {
//     const appliedCoupon = appliedCoupons[service.id];
//     if (!appliedCoupon) return 0;
//     return service.price_raw - appliedCoupon.finalPrice;
//   };

//   // ============================================================
//   // Razorpay Payment Handler (Core Integration)
//   // ============================================================
//   const initiateRazorpayPayment = async (service) => {
//     // Check if user is logged in
//     if (!userId) {
//       setPaymentError('Please login to continue with payment');
//       setTimeout(() => setPaymentError(null), 5000);
//       return;
//     }

//     // Check if Razorpay script is loaded
//     if (!razorpayLoaded) {
//       setPaymentError('Payment system is loading. Please try again in a moment.');
//       setTimeout(() => setPaymentError(null), 5000);
//       return;
//     }

//     setPaymentProcessing(true);
//     setPaymentError(null);
//     setPaymentSuccess(null);

//     const finalPrice = getDiscountedPriceForService(service);
//     const appliedCoupon = appliedCoupons[service.id];

//     console.log('Initiating payment with:', {
//       userId,
//       serviceId: service.id,
//       serviceName: service.name,
//       finalPrice,
//       couponCode: appliedCoupon?.code || null
//     });

//     try {
//       // Step 1: Create order on backend
//       const orderData = await apiService.createOrder(
//         finalPrice,
//         service.id,
//         service.name,
//         userId,
//         appliedCoupon?.code || null
//       );

//       console.log('Order created successfully:', orderData);

//       if (!orderData.order_id) {
//         throw new Error('No order_id in response');
//       }

//       // Get user details from session storage for prefill
//       let userEmail = '';
//       let userPhone = '';
//       let userName = '';

//       try {
//         const userData = sessionStorage.getItem('user');
//         if (userData) {
//           const user = JSON.parse(userData);
//           userEmail = user.email || '';
//           userPhone = user.phone || user.mobile || '';
//           userName = user.name || user.username || '';
//         }
//       } catch (e) {
//         console.error('Error parsing user data:', e);
//       }

//       // Step 2: Configure Razorpay options
//       const options = {
//         key: orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID',
//         amount: orderData.amount, // Already in paise from backend
//         currency: orderData.currency || 'INR',
//         name: 'LegalMitra',
//         description: `Payment for ${service.name}`,
//         image: '/logo.png',
//         order_id: orderData.order_id,
//         handler: async (response) => {
//           console.log('Razorpay payment response:', response);

//           try {
//             // Step 3: Verify payment on backend
//             const verificationData = {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               user_id: userId,
//               service_id: service.id,
//               service_name: service.name,
//               amount: finalPrice,
//               coupon_code: appliedCoupon?.code || null,
//               discount_amount: getDiscountAmountForService(service)
//             };

//             const verifyResult = await apiService.verifyPayment(verificationData);

//             if (verifyResult.success) {
//               setPaymentSuccess('Payment successful! Redirecting...');

//               // Store payment info for success page
//               sessionStorage.setItem('lastPayment', JSON.stringify({
//                 service: service.name,
//                 service_id: service.id,
//                 amount: finalPrice,
//                 transactionId: response.razorpay_payment_id,
//                 date: new Date().toISOString()
//               }));

//               // Navigate to success page after short delay
//               setTimeout(() => {
//                 navigate('/payment-success', {
//                   state: {
//                     serviceData: service,
//                     paymentDetails: verificationData,
//                     transactionId: response.razorpay_payment_id,
//                     amount: finalPrice
//                   }
//                 });
//               }, 2000);
//             } else {
//               throw new Error(verifyResult.message || 'Payment verification failed');
//             }
//           } catch (err) {
//             console.error('Verification error:', err);
//             setPaymentError(err.message || 'Payment verification failed. Please contact support.');
//             setPaymentSuccess(null);
//           }
//           setPaymentProcessing(false);
//         },
//         prefill: {
//           name: userName,
//           email: userEmail,
//           contact: userPhone
//         },
//         notes: {
//           user_id: userId,
//           service_id: service.id,
//           service_name: service.name,
//           coupon_code: appliedCoupon?.code || 'none'
//         },
//         theme: {
//           color: '#3B82F6'
//         },
//         modal: {
//           ondismiss: () => {
//             setPaymentProcessing(false);
//             setPaymentError('Payment cancelled by user');
//             setTimeout(() => setPaymentError(null), 5000);
//           }
//         }
//       };

//       // Step 4: Initialize Razorpay checkout
//       const razorpay = new window.Razorpay(options);
//       razorpay.open();

//     } catch (err) {
//       console.error('Payment initialization error details:', {
//         message: err.message,
//         stack: err.stack,
//         userId,
//         serviceId: service.id,
//         finalPrice
//       });

//       // Display specific error messages based on the error type
//       let errorMessage = 'Failed to initialize payment. ';
//       if (err.message.includes('user_id')) {
//         errorMessage += 'User authentication failed. Please login again.';
//       } else if (err.message.includes('service_id')) {
//         errorMessage += 'Invalid service selected. Please refresh and try again.';
//       } else if (err.message.includes('amount')) {
//         errorMessage += 'Invalid payment amount. Please contact support.';
//       } else if (err.message.includes('network') || err.message.includes('fetch')) {
//         errorMessage += 'Network error. Please check your connection.';
//       } else {
//         errorMessage += err.message;
//       }

//       setPaymentError(errorMessage);
//       setPaymentProcessing(false);

//       setTimeout(() => setPaymentError(null), 8000);
//     }
//   };

//   const handleBooking = async (service) => {
//     await initiateRazorpayPayment(service);
//   };

//   const selectedService = filteredServices.find(s => s.id === selectedServiceId);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading services...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
//         <div className="absolute inset-0 bg-black opacity-20"></div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="text-center">
//             <h1 className="text-3xl md:text-5xl font-bold mb-3">
//               Our Services
//             </h1>
//             <p className="text-lg md:text-xl mb-6 opacity-90">
//               Professional solutions tailored to your needs
//             </p>
//             <div className="flex flex-wrap justify-center gap-3">
//               <button className="bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-sm md:text-base">
//                 Get Started
//               </button>
//               <button className="border-2 border-white px-5 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300 text-sm md:text-base">
//                 Contact Us
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-blue-50 to-transparent"></div>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-md">
//             <div className="flex items-start">
//               <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
//               <div className="flex-1">
//                 <p className="text-red-700">{error}</p>
//                 {error.includes('Cannot connect') && (
//                   <div className="mt-2 text-sm text-red-600">
//                     <p>Try these solutions:</p>
//                     <ul className="list-disc list-inside ml-2 mt-1">
//                       <li>Make sure backend server is running on port 5000</li>
//                       <li>Check if you have CORS enabled in your backend</li>
//                       <li>Verify the API endpoint URL is correct</li>
//                     </ul>
//                   </div>
//                 )}
//               </div>
//               <button onClick={() => setError(null)} className="ml-auto">
//                 <X className="w-4 h-4 text-red-700" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Payment Error Alert */}
//       {paymentError && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
//           <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-md">
//             <div className="flex items-center">
//               <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
//               <p className="text-yellow-700">{paymentError}</p>
//               <button onClick={() => setPaymentError(null)} className="ml-auto">
//                 <X className="w-4 h-4 text-yellow-700" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Payment Success Alert */}
//       {paymentSuccess && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
//           <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-md">
//             <div className="flex items-center">
//               <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
//               <p className="text-green-700">{paymentSuccess}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Menu Toggle */}
//       <div className="lg:hidden sticky top-0 z-20 bg-white/90 backdrop-blur-sm shadow-md p-3 flex items-center justify-between">
//         <button 
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
//         >
//           {isSidebarOpen ? <ChevronLeft size={18} /> : <Shield size={18} />}
//           {isSidebarOpen ? 'Close Menu' : 'Browse Services'}
//         </button>
//         {selectedService && (
//           <span className="text-sm font-medium text-gray-600 truncate max-w-[200px]">
//             {selectedService.name}
//           </span>
//         )}
//       </div>

//       {/* Main Content Area - Three Column Layout */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col lg:flex-row gap-6">

//           {/* LEFT COLUMN - Service Navigation */}
//           <aside className={`
//             lg:w-80 flex-shrink-0
//             ${isSidebarOpen ? 'fixed inset-0 z-30 bg-white shadow-xl overflow-y-auto lg:relative lg:bg-transparent lg:shadow-none' : 'hidden lg:block'}
//           `}>
//             {isSidebarOpen && (
//               <div className="lg:hidden sticky top-0 bg-white p-3 border-b flex justify-between items-center">
//                 <h2 className="font-bold text-lg">Services</h2>
//                 <button onClick={() => setIsSidebarOpen(false)} className="p-1">
//                   <X size={20} />
//                 </button>
//               </div>
//             )}

//             <div className="space-y-4">
//               {/* Menu Filter Section */}
//               <div className="bg-white rounded-xl shadow-md p-4">
//                 <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                   <Shield size={16} />
//                   Categories
//                 </h3>
//                 <div className="space-y-2">
//                   <button
//                     onClick={() => setSelectedMenu('all')}
//                     className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
//                       selectedMenu === 'all'
//                         ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
//                         : 'hover:bg-gray-100 text-gray-700'
//                     }`}
//                   >
//                     <span>All Services</span>
//                     <ChevronRight size={16} className={selectedMenu === 'all' ? 'text-white' : 'text-gray-400'} />
//                   </button>
//                   {menuList.map((menuName) => (
//                     <button
//                       key={menuName}
//                       onClick={() => setSelectedMenu(menuName)}
//                       className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
//                         selectedMenu === menuName
//                           ? `bg-gradient-to-r ${getMenuColor(menuName)} text-white`
//                           : 'hover:bg-gray-100 text-gray-700'
//                       }`}
//                     >
//                       <div className="flex items-center gap-2">
//                         {getMenuIcon(menuName)}
//                         <span>{menuName}</span>
//                       </div>
//                       <ChevronRight size={16} className={selectedMenu === menuName ? 'text-white' : 'text-gray-400'} />
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Service List */}
//               <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                 <h3 className="font-semibold text-gray-700 p-4 border-b flex items-center gap-2">
//                   <FileText size={16} />
//                   Available Services ({filteredServices.length})
//                 </h3>
//                 <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
//                   {filteredServices.map((service) => (
//                     <button
//                       key={service.id}
//                       onClick={() => {
//                         setSelectedServiceId(service.id);
//                         setIsSidebarOpen(false);
//                       }}
//                       className={`w-full text-left p-4 transition-all hover:bg-gray-50 flex justify-between items-center ${
//                         selectedServiceId === service.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
//                       }`}
//                     >
//                       <div>
//                         <p className="font-medium text-gray-800">{service.name}</p>
//                         <p className="text-sm text-gray-500">{service.duration}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold text-blue-600">{service.price}</p>
//                         {service.popular && (
//                           <span className="text-xs text-purple-600 flex items-center gap-1">
//                             <Star size={10} fill="currentColor" /> Popular
//                           </span>
//                         )}
//                       </div>
//                     </button>
//                   ))}
//                   {filteredServices.length === 0 && (
//                     <div className="p-8 text-center text-gray-500">
//                       No services in this category
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* Overlay for mobile sidebar */}
//           {isSidebarOpen && (
//             <div 
//               className="fixed inset-0 bg-black/50 z-20 lg:hidden"
//               onClick={() => setIsSidebarOpen(false)}
//             />
//           )}

//           {/* MIDDLE COLUMN - Service Details Content */}
//           <div className="flex-1 min-w-0">
//             {selectedService ? (
//               <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//                 <div className={`bg-gradient-to-r ${getMenuColor(selectedService.menu_name)} px-6 py-4 flex justify-between items-center`}>
//                   <div className="flex items-center gap-2 text-white">
//                     {getMenuIcon(selectedService.menu_name)}
//                     <span className="font-medium">{selectedService.menu_name}</span>
//                   </div>
//                   {selectedService.popular && (
//                     <div className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
//                       <Star size={14} fill="currentColor" />
//                       Most Popular
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-6">
//                   <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{selectedService.name}</h2>

//                   <div className="prose max-w-none mb-6">
//                     {selectedService.description_raw ? (
//                       <div
//                         dangerouslySetInnerHTML={{ __html: selectedService.description_raw }}
//                         className="text-gray-600 leading-relaxed"
//                       />
//                     ) : (
//                       <p className="text-gray-600 leading-relaxed">{selectedService.description}</p>
//                     )}
//                   </div>

//                   <div className="mb-6">
//                     <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                       <CheckCircle size={18} className="text-green-500" />
//                       What's Included
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       {selectedService.features?.map((feature, idx) => (
//                         <div key={idx} className="flex items-center gap-2 text-gray-600">
//                           <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
//                           <span>{feature}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
//                 <Shield size={48} className="mx-auto text-gray-300 mb-4" />
//                 <p className="text-gray-500">Select a service from the list to view details</p>
//               </div>
//             )}
//           </div>

//           {/* RIGHT COLUMN - Documents & Price */}
//           <div className="lg:w-96 flex-shrink-0">
//             {selectedService ? (
//               <div className="space-y-6">
//                 <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-4">
//                   <div className="p-6 border-b border-gray-100">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h3>
//                     <div className="mb-4">
//                       {appliedCoupons[selectedService.id] ? (
//                         <div>
//                           <div className="flex items-baseline gap-2 flex-wrap">
//                             <span className="text-3xl font-bold text-green-600">
//                               {formatPrice(getDiscountedPriceForService(selectedService))}
//                             </span>
//                             <span className="text-xl text-gray-400 line-through">
//                               {selectedService.price}
//                             </span>
//                           </div>
//                           <div className="mt-2 p-2 bg-green-50 rounded-lg flex items-center justify-between">
//                             <div className="flex items-center gap-2">
//                               <Gift size={14} className="text-green-600" />
//                               <span className="text-sm text-green-700">
//                                 <strong>{appliedCoupons[selectedService.id].code}</strong> applied
//                               </span>
//                             </div>
//                             <button
//                               onClick={() => handleRemoveCoupon(selectedService.id)}
//                               className="text-green-600 hover:text-green-800 text-xs"
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       ) : (
//                         <span className="text-3xl font-bold text-blue-600">{selectedService.price}</span>
//                       )}
//                     </div>

//                     {!appliedCoupons[selectedService.id] && (
//                       <div className="mb-4">
//                         {!showCouponInput[selectedService.id] ? (
//                           <button
//                             onClick={() => setShowCouponInput(prev => ({ ...prev, [selectedService.id]: true }))}
//                             className="flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
//                           >
//                             <Tag className="w-4 h-4 mr-2" />
//                             Have a coupon code?
//                             <ChevronRight className="w-4 h-4 ml-1" />
//                           </button>
//                         ) : (
//                           <div className="p-3 bg-gray-50 rounded-lg">
//                             <div className="flex gap-2">
//                               <input
//                                 type="text"
//                                 placeholder="Enter coupon code"
//                                 value={couponInputs[selectedService.id] || ''}
//                                 onChange={(e) => setCouponInputs(prev => ({ 
//                                   ...prev, 
//                                   [selectedService.id]: e.target.value.toUpperCase() 
//                                 }))}
//                                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
//                                 disabled={couponLoading[selectedService.id]}
//                               />
//                               <button
//                                 onClick={() => handleApplyCoupon(selectedService.id, selectedService.price_raw)}
//                                 disabled={couponLoading[selectedService.id] || !couponInputs[selectedService.id]?.trim()}
//                                 className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-sm hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
//                               >
//                                 {couponLoading[selectedService.id] ? <Loader className="w-4 h-4 animate-spin" /> : 'Apply'}
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setShowCouponInput(prev => ({ ...prev, [selectedService.id]: false }));
//                                   setCouponInputs(prev => ({ ...prev, [selectedService.id]: '' }));
//                                   setCouponErrors(prev => ({ ...prev, [selectedService.id]: '' }));
//                                 }}
//                                 className="px-2 text-gray-500 hover:text-gray-700"
//                               >
//                                 <X size={16} />
//                               </button>
//                             </div>
//                             {couponErrors[selectedService.id] && (
//                               <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
//                                 <AlertCircle size={12} /> {couponErrors[selectedService.id]}
//                               </p>
//                             )}
//                             {couponSuccess[selectedService.id] && (
//                               <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
//                                 <CheckCircle size={12} /> {couponSuccess[selectedService.id]}
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     <button 
//                       onClick={() => handleBooking(selectedService)}
//                       disabled={paymentProcessing || !userId || !razorpayLoaded}
//                       className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                     >
//                       {paymentProcessing ? (
//                         <>
//                           <Loader className="w-5 h-5 animate-spin" />
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           <CreditCard size={18} />
//                           Book Now {appliedCoupons[selectedService.id] && `• Save ${formatPrice(getDiscountAmountForService(selectedService))}`}
//                         </>
//                       )}
//                     </button>
//                     {!razorpayLoaded && !paymentProcessing && (
//                       <p className="text-xs text-yellow-600 mt-2 text-center">
//                         Loading payment system...
//                       </p>
//                     )}
//                     {!userId && !paymentProcessing && (
//                       <p className="text-xs text-red-500 mt-2 text-center">
//                         Please login to book this service
//                       </p>
//                     )}
//                   </div>

//                   <div className="p-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                       <FileText size={18} className="text-blue-500" />
//                       Required Documents
//                     </h3>
//                     {selectedService.documents && selectedService.documents.length > 0 ? (
//                       <ul className="space-y-3">
//                         {selectedService.documents.map((doc, idx) => (
//                           <li key={idx} className="flex items-center p-2 bg-gray-50 rounded-lg">
//                             <FileText className="w-4 h-4 text-blue-500 mr-3 flex-shrink-0" />
//                             <span className="text-sm text-gray-700">{doc}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p className="text-gray-500 text-sm">No specific documents required. Contact us for more information.</p>
//                     )}
//                     <button className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
//                       <Download size={16} />
//                       Download Checklist
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
//                 <FileText size={40} className="mx-auto text-gray-300 mb-3" />
//                 <p className="text-gray-500">Select a service to see documents and pricing</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>


//     </div>
//   );
// };

// export default ServicePage;

import React, { useState, useEffect, useCallback } from "react";

const BASE_URL = "http://localhost:5000/api";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0 });

const cleanHTML = (html) =>
  html
    ?.replace(/width="[^"]*"/g, "")
    ?.replace(/style="[^"]*width:[^;"]*;?[^"]*"/g, "")
    ?.replace(/text-align:\s*justify;/g, "text-align:left;") ?? "";

// ─── Razorpay SDK loader ──────────────────────────────────────────────────────
const loadRazorpaySDK = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ─── Amount calculator ────────────────────────────────────────────────────────
const calcAmounts = (price, discountAmt, partialPct = null) => {
  const afterDiscount = Math.max(price - discountAmt, 0);
  const sgst = afterDiscount * 0.09;
  const cgst = afterDiscount * 0.09;
  const total = afterDiscount + sgst + cgst;
  const payable = partialPct ? (total * partialPct) / 100 : total;
  const remaining = total - payable;
  return { afterDiscount, sgst, cgst, total, payable, remaining };
};

// ─── Document status badge ────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${map[status] ?? map.pending}`}>
      {status ?? "pending"}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT UPLOAD PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const DocumentUploadPage = ({ service, paymentInfo, userId, authToken, onDone }) => {
  const requiredDocs = service.documents ?? [];

  const [uploadState, setUploadState] = useState(() =>
    requiredDocs.map(() => ({
      file: null, uploading: false, uploaded: false, error: "", uploadedDoc: null,
    }))
  );

  const [companyId, setCompanyId] = useState(null);
  const [fetchingDocs, setFetchingDocs] = useState(true);

  // ── Load company_id + already-uploaded docs on mount ──────────────────────
  useEffect(() => {
    // 1. Read company_id from sessionStorage
    try {
      const stored = sessionStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        setCompanyId(u.company_id || u.companyId || null);
      }
    } catch { /* ignore */ }

    // 2. Fetch existing uploads so user sees current status
    const fetchExisting = async () => {
      setFetchingDocs(true);
      try {
        // ✅ FIXED: correct endpoint is /requests/my-documents
        const res = await fetch(`${BASE_URL}/requests/my-documents`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!res.ok) return;
        const data = await res.json();

        // data.documents is the array from getUserDocuments controller
        const existing = Array.isArray(data.documents) ? data.documents : [];

        setUploadState((prev) =>
          prev.map((slot, i) => {
            const reqDoc = requiredDocs[i];
            const reqTitle = reqDoc?.doc_title || reqDoc?.name || "";
            // Match by service_id + doc_title (case-insensitive)
            const match = existing.find(
              (d) =>
                Number(d.service_id) === Number(service.id) &&
                d.doc_title?.toLowerCase() === reqTitle.toLowerCase()
            );
            if (match) {
              return { ...slot, uploaded: true, uploadedDoc: match, error: "" };
            }
            return slot;
          })
        );
      } catch { /* best-effort */ }
      finally { setFetchingDocs(false); }
    };

    if (authToken) fetchExisting();
    else setFetchingDocs(false);
  }, [authToken, service.id]);

  const setSlot = (i, patch) =>
    setUploadState((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );

  const handleFileChange = (i, e) => {
    const file = e.target.files?.[0] ?? null;
    setSlot(i, { file, error: "", uploaded: false, uploadedDoc: null });
  };

  const uploadDoc = async (i) => {
    const slot = uploadState[i];
    const reqDoc = requiredDocs[i];

    if (!slot.file) {
      setSlot(i, { error: "Please select a file first" });
      return;
    }
    if (!companyId) {
      setSlot(i, { error: "Company ID not found in session. Please log in again." });
      return;
    }

    setSlot(i, { uploading: true, error: "" });

    try {
      const formData = new FormData();
      formData.append("file", slot.file);
      // formData.append("company_id",     companyId);
      formData.append("service_id", service.id);
      formData.append("document_title", reqDoc?.doc_title || reqDoc?.name || `Document ${i + 1}`);
      // Pass document_id for re-upload path
      if (slot.uploadedDoc?.id) {
        formData.append("document_id", slot.uploadedDoc.id);
      }

      // ✅ FIXED: correct endpoint is /requests/upload-document
      const res = await fetch(`${BASE_URL}/requests/upload-document`, {
        method: "POST",
        headers: {
          // ⚠️ Do NOT set Content-Type for FormData — browser sets multipart boundary
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSlot(i, {
          uploading: false,
          uploaded: true,
          uploadedDoc: data.document,
          error: "",
          file: null,
        });
      } else {
        setSlot(i, {
          uploading: false,
          error: data.message || "Upload failed. Please try again.",
        });
      }
    } catch {
      setSlot(i, { uploading: false, error: "Network error. Please try again." });
    }
  };

  const allUploaded = uploadState.length > 0 && uploadState.every((s) => s.uploaded);
  const uploadedCount = uploadState.filter((s) => s.uploaded).length;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-neutral-100">
      {/* Header */}
      <header className="border-b px-6 py-4 bg-white shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Upload Documents</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {service.service_name} · Payment ✓
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            {uploadedCount} / {requiredDocs.length} uploaded
          </span>
          {allUploaded && (
            <button
              onClick={onDone}
              className="px-4 py-2 bg-black text-white text-sm rounded-lg font-medium"
            >
              Done ✓
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left — payment summary + doc checklist */}
        <aside className="w-72 border-r bg-white p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Payment confirmation card */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-green-800">
                {paymentInfo.status === "success" ? "Payment Successful" : "Partial Payment Done"}
              </span>
            </div>
            <div className="space-y-1 text-xs text-green-700">
              <div className="flex justify-between">
                <span>Paid</span>
                <span className="font-semibold">₹{fmt(paymentInfo.paid)}</span>
              </div>
              {paymentInfo.remaining > 0 && (
                <div className="flex justify-between">
                  <span>Remaining</span>
                  <span className="font-semibold text-orange-600">₹{fmt(paymentInfo.remaining)}</span>
                </div>
              )}
              <div className="pt-1 border-t border-green-200 font-mono break-all text-green-600">
                {paymentInfo.txnId}
              </div>
            </div>
          </div>

          {/* Required documents checklist */}
          <div className="border rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Required Documents
            </h3>
            <div className="space-y-2">
              {requiredDocs.map((doc, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${uploadState[i]?.uploaded ? "bg-green-500" : "bg-gray-200"
                    }`}>
                    {uploadState[i]?.uploaded && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs ${uploadState[i]?.uploaded ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {doc.doc_title || doc.name || `Document ${i + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* All done card */}
          {allUploaded && (
            <div className="bg-black text-white rounded-xl p-4 text-center">
              <p className="text-sm font-semibold">All documents uploaded!</p>
              <p className="text-xs text-gray-400 mt-1">Our team will review and get back to you.</p>
              <button onClick={onDone} className="mt-3 w-full py-2 bg-white text-black text-xs font-semibold rounded-lg">
                Back to Services
              </button>
            </div>
          )}
        </aside>

        {/* Right — upload cards */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          {fetchingDocs ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : requiredDocs.length === 0 ? (
            <div className="text-center mt-20 text-gray-400">
              <p className="text-sm">No documents required for this service.</p>
              <button onClick={onDone} className="mt-4 px-5 py-2 bg-black text-white text-sm rounded-lg">
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-2xl">
              <p className="text-sm text-gray-500">
                Please upload all required documents for <strong>{service.service_name}</strong>.
                Accepted formats: PDF, JPG, PNG. Max 10MB per file.
              </p>

              {requiredDocs.map((doc, i) => {
                const slot = uploadState[i];
                const docTitle = doc.doc_title || doc.name || `Document ${i + 1}`;

                return (
                  <div
                    key={i}
                    className={`bg-white rounded-xl border overflow-hidden transition-all ${slot.uploaded ? "border-green-200" : "border-gray-200"
                      }`}
                  >
                    {/* Card header */}
                    <div className={`px-5 py-3 flex items-center justify-between border-b ${slot.uploaded ? "bg-green-50 border-green-100" : "bg-gray-50 border-gray-100"
                      }`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${slot.uploaded ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
                          }`}>
                          {slot.uploaded ? "✓" : i + 1}
                        </span>
                        <span className="text-sm font-semibold text-gray-800">{docTitle}</span>
                      </div>
                      {slot.uploadedDoc && <StatusBadge status={slot.uploadedDoc.status} />}
                    </div>

                    {/* Card body */}
                    <div className="px-5 py-4">
                      {slot.uploaded && slot.uploadedDoc && !slot.file ? (
                        // ── Already uploaded — show file info + re-upload button ──
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">{slot.uploadedDoc.doc_title}</p>
                              <p className="text-xs text-gray-400">
                                {slot.uploadedDoc.file_name || "Uploaded successfully"}
                              </p>
                            </div>
                          </div>
                          <label className="cursor-pointer px-3 py-1.5 border text-xs text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                            Re-upload
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileChange(i, e)}
                            />
                          </label>
                        </div>
                      ) : (
                        // ── Upload area ──────────────────────────────────────
                        <div className="space-y-3">
                          <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${slot.file
                              ? "border-black bg-gray-50"
                              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                            }`}>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => handleFileChange(i, e)}
                              disabled={slot.uploading}
                            />
                            {slot.file ? (
                              <div className="text-center px-4">
                                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mx-auto mb-1">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <p className="text-xs font-medium text-gray-800 truncate max-w-xs">{slot.file.name}</p>
                                <p className="text-xs text-gray-400">
                                  {(slot.file.size / 1024).toFixed(1)} KB · Click to change
                                </p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-xs text-gray-500">
                                  <span className="font-medium text-black">Click to upload</span> or drag & drop
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG · Max 10MB</p>
                              </div>
                            )}
                          </label>

                          {slot.error && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                              <span>⚠</span> {slot.error}
                            </p>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => uploadDoc(i)}
                              disabled={!slot.file || slot.uploading}
                              className="flex-1 py-2 bg-black text-white text-sm rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {slot.uploading ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Uploading…
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                  </svg>
                                  Upload
                                </>
                              )}
                            </button>
                            {slot.file && !slot.uploading && (
                              <button
                                onClick={() => setSlot(i, { file: null, error: "" })}
                                className="px-3 py-2 border text-sm text-gray-500 rounded-lg hover:bg-gray-50"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Re-upload confirm section — shown when user picks a new file after already uploaded */}
                      {slot.uploaded && slot.file && (
                        <div className="mt-3 border-t pt-3 space-y-2">
                          <p className="text-xs text-gray-500">
                            Selected: <strong>{slot.file.name}</strong>
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => uploadDoc(i)}
                              disabled={slot.uploading}
                              className="flex-1 py-2 bg-black text-white text-xs rounded-lg font-medium disabled:opacity-40 flex items-center justify-center gap-2"
                            >
                              {slot.uploading ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Uploading…
                                </>
                              ) : "Confirm Re-upload"}
                            </button>
                            <button
                              onClick={() => setSlot(i, { file: null, error: "" })}
                              className="px-3 py-2 border text-xs text-gray-500 rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                          {slot.error && (
                            <p className="text-xs text-red-500">⚠ {slot.error}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SERVICE PAGE (payment flow)
// ═══════════════════════════════════════════════════════════════════════════════
const ServicePage = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [authToken, setAuthToken] = useState(null);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState({ type: "", text: "" });
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [paymentMode, setPaymentMode] = useState("full");
  const [partialPct, setPartialPct] = useState(30);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [showDocUpload, setShowDocUpload] = useState(false);

  // ── Read user + token from sessionStorage ────────────────────────────────────
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) return;
    try {
      const u = JSON.parse(stored);
      setUserId(u.id || u.user_id || null);
      setUserName(u.name || "");
      setUserEmail(u.email || "");
      setUserPhone(u.phone || u.mobile || "");
      setAuthToken(u.token || sessionStorage.getItem("token") || null);
    } catch {
      setUserId(stored);
    }
    const tok = sessionStorage.getItem("token");
    if (tok) setAuthToken(tok);
  }, []);

  useEffect(() => { loadRazorpaySDK(); }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/services/menu/11`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data?.length) { setServices(data); setSelectedService(data[0]); }
        else setError("No services found");
      } catch { setError("Failed to load services. Is the backend running?"); }
      finally { setLoading(false); }
    })();
  }, []);

  const price = selectedService ? parseFloat(selectedService.price) : 0;
  const discountAmt = appliedCoupon?.discount_amount ?? 0;
  const amounts = calcAmounts(price, discountAmt, paymentMode === "partial" ? partialPct : null);

  const handleSelectService = (svc) => {
    setSelectedService(svc);
    setAppliedCoupon(null);
    setCoupon("");
    setCouponMsg({ type: "", text: "" });
    setPaymentMode("full");
    setPaymentSuccess(null);
    setShowDocUpload(false);
  };

  const applyCouponHandler = useCallback(async () => {
    if (!coupon.trim()) { setCouponMsg({ type: "error", text: "Please enter a coupon code" }); return; }
    setApplyingCoupon(true);
    setCouponMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${BASE_URL}/offers/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupon_code: coupon.trim(), amount: price, total_amount: price }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({ code: data.coupon, discount_per: data.discount_per, discount_amount: data.discount_amount });
        setCouponMsg({ type: "success", text: `${data.discount_per}% off! You save ₹${fmt(data.discount_amount)}` });
      } else {
        setAppliedCoupon(null);
        setCouponMsg({ type: "error", text: data.message || "Invalid coupon" });
      }
    } catch {
      setAppliedCoupon(null);
      setCouponMsg({ type: "error", text: "Could not apply coupon." });
    } finally { setApplyingCoupon(false); }
  }, [coupon, price]);

  const removeCoupon = () => { setAppliedCoupon(null); setCoupon(""); setCouponMsg({ type: "", text: "" }); };

  // ── Payment ──────────────────────────────────────────────────────────────────
  const handlePayment = async () => {
    if (!userId) { alert("You must be logged in to make a payment."); return; }
    if (paymentMode === "partial" && amounts.total < 1000) {
      alert("Partial payment is only allowed for amounts above ₹1000."); return;
    }

    setPaymentProcessing(true);
    const sdkReady = await loadRazorpaySDK();
    if (!sdkReady) {
      alert("Payment gateway failed to load. Check your internet connection.");
      setPaymentProcessing(false); return;
    }

    try {
      const orderRes = await fetch(`${BASE_URL}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          service_id: selectedService.id,
          coupon_code: appliedCoupon?.code || null,
          payment_mode: paymentMode,
          partial_percentage: paymentMode === "partial" ? partialPct : null,
          payment_type: "online",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) throw new Error(orderData.message || "Failed to create order");

      const { order, payment_id, payable_amount } = orderData;
      if (!order?.id) throw new Error("Invalid order response from server");
      if (!orderData.key) throw new Error("Razorpay key missing — check RAZORPAY_KEY_ID in .env");

      const options = {
        key: orderData.key,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Audit Filing",
        description: selectedService.service_name,
        order_id: order.id,
        prefill: { name: userName, email: userEmail, contact: userPhone },
        notes: {
          payment_id: String(payment_id),
          service_id: String(selectedService.id),
          coupon_code: appliedCoupon?.code || "",
        },
        theme: { color: "#111111" },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
            fetch(`${BASE_URL}/payments/failed`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ order_id: order.id, reason: "User dismissed payment window" }),
            }).catch(console.error);
          },
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: payable_amount,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              // ✅ Payment verified → switch to document upload page
              setPaymentSuccess({
                status: verifyData.status,
                paid: verifyData.paid_amount,
                remaining: verifyData.remaining_amount,
                txnId: response.razorpay_payment_id,
              });
              setAppliedCoupon(null);
              setCoupon("");
              setShowDocUpload(true);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verify error:", err);
            alert("Payment verification error. Please contact support.");
          } finally {
            setPaymentProcessing(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        console.error("payment.failed:", resp.error);
        alert(`Payment failed: ${resp.error.description}`);
        setPaymentProcessing(false);
        fetch(`${BASE_URL}/payments/failed`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: order.id, reason: resp.error.description }),
        }).catch(console.error);
      });
      rzp.open();

    } catch (err) {
      console.error("handlePayment error:", err);
      alert(err.message || "Payment initialisation failed.");
      setPaymentProcessing(false);
    }
  };

  // ── After payment success → render DocumentUploadPage ────────────────────────
  if (showDocUpload && paymentSuccess && selectedService) {
    return (
      <DocumentUploadPage
        service={selectedService}
        paymentInfo={paymentSuccess}
        userId={userId}
        authToken={authToken}
        onDone={() => {
          setShowDocUpload(false);
          setPaymentSuccess(null);
          setSelectedService(services[0] || null);
        }}
      />
    );
  }

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400 tracking-widest uppercase">Loading Services</p>
        </div>
      </div>
    );
  }

  if (error && services.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-black text-white text-sm rounded-lg">Retry</button>
        </div>
      </div>
    );
  }

  // ─── Main layout ──────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-neutral-100">
      {/* HEADER */}
      <header className="border-b px-6 py-4 bg-white flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Income Tax Services</h1>
          <p className="text-xs text-gray-400 mt-0.5">File your ITR easily with expert help</p>
        </div>
        {userId ? (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
              {userName ? userName[0].toUpperCase() : "U"}
            </div>
            <span className="font-medium">{userName || `User #${userId}`}</span>
          </div>
        ) : (
          <span className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
            ⚠ Not logged in
          </span>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 border-r bg-white flex flex-col overflow-hidden">
          <div className="px-4 py-2.5 border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Services
          </div>
          <div className="flex-1 overflow-y-auto">
            {services.map((svc) => (
              <button key={svc.id} onClick={() => handleSelectService(svc)}
                className={`w-full text-left px-4 py-3.5 border-b text-sm transition-all ${selectedService?.id === svc.id ? "bg-black text-white" : "hover:bg-gray-50 text-gray-700"
                  }`}>
                <div className="font-medium leading-snug">{svc.service_name}</div>
                {svc.type && (
                  <div className={`text-xs mt-0.5 ${selectedService?.id === svc.id ? "text-gray-300" : "text-gray-400"}`}>
                    {svc.type}
                  </div>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* MIDDLE — service detail */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-neutral-100 px-6 py-6">
          {selectedService ? (
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="border-b px-6 py-4 bg-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">{selectedService.service_name}</h2>
                <span className="text-xl font-bold text-gray-900">₹{fmt(price)}</span>
              </div>
              <div className="px-6 py-6">
                {selectedService.description ? (
                  <div className="service-content" dangerouslySetInnerHTML={{ __html: cleanHTML(selectedService.description) }} />
                ) : (
                  <p className="text-gray-400 text-sm">No description available.</p>
                )}
              </div>
              {selectedService.documents?.length > 0 && (
                <div className="border-t px-6 py-5 bg-gray-50">
                  <h3 className="font-semibold text-sm mb-3 text-gray-700">Required Documents</h3>
                  <div className="grid grid-cols-2 gap-1.5">
                    {selectedService.documents.map((doc, i) => (
                      <div key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-gray-400">•</span>
                        <span>{doc.doc_title || doc.name || "Document"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t px-6 py-4 flex gap-3">
                <button className="px-5 py-2 bg-black text-white text-sm rounded-lg font-medium">Get Started</button>
                <button className="px-5 py-2 border text-sm rounded-lg text-gray-700 hover:bg-gray-50">Contact Support</button>
              </div>
            </div>
          ) : (
            <div className="text-center mt-24 text-gray-400">Select a service to get started</div>
          )}
        </main>

        {/* RIGHT SIDEBAR — payment panel */}
        <aside className="w-80 border-l bg-white overflow-y-auto">
          <div className="p-5 space-y-4">

            {/* Price Breakdown */}
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="text-sm font-semibold text-gray-700">Price Breakdown</h3>
              </div>
              <div className="px-4 py-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Base Price</span><span>₹{fmt(price)}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.discount_per}%)</span>
                    <span>− ₹{fmt(discountAmt)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>SGST (9%)</span><span>₹{amounts.sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>CGST (9%)</span><span>₹{amounts.cgst.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-gray-900">
                  <span>Total</span><span>₹{fmt(amounts.total.toFixed(2))}</span>
                </div>
                {paymentMode === "partial" && (
                  <>
                    <div className="flex justify-between text-blue-600 font-medium">
                      <span>Pay Now ({partialPct}%)</span>
                      <span>₹{fmt(amounts.payable.toFixed(2))}</span>
                    </div>
                    <div className="flex justify-between text-orange-500 text-xs">
                      <span>Pay Later</span>
                      <span>₹{fmt(amounts.remaining.toFixed(2))}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Coupon */}
            <div className="border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h3 className="text-sm font-semibold text-gray-700">Coupon Code</h3>
              </div>
              <div className="px-4 py-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div>
                      <span className="text-sm font-semibold text-green-700">{appliedCoupon.code}</span>
                      <p className="text-xs text-green-600">{appliedCoupon.discount_per}% off applied</p>
                    </div>
                    <button onClick={removeCoupon} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" value={coupon}
                      onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponMsg({ type: "", text: "" }); }}
                      onKeyDown={(e) => e.key === "Enter" && applyCouponHandler()}
                      placeholder="Enter code"
                      className="flex-1 border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                      disabled={applyingCoupon} />
                    <button onClick={applyCouponHandler} disabled={applyingCoupon || !coupon.trim()}
                      className="px-3 py-2 bg-black text-white text-sm rounded-lg disabled:opacity-40 font-medium">
                      {applyingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {couponMsg.text && (
                  <p className={`text-xs mt-2 ${couponMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Mode */}
            {amounts.total >= 1000 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <h3 className="text-sm font-semibold text-gray-700">Payment Mode</h3>
                </div>
                <div className="px-4 py-3 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input type="radio" name="paymode" value="full" checked={paymentMode === "full"}
                      onChange={() => setPaymentMode("full")} className="accent-black" />
                    Pay Full Amount
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input type="radio" name="paymode" value="partial" checked={paymentMode === "partial"}
                      onChange={() => setPaymentMode("partial")} className="accent-black" />
                    Partial Payment
                  </label>
                  {paymentMode === "partial" && (
                    <div className="flex gap-2 mt-2">
                      {[30, 50, 80].map((pct) => (
                        <button key={pct} onClick={() => setPartialPct(pct)}
                          className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-all ${partialPct === pct ? "bg-black text-white border-black" : "text-gray-600 hover:bg-gray-50"
                            }`}>
                          {pct}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button onClick={handlePayment} disabled={paymentProcessing || !userId || price <= 0}
              className="w-full py-3.5 bg-black text-white rounded-xl text-sm font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors">
              {paymentProcessing
                ? "Processing…"
                : `Pay ₹${fmt((paymentMode === "partial" ? amounts.payable : amounts.total).toFixed(2))}`}
            </button>

            {!userId && (
              <p className="text-xs text-center text-red-500">Please log in to continue with payment</p>
            )}
            <p className="text-xs text-center text-gray-400">🔒 Secured by Razorpay · 256-bit SSL</p>
          </div>
        </aside>
      </div>

      <style>{`
        .service-content { line-height:1.75; color:#374151; font-size:0.9rem; width:100%; overflow-x:hidden; word-break:break-word; }
        .service-content h1,.service-content h2,.service-content h3 { font-weight:700; margin:1rem 0 0.5rem; color:#111; }
        .service-content ul,.service-content ol { padding-left:1.25rem; margin:0.5rem 0; }
        .service-content li { margin-bottom:0.25rem; }
        .service-content table { width:100%; border-collapse:collapse; font-size:0.85rem; margin:0.75rem 0; }
        .service-content th,.service-content td { border:1px solid #e5e7eb; padding:0.5rem 0.75rem; text-align:left; }
        .service-content th { background:#f9fafb; font-weight:600; }
      `}</style>
    </div>
  );
};

export default ServicePage;
