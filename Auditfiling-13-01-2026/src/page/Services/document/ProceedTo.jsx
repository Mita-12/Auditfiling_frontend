
import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  CurrencyRupeeIcon,
  PlusIcon,
  CheckBadgeIcon,
  ChevronRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const ProceedTo = () => {
  const [serviceData, setServiceData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [pricing, setPricing] = useState({ finalAmount: 0, customAmount: 0 });
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [paymentType, setPaymentType] = useState('full');
  const [partialPercent, setPartialPercent] = useState(30);
  const [allowCustomAmount, setAllowCustomAmount] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { serviceName } = useParams();

  const user = JSON.parse(sessionStorage.getItem('user'));
  const userId = user?.id;
  const token = user?.token;

  /** ---------- Fetch Service Details ---------- */
  const fetchServiceDetails = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/service/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      const service = data.services?.find((s) => s.id === +id) || data;

      setServiceData(service);
      setPricing((prev) => ({
        ...prev,
        finalAmount: service.service_price || service.price || 0,
      }));

      // ✅ Allow custom amount if price not fixed or very low
      setAllowCustomAmount(!service.service_price || parseFloat(service.service_price) <= 0.01);

      const docs =
        data.required_documents?.map((d) => ({
          id: d.id,
          name: d.document_name,
          mandatory: d.status === 1
        })) || [];
      setDocuments(docs);

      const type = service.type?.toLowerCase();
      if (type === 'both') setSelectedType('');
      if (type === 'business' || type === 'both') fetchCompanies();
    } catch (err) {
      console.error(err);
      setError('Failed to load service details.');
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Fetch Companies ---------- */
  const fetchCompanies = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/public/api/v1/user/all_companies/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      const list =
        (data.companies || data.data || data || []).map((c, i) => ({
          id: c.id || c.company_id || i,
          name: c.name || c.company_name || `Company ${i + 1}`,
          type: c.type || c.business_type || 'Business'
        })) || [];
      setCompanies(list);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch companies.');
    }
  };


  // Compute payable before rendering (not inside handleProceed)
  const total = pricing?.finalAmount || 0;
  const payable =
    paymentType === 'partial' ? (total * partialPercent) / 100 : total;

  const handleProceed = () => {
    if (!serviceData) return;

    const type = serviceData.type?.toLowerCase();
    if (
      (type === 'business' ||
        (type === 'both' && selectedType === 'business')) &&
      !selectedCompany
    ) {
      setError('Please select or add a company.');
      return;
    }

    navigate(`/service/${serviceData.service_name}/proceed-to-payment`, {
      state: {
        serviceData,
        serviceType: type === 'both' ? selectedType : type,
        company: companies.find((c) => c.id === +selectedCompany),
        pricing,
        documents,
        paymentType,
        partialPercent,
        payableAmount: payable,
      },
    });
  };

  /** ---------- Apply Coupon ---------- */
  const handleApplyCoupon = async () => {
    if (!pricing.couponCode) return alert('Enter a coupon code.');

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/coupons/check`,
        { coupon_code: pricing.couponCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.valid || data.success) {
        const discount = parseFloat(data.data.discount_percent) || 0;
        const discounted = (pricing.finalAmount * (100 - discount)) / 100;
        setPricing((p) => ({
          ...p,
          finalAmount: discounted,
          discountPercent: discount
        }));
        alert(`Coupon applied! ${discount}% off.`);
      } else alert('Invalid or expired coupon.');
    } catch (err) {
      console.error(err);
      alert('Error validating coupon.');
    } finally {
      setLoading(false);
    }
  };

  /** ---------- Helpers ---------- */
  const formatPrice = (p) =>
    p ? (Math.round(p * 100) / 100).toFixed(2) : '0.00';

  const totalAmount = pricing.finalAmount || 0;
  const payableAmount =
    paymentType === 'partial'
      ? (totalAmount * partialPercent) / 100
      : totalAmount;

  /** ---------- Initial Fetch ---------- */
  useEffect(() => {
    const id =
      location?.state?.serviceData?.id ||
      new URLSearchParams(location.search).get('serviceId');
    if (id) fetchServiceDetails(id);
    else setError('Service ID not found.');
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center items-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600 font-medium">Loading service details...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center items-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-50 border border-red-200 rounded-full p-4 inline-flex mb-4">
            <ClockIcon className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-red-500 font-medium mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );

  const type = serviceData?.type?.toLowerCase();
  const showCompanySection =
    type === 'business' || (type === 'both' && selectedType === 'business');

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
            <DocumentTextIcon className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-serif text-gray-900 mb-4">
            {serviceData?.service_name || 'Loading...'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your registration and proceed to payment
          </p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* ---------- Enhanced Left Section ---------- */}
          <div className="space-y-6">

            {/* Enhanced Documents Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="font-bold text-xl ">Required Documents</h1>
                  <p className="text-gray-500 text-sm">Documents needed for this service</p>
                </div>
              </div>

              {documents.length ? (
                <div className="space-y-3">
                  {documents.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-1 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${d.mandatory ? 'bg-red-100' : 'bg-gray-100'}`}>
                          <DocumentTextIcon className={`w-4 h-4 ${d.mandatory ? 'text-red-600' : 'text-gray-600'}`} />
                        </div>
                        <span className="font-medium text-gray-800">{d.name}</span>
                      </div>
                      {d.mandatory && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full border border-red-200">
                          Required
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium text-lg">No documents listed</p>
                  <p className="text-gray-400 text-sm mt-1">All necessary information will be collected during the process</p>
                </div>
              )}
            </div>
            {/* Service Type Selection */}
            {type === 'both' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BuildingOfficeIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">Service Type</h2>
                    <p className="text-gray-500 text-sm">Choose how you want to register</p>
                  </div>
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
                >
                  <option value="">Select Registration Type</option>
                  <option value="individual">Individual Registration</option>
                  <option value="business">Business Registration</option>
                </select>
              </div>
            )}

            {/* Enhanced Company Selection */}
            {showCompanySection && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="font-bold  text-xl">Select Company</h1>
                      <p className="text-gray-500 text-sm">Choose your registered business</p>
                    </div>
                  </div>
                  <button
                    onClick={fetchCompanies}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
                  >
                    Refresh
                  </button>
                </div>

                {companies.length > 0 ? (
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium mb-4"
                  >
                    <option value="">Select your company</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4 text-center">
                    <p className="text-yellow-800 font-medium">
                      No companies found.
                    </p>
                  </div>
                )}
                <button
                  onClick={() =>
                    navigate('/company-detailform', {
                      state: {
                        redirectBack: `/documents/${serviceName}`,
                        serviceData
                      }
                    })
                  }
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add New Company
                </button>
              </div>
            )}


          </div>

          {/* ---------- Enhanced Right Section ---------- */}
          <div className="space-y-6">
            {/* Enhanced Coupon Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
              <h1 className="font-bold text-gray-900 text-lg mb-4">Apply Coupon Code</h1>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={pricing.couponCode || ''}
                  onChange={(e) =>
                    setPricing((p) => ({
                      ...p,
                      couponCode: e.target.value.toUpperCase()
                    }))
                  }
                  className="flex-1 border border-gray-300 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 font-medium placeholder-gray-400"
                  placeholder="ENTER COUPON CODE"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-4 bg-blue-500 text-white rounded-xl hover:to-blue-500 transition-all duration-300 font-semibold shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Enhanced Payment Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CurrencyRupeeIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-lg">Payment Details</h1>
                  <p className="text-gray-500 text-sm">Complete your payment</p>
                </div>
              </div>

              {/* Custom Amount Input */}
              {allowCustomAmount && (
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Enter Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="enteredAmount"
                    step="0.01"
                    placeholder="Enter total amount"
                    className="w-full border border-amber-300 rounded-xl px-4 py-4 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 font-medium text-lg"
                    value={pricing?.customAmount || ""}
                    onChange={(e) => {
                      const enteredAmount = parseFloat(e.target.value) || 0;
                      setPricing((prev) => ({
                        ...prev,
                        customAmount: enteredAmount,
                        finalAmount: enteredAmount * 0.0001,
                      }));
                    }}
                  />
                </div>
              )}

              {/* Total Amount Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                  <span className="text-3xl font-bold text-blue-700">
                    ₹{formatPrice(pricing.finalAmount)}
                  </span>
                </div>
              </div>

              {/* Payment Options */}
              {pricing.finalAmount > 1000 && !allowCustomAmount && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {['full', 'partial'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setPaymentType(t)}
                        className={`border-2 p-4 rounded-xl font-semibold transition-all duration-200 ${paymentType === t
                          ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                          : 'border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                      >
                        {t === 'full' ? 'Full Payment' : 'Partial Payment'}
                      </button>
                    ))}
                  </div>

                  {paymentType === 'partial' && (
                    <select
                      value={partialPercent}
                      onChange={(e) => setPartialPercent(+e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium mb-4"
                    >
                      <option value={30}>
                        30% = ₹{formatPrice(pricing.finalAmount * 0.3)}
                      </option>
                      <option value={50}>
                        50% = ₹{formatPrice(pricing.finalAmount * 0.5)}
                      </option>
                      <option value={80}>
                        80% = ₹{formatPrice(pricing.finalAmount * 0.8)}
                      </option>
                    </select>
                  )}
                </>
              )}

              {/* Payable Amount for Custom */}
              {totalAmount <= 0.01 && pricing?.customAmount > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Payable Amount:</span>
                    <span className="text-3xl font-bold text-green-700">
                      ₹{formatPrice(payableAmount)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Proceed Button */}
            <button
              onClick={handleProceed}
              disabled={showCompanySection && !selectedCompany}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${showCompanySection && !selectedCompany
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl transform hover:scale-[1.02] shadow-lg'
                }`}
            >
              Proceed to Pay&nbsp;
              <span>
                {payable > 0 ? `₹${payable.toLocaleString()}` : ''}
              </span>
              <ChevronRightIcon className="w-6 h-6" />
            </button>


          </div>
        </div>
      </div>
    </div>
  );
};

export default ProceedTo;




