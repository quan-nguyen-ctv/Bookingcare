import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClinicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clinic, setClinic] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [originalClinic, setOriginalClinic] = useState(null);
  const [editData, setEditData] = useState({
    clinicName: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          toast.error("Vui lòng đăng nhập để tiếp tục", {
            position: "top-right",
            autoClose: 4000,
          });
          navigate("/admin/login");
          return;
        }

        const res = await fetch(`http://localhost:6868/api/v1/clinics/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          throw new Error("Không thể tải thông tin phòng khám");
        }

        const result = await res.json();
        const clinicData = result.data || null;
        setClinic(clinicData);
        setOriginalClinic(clinicData);
        setEditData({
          clinicName: clinicData?.clinicName || "",
          email: clinicData?.email || "",
          phone: clinicData?.phone || "",
          address: clinicData?.address || "",
          description: clinicData?.description || "",
          active: !!clinicData?.active,
        });
      } catch (error) {
        console.error("Error fetching clinic:", error);
        toast.error("Lỗi khi tải thông tin phòng khám", {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    if (!editData.clinicName.trim()) {
      toast.error("Vui lòng nhập tên phòng khám", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (!editData.email.trim()) {
      toast.error("Vui lòng nhập email", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      toast.error("Email không hợp lệ", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (!editData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (!editData.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const payload = {
        clinic_name: editData.clinicName,
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
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Cập nhật phòng khám thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        setEditMode(false);
        const updatedClinic = { ...clinic, ...payload };
        setClinic(updatedClinic);
        setOriginalClinic(updatedClinic);
      } else {
        toast.error(data.message || "Cập nhật thất bại!", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (err) {
      console.error("Error updating clinic:", err);
      toast.error("Lỗi kết nối đến server", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async () => {
    if (!newImageFile) return;
    try {
      const token = localStorage.getItem("admin_token");
      const formData = new FormData();
      formData.append("file", newImageFile);
      formData.append("oldImage", clinic.clinicImage || "");
      
      const res = await fetch(`http://localhost:6868/api/v1/images/clinic-upload?clinicId=${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Cập nhật ảnh thất bại", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }
      toast.success("Cập nhật ảnh thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      const updatedClinic = { ...clinic, clinicImage: result.image || newImageFile.name };
      setClinic(updatedClinic);
      setShowImageModal(false);
      setNewImageFile(null);
    } catch (err) {
      toast.error("Lỗi khi cập nhật ảnh", {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleCancel = () => {
    if (editMode) {
      setEditData({
        clinicName: originalClinic?.clinicName || "",
        email: originalClinic?.email || "",
        phone: originalClinic?.phone || "",
        address: originalClinic?.address || "",
        description: originalClinic?.description || "",
        active: !!originalClinic?.active,
      });
      setEditMode(false);
    } else {
      navigate("/admin/clinics/list");
    }
  };

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600">Không tìm thấy phòng khám</h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium">Đang tải thông tin phòng khám...</span>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy phòng khám</h3>
          <p className="text-gray-500">Phòng khám không tồn tại hoặc đã bị xóa</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Chi Tiết Phòng Khám #{id}
                </h2>
                <p className="text-blue-100 mt-1">Xem và cập nhật thông tin phòng khám</p>
              </div>
              {!editMode && (
                <button
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  onClick={() => setEditMode(true)}
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
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thông Tin Phòng Khám
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Clinic Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Tên Phòng Khám <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="clinicName"
                    value={editMode ? editData.clinicName : clinic.clinicName || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editMode ? editData.email : clinic.email || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Số Điện Thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editMode ? editData.phone : clinic.phone || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>

                {/* Active Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Trạng Thái
                  </label>
                  {editMode ? (
                    <select
                      name="active"
                      value={editData.active ? "true" : "false"}
                      onChange={e => setEditData(prev => ({
                        ...prev,
                        active: e.target.value === "true"
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    >
                      <option value="true">Hoạt Động</option>
                      <option value="false">Không Hoạt Động</option>
                    </select>
                  ) : (
                    <div className={`px-4 py-3 border rounded-lg ${
                      clinic.active 
                        ? "bg-green-50 border-green-200 text-green-700" 
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                      <div className="flex items-center gap-2">
                        <svg className={`w-5 h-5 ${clinic.active ? "text-green-600" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {clinic.active ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                        <span className="font-medium">
                          {clinic.active ? "Hoạt Động" : "Không Hoạt Động"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address - Full width */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Địa Chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editMode ? editData.address : clinic.address || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>

                {/* Description - Full width */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mô Tả
                  </label>
                  <textarea
                    name="description"
                    value={editMode ? editData.description : clinic.description || ""}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                    placeholder="Nhập mô tả về phòng khám..."
                  />
                </div>

                {/* Clinic Image - Full width */}
                {/* <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Hình Ảnh Phòng Khám
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4">
                    {clinic.clinicImage ? (
                      <div className="flex items-start gap-4">
                        <img
                          src={`http://localhost:6868/uploads/${clinic.clinicImage}`}
                          alt="clinic"
                          className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-2">Hình ảnh hiện tại</p>
                          {editMode && (
                            <button
                              type="button"
                              onClick={() => setShowImageModal(true)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Thay Đổi Ảnh
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-500">Chưa có hình ảnh</p>
                          {editMode && (
                            <button
                              type="button"
                              onClick={() => setShowImageModal(true)}
                              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                            >
                              Thêm Ảnh
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => navigate("/admin/clinics/list")}
                disabled={saving}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay Lại
              </button>

              <div className="flex gap-3">
                {editMode && (
                  <button
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hủy
                  </button>
                )}
                
                {editMode && (
                  <button
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang Lưu...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Cập Nhật
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Chọn Ảnh Mới</h3>
            <input
              type="file"
              accept="image/*"
              onChange={e => setNewImageFile(e.target.files[0])}
              className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
            />
            {newImageFile && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Xem trước:</p>
                <img
                  src={URL.createObjectURL(newImageFile)}
                  alt="preview"
                  className="h-32 w-full object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
                onClick={() => {
                  setShowImageModal(false);
                  setNewImageFile(null);
                }}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleImageUpload}
                disabled={!newImageFile}
              >
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

export default ClinicDetail;