import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrescriptionModal from "./PrescriptionModal";

// Helper: format date dd-mm-yyyy
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper: format time to 12-hour format
const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  const [hour, minute] = timeStr.split(":");
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? "PM" : "AM";
  const hour12 = hourNum % 12 || 12;
  return `${hour12}:${minute} ${ampm}`;
};

const PatientBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedSlot, setSelectedSlot] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Get doctorId from localStorage
  const doctorData = JSON.parse(localStorage.getItem("doctor_details"));
  const doctorId = doctorData?.id;

  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (type === "info") {
      toast.info(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Fetch schedules for selected date
  const fetchSchedulesForDate = async (date) => {
    try {
      const token = localStorage.getItem("doctor_token");
      if (!token || !doctorId) {
        showToast("Không tìm thấy thông tin đăng nhập", "error");
        return;
      }

      const res = await fetch(
        `http://localhost:6868/api/v1/schedules/doctor?doctorId=${doctorId}&dateSchedule=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!res.ok) {
        throw new Error("Không thể tải lịch trình");
      }
      
      const json = await res.json();
      
      // Sort schedules by start time
      const sorted = (json?.data || []).sort((a, b) => {
        return new Date(`1970-01-01T${a.start_time}`) - new Date(`1970-01-01T${b.start_time}`);
      });
      
      setSchedules(sorted);
      
      // Create time slots from schedules
      const timeSlots = sorted.map(schedule => 
        `${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}`
      );
      setAvailableTimeSlots(timeSlots);
      
    } catch (error) {
      console.error("Error fetching schedules:", error);
      showToast("Không thể tải lịch trình cho ngày này", "error");
      setSchedules([]);
      setAvailableTimeSlots([]);
    }
  };

  // Fetch all bookings
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("doctor_token");
      if (!token || !doctorId) {
        showToast("Không tìm thấy thông tin đăng nhập", "error");
        return;
      }

      // Get all schedules (no date filter)
      const scheduleRes = await axios.get(
        `http://localhost:6868/api/v1/schedules/doctor?doctorId=${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allSchedules = scheduleRes.data.data || [];
      const scheduleIds = allSchedules.map((s) => s.id);

      if (scheduleIds.length === 0) {
        showToast("Chưa có lịch trình nào được tạo", "info");
        setBookings([]);
        return;
      }

      // Get bookings for each schedule
      const bookingResponses = await Promise.all(
        scheduleIds.map(async (id) => {
          try {
            const res = await axios.get(
              `http://localhost:6868/api/v1/bookings/doctor?scheduleId=${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Attach schedule info to booking
            const scheduleInfo = allSchedules.find(s => s.id === id);
            const bookingsWithSchedule = (res.data.data.bookingList || []).map(booking => ({
              ...booking,
              schedule: scheduleInfo
            }));
            
            return bookingsWithSchedule;
          } catch (err) {
            console.error(`Error fetching bookings for schedule ${id}:`, err);
            return [];
          }
        })
      );

      const allBookings = bookingResponses.flat();
      setBookings(allBookings);
      
      if (allBookings.length === 0) {
        showToast("Chưa có bệnh nhân nào đặt lịch", "info");
      } else {
        showToast(`Đã tải ${allBookings.length} lượt đặt lịch`);
      }
      
    } catch (err) {
      console.error("Error loading booking data:", err);
      showToast("Lỗi khi tải dữ liệu đặt lịch", "error");
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (doctorId) {
      fetchAllBookings();
    }
  }, [doctorId]);

  // Load schedules when selectedDate changes
  useEffect(() => {
    if (doctorId) {
      fetchSchedulesForDate(selectedDate);
      setSelectedSlot(""); // Reset selected slot when date changes
    }
  }, [selectedDate, doctorId]);

  // Map start_time and end_time to time slot format
  const getTimeSlotFromSchedule = (schedule) => {
    if (!schedule || !schedule.start_time || !schedule.end_time) return "";
    return `${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}`;
  };

  // Filter bookings
  const filtered = bookings
    .filter((booking) => {
      const user = booking.user || {};
      const schedule = booking.schedule || {};
      
      // Filter by date
      const matchDate = schedule.date_schedule === selectedDate;
      
      // Filter by time slot
      const bookingTimeSlot = getTimeSlotFromSchedule(schedule);
      const matchSlot = selectedSlot ? bookingTimeSlot === selectedSlot : true;
      
      // Filter by search
      const matchSearch = !search || 
        (user.fullname && user.fullname.toLowerCase().includes(search.toLowerCase())) ||
        (user.phone_number && user.phone_number.includes(search));

      return matchDate && matchSlot && matchSearch;
    })
    .slice(0, limit);

  const handleViewPrescription = (booking) => {
    setSelectedBooking(booking);
    setShowPrescriptionModal(true);
  };

  const handleMedicalRecord = (booking) => {
    showToast("Tính năng hồ sơ bệnh án đang phát triển", "info");
  };

  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#20c0f3] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu bệnh nhân...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản Lý Bệnh Nhân</h1>
              <p className="text-gray-600">Danh sách bệnh nhân đã đặt lịch khám</p>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Bộ Lọc Tìm Kiếm
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng hiển thị</label>
              <select 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                value={limit} 
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                {[5, 10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>{n} bệnh nhân</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày khám</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                  placeholder="Tìm theo tên hoặc số điện thoại..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Khung giờ khám</label>
            <div className="flex gap-2 flex-wrap">
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((slot, index) => (
                  <button
                    key={`${slot}-${index}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedSlot === slot
                        ? "bg-[#20c0f3] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedSlot(selectedSlot === slot ? "" : slot)}
                    type="button"
                  >
                    {slot}
                  </button>
                ))
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800">
                  <span className="text-sm">Không có lịch khám trong ngày này</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kết quả tìm kiếm</p>
                <p className="font-semibold text-gray-900">
                  Hiển thị {filtered.length} / {bookings.filter(b => b.schedule?.date_schedule === selectedDate).length} bệnh nhân
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Ngày: {formatDate(selectedDate)}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lý do</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ khám</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium mb-2">Không tìm thấy bệnh nhân</p>
                        <p className="text-gray-400 text-sm">Thử thay đổi ngày hoặc bộ lọc tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, idx) => {
                    const user = item.user || {};
                    const schedule = item.schedule || {};

                    return (
                      <tr key={item.id || idx} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] rounded-full flex items-center justify-center text-white font-semibold mr-3">
                              {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'P'}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.fullname || "—"}</p>
                              <p className="text-xs text-gray-500">Bệnh nhân</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.birthday ? formatDate(user.birthday) : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 font-mono">
                            {user.phone_number || "—"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.gender === 'male' ? 'bg-blue-100 text-blue-800' :
                            user.gender === 'female' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.gender === 'male' ? 'Nam' : user.gender === 'female' ? 'Nữ' : '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div title={user.address} className="truncate">
                            {user.address || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                          <div title={item.reason} className="truncate">
                            {item.reason || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                            {formatTime(schedule.start_time)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewPrescription(item)}
                              className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                              title="Gửi đơn thuốc"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Đơn thuốc
                            </button>
                          
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={showPrescriptionModal}
        onClose={closePrescriptionModal}
        booking={selectedBooking}
        doctorData={doctorData}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontSize: '14px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default PatientBookingList;
