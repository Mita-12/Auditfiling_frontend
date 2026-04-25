import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import storage from "../../../../src/utils/storage";
import logger from '../../../utils/logger';

const PartialPayment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const {
    serviceData = {},
    payableAmount = 0,
    partialPaymentId = null,
  } = state || {};

  const user = JSON.parse(sessionStorage.getItem("user")) || {};
  const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/v1/services/payment`;

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

        // ✅ Persist all IDs including partial payment ID
        try {
          storage.setIds({
            userId: user?.id ? String(user.id) : null,
            serviceId: serviceData?.id ? String(serviceData.id) : null,
            partialPaymentId: partialPaymentId ? String(partialPaymentId) : null
          });
        } catch (e) {
          logger.warn('Could not persist lastPaid ids to sessionStorage', e);
        }

        // ✅ Use the new API endpoint for partial payment
        const initiatePayload = {
          partial_payment_id: String(partialPaymentId)
        };

        const response = await axios.post(
          `https://api.auditfiling.com/api/v1/rest_partial_payment`,
          initiatePayload
        );

        // logger.debug("Partial Payment Response:", response.data);

        const order = response.data;
        if (!order || !order.order_id) {
          alert("❌ Failed to create Razorpay order");
          return;
        }

        // ✅ Store all IDs including orderId
        try {
          storage.setIds({
            userId: user?.id ? String(user.id) : null,
            serviceId: serviceData?.id ? String(serviceData.id) : null,
            orderId: order.order_id ? String(order.order_id) : null,
            partialPaymentId: partialPaymentId ? String(partialPaymentId) : null,
          });
          // logger.debug("Stored all IDs in sessionStorage:", {
          //   userId: user?.id,
          //   serviceId: serviceData?.id,
          //   orderId: order.order_id,
          //   partialPaymentId
          // });
        } catch (e) {
          logger.warn("Failed to store IDs", e);
        }

        // Open Razorpay directly
        const options = {
          key: order.razorpayKey || "rzp_test_uU1Hri1yyZQCZS", // Use key from API response if available
          amount: order.amount,
          currency: "INR",
          name: "Auditfiling",
          description: `Partial Payment - ${order.partial_payment?.transaction_unpaid_amount || payableAmount} INR`,
          order_id: order.order_id,
          handler: async function (response) {
            // logger.debug("Payment Success Response:", response);
            await verifyPayment(response, order);
          },
          prefill: {
            name: user?.name || "User",
            email: user?.email || "user@example.com",
            contact: user?.phone || "9999999999",
          },
          theme: {
            color: "#1e3a8a",
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();

        razor.on("payment.failed", function (response) {
          // logger.error("Payment failed:", response.error);
          alert("❌ Payment failed: " + response.error.description);
        });
      } catch (err) {
        logger.error("Error during payment process:", err);
        alert("Something went wrong. Please try again.");
      }
    };

    loadAndPay();
  }, []);

  // ✅ Verify Payment with partial payment ID
  const verifyPayment = async (response, order) => {
    try {
      if (!response || !order) {
        alert("Invalid payment data. Please try again.");
        return;
      }

      // 🧾 Prepare the verification payload
      const verifyPayload = {
        razorpay_order_id: response.razorpay_order_id || order.order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        user_id: user?.id || null,
        amount: order?.amount || null, // ✅ Include amount (commonly required)
      };

      // ✅ Add partial_payment_id only if valid
      if (partialPaymentId && partialPaymentId !== "undefined" && partialPaymentId !== null) {
        verifyPayload.partial_payment_id = partialPaymentId;
      }

      // logger.debug("🟨 Verify Payload Sent:", verifyPayload);

      // 🛜 API call with proper headers
      const verifyRes = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/rest_partial_payment_success`,
        verifyPayload,
        { headers: { "Content-Type": "application/json" } }
      );

      // logger.debug("✅ Verification Response:", verifyRes.data);

      // 🟩 Handle verification success
      if (verifyRes.data?.success) {
        navigate("/payment-success", {
          replace: true,
          state: {
            paymentDetails: {
              razorpay_order_id: verifyPayload.razorpay_order_id,
              razorpay_payment_id: verifyPayload.razorpay_payment_id,
              amount: verifyPayload.amount,
              service_id: serviceData?.id || null,
              user_id: verifyPayload.user_id,
              partial_payment_id: verifyPayload.partial_payment_id || null,
              partial_payment_data: order?.partial_payment || null,
            },
          },
        });
      } else {
        console.error("❌ Payment verification failed:", verifyRes.data);
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      logger.error("❌ Verification error:", error.response?.data || error.message);
      alert("Error verifying payment. Please try again later.");
    }
  };



  // 🔇 Nothing is rendered — Razorpay opens automatically
  return null;
};

export default PartialPayment;