import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBooking = () => {
  const [users, setUsers] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");

  const [amount, setAmount] = useState(0);
  const [paymentMethod] = useState("");
  const [paymentCode] = useState(Math.floor(100000 + Math.random() * 900000).toString());
  const [reason] = useState("");
  const [status] = useState("PENDING");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("admin_token");

  const axiosWithToken = axios.create({
    baseURL: "http://localhost:6868/api/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (!token) {
      console.error("❌ Admin token not found.");
      return;
    }

    axiosWithToken
      .get("/users/role?roleName=user")
      .then(res => setUsers(res.data?.data || []))
      .catch(err => console.error("❌ User API error:", err));
  }, [token]);

  useEffect(() => {
    axios.get("http://localhost:6868/api/v1/specialties")
      .then(res => {
        const list = res.data?.data?.specialtyList || [];
        setSpecialties(list);
        if (list.length > 0) {
          setSelectedSpecialty(list[0].id);
        }
      })
      .catch(err => {
        console.error("❌ Specialty API error:", err);
        setSpecialties([]);
      });
  }, []);

  useEffect(() => {
    if (!selectedSpecialty) return;

    axios.get(`http://localhost:6868/api/v1/doctors?specialtyId=${selectedSpecialty}&page=0`)
      .then(res => {
        const list = res.data?.data?.doctors || [];
        setDoctors(list);
        setSelectedDoctor(list[0]?.id || "");
      })
      .catch(err => {
        console.error("❌ Doctor API error:", err);
        setDoctors([]);
      });
  }, [selectedSpecialty]);

  useEffect(() => {
    if (!selectedDoctor || !scheduleDate) return;

    axios.get(`http://localhost:6868/api/v1/schedules/doctor?doctorId=${selectedDoctor}&dateSchedule=${scheduleDate}`)
      .then(res => {
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setSchedules(list);
        if (list.length > 0) setSelectedSchedule(list[0]?.id.toString() || "");
      })
      .catch(err => {
        console.error("❌ Schedule API error:", err);
        setSchedules([]);
      });
  }, [selectedDoctor, scheduleDate]);

  useEffect(() => {
    const selected = schedules.find(s => String(s.id) === selectedSchedule);
    if (selected) {
      setAmount(selected.price || 0);
    }
  }, [selectedSchedule, schedules]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  const token = localStorage.getItem("admin_token"); // ← Thay bằng key bạn lưu token

  try {
    const res = await axios.post(
      "http://localhost:6868/api/v1/bookings",
      {
        schedule_id: Number(selectedSchedule),
        user_id: Number(selectedUser),
        payment_method: paymentMethod,
        payment_code: paymentCode,
        amount: Number(amount),
        reason,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ← TRUYỀN TOKEN Ở ĐÂY
        },
      }
    );

    alert("✅ Đặt lịch thành công!");
    navigate("/admin/bookings/list");
  } catch (err) {
    alert("❌ Lỗi khi đặt lịch!");
    console.error("❌ Booking API error:", err?.response?.data || err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-6 text-center text-[#223a66]">Đặt lịch khám (Admin)</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-1">Người dùng</label>
          <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required className="w-full p-2 border rounded">
            <option value="">-- Chọn user --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.fullname || u.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Chuyên khoa</label>
          <select value={selectedSpecialty} onChange={e => setSelectedSpecialty(e.target.value)} required className="w-full p-2 border rounded">
            {specialties.map(s => (
              <option key={s.id} value={s.id}>{s.specialtyName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Bác sĩ</label>
          <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} required className="w-full p-2 border rounded">
            <option value="">-- Chọn bác sĩ --</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.user?.fullname || "Không rõ tên"}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Ngày khám</label>
          <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} required className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Lịch khám</label>
          <select value={selectedSchedule} onChange={e => setSelectedSchedule(e.target.value)} required className="w-full p-2 border rounded">
            <option value="">-- Chọn lịch --</option>
            {schedules
              .filter(s => s.active && s.number_booked < s.booking_limit)
              .map(s => {
                const date = typeof s.date_schedule === "string" ? s.date_schedule : (s.date_schedule || []).join("-");
                const start = typeof s.start_time === "string" ? s.start_time : (s.start_time || []).join(":");
                const end = typeof s.end_time === "string" ? s.end_time : (s.end_time || []).join(":");
                return (
                  <option key={s.id} value={s.id}>
                    {date} từ {start} đến {end} ({s.booking_limit - s.number_booked} chỗ trống)
                  </option>
                );
              })}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          {loading ? "Đang xử lý..." : "Đặt lịch"}
        </button>
      </form>
    </div>
  );
};

export default AddBooking;
