import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const { doctor, specialty, schedule, bookingId } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("");
  const [showVNPayModal, setShowVNPayModal] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("bookingId:", bookingId );
  

  // Mở modal VNPay
  const handleChooseVNPay = () => {
    setPaymentMethod("vnpay");
    setShowVNPayModal(true);
  };

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

  return (
    <main className="bg-white min-h-screen">
      <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
        ></div>
        <div className="relative z-10 text-center">
          <div className="text-white text-sm mb-1">Book your Seat</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Appointment
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 flex flex-col md:flex-row gap-8 items-start justify-center">
        {/* Thông tin bác sĩ */}
        <div className="w-full md:w-[350px] bg-white rounded-xl shadow p-6 mb-8 md:mb-0">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={doctor?.user?.avatar || "/images/doctor.png"}
              alt="Doctor"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <div className="font-bold text-[#223a66] text-lg">
                {doctor?.user?.fullname || "Đang tải..."}
              </div>
              <div className="text-xs text-gray-500">
                {specialty?.specialtyName || ""}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">⏰</span>{" "}
            {schedule
              ? `${schedule.start_time} - ${schedule.end_time} ${schedule.date_schedule}`
              : "Đang tải..."}
          </div>
          <div className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">🏥</span> Novena Clinics - Hà Nội
          </div>
          <div className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">📍</span> Tầng 25, tòa nhà Ngọc Khánh Plaza, số 1 Phạm Huy Thông, Ba Đình, Hà Nội
          </div>
          {/* Hiển thị Booking ID */}
          <div className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">Booking ID:</span> {bookingId || "Chưa có"}
          </div>
          <div className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">Costs:</span> ${schedule?.price || ""}
          </div>
        </div>

        {/* Form thanh toán */}
        <form className="flex-1 max-w-xl bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold text-[#223a66] mb-6 text-center">
            Book appointment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="border rounded px-3 py-2 w-full bg-gray-100"
              placeholder="Họ tên"
              defaultValue={doctor?.user?.fullname || ""}
              disabled
            />
            <input
              className="border rounded px-3 py-2 w-full bg-gray-100"
              placeholder="Số điện thoại"
              defaultValue=""
            />
            <input
              className="border rounded px-3 py-2 w-full bg-gray-100"
              placeholder="Email"
              defaultValue=""
            />
            <select className="border rounded px-3 py-2 w-full bg-gray-100" disabled>
              <option>Male</option>
              <option>Female</option>
            </select>
            <input
              className="border rounded px-3 py-2 w-full bg-gray-100 col-span-2"
              placeholder="Địa chỉ"
              defaultValue=""
            />
          </div>
          <textarea
            className="border rounded px-3 py-2 w-full bg-gray-100 mb-4"
            placeholder="Reason for Medical Examination"
            rows={3}
          />
          <div className="mb-4">
            <div className="font-semibold mb-2">Choose payment method:</div>
            <div className="flex gap-4">
              <button
                type="button"
                className={`border rounded px-6 py-2 flex-1 flex items-center justify-center gap-2 ${paymentMethod === "vnpay" ? "bg-blue-200" : "bg-blue-50"}`}
                onClick={handleChooseVNPay}
              >
                <img src="/images/download (1).png" alt="VNPay" className="h-6" />
                VNPay
              </button>
              <button
                type="button"
                className={`border rounded px-6 py-2 flex-1 flex items-center justify-center gap-2 ${paymentMethod === "paypal" ? "bg-blue-200" : "bg-blue-50"}`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <img src="/images/paypal.png" alt="PayPal" className="h-6" />
                PayPal
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#223a66] text-white font-semibold py-2 rounded mt-4"
          >
            MAKE APPOINTMENT
          </button>
        </form>
      </section>

      {/* MODAL VNPay */}
      {showVNPayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
              onClick={handleCloseModal}
              aria-label="Đóng"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <img src="/images/download (1).png" alt="VNPay" className="h-12 mb-4" />
              <h3 className="text-xl font-bold mb-4 text-[#223a66] text-center">Thanh toán qua VNPay</h3>
              <p className="text-gray-600 mb-4 text-center">
                Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch.
              </p>
              <button
  className="w-full bg-[#223a66] text-white font-semibold py-2 rounded mt-2 flex items-center justify-center gap-2"
  onClick={handleVNPayPayment}
  disabled={loading}
>
  {loading && (
    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )}
  {loading ? "Đang chuyển hướng..." : "Tiếp tục thanh toán VNPay"}
</button>
              <div className="text-xs text-gray-400 text-center mt-2">
                <span role="img" aria-label="lock">🔒</span> Bảo mật bởi VNPay
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default PaymentPage;