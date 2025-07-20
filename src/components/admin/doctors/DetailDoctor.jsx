import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DetailDoctor = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    user_id: "",
    user: "",
    specialty_id: "",
    specialty: "",
    avatar: "",
    experience: "",
    qualification: "",
    bio: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [showImageModal, setShowImageModal] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`http://localhost:6868/api/v1/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      setDoctor(result.data || null);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  const handleEditClick = () => {
    setEditData({
     
      user: doctor.user?.fullname || doctor.user?.name || "",
     
      specialty: doctor.specialty?.specialtyName || "",
      avatar: doctor.avatar || "",
      experience: doctor.experience || "",
      qualification: doctor.qualification || "",
      bio: doctor.bio || ""
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const payload = {
       
        user_id: doctor.user.id,
        specialty_id: doctor.specialty?.id,
        avatar: doctor.avatar,
        experience: editData.experience,
        qualification: editData.qualification,
        bio: editData.bio
      };
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
        showToast(errorData.message || "Cập nhật thất bại", "error");
        return;
      }
      showToast("Cập nhật thành công!");
      setEditMode(false);
      // Reload data
      const updated = await res.json();
      setDoctor({
        ...doctor,
        user: { ...doctor.user, fullname: editData.user },
        specialty: { ...doctor.specialty, specialtyName: editData.specialty },
        avatar: editData.image,
        experience: editData.experience,
        qualification: editData.qualification,
        bio: editData.bio,
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
      formData.append("file", newImageFile); // file mới
      formData.append("oldAvatar", doctor.avatar || ""); // ảnh hiện tại

      // API mới theo swagger
      const res = await fetch(`http://localhost:6868/api/v1/images/uploads?doctorId=${id}`, {
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
      setEditData({ ...editData, image: result.image || newImageFile.name });
      setDoctor({ ...doctor, avatar: result.image || newImageFile.name });
      setShowImageModal(false);
      setNewImageFile(null);
    } catch (err) {
      showToast("Lỗi khi cập nhật ảnh", "error");
    }
  };

  if (loading) return <div className="p-8">Đang tải dữ liệu...</div>;
  if (!doctor) return <div className="p-8">Không tìm thấy bác sĩ.</div>;

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
      <h2 className="text-2xl font-bold text-[#223a66] mb-4">Chi tiết bác sĩ</h2>
      <div className="mb-4">
        <strong>User:</strong>{" "}
        {editMode ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={editData.user}
            onChange={e => setEditData({ ...editData, user: e.target.value })}
          />
        ) : (
          doctor.user?.fullname || doctor.user?.name
        )}
      </div>
      <div className="mb-4">
        <strong>Specialty:</strong>{" "}
        {editMode ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={editData.specialty}
            onChange={e => setEditData({ ...editData, specialty: e.target.value })}
          />
        ) : (
          doctor.specialty?.specialtyName
        )}
      </div>
      <div className="mb-4">
        <strong>Ảnh:</strong><br />
        {editMode ? (
          <>
            <input
              className="border px-2 py-1 rounded w-full mb-2"
              value={editData.image}
              onChange={e => setEditData({ ...editData, image: e.target.value })}
              placeholder="Tên file ảnh hoặc đường dẫn"
              readOnly
            />
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
              type="button"
              onClick={() => setShowImageModal(true)}
            >
              Sửa ảnh
            </button>
            {editData.image && (
              <img
                src={`http://localhost:6868/uploads/${editData.image}`}
                alt="avatar"
                className="h-32 rounded mt-2"
              />
            )}
          </>
        ) : (
          doctor.avatar && (
            <img
              src={`http://localhost:6868/uploads/${doctor.avatar}`}
              alt="avatar"
              className="h-32 rounded"
            />
          )
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
      <div className="mb-4">
        <strong>Experience:</strong>{" "}
        {editMode ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={editData.experience}
            onChange={e => setEditData({ ...editData, experience: e.target.value })}
          />
        ) : (
          doctor.experience
        )}
      </div>
      <div className="mb-4">
        <strong>Qualification:</strong>{" "}
        {editMode ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={editData.qualification}
            onChange={e => setEditData({ ...editData, qualification: e.target.value })}
          />
        ) : (
          doctor.qualification
        )}
      </div>
      <div className="mb-4">
        <strong>Bio:</strong>{" "}
        {editMode ? (
          <input
            className="border px-2 py-1 rounded w-full"
            value={editData.bio}
            onChange={e => setEditData({ ...editData, bio: e.target.value })}
          />
        ) : (
          doctor.bio
        )}
      </div>
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

export default DetailDoctor;