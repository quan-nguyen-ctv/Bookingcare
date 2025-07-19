
import React, { useState, useEffect } from "react";
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
if (!token || token.split(".").length !== 3) {
  setError("Bạn chưa đăng nhập hoặc token không hợp lệ.");
  return;
}

const decoded = jwtDecode(token);

        const userId = decoded.userId;

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

        setBookings(json.data);
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
          {bookings.map((b, idx) => {
            // Xử lý start_time và end_time
            const startTime = Array.isArray(b.schedule?.start_time)
              ? b.schedule.start_time.join(":")
              : b.schedule?.start_time || "Không rõ";

            const endTime = Array.isArray(b.schedule?.end_time)
              ? b.schedule.end_time.join(":")
              : b.schedule?.end_time || "Không rõ";

            // Xử lý date_schedule
            const dateSchedule = Array.isArray(b.schedule?.date_schedule)
              ? b.schedule.date_schedule.join("-")
              : b.schedule?.date_schedule || "Không rõ";

            return (
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
                        {startTime} - {endTime}
                      </div>
                      <div className="flex items-center gap-2 text-[#223a66] mt-1 text-sm">
                        <FaCalendarAlt className="mr-1" />
                        {dateSchedule}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 mt-4 md:mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                      <div>
                        <span className="font-semibold">Patient:</span>{" "}
                        {b.user?.fullname}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span>{" "}
                        {b.user?.email}
                      </div>
                      <div>
                        <span className="font-semibold">Phone:</span>{" "}
                        {b.user?.phone_number}
                      </div>
                      <div>
                        <span className="font-semibold">Doctor:</span>{" "}
                        <span className="text-[#1e88e5] font-semibold">
                          {b.schedule?.doctor_name || "Không rõ"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Specialty:</span>{" "}
                        {b.schedule?.specialty_name || "Không rõ"}
                      </div>
                      <div>
                        <span className="font-semibold">Costs:</span>{" "}
                        {b.amount?.toLocaleString() || "0"} VND
                      </div>
                      <div>
                        <span className="font-semibold">Clinic:</span>{" "}
                        {b.schedule?.clinic_name || clinicInfo.name}
                      </div>
                      <div>
                        <span className="font-semibold">Clinic Address:</span>{" "}
                        {b.schedule?.clinic_address || clinicInfo.address}
                      </div>
                      <div>
                        <span className="font-semibold">Reason:</span>{" "}
                        {b.reason || "Không có"}
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
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ListBooking;
