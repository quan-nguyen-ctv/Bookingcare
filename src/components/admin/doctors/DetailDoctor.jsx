import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [showImageModal, setShowImageModal] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch(`http://localhost:6868/api/v1/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (res.ok) {
          setDoctor(result.data || null);
        } else {
          showToast("Không thể tải thông tin bác sĩ", "error");
        }
      } catch (error) {
        showToast("Lỗi kết nối đến server", "error");
      } finally {
        setLoading(false);
      }
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
      
      showToast("Cập nhật thông tin bác sĩ thành công!");
      setEditMode(false);
      
      // Update local state
      setDoctor({
        ...doctor,
        experience: editData.experience,
        qualification: editData.qualification,
        bio: editData.bio,
      });
    } catch (err) {
      showToast("Lỗi khi cập nhật thông tin", "error");
    }
  };

  const handleImageUpload = async () => {
    if (!newImageFile) return;
    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", newImageFile);
      formData.append("oldAvatar", doctor.avatar || "");

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
      setEditData({ ...editData, avatar: result.image || newImageFile.name });
      setDoctor({ ...doctor, avatar: result.image || newImageFile.name });
      setShowImageModal(false);
      setNewImageFile(null);
    } catch (err) {
      showToast("Lỗi khi cập nhật ảnh", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium">Đang tải thông tin bác sĩ...</span>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy bác sĩ</h3>
          <p className="text-gray-500">Thông tin bác sĩ không tồn tại hoặc đã bị xóa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Chi Tiết Bác Sĩ
                </h2>
                <p className="text-blue-100 mt-1">Thông tin chi tiết và quản lý bác sĩ</p>
              </div>
              {!editMode && (
                <button
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  onClick={handleEditClick}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh Sửa
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Avatar Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    {doctor.avatar ? (
                      <img
                        src={`http://localhost:6868/uploads/${doctor.avatar}`}
                        alt="Doctor avatar"
                        className="w-48 h-48 rounded-full object-cover border-4 border-[#20c0f3] shadow-lg mx-auto"
                      />
                    ) : (
                      <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300 mx-auto">
                        <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    {editMode && (
                      <button
                        className="absolute bottom-4 right-4 bg-[#20c0f3] hover:bg-[#1ba0d1] text-white p-3 rounded-full shadow-lg transition-colors duration-200"
                        onClick={() => setShowImageModal(true)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mt-4">
                    {doctor.user?.fullname || doctor.user?.name || "Chưa có tên"}
                  </h3>
                  <p className="text-[#20c0f3] font-medium">
                    {doctor.specialty?.specialtyName || "Chưa có chuyên khoa"}
                  </p>
                </div>
              </div>

              {/* Information Section */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Thông Tin Cơ Bản
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Họ Tên</label>
                        {editMode ? (
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                            value={editData.user}
                            onChange={e => setEditData({ ...editData, user: e.target.value })}
                            disabled
                          />
                        ) : (
                          <p className="text-gray-900 bg-white p-3 rounded border">{doctor.user?.fullname || doctor.user?.name || "—"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Chuyên Khoa</label>
                        {editMode ? (
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                            value={editData.specialty}
                            onChange={e => setEditData({ ...editData, specialty: e.target.value })}
                            disabled
                          />
                        ) : (
                          <p className="text-gray-900 bg-white p-3 rounded border">{doctor.specialty?.specialtyName || "—"}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Thông Tin Chuyên Môn
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Kinh Nghiệm</label>
                        {editMode ? (
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                            value={editData.experience}
                            onChange={e => setEditData({ ...editData, experience: e.target.value })}
                          />
                        ) : (
                          <p className="text-gray-900 bg-white p-3 rounded border">{doctor.experience || "—"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bằng Cấp</label>
                        {editMode ? (
                          <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent resize-none"
                            rows="3"
                            value={editData.qualification}
                            onChange={e => setEditData({ ...editData, qualification: e.target.value })}
                          />
                        ) : (
                          <p className="text-gray-900 bg-white p-3 rounded border min-h-[80px]">{doctor.qualification || "—"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tiểu Sử</label>
                        {editMode ? (
                          <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent resize-none"
                            rows="4"
                            value={editData.bio}
                            onChange={e => setEditData({ ...editData, bio: e.target.value })}
                          />
                        ) : (
                          <p className="text-gray-900 bg-white p-3 rounded border min-h-[100px]">{doctor.bio || "—"}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => navigate(-1)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay Lại
              </button>
              
              {editMode ? (
                <div className="flex gap-3">
                  <button
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={() => setEditMode(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hủy
                  </button>
                  <button
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={handleSave}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lưu Thay Đổi
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Cập Nhật Ảnh Bác Sĩ
              </h3>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#20c0f3] transition-colors duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setNewImageFile(e.target.files[0])}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {newImageFile ? (
                    <div>
                      <img
                        src={URL.createObjectURL(newImageFile)}
                        alt="preview"
                        className="h-32 w-32 rounded-full object-cover mx-auto mb-4 border-4 border-[#20c0f3]"
                      />
                      <p className="text-sm text-gray-600">Nhấn để chọn ảnh khác</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <p className="text-sm text-gray-600">Nhấn để chọn ảnh</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex gap-3 justify-end">
              <button
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => {
                  setShowImageModal(false);
                  setNewImageFile(null);
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-[#20c0f3] hover:bg-[#1ba0d1] text-white rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleImageUpload}
                disabled={!newImageFile}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Lưu Ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontSize: '14px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default DetailDoctor;