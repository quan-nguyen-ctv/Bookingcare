import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaCalendarAlt, FaUserMd, FaStethoscope, FaClock, FaEdit } from "react-icons/fa";

const BookingPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");
  const [paymentCode, setPaymentCode] = useState("");
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [userId, setUserId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setPaymentCode(randomCode);
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.userId) {
          setUserId(decoded.userId);
        }
      } catch (err) {
        console.error("Lỗi khi decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:6868/api/v1/specialties")
      .then((res) => res.json())
      .then((data) => {
        const list = data?.data?.specialtyList || [];
        setSpecialties(list);
        if (list.length > 0) {
          setSelectedSpecialty(list[0].id);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi gọi API specialties:", err);
        setSpecialties([]);
      });
  }, []);

  useEffect(() => {
    if (!selectedSpecialty) return;
    const token = localStorage.getItem("token");
    fetch(`http://localhost:6868/api/v1/doctors?specialtyId=${selectedSpecialty}&page=0`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.doctors) {
          setDoctors(data.data.doctors);
          setSelectedDoctor(data.data.doctors[0]?.id || "");
        } else {
          setDoctors([]);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi load doctors:", err);
        setDoctors([]);
      });
  }, [selectedSpecialty]);

  useEffect(() => {
    if (!selectedDoctor || !scheduleDate) return;
    const token = localStorage.getItem("token");
    fetch(`http://localhost:6868/api/v1/schedules/doctor?doctorId=${selectedDoctor}&dateSchedule=${scheduleDate}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const scheduleList = Array.isArray(data?.data) ? data.data : [];
        setSchedules(scheduleList);
        if (scheduleList.length > 0) {
          setSelectedSchedule(scheduleList[0]?.id || "");
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi load schedules:", err);
        setSchedules([]);
      });
  }, [selectedDoctor, scheduleDate]);

  useEffect(() => {
    const selected = schedules.find(s => s.id === Number(selectedSchedule));
    if (selected) {
      setAmount(selected.price || 0);
    }
  }, [selectedSchedule]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:6868/api/v1/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          schedule_id: Number(selectedSchedule),
          user_id: Number(userId),
          payment_method: paymentMethod,
          payment_code: paymentCode,
          amount: Number(amount),
          reason: reason,
          status: status,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const bookingData = await response.json();
      const bookingId = bookingData?.data?.id;

      const doctor = doctors.find(d => d.id === Number(selectedDoctor));
      const specialty = specialties.find(s => s.id === Number(selectedSpecialty));
      const schedule = schedules.find(s => s.id === Number(selectedSchedule));
      
      navigate("/payment", {
        state: {
          doctor,
          specialty,
          schedule,
          bookingId,
          reason,
        },
      });
    } catch (err) {
      alert("Lỗi kết nối server!");
    } finally {
      setBookingLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center mt-20 text-green-600 text-xl">
        ✅ Bạn đã đặt lịch hẹn thành công!
      </div>
    );
  }

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
            Healthcare Booking
          </span>
          <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight mt-2">
            Book Your <span className="font-bold text-[#23cf7c]">Appointment</span>
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90">
            Schedule your consultation with our expert medical professionals
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
                Appointment Booking
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-4 mt-2">
                Schedule Your <span className="font-bold">Visit</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Please fill out the form below to book your appointment with our specialists
              </p>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Specialty Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="flex items-center gap-2 mb-3 font-semibold text-[#223a66] text-lg">
                      <FaStethoscope className="text-[#23cf7c]" />
                      Medical Specialty
                    </label>
                    <select
                      className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#23cf7c] focus:outline-none transition duration-300 text-gray-700"
                      value={selectedSpecialty}
                      onChange={(e) => {
                        setSelectedSpecialty(e.target.value);
                        setSelectedDoctor("");
                      }}
                      required
                    >
                      {Array.isArray(specialties) &&
                        specialties.map((spec) => (
                          <option key={spec.id} value={spec.id}>
                            {spec.specialtyName}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Doctor Selection */}
                  <div>
                    <label className="flex items-center gap-2 mb-3 font-semibold text-[#223a66] text-lg">
                      <FaUserMd className="text-[#23cf7c]" />
                      Select Doctor
                    </label>
                    <select
                      className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#23cf7c] focus:outline-none transition duration-300 text-gray-700"
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      required
                    >
                      <option value="">Choose a doctor</option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          Dr. {doc.user?.fullname || "(Name not available)"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date and Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="flex items-center gap-2 mb-3 font-semibold text-[#223a66] text-lg">
                      <FaCalendarAlt className="text-[#23cf7c]" />
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#23cf7c] focus:outline-none transition duration-300 text-gray-700"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mb-3 font-semibold text-[#223a66] text-lg">
                      <FaClock className="text-[#23cf7c]" />
                      Available Time Slots
                    </label>
                    <select
                      className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#23cf7c] focus:outline-none transition duration-300 text-gray-700"
                      value={selectedSchedule}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                      required
                    >
                      <option value="">Select time slot</option>
                      {schedules
                        .filter((schedule) => {
                          const { active, number_booked, booking_limit, date_schedule, start_time } = schedule;
                          if (!active || number_booked >= booking_limit) return false;
                          const dateStr = Array.isArray(date_schedule) ? date_schedule.join("-") : date_schedule;
                          const timeStr = Array.isArray(start_time) ? start_time.join(":") : start_time;
                          const fullStartTime = new Date(`${dateStr}T${timeStr}`);
                          return fullStartTime > new Date();
                        })
                        .map((schedule) => {
                          const dateString = Array.isArray(schedule.date_schedule)
                            ? schedule.date_schedule.join("-")
                            : schedule.date_schedule || "Unknown date";
                          const startTimeString = Array.isArray(schedule.start_time)
                            ? schedule.start_time.join(":")
                            : schedule.start_time || "Unknown";
                          const endTimeString = Array.isArray(schedule.end_time)
                            ? schedule.end_time.join(":")
                            : schedule.end_time || "Unknown";

                          return (
                            <option key={schedule.id} value={schedule.id}>
                              {startTimeString} - {endTimeString} ({schedule.booking_limit - schedule.number_booked} slots available)
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>

                {/* Reason for Visit */}
                <div>
                  <label className="flex items-center gap-2 mb-3 font-semibold text-[#223a66] text-lg">
                    <FaEdit className="text-[#23cf7c]" />
                    Reason for Visit <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#23cf7c] focus:outline-none transition duration-300 resize-none text-gray-700"
                    rows="5"
                    placeholder="Please describe your symptoms or reason for consultation (e.g., headache, fever, routine checkup...)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      Please provide detailed information to help our doctors prepare for your visit
                    </p>
                    <span className="text-xs text-gray-400">
                      {reason.length}/500 characters
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                {amount > 0 && (
                  <div className="bg-[#23cf7c]/10 rounded-xl p-6 border border-[#23cf7c]/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[#223a66] font-semibold text-lg">Consultation Fee:</span>
                      <span className="text-[#23cf7c] font-bold text-2xl">
                        {amount.toLocaleString('vi-VN')} VND
                      </span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-[#23cf7c] hover:bg-[#1eb567] text-white font-semibold px-8 py-4 rounded-xl transition duration-300 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    disabled={bookingLoading || !reason.trim()}
                  >
                    {bookingLoading && (
                      <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    )}
                    {bookingLoading ? "Processing..." : "Book Appointment"}
                    <FaCalendarAlt className="text-lg" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
              Why Book With Us
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-4 mt-2">
              Easy & <span className="font-bold">Secure</span> Booking
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Quick Booking",
                description: "Fast and easy appointment scheduling in just a few clicks"
              },
              {
                icon: "🔒",
                title: "Secure Platform",
                description: "Your personal information is protected with advanced security"
              },
              {
                icon: "📱",
                title: "24/7 Support",
                description: "Round-the-clock customer support for any assistance needed"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#223a66] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;