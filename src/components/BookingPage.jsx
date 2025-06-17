import React, { useState } from "react";
import { useBooking } from "./BookingContext";
import { useNavigate } from "react-router-dom";

// Mock data (có thể import từ Doctors.jsx nếu muốn dùng chung)
const specialties = [
  "Cardiology",
  "Ophthalmology",
  "Dental Care",
  "Child Care",
  "Bone & Joint Centre",
  "Digestive Health",
];

const doctors = [
  { id: 1, name: "Nguyen Van Binh", specialty: "Cardiology" },
  { id: 2, name: "Tran Thi Lan", specialty: "Cardiology" },
  { id: 3, name: "Le Quang Hieu", specialty: "Ophthalmology" },
  { id: 4, name: "Pham Thi Mai", specialty: "Ophthalmology" },
  { id: 5, name: "Nguyen Van Son", specialty: "Dental Care" },
  { id: 6, name: "Do Thi Hoa", specialty: "Dental Care" },
  { id: 7, name: "Pham Van An", specialty: "Child Care" },
  { id: 8, name: "Nguyen Thi Dao", specialty: "Child Care" },
  { id: 9, name: "Tran Van Minh", specialty: "Bone & Joint Centre" },
  { id: 10, name: "Le Thi Bich", specialty: "Bone & Joint Centre" },
  { id: 11, name: "Ha Van Quyet", specialty: "Digestive Health" },
  { id: 12, name: "Hai Thuy Vi", specialty: "Digestive Health" },
  { id: 13, name: "Nguyen Chi Thanh", specialty: "Digestive Health" },
  { id: 14, name: "Le Thi Thu", specialty: "Digestive Health" },
];

const BookingPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { addBooking } = useBooking();
  const navigate = useNavigate();

  // Lọc bác sĩ theo chuyên khoa
  const filteredDoctors = doctors.filter(
    (doc) => doc.specialty === selectedSpecialty
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addBooking({
      name,
      specialty: selectedSpecialty,
      doctor: selectedDoctor,
      date,
      time,
      phone,
      email,
    });
    navigate("/booking-success");
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Banner */}
      <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
        ></div>
        <div className="relative z-10 text-center">
          <div className="text-white text-sm mb-1">Booking</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Book an Appointment
          </h1>
        </div>
      </section>

      {/* Booking Form */}
      <section className="container mx-auto px-4 py-10 max-w-xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#223a66] mb-6 text-center">
            Đặt lịch hẹn
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Chọn phòng ban */}
            <div>
              <label className="block mb-1 font-semibold text-[#223a66]">
                Phòng ban
              </label>
              <select
                className="w-full p-3 rounded border border-gray-200 focus:outline-none"
                value={selectedSpecialty}
                onChange={(e) => {
                  setSelectedSpecialty(e.target.value);
                  setSelectedDoctor(""); // reset doctor khi đổi khoa
                }}
                required
              >
                {specialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            {/* Chọn bác sĩ */}
            <div>
              <label className="block mb-1 font-semibold text-[#223a66]">
                Bác sĩ
              </label>
              <select
                className="w-full p-3 rounded border border-gray-200 focus:outline-none"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">Chọn bác sĩ</option>
                {filteredDoctors.map((doc) => (
                  <option key={doc.id} value={doc.name}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Ngày */}
            <div>
              <label className="block mb-1 font-semibold text-[#223a66]">
                Ngày hẹn
              </label>
              <input
                type="date"
                className="w-full p-3 rounded border border-gray-200 focus:outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            {/* Giờ */}
            <div>
              <label className="block mb-1 font-semibold text-[#223a66]">
                Giờ hẹn
              </label>
              <input
                type="time"
                className="w-full p-3 rounded border border-gray-200 focus:outline-none"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            {/* Phone */}
            <div>
              <label className="block mb-1 font-semibold text-[#223a66]">
                Số điện thoại
              </label>
              <input
                type="tel"
                className="w-full p-3 rounded border border-gray-200 focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                pattern="[0-9]{10,15}"
                placeholder="Nhập số điện thoại"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block mb-1 font-semibold text-[#223a66]">
                Email
              </label>
              <input
                type="email"
                className="w-full p-3 rounded border border-gray-200 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Nhập email"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#f75757] hover:bg-[#223a66] text-white font-semibold px-8 py-3 rounded-xl transition text-sm mt-2"
            >
              Đặt lịch hẹn
            </button>
            {submitted && (
              <div className="text-green-600 text-center mt-4 font-semibold">
                Đặt lịch thành công!
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;