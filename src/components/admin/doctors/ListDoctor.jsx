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
    user_id: "",
    specialty_id: "",
    avatar: "",
    bio: "",
    experience: "",
    qualification: "",
    active: true,
  });
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2500);
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:6868/api/v1/doctors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setDoctors(data.data?.doctors || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", err);
      showToast("Tải danh sách thất bại", "error");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({
      user_id: item.user?.id || "",
      specialty_id: item.specialty?.id || "",
      avatar: item.avatar,
      bio: item.bio,
      experience: item.experience,
      qualification: item.qualification,
      active: item.active,
    });
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const payload = {
        user_id: Number(editData.user_id),
        specialty_id: Number(editData.specialty_id),
        avatar: editData.avatar,
        bio: editData.bio,
        experience: Number(editData.experience),
        qualification: editData.qualification,
        active: Boolean(editData.active),
      };

      console.log("Payload gửi đi:", payload);

      const res = await fetch(`http://localhost:6868/api/v1/doctors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error:", errorData);
        throw new Error("API trả về lỗi " + res.status);
      }

      showToast("Cập nhật bác sĩ thành công");
      setEditId(null);
      fetchDoctors(); // Reload danh sách
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      showToast("Cập nhật thất bại", "error");
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:6868/api/v1/doctors/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast("Xóa bác sĩ thành công");
      setDeleteId(null);
      fetchDoctors();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      showToast("Xóa thất bại", "error");
    }
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
            <th className="border px-3 py-2">Avatar</th>
            <th className="border px-3 py-2">Experience</th>
            <th className="border px-3 py-2">Qualification</th>
            <th className="border px-3 py-2">Bio</th>
            <th className="border px-3 py-2">Active</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-4 text-gray-400">
                No doctors found.
              </td>
            </tr>
          ) : (
            doctors.map((item, idx) => (
              <tr key={item.id} className="border-b">
                <td className="border px-3 py-2">{idx + 1}</td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <input
                      className="border px-2 py-1 w-full"
                      value={editData.user_id}
                      onChange={(e) => setEditData({ ...editData, user_id: e.target.value })}
                    />
                  ) : (
                    item.user?.fullname
                  )}
                </td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <input
                      className="border px-2 py-1 w-full"
                      value={editData.specialty_id}
                      onChange={(e) => setEditData({ ...editData, specialty_id: e.target.value })}
                    />
                  ) : (
                    item.specialty?.specialtyName || "Chưa có"
                  )}
                </td>
                <td className="border px-3 py-2">
  {editId === item.id ? (
    <input
      className="border px-2 py-1 w-full"
      value={editData.avatar}
      onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
    />
  ) : (
    item.avatar && (
      <img
        src={`http://localhost:6868/uploads/${item.avatar}`}
        alt="Avatar"
        className="h-10 mx-auto"
      />
    )
  )}
</td>

                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <input
                      className="border px-2 py-1 w-full"
                      value={editData.experience}
                      onChange={(e) => setEditData({ ...editData, experience: e.target.value })}
                    />
                  ) : (
                    item.experience
                  )}
                </td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <input
                      className="border px-2 py-1 w-full"
                      value={editData.qualification}
                      onChange={(e) => setEditData({ ...editData, qualification: e.target.value })}
                    />
                  ) : (
                    item.qualification
                  )}
                </td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <input
                      className="border px-2 py-1 w-full"
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    />
                  ) : (
                    item.bio
                  )}
                </td>
                <td className="border px-3 py-2">
                  {editId === item.id ? (
                    <select
                      className="border px-2 py-1 w-full"
                      value={editData.active}
                      onChange={(e) =>
                        setEditData({ ...editData, active: e.target.value === "true" })
                      }
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  ) : (
                    item.active ? "Active" : "Inactive"
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
            ))
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
