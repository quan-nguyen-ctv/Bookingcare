import React, { useState, useEffect } from "react";
import { useBooking } from "./BookingContext";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { addBooking } = useBooking();
  const navigate = useNavigate();

  // Lấy specialties và doctors từ localStorage
  useEffect(() => {
    const specialtiesData = JSON.parse(
      localStorage.getItem("specialties") || "[]"
    );
    setSpecialties(specialtiesData);
    if (specialtiesData.length > 0) setSelectedSpecialty(specialtiesData[0].name);

    const doctorsData = JSON.parse(localStorage.getItem("doctors") || "[]");
    setDoctors(doctorsData);
  }, []);

  // Lọc bác sĩ theo chuyên khoa
  const filteredDoctors = doctors.filter(
    (doc) => doc.specialty === selectedSpecialty
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addBooking({
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
                  <option key={spec.id} value={spec.name}>
                    {spec.name}
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
                  <option key={doc.id} value={doc.user}>
                    {doc.user}
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