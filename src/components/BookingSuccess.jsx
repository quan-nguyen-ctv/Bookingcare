import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastError, ToastSuccess } from "../notification";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const { idBooking } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");
  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
  const [statusPay, setStatusPay] = useState("");
  const idBookingSuccess = searchParams.get("bookingId");

  console.log("Booking ID:", idBookingSuccess);

  useEffect(() => {
    if (
      location.pathname.includes("/booking/result/") &&
      idBooking &&
      vnp_TransactionNo &&
      vnp_ResponseCode === "00"
    ) {
      payOrderSuccess(idBooking, vnp_TransactionNo, vnp_ResponseCode);

      async function payOrderSuccess(bookingId, vnp_TransactionNo, vnp_ResponseCode) {
        try {
          const res = await fetch(
            `http://localhost:6868/api/v1/bookings/payBooking/${bookingId}?vnp_TransactionNo=${vnp_TransactionNo}&vnp_ResponseCode=${vnp_ResponseCode}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await res.json();
          if (res.ok && data.status === "success") {
            ToastSuccess("Booking payment successfully.");
            navigate(`/booking/success?bookingId=${bookingId}`);
          } else {
            ToastError(data.message || "Payment failed.");
          }
        } catch (error) {
          ToastError(error.message || "Payment failed.");
        }
      }
    } else if (idBooking && vnp_TransactionNo && vnp_ResponseCode === "24") {
      setStatusPay("Pay_failed");
    }
  }, [idBooking, vnp_TransactionNo, vnp_ResponseCode, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full text-center">
        {statusPay === "Pay_failed" ? (
          <>
            {/* Payment Failed Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-red-600 mb-6">

              Payment Failed!

            </h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <p className="text-red-700">
                Note: Your payment was not successful. Please try again or contact support.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition duration-200 font-medium text-lg"
            >
              Return to Home!
            </button>
          </>
        ) : idBookingSuccess ? (
          <>
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-green-600 mb-6">
              Booking successful!
            </h1>
            
            <div className="mb-8">
              <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
                <span className="font-medium">Note:</span> Your appointment has been transferred to the medical facility. Please do not book through other channels to avoid duplicate schedules.
              </p>
            </div>

            <button
              onClick={() => navigate(`/account/bookings/${idBookingSuccess}`)}
              className="bg-blue-900 text-white px-8 py-3 rounded-full hover:bg-blue-800 transition duration-200 font-medium text-lg uppercase tracking-wide"
            >
              SEE DETAILED APPOINTMENT SCHEDULE HERE!
            </button>
          </>
        ) : (
          <>
            {/* No Information Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

<h1 className="text-3xl font-bold text-gray-600 mb-6">

              No booking information found!
            </h1>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-600 text-white px-8 py-3 rounded-full hover:bg-gray-700 transition duration-200 font-medium text-lg"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingSuccess;