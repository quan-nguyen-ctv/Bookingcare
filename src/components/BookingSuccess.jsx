import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaCalendarAlt, FaHome, FaEye } from "react-icons/fa";
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
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center bg-gradient-to-r from-[#223a66] to-[#2c4a7a] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/about-banner.jpg')",
            filter: "brightness(0.7)"
          }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
            Booking Status
          </span>
          <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight mt-2">
            {statusPay === "Pay_failed" ? (
<>Payment <span className="font-bold text-red-400">Failed</span></>
            ) : idBookingSuccess ? (
              <>Booking <span className="font-bold text-[#23cf7c]">Success</span></>
            ) : (
              <>No <span className="font-bold text-gray-300">Information</span></>
            )}
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90">
            {statusPay === "Pay_failed" 
              ? "Your payment was not processed successfully"
              : idBookingSuccess 
                ? "Your appointment has been confirmed"
                : "Unable to find booking information"
            }
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {statusPay === "Pay_failed" ? (
              /* Payment Failed */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-red-500 p-8 text-white text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTimesCircle className="text-4xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Payment Failed</h2>
                  <p className="text-red-100">Transaction could not be completed</p>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-red-800 mb-2">What happened?</h3>
                    <p className="text-red-700">
                      Your payment was not successful. This could be due to insufficient funds, 
                      network issues, or payment method restrictions.
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h4 className="text-lg font-semibold text-[#223a66]">Next Steps:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h5 className="font-medium text-[#223a66] mb-2">Check Payment Method</h5>
                        <p className="text-sm text-gray-600">Verify your card details and account balance</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h5 className="font-medium text-[#223a66] mb-2">Try Again</h5>
                        <p className="text-sm text-gray-600">Return to booking and attempt payment again</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
<button
                      onClick={() => navigate("/booking")}
                      className="bg-[#23cf7c] hover:bg-[#1eb567] text-white px-8 py-3 rounded-full font-medium transition duration-300 flex items-center justify-center gap-2"
                    >
                      <FaCalendarAlt />
                      Book Again
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="border-2 border-[#223a66] text-[#223a66] hover:bg-[#223a66] hover:text-white px-8 py-3 rounded-full font-medium transition duration-300 flex items-center justify-center gap-2"
                    >
                      <FaHome />
                      Return Home
                    </button>
                  </div>
                </div>
              </div>
            ) : idBookingSuccess ? (
              /* Booking Success */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#23cf7c] p-8 text-white text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-4xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
                  <p className="text-green-100">Your appointment has been successfully scheduled</p>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                      <h3 className="font-semibold text-green-800 mb-2">Important Notice</h3>
                      <p className="text-green-700">
                        Your appointment has been transferred to the medical facility. 
                        Please do not book through other channels to avoid duplicate schedules.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-[#23cf7c] rounded-full flex items-center justify-center mx-auto mb-3">
                          <FaCheckCircle className="text-white text-xl" />
                        </div>
                        <h4 className="font-semibold text-[#223a66] mb-2">Confirmed</h4>
                        <p className="text-sm text-gray-600">Your booking is confirmed and saved</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-[#223a66] rounded-full flex items-center justify-center mx-auto mb-3">
<FaCalendarAlt className="text-white text-xl" />
                        </div>
                        <h4 className="font-semibold text-[#223a66] mb-2">Scheduled</h4>
                        <p className="text-sm text-gray-600">Appointment added to your calendar</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-sm">#{idBookingSuccess}</span>
                        </div>
                        <h4 className="font-semibold text-[#223a66] mb-2">Reference</h4>
                        <p className="text-sm text-gray-600">Your booking ID for reference</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-[#223a66] mb-4">What's Next?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h5 className="font-medium text-[#223a66] mb-2">Prepare for Visit</h5>
                        <p className="text-sm text-gray-600">Bring your ID and any relevant medical records</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h5 className="font-medium text-[#223a66] mb-2">Arrive Early</h5>
                        <p className="text-sm text-gray-600">Please arrive 15 minutes before your appointment</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={() => navigate(`/account/bookings/${idBookingSuccess}`)}
                        className="bg-[#223a66] hover:bg-[#1a2d52] text-white px-8 py-3 rounded-full font-medium transition duration-300 flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        View Appointment Details
                      </button>
                      <button
                        onClick={() => navigate("/")}
                        className="border-2 border-[#23cf7c] text-[#23cf7c] hover:bg-[#23cf7c] hover:text-white px-8 py-3 rounded-full font-medium transition duration-300 flex items-center justify-center gap-2"
                      >
                        <FaHome />
                        Return Home
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* No Information */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
<div className="bg-gray-500 p-8 text-white text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaQuestionCircle className="text-4xl text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">No Information Found</h2>
                  <p className="text-gray-200">Unable to locate booking details</p>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">What can you do?</h3>
                    <p className="text-gray-700">
                      The booking information you're looking for might have been moved or doesn't exist. 
                      Please check your booking history or start a new appointment.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h5 className="font-medium text-[#223a66] mb-2">Check History</h5>
                      <p className="text-sm text-gray-600">View your previous appointments and bookings</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h5 className="font-medium text-[#223a66] mb-2">New Booking</h5>
                      <p className="text-sm text-gray-600">Schedule a new appointment with our doctors</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate("/list-booking")}
                      className="bg-[#223a66] hover:bg-[#1a2d52] text-white px-8 py-3 rounded-full font-medium transition duration-300 flex items-center justify-center gap-2"
                    >
                      <FaCalendarAlt />
                      View My Bookings
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white px-8 py-3 rounded-full font-medium transition duration-300 flex items-center justify-center gap-2"
                    >
                      <FaHome />
                      Return Home
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingSuccess;