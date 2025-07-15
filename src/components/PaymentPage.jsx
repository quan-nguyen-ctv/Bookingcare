import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const { doctor, specialty, schedule } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");

  // Khi chọn VNPay, mở modal nhập thẻ
  const handleChooseVNPay = () => {
    setPaymentMethod("vnpay");
    setShowCardModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowCardModal(false);
  };

  // Xác nhận số thẻ
  const handleConfirmCard = (e) => {
    e.preventDefault();
    setShowCardModal(false);
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
          <div className="text-sm text-gray-700 mb-1">
            <span className="font-semibold">Costs:</span> ${schedule?.price || "100"}
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

      {/* MODAL NHẬP SỐ THẺ VNPay */}
      {showCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
              onClick={handleCloseModal}
              aria-label="Đóng"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-6 text-[#223a66] text-center">Thanh toán VNPay</h3>
            <form onSubmit={handleConfirmCard} className="space-y-4">
              <input
                type="email"
                className="border rounded px-3 py-2 w-full"
                placeholder="Email address"
                required
              />
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                placeholder="Name on card"
                required
              />
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                placeholder="Card number"
                maxLength={19}
                required
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Expiration date (MM/YY)"
                  maxLength={5}
                  required
                />
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="CVC"
                  maxLength={4}
                  required
                />
              </div>
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                placeholder="Address"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="City"
                  required
                />
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="State / Province"
                  required
                />
                <input
                  type="text"
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Postal code"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked id="billing" />
                <label htmlFor="billing" className="text-sm">Billing address is the same as shipping address</label>
              </div>
              <button
                type="submit"
                className="w-full bg-[#223a66] text-white font-semibold py-2 rounded mt-2"
              >
               Thanh toán
              </button>
              <div className="text-xs text-gray-400 text-center mt-2">
                <span role="img" aria-label="lock">🔒</span> Payment details stored in plain text
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default PaymentPage;