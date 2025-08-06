import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaClock, FaCalendarAlt, FaUserMd, FaMapMarkerAlt, FaEdit, FaCreditCard, FaPhone, FaEnvelope } from "react-icons/fa";

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return "bg-[#23cf7c] text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "Wait Refund":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Appointment Confirmed";
      case "pending":
        return "Pending Payment";
      case "rejected":
        return "Rejected";
      case "Wait Refund":
        return "Waiting Refund";
      default:
        return "Refunded";
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center bg-gradient-to-r from-[#223a66] to-[#2c4a7a] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/about-banner.jpg')",
            filter: "brightness(0.7)"
          }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
            Booking Information
          </span>
          <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight mt-2">
            Appointment <span className="font-bold text-[#23cf7c]">Details</span>
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90">
            Review your appointment information and manage your booking
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate("/list-booking")}
              className="mb-8 flex items-center gap-2 px-6 py-3 bg-[#223a66] text-white rounded-full hover:bg-[#1b2c4a] transition duration-300 shadow-lg"
            >
              <FaArrowLeft />
              Back to Bookings
            </button>

            {loading ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#23cf7c] mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading appointment details...</p>
              </div>
            ) : !booking ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-500 mb-2">Booking Not Found</h3>
                <p className="text-gray-400">The appointment you're looking for doesn't exist or has been removed.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header with Status */}
                <div className="bg-gradient-to-r from-[#223a66] to-[#2c4a7a] p-8 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Booking #{booking.id}</h2>
                      <p className="text-blue-200">Scheduled appointment details</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-6 py-3 rounded-full font-semibold text-sm ${getStatusBadge(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Doctor Info */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-2xl p-6 text-center">
                        <img
                          src={
                            booking?.schedule?.avatar
                              ? `http://localhost:6868/uploads/${encodeURIComponent(booking.schedule.avatar)}`
                              : "/images/doctor.png"
                          }
                          alt="Doctor"
                          className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-[#23cf7c]"
                        />
                        <h3 className="text-xl font-bold text-[#223a66] mb-2">
                          Dr. {booking?.schedule?.doctor_name}
                        </h3>
                        <p className="text-[#23cf7c] font-medium mb-4">
                          {booking?.schedule?.specialty_name}
                        </p>
                        
                        {/* Schedule Info */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 text-gray-600">
                            <FaClock className="text-[#23cf7c]" />
                            <span>
                              {convertToTimeString(booking?.schedule?.start_time)} - {convertToTimeString(booking?.schedule?.end_time)}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-gray-600">
                            <FaCalendarAlt className="text-[#23cf7c]" />
                            <span>{convertToDateString(booking?.schedule?.date_schedule)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="lg:col-span-2">
                      <div className="space-y-6">
                        {/* Patient Information */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <h4 className="text-lg font-bold text-[#223a66] mb-4 flex items-center gap-2">
                            <FaUserMd className="text-[#23cf7c]" />
                            Patient Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Full Name</p>
                              <p className="font-semibold text-gray-800">{booking?.user?.fullname}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Email</p>
                              <p className="font-semibold text-gray-800 flex items-center gap-2">
                                <FaEnvelope className="text-[#23cf7c] text-sm" />
                                {booking?.user?.email}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Phone</p>
                              <p className="font-semibold text-gray-800 flex items-center gap-2">
                                <FaPhone className="text-[#23cf7c] text-sm" />
                                {booking?.user?.phone_number}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Clinic Information */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <h4 className="text-lg font-bold text-[#223a66] mb-4 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-[#23cf7c]" />
                            Clinic Information
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Clinic Name</p>
                              <p className="font-semibold text-gray-800">{booking?.schedule?.clinic_name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Address</p>
                              <p className="font-semibold text-gray-800">{booking?.schedule?.clinic_address}</p>
                            </div>
                          </div>
                        </div>

                        {/* Consultation Details */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <h4 className="text-lg font-bold text-[#223a66] mb-4">Consultation Details</h4>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Reason for Visit</p>
                              <p className="font-semibold text-gray-800">{booking?.reason}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Consultation Fee</p>
                              <p className="font-bold text-2xl text-[#23cf7c]">
                                {booking?.amount?.toLocaleString()} VND
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          {booking?.status === "pending" && (
                            <button
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#23cf7c] hover:bg-[#1eb567] text-white rounded-full font-medium transition duration-300 shadow-lg"
                              onClick={handlePayment}
                            >
                              <FaCreditCard />
                              Pay Now
                            </button>
                          )}

                          {booking?.status === "pending" && booking?.change_count === 0 && (
                            <button
                              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#223a66] text-[#223a66] hover:bg-[#223a66] hover:text-white rounded-full font-medium transition duration-300"
                              onClick={() => {
                                setShowEditModal(true);
                                setSelectedDate("");
                                setAvailableTimes([]);
                                setSelectedScheduleId(null);
                                setSelectedTime("");
                              }}
                            >
                              <FaEdit />
                              Edit Appointment
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {showEditModal && booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#223a66] to-[#2c4a7a] p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Change Appointment</h3>
              <p className="text-blue-200">
                <strong>Note:</strong> You can only change the appointment <strong>once</strong>.
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Current Schedule */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-[#223a66] mb-3">Current Schedule</h4>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <FaClock className="text-[#23cf7c]" />
                    {convertToTimeString(booking?.schedule?.start_time)} - {convertToTimeString(booking?.schedule?.end_time)}
                  </span>
                  <span className="flex items-center gap-2">
                    <FaCalendarAlt className="text-[#23cf7c]" />
                    {convertToDateString(booking?.schedule?.date_schedule)}
                  </span>
                </div>
              </div>

              {/* Doctor Info & New Schedule */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Doctor Info */}
                <div className="flex gap-4">
                  <img
                    src={
                      booking?.schedule?.avatar
                        ? `http://localhost:6868/uploads/${encodeURIComponent(booking.schedule.avatar)}`
                        : "/images/doctor.png"
                    }
                    alt="Doctor"
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#23cf7c]"
                  />
                  <div>
                    <h4 className="font-bold text-[#223a66] text-lg">{booking?.schedule?.doctor_name}</h4>
                    <p className="text-sm text-gray-600 mb-1">Experience: {booking?.schedule?.experience} years</p>
                    <p className="text-sm text-gray-600 mb-2">
                      Qualification: {booking?.schedule?.qualification}
                    </p>
                    <a
                      href={`/doctors/${booking?.schedule?.doctor_id}-${booking?.schedule?.doctor_name || ""}`}
                      className="text-[#23cf7c] underline text-sm hover:text-[#1eb567]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Profile
                    </a>
                  </div>
                </div>

                {/* New Schedule Selection */}
                <div>
                  <h4 className="font-semibold text-[#223a66] mb-4">Select New Schedule</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaCalendarAlt className="inline mr-2 text-[#23cf7c]" />
                        Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime("");
                          setSelectedScheduleId(null);
                        }}
                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#23cf7c] focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaClock className="inline mr-2 text-[#23cf7c]" />
                        Available Times
                      </label>
                      {availableTimes.length === 0 && selectedDate && (
                        <p className="text-gray-400 text-center py-4">No available time slots</p>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        {availableTimes.map((sch) => (
                          <button
                            key={sch.id}
                            className={`p-3 border-2 rounded-xl text-sm font-medium transition ${
                              selectedScheduleId === sch.id
                                ? "bg-[#23cf7c] text-white border-[#23cf7c]"
                                : "bg-white text-[#223a66] border-gray-200 hover:border-[#23cf7c]"
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
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
              <button
                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition font-medium"
                onClick={() => setShowEditModal(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-[#23cf7c] text-white rounded-full hover:bg-[#1eb567] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSaveChange}
                disabled={!selectedScheduleId || saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;