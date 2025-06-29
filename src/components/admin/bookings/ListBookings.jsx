import React, { useEffect, useState } from "react";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

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

const ListBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    user: "",
    doctor: "",
    specialty: "",
    date: "",
    time: "",
    status: ""
  });
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    // Lấy dữ liệu khi mount
    const data = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(data);

    // Lắng nghe sự kiện storage (tab khác)
    const handleStorage = () => {
      const data = JSON.parse(localStorage.getItem("bookings") || "[]");
      setBookings(data);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    const newList = bookings.filter(item => item.id !== deleteId);
    setBookings(newList);
    localStorage.setItem("bookings", JSON.stringify(newList));
    setDeleteId(null);
    showToast("Xóa booking thành công!", "success");
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({
      user: item.user,
      doctor: item.doctor,
      specialty: item.specialty,
      date: item.date,
      time: item.time,
      status: item.status
    });
  };

  const handleSave = (id) => {
    const newList = bookings.map(item =>
      item.id === id ? { ...item, ...editData } : item
    );
    setBookings(newList);
    localStorage.setItem("bookings", JSON.stringify(newList));
    setEditId(null);
    showToast("Chỉnh sửa booking thành công!", "success");
  };

  return (
    <div className="overflow-x-auto">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: toast.type })}
        />
      )}
      <table className="min-w-full border text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2">User</th>
            <th className="border px-3 py-2">Phone</th> {/* Thêm cột Phone */}
            <th className="border px-3 py-2">Doctor</th>
            <th className="border px-3 py-2">Specialty</th>
            <th className="border px-3 py-2">Date</th>
            <th className="border px-3 py-2">Time</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((item, idx) => {
            // Lấy phone của user từ localStorage
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const userInfo = users.find(u => u.name === item.user);
            return (
              <tr key={item.id} className="border-b">
                <td className="border px-3 py-2">{idx + 1}</td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <input
                      className="border px-2 py-1"
                      value={editData.user}
                      onChange={e => setEditData({ ...editData, user: e.target.value })}
                    />
                  ) : (
                    item.user
                  )}
                </td>
                <td className="border px-3 py-2">
                  {userInfo ? userInfo.phone : ""}
                </td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <input
                      className="border px-2 py-1"
                      value={editData.doctor}
                      onChange={e => setEditData({ ...editData, doctor: e.target.value })}
                    />
                  ) : (
                    item.doctor
                  )}
                </td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <input
                      className="border px-2 py-1"
                      value={editData.specialty}
                      onChange={e => setEditData({ ...editData, specialty: e.target.value })}
                    />
                  ) : (
                    item.specialty
                  )}
                </td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <input
                      type="date"
                      className="border px-2 py-1"
                      value={editData.date}
                      onChange={e => setEditData({ ...editData, date: e.target.value })}
                    />
                  ) : (
                    item.date
                  )}
                </td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <input
                      className="border px-2 py-1"
                      value={editData.time}
                      onChange={e => setEditData({ ...editData, time: e.target.value })}
                    />
                  ) : (
                    item.time
                  )}
                </td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <select
                      className="border px-2 py-1"
                      value={editData.status}
                      onChange={e => setEditData({ ...editData, status: e.target.value })}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    item.status
                  )}
                </td>
                <td className="border px-3 py-2 space-x-1">
                  {editId === item.id ? (
                    <>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => handleSave(item.id)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-yellow-400 text-white px-2 py-1 rounded"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={9} className="py-4 text-gray-400">No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ListBookings;