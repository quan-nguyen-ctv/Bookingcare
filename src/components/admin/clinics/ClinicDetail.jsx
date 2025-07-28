import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    clinic_name: "",
    clinic_image: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showImageModal, setShowImageModal] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`http://localhost:6868/api/v1/clinics/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      setClinic(result.data || null);
      setEditData({
        clinic_name: result.data?.clinicName || "",
        clinic_image: result.data?.clinicImage || "",
        email: result.data?.email || "",
        phone: result.data?.phone || "",
        address: result.data?.address || "",
        description: result.data?.description || "",
        active: !!result.data?.active,
      });
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const payload = {
        clinic_name: editData.clinic_name,
        clinic_image: editData.clinic_image,
        email: editData.email,
        phone: editData.phone,
        address: editData.address,
        description: editData.description,
        active: editData.active,
      };
      const res = await fetch(`http://localhost:6868/api/v1/clinics/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        showToast(errorData.message || "Cập nhật thất bại", "error");
        return;
      }
      showToast("Cập nhật thành công!");
      setEditMode(false);
      // Reload data
      const updated = await res.json();
      setClinic({
        ...clinic,
        ...payload,
      });
    } catch (err) {
      showToast("Lỗi khi cập nhật", "error");
    }
  };

  const handleImageUpload = async () => {
    if (!newImageFile) return;
    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", newImageFile);
      formData.append("oldImage", clinic.clinic_image || "");
      // API upload image cho clinic
      const res = await fetch(`http://localhost:6868/api/v1/images/clinic-upload?clinicId=${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        showToast(result.message || "Cập nhật ảnh thất bại", "error");
        return;
      }
      showToast("Cập nhật ảnh thành công!");
      setEditData({ ...editData, clinic_image: result.image || newImageFile.name });
      setClinic({ ...clinic, clinic_image: result.image || newImageFile.name });
      setShowImageModal(false);
      setNewImageFile(null);
    } catch (err) {
      showToast("Lỗi khi cập nhật ảnh", "error");
    }
  };

  if (loading) return <div className="p-8">Đang tải dữ liệu...</div>;
  if (!clinic) return <div className="p-8">Không tìm thấy phòng khám.</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
            ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
          style={{ minWidth: 220 }}
        >
          {toast.message}
        </div>
      )}
      <h2 className="text-2xl font-bold text-[#223a66] mb-4">Chi tiết phòng khám</h2>
      <div className="mb-4">
        <strong>Tên phòng khám:</strong>{" "}
        {editMode ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={editData.clinic_name}
            onChange={e => setEditData({ ...editData, clinic_name: e.target.value })}
          />
        ) : (
          clinic.clinicName
        )}
      </div>
      <div className="mb-4">
        <strong>Email:</strong>{" "}
        {editMode ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={editData.email}
            onChange={e => setEditData({ ...editData, email: e.target.value })}
          />
        ) : (
          clinic.email
        )}
      </div>
      <div className="mb-4">
        <strong>Số điện thoại:</strong>{" "}
        {editMode ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={editData.phone}
            onChange={e => setEditData({ ...editData, phone: e.target.value })}
          />
        ) : (
          clinic.phone
        )}
      </div>
      <div className="mb-4">
        <strong>Địa chỉ:</strong>{" "}
        {editMode ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={editData.address}
            onChange={e => setEditData({ ...editData, address: e.target.value })}
          />
        ) : (
          clinic.address
        )}
      </div>
     
      <div className="mb-4">
        <strong>Trạng thái:</strong>{" "}
        {editMode ? (
          <select
            className="border px-2 py-1 rounded w-full"
            value={editData.active ? "true" : "false"}
            onChange={e => setEditData({ ...editData, active: e.target.value === "true" })}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        ) : (
          clinic.active ? "Active" : "Inactive"
        )}
      </div>
      <div className="mb-4">
        <strong>Ảnh:</strong><br />
        {(editData.clinic_image || clinic.clinicImage || clinic.clinic_image) && (
          <img
            src={`http://localhost:6868/uploads/${editData.clinic_image || clinic.clinicImage || clinic.clinic_image}`}
            alt="clinic"
            className="h-32 rounded mb-2"
          />
        )}
        {editMode && (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
            type="button"
            onClick={() => setShowImageModal(true)}
          >
            Sửa ảnh
          </button>
        )}
      </div>
      {/* Modal upload file */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Chọn ảnh mới</h3>
            <input
              type="file"
              accept="image/*"
              onChange={e => setNewImageFile(e.target.files[0])}
              className="mb-4"
            />
            {newImageFile && (
              <img
                src={URL.createObjectURL(newImageFile)}
                alt="preview"
                className="h-24 rounded mb-4"
              />
            )}
            <div className="flex gap-3 justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowImageModal(false);
                  setNewImageFile(null);
                }}
              >
                Hủy
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleImageUpload}
                disabled={!newImageFile}
              >
                Lưu ảnh
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-3 mt-6">
        <button
          className="bg-[#223a66] text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
        {!editMode ? (
          <button
            className="bg-yellow-400 text-white px-4 py-2 rounded"
            onClick={handleEditClick}
          >
            Sửa
          </button>
        ) : (
          <>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSave}
            >
              Lưu
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setEditMode(false)}
            >
              Hủy
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClinicDetail;