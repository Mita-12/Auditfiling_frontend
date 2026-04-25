import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import logger from '../../../utils/logger';
import storage from '../../../../src/utils/storage';

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Payment info passed from ProceedToPayment (optional)
  const { paymentDetails = {} } = state || {};
  const { razorpay_order_id, razorpay_payment_id, amount } = paymentDetails;

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-2 ">
      {/* Success Icon */}
      <CheckCircleIcon className="w-20 h-20 text-green-500  animate-bounce" />

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Payment Successful!
      </h1>

      {/* Message */}
      <p className="text-gray-600 mb-8">
        Thank you for your payment. Your transaction has been successfully
        completed.
      </p>

      {/* Payment Details */}
      <div className="bg-gray-50 border rounded-xl shadow-sm p-6 w-full max-w-md text-left mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Payment Details
        </h2>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Order ID:</strong>{" "}
            {razorpay_order_id || "N/A"}
          </p>
          <p>
            <strong>Payment ID:</strong>{" "}
            {razorpay_payment_id || "N/A"}
          </p>
          <p>
            <strong>Amount Paid:</strong> ₹{(amount)}
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={() => {
          // Persist service/user ids if available from state so DocumentUpload can read them
          try {
            storage.setIds({ userId: paymentDetails?.user_id || null, serviceId: paymentDetails?.service_id || null });
          } catch (e) {
            logger.warn('Could not persist payment ids to sessionStorage', e);
          }
          navigate("/document");
        }}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
      >
        Go to Document Upload
      </button>
    </div>
  );
};

export default PaymentSuccess;
