import React, { useEffect, useState } from "react";
import axios from "axios";

// Helper: format date dd-mm-yyyy
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const PatientBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedSlot, setSelectedSlot] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  // Lấy doctorId từ localStorage (giống DoctorSchedule)
  const doctorData = JSON.parse(localStorage.getItem("doctor_details"));
  const doctorId = doctorData?.id;

  // Fetch schedules cho ngày được chọn
  const fetchSchedulesForDate = async (date) => {
    try {
      const token = localStorage.getItem("doctor_token");
      if (!token || !doctorId) return;

      const res = await fetch(
        `http://localhost:6868/api/v1/schedules/doctor?doctorId=${doctorId}&dateSchedule=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await res.json();
      
      // Sắp xếp lịch theo thời gian bắt đầu (giống DoctorSchedule)
      const sorted = (json?.data || []).sort((a, b) => {
        return new Date(`1970-01-01T${a.start_time}`) - new Date(`1970-01-01T${b.start_time}`);
      });
      
      setSchedules(sorted);
      
      // Tạo time slots từ schedules
      const timeSlots = sorted.map(schedule => 
        `${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}`
      );
      setAvailableTimeSlots(timeSlots);
      
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setSchedules([]);
      setAvailableTimeSlots([]);
    }
  };

  // Fetch all bookings
  const fetchAllBookings = async () => {
    try {
      const token = localStorage.getItem("doctor_token");
      if (!token || !doctorId) return;

      // Lấy tất cả schedules (không filter theo date)
      const scheduleRes = await axios.get(
        `http://localhost:6868/api/v1/schedules/doctor?doctorId=${doctorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allSchedules = scheduleRes.data.data || [];
      const scheduleIds = allSchedules.map((s) => s.id);

      // Lấy bookings cho từng schedule
      const bookingResponses = await Promise.all(
        scheduleIds.map(async (id) => {
          try {
            const res = await axios.get(
              `http://localhost:6868/api/v1/bookings/doctor?scheduleId=${id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Gắn thông tin schedule vào booking
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
      
    } catch (err) {
      console.error("Error loading booking data:", err);
    }
  };

  // Load data khi component mount
  useEffect(() => {
    fetchAllBookings();
  }, [doctorId]);

  // Load schedules khi selectedDate thay đổi
  useEffect(() => {
    fetchSchedulesForDate(selectedDate);
    setSelectedSlot(""); // Reset selected slot khi đổi ngày
  }, [selectedDate, doctorId]);

  // Map start_time và end_time thành time slot format
  const getTimeSlotFromSchedule = (schedule) => {
    if (!schedule || !schedule.start_time || !schedule.end_time) return "";
    return `${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}`;
  };

  // Filter bookings
  const filtered = bookings
    .filter((booking) => {
      const user = booking.user || {};
      const schedule = booking.schedule || {};
      
      // Filter theo date
      const matchDate = schedule.date_schedule === selectedDate;
      
      // Filter theo time slot
      const bookingTimeSlot = getTimeSlotFromSchedule(schedule);
      const matchSlot = selectedSlot ? bookingTimeSlot === selectedSlot : true;
      
      // Filter theo search
      const matchSearch = !search || 
        (user.fullname && user.fullname.toLowerCase().includes(search.toLowerCase())) ||
        (user.phone_number && user.phone_number.includes(search));

      return matchDate && matchSlot && matchSearch;
    })
    .slice(0, limit);

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#223a66] mb-4 flex items-center gap-2">
        Patient <span className="text-base font-normal text-gray-400">• MANAGE PATIENT</span>
      </h2>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Limit</label>
            <select 
              className="border rounded px-2 py-1" 
              value={limit} 
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Date Schedule</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {/* Time slots từ API */}
          <div className="flex gap-2 flex-wrap">
            {availableTimeSlots.length > 0 ? (
              availableTimeSlots.map((slot, index) => (
                <button
                  key={`${slot}-${index}`}
                  className={`px-3 py-1 rounded border text-sm ${
                    selectedSlot === slot
                      ? "bg-[#ffc107] text-white"
                      : "bg-white text-[#223a66] border-gray-300"
                  }`}
                  onClick={() => setSelectedSlot(selectedSlot === slot ? "" : slot)}
                  type="button"
                >
                  {slot}
                </button>
              ))
            ) : (
              <span className="text-gray-500 text-sm">Không có lịch trong ngày này</span>
            )}
          </div>

          <div className="ml-auto">
            <label className="block text-xs font-semibold mb-1">Search</label>
            <input
              type="text"
              className="border rounded px-2 py-1"
              placeholder="Search by name or phone"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Patient's name</th>
                <th className="border px-3 py-2">Birthday</th>
                <th className="border px-3 py-2">Phone number</th>
                <th className="border px-3 py-2">Gender</th>
                <th className="border px-3 py-2">Address</th>
                <th className="border px-3 py-2">Reason</th>
                <th className="border px-3 py-2">Date schedule</th>
                <th className="border px-3 py-2">Start Time</th>
                <th className="border px-3 py-2">Prescription</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-4 text-gray-400">No patients found.</td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const user = item.user || {};
                  const schedule = item.schedule || {};

                  return (
                    <tr key={item.id || idx} className="border-b">
                      <td className="border px-3 py-2">{idx + 1}</td>
                      <td className="border px-3 py-2">{user.fullname || "N/A"}</td>
                      <td className="border px-3 py-2">
                        {user.birthday ? formatDate(user.birthday) : "N/A"}
                      </td>
                      <td className="border px-3 py-2">{user.phone_number || "N/A"}</td>
                      <td className="border px-3 py-2">
                        {user.gender
                          ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                          : "N/A"}
                      </td>
                      <td className="border px-3 py-2" title={user.address}>
                        {user.address
                          ? user.address.length > 25
                            ? user.address.slice(0, 25) + "..."
                            : user.address
                          : "N/A"}
                      </td>
                      <td className="border px-3 py-2">{item.reason || "N/A"}</td>
                      <td className="border px-3 py-2">{schedule.date_schedule || "N/A"}</td>
                      <td className="border px-3 py-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {schedule.start_time}
                        </span>
                      </td>
                      <td className="border px-3 py-2">
                        <button className="text-[#223a66] underline">View</button>
                      </td>
                      <td className="border px-3 py-2">
                        <button className="bg-[#007bff] text-white px-3 py-1 rounded">
                          Medical Exam Record
                        </button>
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
  );
};

export default PatientBookingList;
