import React, { useEffect } from "react";
import { useBooking } from "./BookingContext";
import { useNavigate } from "react-router-dom";

const clinicInfo = {
  name: "Novena Clinics - Hà Nội",
  address:
    "Tầng 25, tòa nhà Ngọc Khánh Plaza, số 1 Phạm Huy Thông, Phường Ngọc Khánh, Ba Đình, Hà Nội",
  cost: "$100",
};

const BookingSuccess = () => {
  const { bookings } = useBooking();
  const navigate = useNavigate();

  // Lấy booking cuối cùng vừa đặt
  const booking = bookings.length > 0 ? bookings[bookings.length - 1] : null;

  // Nếu không có booking thì chuyển về trang booking
  useEffect(() => {
    if (!booking) navigate("/booking");
  }, [booking, navigate]);

  if (!booking) return null;

  // Tính giờ kết thúc (ví dụ cộng 30 phút)
  let endTime = "";
  if (booking.time) {
    const [h, m] = booking.time.split(":");
    const d = new Date();
    d.setHours(+h, +m + 30);
    endTime = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="max-w-3xl mx-auto my-10 bg-white rounded-lg shadow">
      <div className="rounded-t-lg bg-green-600 p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Appointment Confirmation
        </h2>
      </div>
      <div className="p-8">
        <h3 className="text-xl font-bold mb-2 text-[#223a66]">
          Thank you for booking with our clinic!
        </h3>
        <p className="mb-6">
          Your appointment has been successfully scheduled. Below are the details of your visit:
        </p>
        <div className="mb-4">
          <div>
            <span className="font-bold">Full Name:</span> {booking.name || "Chưa nhập"}
          </div>
          <div>
            <span className="font-bold">Email:</span>{" "}
            <a href={`mailto:${booking.email}`} className="text-blue-600 underline">
              {booking.email}
            </a>
          </div>
          <div>
            <span className="font-bold">Phone Number:</span> {booking.phone}
          </div>
        </div>
        <hr className="my-4" />
        <div className="mb-4">
          <div>
            <span className="font-bold">Doctor:</span> Dr. {booking.doctor}
          </div>
          <div>
            <span className="font-bold">Specialty:</span> {booking.specialty}
          </div>
          <div>
            <span className="font-bold">Clinic:</span> {clinicInfo.name}
          </div>
          <div>
            <span className="font-bold">Clinic Address:</span> {clinicInfo.address}
          </div>
          <div>
            <span className="font-bold">Appointment Date:</span> {booking.date}
          </div>
          <div>
            <span className="font-bold">Start Time:</span> {booking.time}
          </div>
          <div>
            <span className="font-bold">End Time:</span> {endTime}
          </div>
          <div>
            <span className="font-bold">Costs:</span> {clinicInfo.cost}
          </div>
        </div>
        <div className="mt-8 bg-gray-100 rounded p-4 text-center text-gray-700 text-sm">
          If you have any questions, feel free to{" "}
          <a href="/contact" className="text-green-600 underline">
            contact us
          </a>{" "}
          or call our hotline at <span className="font-bold">1900 9999</span>.<br />
          Novena Clinic thanks you for trusting us!
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;