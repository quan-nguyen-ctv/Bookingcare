import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaUserMd, FaClock, FaMapMarkerAlt, FaHospital, FaCreditCard, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

const PaymentPage = () => {
  const location = useLocation();
  const { doctor, specialty, schedule, bookingId, reason } = location.state || {};
  
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showVNPayModal, setShowVNPayModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  console.log("bookingId:", bookingId);
  console.log("reason:", reason);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:6868/api/v1/users/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data?.data || null);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setUser(null);
      }
    };
    fetchUserDetails();
  }, []);

  // Đóng modal
  const handleCloseModal = () => {
    setShowVNPayModal(false);
  };

  // Xử lý thanh toán VNPay
  const handleVNPayPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:6868/api/v1/payment/vn-pay?bookingId=${bookingId}&amount=${schedule?.price || 0}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setLoading(false);
      if (data?.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Không lấy được link thanh toán VNPay!");
      }
    } catch (err) {
      setLoading(false);
      alert("Lỗi khi tạo thanh toán VNPay!");
    }
  };

  // Xử lý khi ấn nút Complete Appointment Booking
  const handleCompleteBooking = () => {
    if (paymentMethod === "vnpay") {
      setShowVNPayModal(true);
    } else if (paymentMethod === "paypal") {
      // Xử lý PayPal payment logic ở đây
      alert("PayPal payment not implemented yet!");
    }
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-r from-[#223a66] to-[#2c4a7a] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/about-banner.jpg')",
            filter: "brightness(0.7)"
          }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
            Secure Payment
          </span>
          <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight mt-2">
            Complete Your <span className="font-bold text-[#23cf7c]">Appointment</span>
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90">
            Review your booking details and proceed with secure payment
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Doctor & Appointment Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Doctor Header */}
                  <div className="bg-gradient-to-r from-[#223a66] to-[#2c4a7a] p-6 text-white">
                    <div className="flex items-center gap-4">
                      <img
                        src={`http://localhost:6868/api/v1/images/view/${doctor?.avatar || "default.png"}`}
                        alt="Doctor"
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#23cf7c]"
                      />
                      <div>
                        <h3 className="font-bold text-xl">
                          {doctor?.user?.fullname || "Loading..."}
                        </h3>
                        <p className="text-blue-200 text-sm">
                          {specialty?.specialtyName || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <FaClock className="text-[#23cf7c] text-lg" />
                      <div>
                        <p className="font-medium">Appointment Time</p>
                        <p className="text-sm text-gray-600">
                          {schedule
                            ? `${schedule.start_time} - ${schedule.end_time}`
                            : "Loading..."}
                        </p>
                        <p className="text-sm text-gray-600">{schedule?.date_schedule}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <FaHospital className="text-[#23cf7c] text-lg" />
                      <div>
                        <p className="font-medium">Clinic</p>
                        <p className="text-sm text-gray-600">{schedule?.clinic_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <FaMapMarkerAlt className="text-[#23cf7c] text-lg" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-sm text-gray-600">{schedule?.clinic_address || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <FaUserMd className="text-[#23cf7c] text-lg" />
                      <div>
                        <p className="font-medium">Booking ID</p>
                        <p className="text-sm text-gray-600 font-mono">#{bookingId || "Pending"}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="bg-[#23cf7c]/10 rounded-xl p-4 border border-[#23cf7c]/20 mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[#223a66] font-semibold">Consultation Fee:</span>
                        <span className="text-[#23cf7c] font-bold text-xl">
                          {schedule?.price?.toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="mb-8">
                    <h2 className="text-3xl font-light text-[#223a66] mb-2">
                      Complete Your <span className="font-bold">Booking</span>
                    </h2>
                    <p className="text-gray-600">Please review your information and proceed with payment</p>
                  </div>

                  {/* Patient Information */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-[#223a66] mb-4 flex items-center gap-2">
                      <FaUserMd className="text-[#23cf7c]" />
                      Patient Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700"
                          value={user?.fullname || "Loading..."}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700"
                          value={user?.phone_number || "Loading..."}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                          className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700"
                          value={user?.email || "Loading..."}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <input
                          className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700"
                          value={user?.gender || "Not specified"}
                          disabled
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700"
                          value={user?.address || "Not specified"}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reason for Visit */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-[#223a66] mb-4">Reason for Visit</h3>
                    <textarea
                      className="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-700 resize-none"
                      rows="4"
                      value={reason || "Not specified"}
                      disabled
                    />
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-[#223a66] mb-4 flex items-center gap-2">
                      <FaCreditCard className="text-[#23cf7c]" />
                      Choose Payment Method
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        className={`border-2 rounded-xl p-6 flex items-center justify-center gap-3 transition duration-300 ${
                          paymentMethod === "vnpay" 
                            ? "border-[#23cf7c] bg-[#23cf7c]/10 shadow-lg" 
                            : "border-gray-200 hover:border-[#23cf7c] hover:bg-gray-50"
                        }`}
                        onClick={() => setPaymentMethod("vnpay")}
                      >
                        <img src="/images/download (1).png" alt="VNPay" className="h-8" />
                        <div className="text-left">
                          <div className="font-semibold text-[#223a66]">VNPay</div>
                          <div className="text-sm text-gray-600">Secure Vietnamese payment</div>
                        </div>
                        {paymentMethod === "vnpay" && (
                          <FaCheckCircle className="text-[#23cf7c] ml-auto" />
                        )}
                      </button>

                      <button
                        type="button"
                        className={`border-2 rounded-xl p-6 flex items-center justify-center gap-3 transition duration-300 ${
                          paymentMethod === "paypal" 
                            ? "border-[#23cf7c] bg-[#23cf7c]/10 shadow-lg" 
                            : "border-gray-200 hover:border-[#23cf7c] hover:bg-gray-50"
                        }`}
                        onClick={() => setPaymentMethod("paypal")}
                      >
                        <img src="/images/paypal.png" alt="PayPal" className="h-8" />
                        <div className="text-left">
                          <div className="font-semibold text-[#223a66]">PayPal</div>
                          <div className="text-sm text-gray-600">International payment</div>
                        </div>
                        {paymentMethod === "paypal" && (
                          <FaCheckCircle className="text-[#23cf7c] ml-auto" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                    <div className="flex items-center gap-3 text-blue-800">
                      <FaShieldAlt className="text-xl" />
                      <div>
                        <h4 className="font-semibold">Secure Payment</h4>
                        <p className="text-sm">Your payment information is encrypted and secure</p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    className="w-full bg-[#23cf7c] hover:bg-[#1eb567] text-white font-semibold py-4 rounded-xl text-lg transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!paymentMethod}
                    onClick={handleCompleteBooking}
                  >
                    Complete Appointment Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL VNPay */}
      {showVNPayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#223a66] to-[#2c4a7a] p-6 text-white relative">
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold"
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ×
              </button>
              <div className="text-center">
                <img src="/images/download (1).png" alt="VNPay" className="h-12 mx-auto mb-3" />
                <h3 className="text-xl font-bold">VNPay Payment</h3>
                <p className="text-blue-200 text-sm">Secure payment gateway</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#23cf7c]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaShieldAlt className="text-[#23cf7c] text-2xl" />
                </div>
                <h4 className="text-lg font-semibold text-[#223a66] mb-2">Secure Payment Process</h4>
                <p className="text-gray-600 text-sm">
                  You will be redirected to VNPay's secure payment gateway to complete your transaction.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Amount to pay:</span>
                  <span className="font-bold text-[#23cf7c] text-lg">
                    {schedule?.price?.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              </div>

              <button
                className="w-full bg-[#23cf7c] hover:bg-[#1eb567] text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleVNPayPayment}
                disabled={loading}
              >
                {loading && (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {loading ? "Redirecting..." : "Continue to VNPay"}
              </button>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <FaShieldAlt className="text-green-500" />
                  Secured by VNPay SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PaymentPage;