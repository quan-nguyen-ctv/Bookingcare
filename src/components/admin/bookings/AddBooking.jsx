import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
      ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
    style={{ minWidth: 220 }}
  >
    {message}
    <button
      onClick={onClose}
      className="ml-4 text-white font-bold"
      style={{ background: "transparent", border: "none", cursor: "pointer" }}
    >
      ×
    </button>
  </div>
);

const AddBooking = () => {
  const [user, setUser] = useState("");
  const [doctor, setDoctor] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setDoctors(JSON.parse(localStorage.getItem("doctors") || "[]"));
    setSpecialties(JSON.parse(localStorage.getItem("specialties") || "[]"));
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(allUsers.filter(u => u.role !== "doctor"));
  }, []);

  // Lọc doctor theo specialty đã chọn
  const filteredDoctors = specialty
    ? doctors.filter(d => d.specialty === specialty)
    : doctors;

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push({
      id: Date.now(),
      user,
      doctor,
      specialty,
      date,
      time,
      status: "pending"
    });
    localStorage.setItem("bookings", JSON.stringify(bookings));
    setUser("");
    setDoctor("");
    setSpecialty("");
    setDate("");
    setTime("");
    showToast("Đặt lịch thành công!", "success");
    setTimeout(() => {
      navigate("/admin/bookings/list");
    }, 1200); // Đợi toast hiện xong rồi chuyển trang
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: toast.type })}
        />
      )}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-8 border">
        <h2 className="text-lg font-bold text-[#20c0f3] mb-6">Add Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">User</label>
            <select
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              value={user}
              onChange={e => setUser(e.target.value)}
              required
            >
              <option value="">Select User</option>
              {users.map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Specialty</label>
            <select
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              value={specialty}
              onChange={e => {
                setSpecialty(e.target.value);
                setDoctor(""); // reset doctor khi đổi chuyên ngành
              }}
              required
            >
              <option value="">Select Specialty</option>
              {specialties.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Doctor</label>
            <select
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              value={doctor}
              onChange={e => setDoctor(e.target.value)}
              required
              disabled={!specialty}
            >
              <option value="">Select Doctor</option>
              {filteredDoctors.map(d => (
                <option key={d.id} value={d.user}>{d.user}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Date</label>
            <input
              type="date"
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Time</label>
            <input
              type="time"
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              className="bg-[#ffc107] hover:bg-yellow-400 text-white font-bold px-6 py-2 rounded"
              onClick={() => {
                setUser("");
                setDoctor("");
                setSpecialty("");
                setDate("");
                setTime("");
              }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="bg-[#007bff] hover:bg-blue-600 text-white font-bold px-6 py-2 rounded"
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBooking;