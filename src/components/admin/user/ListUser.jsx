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

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    birthday: "",
    password: "",
    address: "",
    phone: "",
    gender: "",
    role: "",
  });
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(data);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    const newList = users.filter(item => item.id !== deleteId);
    setUsers(newList);
    localStorage.setItem("users", JSON.stringify(newList));
    setDeleteId(null);
    showToast("Xóa user thành công!", "success");
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({
      name: item.name,
      email: item.email,
      birthday: item.birthday,
      password: item.password,
      address: item.address,
      phone: item.phone,
      gender: item.gender,
      role: item.role,
    });
  };

  const handleSave = (id) => {
    const newList = users.map(item =>
      item.id === id ? { ...item, ...editData } : item
    );
    setUsers(newList);
    localStorage.setItem("users", JSON.stringify(newList));
    setEditId(null);
    showToast("Chỉnh sửa user thành công!", "success");
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
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Birthday</th>
            <th className="border px-3 py-2">Address</th>
            <th className="border px-3 py-2">Phone</th>
            <th className="border px-3 py-2">Gender</th>
            <th className="border px-3 py-2">Role</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item, idx) => (
            <tr key={item.id} className="border-b">
              <td className="border px-3 py-2">{idx + 1}</td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editData.email}
                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                  />
                ) : (
                  item.email
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    type="date"
                    className="border px-2 py-1"
                    value={editData.birthday}
                    onChange={e => setEditData({ ...editData, birthday: e.target.value })}
                  />
                ) : (
                  item.birthday
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editData.address}
                    onChange={e => setEditData({ ...editData, address: e.target.value })}
                  />
                ) : (
                  item.address
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editData.phone}
                    onChange={e => setEditData({ ...editData, phone: e.target.value })}
                  />
                ) : (
                  item.phone
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <select
                    className="border px-2 py-1"
                    value={editData.gender}
                    onChange={e => setEditData({ ...editData, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                ) : (
                  item.gender
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <select
                    className="border px-2 py-1"
                    value={editData.role}
                    onChange={e => setEditData({ ...editData, role: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="customer">Customer</option>
                    <option value="doctor">Doctor</option>
                  </select>
                ) : (
                  item.role
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
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={9} className="py-4 text-gray-400">No users found.</td>
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

export default ListUser;