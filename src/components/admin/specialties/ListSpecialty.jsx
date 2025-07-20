import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const ListSpecialty = () => {
  const [specialties, setSpecialties] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", image: "", desc: "", price: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const fetchSpecialties = async () => {
    try {
      const res = await fetch("http://localhost:6868/api/v1/specialties");
      const result = await res.json();
      setSpecialties(result.data.specialtyList || []);
    } catch (err) {
      console.error("Lỗi khi load specialties:", err);
      showToast("Lỗi khi tải dữ liệu", "error");
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      await fetch(`http://localhost:6868/api/v1/specialties/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast("Xóa chuyên khoa thành công!");
      fetchSpecialties();
      setDeleteId(null);
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      showToast("Xóa thất bại", "error");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({
      name: item.specialtyName,
      image: item.specialtyImage,
      desc: item.description,
      price: item.price,
    });
  };

  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("admin_token");

      const payload = {
        specialty_name: editData.name,
        specialty_image: editData.image,
        description: editData.desc,
        price: Number(editData.price),
      };

      console.log("Payload gửi đi:", payload);

      const res = await fetch(`http://localhost:6868/api/v1/specialties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Nếu không cần token thì bỏ dòng này
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error:", errorData);
        throw new Error("API trả về lỗi 400");
      }

      showToast("Cập nhật thành công");
      setEditId(null);
      fetchSpecialties(); // Reload danh sách nếu có
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      showToast("Cập nhật thất bại", "error");
    }
  };

  const handlePreview = (id) => {
    navigate(`/admin/specialties/${id}`);
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
            <th className="border px-3 py-2">STT</th>
            <th className="border px-3 py-2">Tên</th>
            <th className="border px-3 py-2">Ảnh</th>
            <th className="border px-3 py-2">Mô tả</th>
            <th className="border px-3 py-2">Giá</th>
            <th className="border px-3 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {specialties.map((item, idx) => (
            <tr key={item.id} className="border-b">
              <td className="border px-3 py-2">{idx + 1}</td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  item.specialtyName
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editData.image}
                    onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                  />
                ) : (
                  item.specialtyImage && (
                    <img
                      src={`http://localhost:6868/uploads/${item.specialtyImage}`}
                      alt={item.specialtyName}
                      className="h-10 mx-auto"
                    />
                  )
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    className="border px-2 py-1"
                    value={editData.desc}
                    onChange={(e) => setEditData({ ...editData, desc: e.target.value })}
                  />
                ) : (
                  item.description
                )}
              </td>
              <td className="border px-3 py-2">
                {editId === item.id ? (
                  <input
                    type="number"
                    className="border px-2 py-1"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                  />
                ) : (
                  item.price?.toLocaleString("vi-VN") + " đ"
                )}
              </td>
              <td className="border px-3 py-2 space-x-1">
                {editId === item.id ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleSave(item.id)}
                    >
                      Lưu
                    </button>
                    <button
                      className="bg-gray-400 text-white px-2 py-1 rounded"
                      onClick={() => setEditId(null)}
                    >
                      Hủy
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handlePreview(item.id)}
                    >
                      Xem trước
                    </button>
                    {/* <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded"
                      onClick={() => handleEdit(item)}
                    >
                      Sửa
                    </button> */}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(item.id)}
                    >
                      Xóa
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {specialties.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4 text-gray-400">
                Không có chuyên khoa nào.
              </td>
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

export default ListSpecialty;
