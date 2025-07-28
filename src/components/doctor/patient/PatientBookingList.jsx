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

const timeSlots = [
  "07:00 - 07:30", "07:30 - 08:00", "08:00 - 08:30", "08:30 - 09:00",
  "09:00 - 09:30", "09:30 - 10:00", "14:00 - 14:30", "14:30 - 15:00",
  "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30", "16:30 - 17:00",
  "17:00 - 17:30", "17:30 - 18:00", "18:00 - 18:30", "18:30 - 19:00",
  "19:00 - 19:30", "19:30 - 20:00", "20:00 - 20:30",
];

const PatientBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedSlot, setSelectedSlot] = useState("");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);

  useEffect(() => {
   const fetchData = async () => {
  try {
    const token = localStorage.getItem("doctor_token");
    if (!token) {
      console.warn("Token not found in localStorage");
      return;
    }

    // ✅ Lấy doctorId từ localStorage
    const doctorId = localStorage.getItem("doctorId");
if (!doctorId) {
  console.warn("Doctor ID not found in localStorage");
  return;
}

    console.log("👨‍⚕️ Doctor ID from localStorage:", doctorId);

    // Gọi API lấy lịch khám theo doctorId
    const scheduleRes = await axios.get(
      `http://localhost:6868/api/v1/schedules/doctor?doctorId=${doctorId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("📅 Schedule API response:", scheduleRes.data);

    const schedules = scheduleRes.data.data || [];
    const scheduleIds = schedules.map((s) => s.id);
    console.log("📌 Schedule IDs:", scheduleIds);

    const bookingResponses = await Promise.all(
  scheduleIds.map(async (id) => {
    try {
      const res = await axios.get(`http://localhost:6868/api/v1/bookings/doctor?scheduleId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`📦 Bookings for schedule ${id}:`, res.data);
      return res;
    } catch (err) {
      console.error(`❌ Lỗi khi gọi API booking với scheduleId=${id}:`, err);
      return null;
    }
  })
);


    const allBookings = bookingResponses.flatMap((res) => res.data.data.bookingList || []);
    console.log("📚 All merged bookings:", allBookings);
    setBookings(allBookings);

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    console.log("🧑‍🤝‍🧑 Loaded users:", storedUsers);
    setUsers(storedUsers);
  } catch (err) {
    console.error("❌ Error loading booking data:", err);
  }
};


    fetchData();
  }, []);

  const filtered = bookings
  // .filter((b) => {
  //   const user = b.user || {};

  //   const matchDate = b.date === selectedDate;
  //   const matchSlot = selectedSlot ? b.slot === selectedSlot : true;
  //   const matchSearch =
  //     !search ||
  //     (user.fullname && user.fullname.toLowerCase().includes(search.toLowerCase())) ||
  //     (user.phone_number && user.phone_number.toLowerCase().includes(search.toLowerCase()));

  //   return matchDate && matchSlot && matchSearch;
  // })
  // .slice(0, limit);


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
          <select className="border rounded px-2 py-1" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            {[10, 20, 50, 100].map((n) => (
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

        <div className="flex gap-2 flex-wrap">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              className={`px-3 py-1 rounded border text-sm ${
                selectedSlot === slot
                  ? "bg-[#ffc107] text-white"
                  : "bg-white text-[#223a66] border-gray-300"
              }`}
              onClick={() => setSelectedSlot(slot)}
              type="button"
            >
              {slot}
            </button>
          ))}
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
              <th className="border px-3 py-2">Prescription</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-4 text-gray-400">No patients found.</td>
              </tr>
            ) : (
              filtered.map((item, idx) => {
                const user = item.user || {};

                return (
                  <tr key={item.id || idx} className="border-b">
                    <td className="border px-3 py-2">{idx + 1}</td>
                    <td className="border px-3 py-2">{user.fullname || "N/A"}</td>
                    <td className="border px-3 py-2">{user.birthday ? formatDate(user.birthday) : "N/A"}</td>
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
