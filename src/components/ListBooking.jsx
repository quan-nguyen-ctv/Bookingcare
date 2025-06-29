// import React from "react";
// import { useBooking } from "./BookingContext";
// import { FaUserMd, FaCalendarAlt, FaClock } from "react-icons/fa";

// const clinicInfo = {
//   name: "Novena Clinics - Hà Nội",
//   address:
//     "Tầng 25, tòa nhà Ngọc Khánh Plaza, số 1 Phạm Huy Thông, Phường Ngọc Khánh, Ba Đình, Hà Nội",
//   cost: "$100",
// };

// const ListBooking = () => {
//   const { bookings } = useBooking();

//   return (
//     <section className="container mx-auto px-4 py-10 max-w-2xl">
//       <h2 className="text-2xl font-bold text-[#223a66] mb-8 text-center">
//         Booking list placed
//       </h2>
//       {bookings.length === 0 ? (
//         <div className="text-center text-gray-500">Chưa có lịch hẹn nào.</div>
//       ) : (
//         <div className="space-y-8">
//           {bookings.map((b, idx) => (
//             <div
//               key={idx}
//               className="bg-white rounded-xl shadow p-8 flex flex-col gap-4 border border-gray-200"
//             >
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-4xl text-[#223a66]">
//                     <FaUserMd />
//                   </div>
//                   <div>
//                     <div className="font-semibold text-[#223a66] text-lg">
//                       Medical Exam
//                     </div>
//                     <div className="flex items-center gap-2 text-[#223a66] mt-1 text-sm">
//                       <FaClock className="mr-1" />
//                       {b.time || "07:30 - 08:00"}
//                     </div>
//                     <div className="flex items-center gap-2 text-[#223a66] mt-1 text-sm">
//                       <FaCalendarAlt className="mr-1" />
//                       {b.date}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex-1 mt-4 md:mt-0">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
//                     <div>
//                       <span className="font-semibold">Patient:</span>{" "}
//                       {b.name || "Chưa nhập"}
//                     </div>
//                     <div>
//                       <span className="font-semibold">Email:</span> {b.email}
//                     </div>
//                     <div>
//                       <span className="font-semibold">Phone:</span> {b.phone}
//                     </div>
//                     <div>
//                       <span className="font-semibold">Doctor:</span>{" "}
//                       <span className="text-[#1e88e5] font-semibold">
//                         {b.doctor}
//                       </span>
//                     </div>
//                     <div>
//                       <span className="font-semibold">Specialty:</span>{" "}
//                       {b.specialty}
//                     </div>
//                     <div>
//                       <span className="font-semibold">Costs:</span>{" "}
//                       {clinicInfo.cost}
//                     </div>
//                     <div>
//                       <span className="font-semibold">Clinic:</span>{" "}
//                       {clinicInfo.name}
//                     </div>
//                     <div>
//                       <span className="font-semibold">Clinic Address:</span>{" "}
//                       {clinicInfo.address}
//                     </div>
//                     <div>
//                       <span className="font-semibold">Reason:</span>{" "}
//                       {b.reason || "Không có"}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
//                 <button
//                   className="bg-green-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-green-700 transition w-fit"
//                   disabled
//                 >
//                   Appointment booked
//                 </button>
//                 <a
//                   href="#"
//                   className="text-[#223a66] mt-2 md:mt-0 hover:underline text-sm"
//                 >
//                   Medical Exam Results
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default ListBooking;

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { FaUserMd, FaCalendarAlt, FaClock } from "react-icons/fa";

const clinicInfo = {
  name: "Novena Clinics - Hà Nội",
  address:
    "Tầng 25, tòa nhà Ngọc Khánh Plaza, số 1 Phạm Huy Thông, Phường Ngọc Khánh, Ba Đình, Hà Nội",
  cost: "$100",
};

const ListBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn chưa đăng nhập.");
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.userId; // ✅ Lấy đúng userId từ claims



        if (!userId) {
          setError("Không thể lấy thông tin người dùng từ token.");
          return;
        }

        const res = await fetch(`http://localhost:6868/api/v1/bookings/user/${userId}`, {
          headers: {
                 Authorization: `Bearer ${token}`,
                 "Content-Type": "application/json",
                 },
        });


        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.message || "Lỗi khi lấy danh sách lịch hẹn.");
        }

        // ✅ Fix tại đây
        setBookings(json.data); // <-- CHỈ LẤY data
      } catch (err) {
        console.error("Lỗi:", err);
        setError(err.message || "Đã xảy ra lỗi.");
      }
    };

    fetchBookings();
  }, []);

  return (
    <section className="container mx-auto px-4 py-10 max-w-2xl">
      <h2 className="text-2xl font-bold text-[#223a66] mb-8 text-center">
        Booking list placed
      </h2>

      {error && <div className="text-red-500 text-center">{error}</div>}

      {bookings.length === 0 && !error ? (
        <div className="text-center text-gray-500">Chưa có lịch hẹn nào.</div>
      ) : (
        <div className="space-y-8">
          {bookings.map((b, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-8 flex flex-col gap-4 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-4xl text-[#223a66]">
                    <FaUserMd />
                  </div>
                  <div>
                    <div className="font-semibold text-[#223a66] text-lg">
                      Medical Exam
                    </div>
                    <div className="flex items-center gap-2 text-[#223a66] mt-1 text-sm">
                      <FaClock className="mr-1" />
                      {(b.schedule?.start_time[0] ?? "07") + ":" + (b.schedule?.start_time[1] ?? "30")}
                      {" - "}
                      {(b.schedule?.end_time[0] ?? "08") + ":" + (b.schedule?.end_time[1] ?? "00")}
                    </div>
                    <div className="flex items-center gap-2 text-[#223a66] mt-1 text-sm">
                      <FaCalendarAlt className="mr-1" />
                      {(b.schedule?.date_schedule || []).join("-")}
                    </div>
                  </div>
                </div>
                <div className="flex-1 mt-4 md:mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                      <span className="font-semibold">Patient:</span> {b.user?.fullname}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span> {b.user?.email}
                    </div>
                    <div>
                      <span className="font-semibold">Phone:</span> {b.user?.phone_number}
                    </div>
                    <div>
                      <span className="font-semibold">Doctor:</span>{" "}
                      <span className="text-[#1e88e5] font-semibold">{b.schedule?.doctor_name}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Specialty:</span> {b.schedule?.specialty_name}
                    </div>
                    <div>
                      <span className="font-semibold">Costs:</span> {b.amount.toLocaleString()} VND
                    </div>
                    <div>
                      <span className="font-semibold">Clinic:</span> {b.schedule?.clinic_name}
                    </div>
                    <div>
                      <span className="font-semibold">Clinic Address:</span>{" "}
                      {b.schedule?.clinic_address || clinicInfo.address}
                    </div>
                    <div>
                      <span className="font-semibold">Reason:</span> {b.reason || "Không có"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
                <button
                  className="bg-green-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-green-700 transition w-fit"
                  disabled
                >
                  Appointment booked
                </button>
                <a
                  href="#"
                  className="text-[#223a66] mt-2 md:mt-0 hover:underline text-sm"
                >
                  Medical Exam Results
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ListBooking;
