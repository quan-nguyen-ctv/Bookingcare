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

const ListDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    user: "",
    specialty: "",
    image: "",
    experience: "",
    qualification: "",
    bio: ""
  });
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("doctors") || "[]");
    setDoctors(data);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    const newList = doctors.filter(item => item.id !== deleteId);
    setDoctors(newList);
    localStorage.setItem("doctors", JSON.stringify(newList));
    setDeleteId(null);
    showToast("Xóa bác sĩ thành công!", "success");
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({
      user: item.user,
      specialty: item.specialty,
      image: item.image,
      experience: item.experience,
      qualification: item.qualification,
      bio: item.bio
    });
  };

  const handleSave = (id) => {
    const newList = doctors.map(item =>
      item.id === id ? { ...item, ...editData } : item
    );
    setDoctors(newList);
    localStorage.setItem("doctors", JSON.stringify(newList));
    setEditId(null);
    showToast("Chỉnh sửa bác sĩ thành công!", "success");
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
            <th className="border px-3 py-2">Specialty</th>
            <th className="border px-3 py-2">Image</th>
            <th className="border px-3 py-2">Experience</th>
            <th className="border px-3 py-2">Qualification</th>
            <th className="border px-3 py-2">Bio</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((item, idx) => (
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
                    className="border px-2 py-1"
                    value={editData.image}
                    onChange={e => setEditData({ ...editData, image: e.target.value })}
                  />
                ) : (
                  item.image && <img src={item.image} alt={item.user} className="h-10 mx-auto" />
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editData.experience}
                    onChange={e => setEditData({ ...editData, experience: e.target.value })}
                  />
                ) : (
                  item.experience
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editData.qualification}
                    onChange={e => setEditData({ ...editData, qualification: e.target.value })}
                  />
                ) : (
                  item.qualification
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editData.bio}
                    onChange={e => setEditData({ ...editData, bio: e.target.value })}
                  />
                ) : (
                  item.bio
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
          {doctors.length === 0 && (
            <tr>
              <td colSpan={8} className="py-4 text-gray-400">No doctors found.</td>
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

export default ListDoctor;