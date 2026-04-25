import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import storage from "../../../../src/utils/storage";
import logger from '../../../utils/logger';

const ProceedToPayment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    serviceData = {},
    company = {},
    pricing = {},
    paymentType = "full",
    partialPercent = "100",
    payableAmount = 0,
  } = state || {};

  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  // const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/v1/services/payment`;

  // ✅ Load Razorpay SDK & trigger payment immediately
  useEffect(() => {
    const loadAndPay = async () => {
      try {
        // Load Razorpay script
        if (!window.Razorpay) {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }


        try {

          storage.setIds({ userId: user?.id ? String(user.id) : null, serviceId: serviceData?.id ? String(serviceData.id) : null });
        } catch (e) {
          logger.warn('Could not persist lastPaid ids to sessionStorage', e);
        }

        // Initiate payment
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/services/payment/initiate`, {
          user_id: String(user.id),
          service_id: String(serviceData.id),
          coupon_code: null,
          amount: String(pricing.amount || payableAmount),

          total_amount: String(payableAmount),
          percent: String(partialPercent || "100"),
          // company_id: company?.id ? String(company.id) : null,

          company_id: company?.id,
          payment_type: paymentType,
        });

        // logger.debug("Initiate Response:", response.data);
        const order = response.data?.data;
        if (!order || !order.order_id) {
          alert("❌ Failed to create Razorpay order");
          return;
        }

        // ✅ Store orderId along with userId and serviceId
        try {
          storage.setIds({
            userId: user?.id ? String(user.id) : null,
            serviceId: serviceData?.id ? String(serviceData.id) : null,
            orderId: order.order_id ? String(order.order_id) : null,
          });
          // logger.debug("Stored orderId in sessionStorage:", order.order_id);
        } catch (e) {
          logger.warn("Failed to store orderId", e);
        }


        // Open Razorpay directly
        const options = {
          key: "rzp_test_uU1Hri1yyZQCZS",
          amount: order.amount,
          currency: order.currency || "INR",
          name: "Auditfiling",
          description: order.service_name || "Service Payment",
          order_id: order.order_id,
          handler: async function (response) {
            // logger.debug("Payment Success Response:", response);
            await verifyPayment(response, order);
          },
          prefill: {
            name: order.user_name || user?.name || "User",
            email: order.user_email || user?.email || "user@example.com",
            contact: user?.phone || "9999999999",
          },
          theme: {
            color: "#1e3a8a",
          },
          modal: {
  ondismiss: async function() {
    logger.info("Payment modal closed by user");
    navigate("/", { replace: true });
  },
  escape: false, // Prevent closing with escape key
  backdropclose: false // Prevent closing by clicking backdrop
}
        };

        const razor = new window.Razorpay(options);
        razor.open();

        razor.on("payment.failed", function (response) {
          logger.error("Payment failed:", response.error);
          alert("❌ Payment failed: " + response.error.description);
        });
      } catch (err) {
        logger.error("Error during payment process:", err);
        alert("Something went wrong. Please try again.");
        
      }
    };

    loadAndPay();
  }, []); // run only once

  // ✅ Verify Payment
  const verifyPayment = async (response, order) => {
    try {
      const verifyRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/services/payment/verify`, {

        razorpay_order_id: order.order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        user_id: user.id
      });

      // logger.debug("Verification Response:", verifyRes.data);

      if (verifyRes.data?.success) {

        navigate("/payment-success", {
          replace: true,
          state: {
            paymentDetails: {
              razorpay_order_id: order.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              amount: order.amount,
              service_id: order.service_id || order.serviceId || order.service || serviceData?.id || null,
              user_id: order.user_id || order.userId || user?.id || null,
            },
          },
        });
      } else {
        alert("❌ Payment verification failed.");
      }
    } catch (error) {
      logger.error("Verification error:", error);
      alert("Error verifying payment.");
    }
  };

  // 🔇 Nothing is rendered — Razorpay opens automatically
  return null;
};

export default ProceedToPayment;
