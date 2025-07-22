import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
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

  const token = localStorage.getItem("admin_token");
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2500);
  };

  const fetchDoctors = async () => {
    if (!token) {
      showToast("Vui lòng đăng nhập với quyền admin để xem danh sách", "error");
      return;
    }
    try {
      const res = await axios.get("http://localhost:6868/api/v1/doctors", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const list = res.data.data?.doctors || [];
      console.log("Danh sách bác sĩ:", list);

      // Ghép lại đúng tên trường cho bảng
      const mappedList = list.map(item => ({
        id: item.id,
        user: item.user?.fullname || item.user?.name || "",
        specialty: item.specialty?.specialtyName || "",
        image: item.avatar || "",
        experience: item.experience || "",
        qualification: item.qualification || "",
        bio: item.bio || ""
      }));

      setDoctors(mappedList);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", err);
      showToast("Lỗi khi tải danh sách", "error");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({
      user: item.user,
      specialty: item.specialty,
      image: item.avatar,
      experience: item.experience,
      qualification: item.qualification,
      bio: item.bio
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(
        `http://localhost:6868/api/v1/doctors/${id}`,
        {
          user: editData.user,
          specialty: editData.specialty.specialtyName,
          image: editData.image,
          experience: editData.experience,
qualification: editData.qualification,
          bio: editData.bio
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const updated = doctors.map((doc) =>
        doc.id === id ? { ...doc, ...editData } : doc
      );
      setDoctors(updated);
      setEditId(null);
      showToast("Chỉnh sửa bác sĩ thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      showToast("Lỗi khi cập nhật", "error");
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:6868/api/v1/doctors/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const newList = doctors.filter(item => item.id !== deleteId);
      setDoctors(newList);
      setDeleteId(null);
      showToast("Xóa bác sĩ thành công!");
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
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Specialty</th>
            <th className="border px-3 py-2">Image</th>
            <th className="border px-3 py-2">Experience</th>
            <th className="border px-3 py-2">Qualification</th>
            <th className="border px-3 py-2">Bio</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-4 text-gray-400">No doctors found.</td>
            </tr>
          ) : (
            doctors.map((item, idx) => (
              <tr key={item.id} className="border-b">
                <td className="border px-3 py-2">{idx + 1}</td>
                {["user", "specialty", "image", "experience", "qualification", "bio"].map((field) => (
                  <td key={field} className="border px-3 py-2">
                    {editId === item.id ? (
                      <input
                        className="border px-2 py-1 w-full"
                        value={editData[field]}
                        onChange={e => setEditData({ ...editData, [field]: e.target.value })}
                      />
                    ) : (
                      field === "image" ? (
                        item.image && <img src={`http://localhost:6868/uploads/${item.image}`} alt="img" className="h-10 mx-auto" />
                      ) : (
item[field]
                      )
                    )}
                  </td>
                ))}
                <td className="border px-3 py-2 space-x-1">
                  {editId === item.id ? (
                    <>
                      <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleSave(item.id)}>
                        Save
                      </button>
                      <button className="bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setEditId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => navigate(`/admin/doctors/${item.id}`)}
                      >
                        View
                      </button>
                      {/* <button className="bg-yellow-400 text-white px-2 py-1 rounded" onClick={() => handleEdit(item)}>
                        Edit
                      </button> */}
                      <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(item.id)}>
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