// import React, { useState } from "react";
// import { useBooking } from "./BookingContext";
// import { useNavigate } from "react-router-dom";

// // Mock data (có thể import từ Doctors.jsx nếu muốn dùng chung)
// const specialties = [
//   "Cardiology",
//   "Ophthalmology",
//   "Dental Care",
//   "Child Care",
//   "Bone & Joint Centre",
//   "Digestive Health",
// ];

// const doctors = [
//   { id: 1, name: "Nguyen Van Binh", specialty: "Cardiology" },
//   { id: 2, name: "Tran Thi Lan", specialty: "Cardiology" },
//   { id: 3, name: "Le Quang Hieu", specialty: "Ophthalmology" },
//   { id: 4, name: "Pham Thi Mai", specialty: "Ophthalmology" },
//   { id: 5, name: "Nguyen Van Son", specialty: "Dental Care" },
//   { id: 6, name: "Do Thi Hoa", specialty: "Dental Care" },
//   { id: 7, name: "Pham Van An", specialty: "Child Care" },
//   { id: 8, name: "Nguyen Thi Dao", specialty: "Child Care" },
//   { id: 9, name: "Tran Van Minh", specialty: "Bone & Joint Centre" },
//   { id: 10, name: "Le Thi Bich", specialty: "Bone & Joint Centre" },
//   { id: 11, name: "Ha Van Quyet", specialty: "Digestive Health" },
//   { id: 12, name: "Hai Thuy Vi", specialty: "Digestive Health" },
//   { id: 13, name: "Nguyen Chi Thanh", specialty: "Digestive Health" },
//   { id: 14, name: "Le Thi Thu", specialty: "Digestive Health" },
// ];

// const BookingPage = () => {
//   const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0]);
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const { addBooking } = useBooking();
//   const navigate = useNavigate();

//   // Lọc bác sĩ theo chuyên khoa
//   const filteredDoctors = doctors.filter(
//     (doc) => doc.specialty === selectedSpecialty
//   );

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     addBooking({
//       name,
//       specialty: selectedSpecialty,
//       doctor: selectedDoctor,
//       date,
//       time,
//       phone,
//       email,
//     });
//     navigate("/booking-success");
//   };

//   return (
//     <main className="bg-white min-h-screen">
//       {/* Banner */}
//       <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
//         <div
//           className="absolute inset-0 bg-cover bg-center opacity-20"
//           style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
//         ></div>
//         <div className="relative z-10 text-center">
//           <div className="text-white text-sm mb-1">Booking</div>
//           <h1 className="text-3xl md:text-4xl font-bold text-white">
//             Book an Appointment
//           </h1>
//         </div>
//       </section>

//       {/* Booking Form */}
//       <section className="container mx-auto px-4 py-10 max-w-xl">
//         <div className="bg-white rounded-xl shadow-lg p-8">
//           <h2 className="text-2xl font-bold text-[#223a66] mb-6 text-center">
//             Đặt lịch hẹn
//           </h2>
//           <form className="space-y-5" onSubmit={handleSubmit}>
//             {/* Chọn phòng ban */}
//             <div>
//               <label className="block mb-1 font-semibold text-[#223a66]">
//                 Phòng ban
//               </label>
//               <select
//                 className="w-full p-3 rounded border border-gray-200 focus:outline-none"
//                 value={selectedSpecialty}
//                 onChange={(e) => {
//                   setSelectedSpecialty(e.target.value);
//                   setSelectedDoctor(""); // reset doctor khi đổi khoa
//                 }}
//                 required
//               >
//                 {specialties.map((spec) => (
//                   <option key={spec} value={spec}>
//                     {spec}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Chọn bác sĩ */}
//             <div>
//               <label className="block mb-1 font-semibold text-[#223a66]">
//                 Bác sĩ
//               </label>
//               <select
//                 className="w-full p-3 rounded border border-gray-200 focus:outline-none"
//                 value={selectedDoctor}
//                 onChange={(e) => setSelectedDoctor(e.target.value)}
//                 required
//               >
//                 <option value="">Chọn bác sĩ</option>
//                 {filteredDoctors.map((doc) => (
//                   <option key={doc.id} value={doc.name}>
//                     {doc.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Ngày */}
//             <div>
//               <label className="block mb-1 font-semibold text-[#223a66]">
//                 Ngày hẹn
//               </label>
//               <input
//                 type="date"
//                 className="w-full p-3 rounded border border-gray-200 focus:outline-none"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 required
//               />
//             </div>
//             {/* Giờ */}
//             <div>
//               <label className="block mb-1 font-semibold text-[#223a66]">
//                 Giờ hẹn
//               </label>
//               <input
//                 type="time"
//                 className="w-full p-3 rounded border border-gray-200 focus:outline-none"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//                 required
//               />
//             </div>
//             {/* Phone */}
//             <div>
//               <label className="block mb-1 font-semibold text-[#223a66]">
//                 Số điện thoại
//               </label>
//               <input
//                 type="tel"
//                 className="w-full p-3 rounded border border-gray-200 focus:outline-none"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 required
//                 pattern="[0-9]{10,15}"
//                 placeholder="Nhập số điện thoại"
//               />
//             </div>
//             {/* Email */}
//             <div>
//               <label className="block mb-1 font-semibold text-[#223a66]">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 className="w-full p-3 rounded border border-gray-200 focus:outline-none"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="Nhập email"
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-[#f75757] hover:bg-[#223a66] text-white font-semibold px-8 py-3 rounded-xl transition text-sm mt-2"
//             >
//               Đặt lịch hẹn
//             </button>
//             {submitted && (
//               <div className="text-green-600 text-center mt-4 font-semibold">
//                 Đặt lịch thành công!
//               </div>
//             )}
//           </form>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default BookingPage;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const BookingPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [paymentCode, setPaymentCode] = useState("");
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("Khám sức khỏe định kỳ");
  const [status, setStatus] = useState("PENDING");
  const [userId, setUserId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
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

      const result = await response.json();
      if (response.ok) {
        setSubmitted(true);
        navigate("/booking-success");
      } else {
        alert("Đặt lịch thất bại: " + result.message);
      }
    } catch (err) {
      console.error("Lỗi đặt lịch:", err);
      alert("Lỗi kết nối server!");
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

      <section className="container mx-auto px-4 py-10 max-w-xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#223a66] mb-6 text-center">
            Đặt lịch hẹn
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-semibold text-[#223a66]">
                Chuyên khoa
              </label>
              <select
                className="w-full p-3 rounded border border-gray-200 focus:outline-none"
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
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.user?.fullname || "(Không rõ tên)"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-[#223a66]">
                Ngày khám
              </label>
              <input
                type="date"
                className="w-full p-3 rounded border border-gray-200 focus:outline-none"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-[#223a66]">
                Lịch khám
              </label>
              <select
                className="w-full p-3 rounded border border-gray-200 focus:outline-none"
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                required
              >
                <option value="">Chọn lịch</option>
                {schedules
  .filter((schedule) => schedule.number_booked < schedule.booking_limit)
  .map((schedule) => (
    <option key={schedule.id} value={schedule.id}>
      {schedule.date_schedule?.join("-")} từ {schedule.start_time?.join(":")} đến {schedule.end_time?.join(":")} (
      {schedule.booking_limit - schedule.number_booked} chỗ trống)
    </option>
))}

              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#f75757] hover:bg-[#223a66] text-white font-semibold px-8 py-3 rounded-xl transition text-sm mt-2"
            >
              Đặt lịch hẹn
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;
