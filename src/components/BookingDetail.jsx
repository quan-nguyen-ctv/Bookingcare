import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Nếu bạn có các hàm convert date/time thì import vào, nếu không thì dùng mặc định
const convertToDateString = (date) => (date ? new Date(date).toLocaleDateString() : "");
const convertToTimeString = (time) => (time ? time.slice(0, 5) : "");

const BookingDetail = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch booking detail
  useEffect(() => {
    const fetchBooking = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const userId = JSON.parse(atob(token.split(".")[1])).userId;
        const res = await fetch(
          `http://localhost:6868/api/v1/bookings/user/${userId}/detail?bookingId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Lỗi khi lấy booking.");
        setBooking(json.data);
      } catch (err) {
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBooking();
  }, [id]);

  // Fetch available schedules for selected date
  useEffect(() => {
    if (!selectedDate || !booking || !booking.schedule || !booking.schedule.doctor_id) return;
    const fetchSchedules = async () => {
      try {
        const res = await fetch(
          `http://localhost:6868/api/v1/schedules?doctorId=${booking.schedule.doctor_id}&dateSchedule=${selectedDate}`
        );
        const json = await res.json();
        setAvailableTimes(json.data?.scheduleResponseList || []);
      } catch {
        setAvailableTimes([]);
      }
    };
    fetchSchedules();
  }, [selectedDate, booking]);

  // Handle save change
  const handleSaveChange = async () => {
    if (!selectedScheduleId) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      const res = await fetch(
        `http://localhost:6868/api/v1/bookings/user/${userId}/change?bookingId=${id}&scheduleId=${selectedScheduleId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Lỗi khi đổi lịch.");
      setShowEditModal(false);
      // Reload booking detail
      window.location.reload();
    } catch (err) {
      alert(err.message || "Đổi lịch thất bại");
    } finally {
      setSaving(false);
    }
  };

  // Handle navigate to payment
  const handlePayment = () => {
    if (!booking) return;

    // Tạo data để truyền sang PaymentPage
    const paymentData = {
      doctor: {
        user: {
          fullname: booking.schedule?.doctor_name,
        },
        avatar: booking.schedule?.avatar,
      },
      specialty: {
        specialtyName: booking.schedule?.specialty_name,
      },
      schedule: {
        start_time: convertToTimeString(booking.schedule?.start_time),
        end_time: convertToTimeString(booking.schedule?.end_time),
        date_schedule: convertToDateString(booking.schedule?.date_schedule),
        clinic_address: booking.schedule?.clinic_address,
        clinic_name: booking.schedule?.clinic_name,
        price: booking.amount,
      },
      bookingId: booking.id,
      reason: booking?.reason
    };

    // Navigate to payment page with data
    navigate("/payment", { state: paymentData });
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <button
        onClick={() => navigate("/list-booking")}
        className="mb-6 px-4 py-2 bg-[#223a66] text-white rounded hover:bg-[#1b2c4a] transition"
      >
        Back
      </button>
      <div className="bg-white rounded-xl shadow p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-[#223a66] mb-6 text-center">Booking Detail</h2>
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : !booking ? (
          <div className="text-center text-gray-500 py-8">Không tìm thấy booking.</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Doctor & Time */}
            <div className="md:w-1/3 flex flex-col items-center">
              <img
                src={
                  booking?.schedule?.avatar
                    ? `http://localhost:6868/uploads/${encodeURIComponent(booking.schedule.avatar)}`
                    : "/images/doctor.png"
                }
                alt="Doctor"
                className="w-32 h-32 rounded-full object-cover mb-4 border"
              />
              <div className="font-semibold text-lg mb-2">Medical Exam</div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-5 h-5 text-[#223a66]">
                  {/* Clock icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                  </svg>
                </span>
                <span>
                  {convertToTimeString(booking?.schedule?.start_time)} - {convertToTimeString(booking?.schedule?.end_time)}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-5 h-5 text-[#223a66]">
                  {/* Calendar icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </span>
                <span>{convertToDateString(booking?.schedule?.date_schedule)}</span>
              </div>
            </div>
            {/* Right: Info */}
            <div className="md:w-2/3">
              <p>
                <strong>Patient: </strong>
                {booking?.user?.fullname}
              </p>
              <p>
                <strong>Email: </strong>
                {booking?.user?.email}
              </p>
              <p>
                <strong>Phone: </strong>
                {booking?.user?.phone_number}
              </p>
              <p>
                <strong>Doctor: </strong>
                <a
                  href={`/doctors/${booking?.schedule?.doctor_id}-${booking?.schedule?.doctor_name || ""}`}
                  className="text-blue-600 underline"
                >
                  {booking?.schedule?.doctor_name}
                </a>
              </p>
              <p>
                <strong>Specialty: </strong>
                {booking?.schedule?.specialty_name}
              </p>
              <p>
                <strong>Costs: </strong>
                {booking?.amount?.toLocaleString()} VND
              </p>
              <p>
                <strong>Clinic: </strong>
                {booking?.schedule?.clinic_name}
              </p>
              <p>
                <strong>Clinic Address: </strong>
                {booking?.schedule?.clinic_address}
              </p>
              <p>
                <strong>Reason: </strong>
                {booking?.reason}
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                {booking?.status === "paid" ? (
                  <span className="bg-green-500 text-white px-4 py-2 rounded">Appointment booked</span>
                ) : booking?.status === "pending" ? (
                  <span className="bg-yellow-400 text-white px-4 py-2 rounded">Pending</span>
                ) : booking?.status === "rejected" ? (
                  <span className="bg-red-500 text-white px-4 py-2 rounded">Rejected</span>
                ) : booking?.status === "Wait Refund" ? (
                  <span className="bg-blue-400 text-white px-4 py-2 rounded">Wait Refund</span>
                ) : (
                  <span className="bg-blue-600 text-white px-4 py-2 rounded">Refunded</span>
                )}

                {/* Nút thanh toán cho status pending */}
                {booking?.status === "pending" && (
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
                    onClick={handlePayment}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Pay Now
                  </button>
                )}

                {/* Nút sửa chỉ cho phép đổi nếu trạng thái là pending và chưa đổi lần nào */}
                {booking?.status === "pending" && booking?.change_count === 0 && (
                  <button
                    className="px-4 py-2 bg-[#223a66] text-white rounded hover:bg-[#1b2c4a] transition"
                    onClick={() => {
                      setShowEditModal(true);
                      setSelectedDate("");
                      setAvailableTimes([]);
                      setSelectedScheduleId(null);
                      setSelectedTime("");
                    }}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal đổi lịch */}
      {showEditModal && booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
            <h3 className="text-xl font-bold mb-2">Change Appointment</h3>
            <p className="text-red-600 mb-2 font-semibold">
              Note: You can only change the appointment <b>once</b>.
            </p>
            <div className="bg-gray-100 rounded p-3 mb-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold">Current schedule:</span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#223a66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                  </svg>
                  {convertToTimeString(booking?.schedule?.start_time)} - {convertToTimeString(booking?.schedule?.end_time)}
                </span>
                <span className="flex items-center gap-2 ml-4">
                  <svg className="w-4 h-4 text-[#223a66]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {convertToDateString(booking?.schedule?.date_schedule)}
                </span>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <img
                src={
                  booking?.schedule?.avatar
                    ? `http://localhost:6868/uploads/${encodeURIComponent(booking.schedule.avatar)}`
                    : "/images/doctor.png"
                }
                alt="Doctor"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <div>
                <div className="font-bold">{booking?.schedule?.doctor_name}</div>
                <div className="text-sm text-gray-600 mb-1">Experience: {booking?.schedule?.experience} years</div>
                <div className="text-sm text-gray-600 mb-1">
                  Qualification: {booking?.schedule?.qualification}
                </div>
                <a
                  href={`/doctors/${booking?.schedule?.doctor_id}-${booking?.schedule?.doctor_name || ""}`}
                  className="text-blue-600 underline text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See more
                </a>
              </div>
              <div className="ml-8 flex-1">
                <div className="font-semibold mb-1">Schedule:</div>
                <div className="mb-2">
                  <label className="mr-2">Date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                      setSelectedScheduleId(null);
                    }}
                    className="border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="mr-2">Select Time:</label>
                  {availableTimes.length === 0 && selectedDate && (
                    <span className="text-gray-400 ml-2">No available time</span>
                  )}
                  {availableTimes.map((sch) => (
                    <button
                      key={sch.id}
                      className={`px-3 py-1 border rounded mr-2 mb-2 ${
                        selectedScheduleId === sch.id
                          ? "bg-[#223a66] text-white"
                          : "bg-white text-[#223a66] border-[#223a66]"
                      }`}
                      onClick={() => {
                        setSelectedScheduleId(sch.id);
                        setSelectedTime(`${convertToTimeString(sch.start_time)} - ${convertToTimeString(sch.end_time)}`);
                      }}
                    >
                      {convertToTimeString(sch.start_time)} - {convertToTimeString(sch.end_time)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowEditModal(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSaveChange}
                disabled={!selectedScheduleId || saving}
              >
                {saving ? "Saving..." : "Save Change"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;