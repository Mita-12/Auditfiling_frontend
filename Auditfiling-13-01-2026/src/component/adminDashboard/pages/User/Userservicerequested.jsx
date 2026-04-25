import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  FileText, 
  MoreVertical, 
  Search, 
  Filter, 
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock as PendingIcon,
  Upload,
  Eye,
  Download,
  Trash2,
  X,
  Plus,
  ShoppingCart,
  Tag,
  CreditCard,
  Wallet,
  Building,
  ChevronRight,
  Loader
} from 'lucide-react';

const BASE_URL = "http://localhost:5000/api";

// Helper functions
const fmt = (n) => Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const loadRazorpaySDK = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const calcAmounts = (price, discountAmt, partialPct = null) => {
  const afterDiscount = Math.max(price - discountAmt, 0);
  const total = afterDiscount;
  const payable = partialPct ? (total * partialPct) / 100 : total;
  const remaining = total - payable;
  return { afterDiscount, total, payable, remaining };
};

// Document Upload Component - Updated for your backend
const DocumentUploadPage = ({ service, paymentInfo, userId, authToken, onDone, onBack }) => {
  const requiredDocs = service.documents ?? [];
  const [uploadState, setUploadState] = useState(() =>
    requiredDocs.map(() => ({
      file: null, uploading: false, uploaded: false, error: "", uploadedDoc: null,
    }))
  );
  const [fetchingDocs, setFetchingDocs] = useState(true);
  const [allUploaded, setAllUploaded] = useState(false);

  useEffect(() => {
    const fetchExisting = async () => {
      setFetchingDocs(true);
      try {
        // Fetch existing documents for this service
        const res = await fetch(`${BASE_URL}/documents/user?service_id=${service.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          const existing = Array.isArray(data.documents) ? data.documents : [];

          setUploadState((prev) =>
            prev.map((slot, i) => {
              const reqDoc = requiredDocs[i];
              const reqTitle = reqDoc?.doc_title || reqDoc?.name || "";
              const match = existing.find(
                (d) => d.doc_title?.toLowerCase() === reqTitle.toLowerCase()
              );
              if (match) {
                return { ...slot, uploaded: true, uploadedDoc: match, error: "" };
              }
              return slot;
            })
          );
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setFetchingDocs(false);
      }
    };

    if (authToken && service.id) {
      fetchExisting();
    } else {
      setFetchingDocs(false);
    }
  }, [authToken, service.id, requiredDocs]);

  // Check if all documents are uploaded
  useEffect(() => {
    const allUploadedFlag = uploadState.length > 0 && uploadState.every((s) => s.uploaded);
    setAllUploaded(allUploadedFlag);
  }, [uploadState]);

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

    setSlot(i, { uploading: true, error: "" });

    try {
      const formData = new FormData();
      formData.append("file", slot.file);
      formData.append("service_id", service.id);
      formData.append("document_title", reqDoc?.doc_title || reqDoc?.name || `Document ${i + 1}`);
      
      if (slot.uploadedDoc?.id) {
        formData.append("document_id", slot.uploadedDoc.id);
      }

      const res = await fetch(`${BASE_URL}/documents/upload`, {
        method: "POST",
        headers: {
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
    } catch (err) {
      console.error("Upload error:", err);
      setSlot(i, { uploading: false, error: "Network error. Please try again." });
    }
  };

  const uploadedCount = uploadState.filter((s) => s.uploaded).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Upload Documents
            </h3>
            <p className="text-sm text-gray-500 mt-1">{service.name}</p>
          </div>
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Success Message */}
        <div className="mx-6 mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">Payment Successful!</p>
              <p className="text-xs text-green-600">
                Transaction ID: {paymentInfo.txnId} | Amount Paid: ₹{fmt(paymentInfo.paid)}
              </p>
              {paymentInfo.remaining > 0 && (
                <p className="text-xs text-orange-600">
                  Remaining Amount: ₹{fmt(paymentInfo.remaining)} (to be paid later)
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {fetchingDocs ? (
            <div className="flex items-center justify-center h-40">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : requiredDocs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No documents required for this service.</p>
              <button onClick={onDone} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                  Please upload all required documents. <span className="text-blue-600">{uploadedCount}/{requiredDocs.length} uploaded</span>
                </p>
                {allUploaded && (
                  <button onClick={onDone} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                    Submit All Documents
                  </button>
                )}
              </div>

              {requiredDocs.map((doc, i) => {
                const slot = uploadState[i];
                const docTitle = doc.doc_title || doc.name || `Document ${i + 1}`;

                return (
                  <div key={i} className={`border rounded-lg overflow-hidden ${slot.uploaded ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
                    <div className={`px-4 py-3 flex items-center justify-between border-b ${slot.uploaded ? "bg-green-100 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                      <div className="flex items-center gap-2">
                        {slot.uploaded ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                        )}
                        <span className="text-sm font-semibold text-gray-800">{docTitle}</span>
                      </div>
                      {slot.uploadedDoc && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-200 text-green-800">
                          Uploaded
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      {slot.uploaded && slot.uploadedDoc && !slot.file ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="text-sm text-gray-600">{slot.uploadedDoc.file_name || "Uploaded successfully"}</p>
                              <p className="text-xs text-gray-400">Click re-upload to replace</p>
                            </div>
                          </div>
                          <label className="cursor-pointer px-3 py-1.5 border text-sm text-gray-600 rounded-lg hover:bg-gray-50">
                            Re-upload
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(i, e)} />
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${slot.file ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => handleFileChange(i, e)} disabled={slot.uploading} />
                            {slot.file ? (
                              <div className="text-center">
                                <FileText className="w-8 h-8 text-blue-500 mx-auto mb-1" />
                                <p className="text-xs font-medium text-gray-800">{slot.file.name}</p>
                                <p className="text-xs text-gray-400">{(slot.file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            ) : (
                              <div className="text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">Click to upload</p>
                                <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 10MB)</p>
                              </div>
                            )}
                          </label>

                          {slot.error && <p className="text-xs text-red-500">{slot.error}</p>}

                          {slot.file && (
                            <div className="flex gap-2">
                              <button onClick={() => uploadDoc(i)} disabled={slot.uploading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50">
                                {slot.uploading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : "Upload"}
                              </button>
                              <button onClick={() => setSlot(i, { file: null, error: "" })} className="px-3 py-2 border text-gray-600 rounded-lg text-sm">
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserServiceRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [appliedCouponData, setAppliedCouponData] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponMsg, setCouponMsg] = useState({ type: "", text: "" });
  const [paymentMode, setPaymentMode] = useState("full");
  const [partialPct, setPartialPct] = useState(30);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  // Document upload state
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [paymentSuccessInfo, setPaymentSuccessInfo] = useState(null);
  const [currentServiceForDocs, setCurrentServiceForDocs] = useState(null);
  
  // User data from session
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [authToken, setAuthToken] = useState(null);
  
  // Services data
  const [availableServices, setAvailableServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [serviceError, setServiceError] = useState(null);

  // Load Razorpay SDK on mount
  useEffect(() => { loadRazorpaySDK(); }, []);

  // Read user + token from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
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
    }
    const tok = sessionStorage.getItem("token");
    if (tok) setAuthToken(tok);
  }, []);

  // Fetch available services from backend
  useEffect(() => {
    const fetchServices = async () => {
      if (!authToken) return;
      
      setLoadingServices(true);
      setServiceError(null);
      try {
        const response = await fetch(`${BASE_URL}/services/menu/11`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        if (data && data.length) {
          const transformedServices = data.map(service => ({
            id: service.id,
            name: service.service_name,
            price: parseFloat(service.price) || 0,
            documents: service.documents || [],
            category: service.type || "Service"
          }));
          setAvailableServices(transformedServices);
        } else {
          setServiceError("No services available");
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setServiceError("Failed to load services. Please try again.");
      } finally {
        setLoadingServices(false);
      }
    };
    
    fetchServices();
  }, [authToken]);

  // Fetch user's service requests
  const fetchUserRequests = useCallback(async () => {
    if (!userId || !authToken) return;
    
    setLoadingRequests(true);
    try {
      const response = await fetch(`${BASE_URL}/requests/service-requests/my`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.requests && data.requests.length) {
          const transformedRequests = data.requests.map(req => ({
            id: req.id,
            requestDetails: req.request_details || req.service_name,
            service: req.service_name,
            dateTime: req.created_at,
            status: req.status || "pending",
            reason: req.reason || "Awaiting processing",
            actions: [],
            paymentStatus: req.payment_status || "pending",
            amount: parseFloat(req.amount) || 0,
            couponApplied: req.coupon_code ? { code: req.coupon_code } : null
          }));
          setRequests(transformedRequests);
        } else {
          setRequests([]);
        }
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoadingRequests(false);
    }
  }, [userId, authToken]);

  useEffect(() => {
    fetchUserRequests();
  }, [fetchUserRequests]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <PendingIcon className="w-4 h-4" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleFileUpload = async (requestId, files) => {
    const fileList = Array.from(files);
    
    for (const file of fileList) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("request_id", requestId);
      
      try {
        const response = await fetch(`${BASE_URL}/requests/upload-document`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          body: formData,
        });
        
        if (response.ok) {
          setUploadedFiles(prev => ({
            ...prev,
            [requestId]: [...(prev[requestId] || []), file]
          }));
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }
    
    setShowUploadModal(false);
    setSelectedRequest(null);
  };

  const handleDeleteFile = (requestId, fileIndex) => {
    setUploadedFiles(prev => ({
      ...prev,
      [requestId]: prev[requestId].filter((_, idx) => idx !== fileIndex)
    }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMsg({ type: "error", text: "Please enter a coupon code" });
      return;
    }
    if (!selectedService) return;
    
    setApplyingCoupon(true);
    setCouponMsg({ type: "", text: "" });
    
    try {
      const response = await fetch(`${BASE_URL}/offers/apply`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ 
          coupon_code: couponCode.trim().toUpperCase(), 
          amount: selectedService.price, 
          total_amount: selectedService.price 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAppliedCouponData({
          code: data.coupon,
          discount_per: data.discount_per,
          discount_amount: data.discount_amount
        });
        setDiscount(data.discount_amount);
        setCouponApplied(true);
        setCouponMsg({ type: "success", text: `${data.discount_per}% off! You save ₹${fmt(data.discount_amount)}` });
      } else {
        setAppliedCouponData(null);
        setCouponApplied(false);
        setDiscount(0);
        setCouponMsg({ type: "error", text: data.message || "Invalid coupon" });
      }
    } catch {
      setCouponMsg({ type: "error", text: "Could not apply coupon." });
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCouponData(null);
    setCouponApplied(false);
    setDiscount(0);
    setCouponCode("");
    setCouponMsg({ type: "", text: "" });
  };

  // Process payment only (no request creation)
  const handleAddService = async () => {
    if (!selectedService) return;
    if (!userId) {
      alert("Please log in to continue");
      return;
    }
    
    setPaymentProcessing(true);
    
    const sdkReady = await loadRazorpaySDK();
    if (!sdkReady) {
      alert("Payment gateway failed to load. Check your internet connection.");
      setPaymentProcessing(false);
      return;
    }
    
    const price = selectedService.price;
    const discountAmt = discount;
    const amounts = calcAmounts(price, discountAmt, paymentMode === "partial" ? partialPct : null);
    const payableAmount = paymentMode === "partial" ? amounts.payable : amounts.total;
    
    try {
      // Create order
      const orderRes = await fetch(`${BASE_URL}/payments/create-order`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          user_id: userId,
          service_id: selectedService.id,
          coupon_code: appliedCouponData?.code || null,
          payment_mode: paymentMode,
          partial_percentage: paymentMode === "partial" ? partialPct : null,
          payment_type: "online",
        }),
      });
      
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || "Failed to create order");
      }
      
      const { order, payment_id, payable_amount, key } = orderData;
      if (!order?.id) throw new Error("Invalid order response");
      if (!key) throw new Error("Razorpay key missing");
      
      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Service Payment",
        description: selectedService.name,
        order_id: order.id,
        prefill: { name: userName, email: userEmail, contact: userPhone },
        notes: {
          payment_id: String(payment_id),
          service_id: String(selectedService.id),
          coupon_code: appliedCouponData?.code || "",
        },
        theme: { color: "#111111" },
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await fetch(`${BASE_URL}/payments/verify`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: payable_amount,
              }),
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Store payment success info
              setPaymentSuccessInfo({
                status: "success",
                paid: payable_amount,
                remaining: paymentMode === "partial" ? amounts.remaining : 0,
                txnId: response.razorpay_payment_id,
              });
              
              // Store the current service for document upload
              setCurrentServiceForDocs(selectedService);
              
              // Close the add service modal
              setShowAddServiceModal(false);
              
              // Reset form
              setSelectedService(null);
              removeCoupon();
              setPaymentMode("full");
              
              // Show document upload modal
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
        console.error("Payment failed:", resp.error);
        alert(`Payment failed: ${resp.error.description}`);
        setPaymentProcessing(false);
      });
      rzp.open();
      
    } catch (err) {
      console.error("Payment error:", err);
      alert(err.message || "Payment initialisation failed.");
      setPaymentProcessing(false);
    }
  };

  const handleDocumentUploadComplete = async () => {
    setShowDocUpload(false);
    setPaymentSuccessInfo(null);
    setCurrentServiceForDocs(null);
    
    // Refresh the requests list
    await fetchUserRequests();
    
    // Show success message
    alert("Payment completed and documents uploaded successfully!");
  };

  const price = selectedService ? selectedService.price : 0;
  const amounts = calcAmounts(price, discount, paymentMode === "partial" ? partialPct : null);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requestDetails?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.service?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: "N/A", time: "N/A" };
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Upload Document</h3>
          <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Drag & drop files here or click to browse</p>
          <p className="text-sm text-gray-400">Supports PDF, DOC, JPG, PNG (Max 10MB)</p>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileUpload(selectedRequest?.id, e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition">
            Choose Files
          </label>
        </div>
      </div>
    </div>
  );

  const AddServiceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl m-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            Make Payment for Service
          </h3>
          <button onClick={() => setShowAddServiceModal(false)} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          {/* Service Selection Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
            <div className="relative">
              <select
                value={selectedService?.id || ''}
                onChange={(e) => {
                  const service = availableServices.find(s => s.id === parseInt(e.target.value));
                  setSelectedService(service);
                  removeCoupon();
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                disabled={loadingServices}
              >
                <option value="">Choose a service...</option>
                {availableServices.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {formatPrice(service.price)}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            {loadingServices && (
              <div className="flex items-center justify-center mt-2">
                <Loader className="w-4 h-4 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-gray-500">Loading services...</span>
              </div>
            )}
            {serviceError && (
              <p className="text-sm text-red-500 mt-2">{serviceError}</p>
            )}
          </div>

          {/* Service Details */}
          {selectedService && (
            <>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">{selectedService.name}</h4>
                
                {/* Price Display */}
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="text-gray-800 font-medium">{formatPrice(selectedService.price)}</span>
                  </div>
                  {couponApplied && discount > 0 && (
                    <div className="flex justify-between items-center mb-2 text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        Discount ({appliedCouponData?.discount_per}%):
                      </span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(amounts.total)}</span>
                  </div>
                  {paymentMode === "partial" && (
                    <>
                      <div className="flex justify-between items-center mt-2 text-green-600">
                        <span>Pay Now ({partialPct}%):</span>
                        <span className="font-semibold">{formatPrice(amounts.payable)}</span>
                      </div>
                      <div className="flex justify-between items-center text-orange-500 text-sm">
                        <span>Pay Later:</span>
                        <span>{formatPrice(amounts.remaining)}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Documents Section */}
                {selectedService.documents && selectedService.documents.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      Required Documents
                    </h5>
                    <div className="space-y-1">
                      {selectedService.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{doc.doc_title || doc.name || `Document ${idx + 1}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Mode Selection */}
              {amounts.total >= 1000 && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
                  <div className="space-y-2">
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

              {/* Coupon Code Section */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Apply Coupon Code
                </label>
                {couponApplied ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div>
                      <span className="text-sm font-semibold text-green-700">{appliedCouponData?.code}</span>
                      <p className="text-xs text-green-600">{appliedCouponData?.discount_per}% off applied</p>
                    </div>
                    <button onClick={removeCoupon} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={applyingCoupon}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
                    >
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
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button onClick={() => setShowAddServiceModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
            Cancel
          </button>
          <button
            onClick={handleAddService}
            disabled={!selectedService || paymentProcessing || !userId}
            className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
              selectedService && userId && !paymentProcessing
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {paymentProcessing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay {formatPrice(paymentMode === "partial" ? amounts.payable : amounts.total)}
              </>
            )}
          </button>
        </div>
        {!userId && (
          <p className="text-xs text-center text-red-500 pb-4">Please log in to make payment</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Service Requests</h1>
            <p className="text-gray-600">Manage and track all your service requests in one place</p>
          </div>
          <button
            onClick={() => setShowAddServiceModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Make Payment
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by request details or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="in-progress">In Progress</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Request Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingRequests ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                      <p className="text-gray-500 mt-2">Loading requests...</p>
                    </td>
                  </tr>
                ) : filteredRequests.map((request) => {
                  const { date, time } = formatDateTime(request.dateTime);
                  return (
                    <tr key={request.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{request.requestDetails}</p>
                            {uploadedFiles[request.id] && uploadedFiles[request.id].length > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <Upload className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{uploadedFiles[request.id].length} file(s)</span>
                              </div>
                            )}
                            {request.couponApplied && (
                              <div className="flex items-center gap-1 mt-1">
                                <Tag className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600">Coupon: {request.couponApplied.code}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{request.service}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-900">{date}</p>
                            <p className="text-xs text-gray-500">{time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(request.paymentStatus)}`}>
                          {request.paymentStatus?.charAt(0).toUpperCase() + request.paymentStatus?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">{formatPrice(request.amount)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowUploadModal(true);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Upload Document"
                          >
                            <Upload className="w-4 h-4" />
                          </button>
                          {uploadedFiles[request.id] && uploadedFiles[request.id].length > 0 && (
                            <div className="relative group">
                              <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                                <Eye className="w-4 h-4" />
                              </button>
                              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block z-10">
                                <div className="p-2">
                                  <p className="text-xs font-medium text-gray-700 mb-2 px-2">Uploaded Files</p>
                                  {uploadedFiles[request.id].map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between px-2 py-1 hover:bg-gray-50 rounded">
                                      <span className="text-xs text-gray-600 truncate flex-1">{file.name}</span>
                                      <button
                                        onClick={() => handleDeleteFile(request.id, idx)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {!loadingRequests && filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No service requests found</p>
            </div>
          )}
        </div>

        {/* Modals */}
        {showUploadModal && <UploadModal />}
        {showAddServiceModal && <AddServiceModal />}
        {showDocUpload && currentServiceForDocs && paymentSuccessInfo && (
          <DocumentUploadPage
            service={currentServiceForDocs}
            paymentInfo={paymentSuccessInfo}
            userId={userId}
            authToken={authToken}
            onDone={handleDocumentUploadComplete}
            onBack={() => {
              setShowDocUpload(false);
              setPaymentSuccessInfo(null);
              setCurrentServiceForDocs(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserServiceRequests;