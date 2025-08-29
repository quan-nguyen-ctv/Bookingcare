import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetailTimeSlot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [timeSlot, setTimeSlot] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [originalTimeSlot, setOriginalTimeSlot] = useState(null);
  
  const [formData, setFormData] = useState({
    duration_minutes: 30,
    specialty_id: ""
  });

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

  // Fetch time slot detail
  const fetchTimeSlotDetail = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      
      if (!token) {
        showToast("Vui lòng đăng nhập để tiếp tục", "error");
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`http://localhost:6868/api/v1/time-slots/${id}`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          showToast("Phiên đăng nhập đã hết hạn", "error");
          navigate("/admin/login");
          return;
        }
        if (response.status === 404) {
          showToast("Không tìm thấy khung giờ", "error");
          return;
        }
        throw new Error("Không thể tải thông tin khung giờ");
      }

      const data = await response.json();
      const slotData = data.data || data;
      
      setTimeSlot(slotData);
      setOriginalTimeSlot(slotData);
      setFormData({
        duration_minutes: slotData.durationMinutes || slotData.duration_minutes || 30,
        specialty_id: slotData.specialty_id || ""
      });
      
    } catch (error) {
      console.error("Error fetching time slot:", error);
      showToast("Lỗi khi tải thông tin khung giờ", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specialties
  const fetchSpecialties = async () => {
    setLoadingSpecialties(true);
    try {
const response = await fetch("http://localhost:6868/api/v1/specialties");
      if (!response.ok) {
        throw new Error("Failed to fetch specialties");
      }
      const data = await response.json();
      setSpecialties(data.data?.specialtyList || []);
    } catch (error) {
      console.error("Error fetching specialties:", error);
      showToast("Lỗi khi tải danh sách chuyên khoa", "error");
    } finally {
      setLoadingSpecialties(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTimeSlotDetail();
      fetchSpecialties();
    }
  }, [id]);

  const handleEditClick = () => {
    setFormData({
      duration_minutes: timeSlot.durationMinutes || timeSlot.duration_minutes || 30,
      specialty_id: timeSlot.specialty_id || ""
    });
    setIsEditing(true);
  };

  const validateForm = () => {
    if (!formData.specialty_id) {
      showToast("Vui lòng chọn chuyên khoa", "error");
      return false;
    }

    if (!formData.duration_minutes || formData.duration_minutes <= 0) {
      showToast("Vui lòng nhập thời lượng hợp lệ", "error");
      return false;
    }

    if (formData.duration_minutes < 5 || formData.duration_minutes > 300) {
      showToast("Thời lượng phải từ 5 đến 300 phút", "error");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const payload = {
        duration_minutes: parseInt(formData.duration_minutes),
        specialty_id: parseInt(formData.specialty_id)
      };

      const response = await fetch(`http://localhost:6868/api/v1/time-slots/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Cập nhật khung giờ thành công!");
        setIsEditing(false);
        await fetchTimeSlotDetail();
      } else {
        showToast(data.message || "Cập nhật thất bại!", "error");
      }
    } catch (error) {
      console.error("Error updating time slot:", error);
      showToast("Lỗi kết nối đến server", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>
          <span className="font-medium">Đang tải thông tin khung giờ...</span>
        </div>
      </div>
    );
  }

  if (!timeSlot) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy khung giờ</h3>
          <p className="text-gray-500">Khung giờ không tồn tại hoặc đã bị xóa</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Chi Tiết Khung Giờ
                </h2>
                <p className="text-blue-100 mt-1">Xem và cập nhật thông tin khung giờ</p>
              </div>
              {!isEditing && (
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
              {/* Icon Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-48 h-48 rounded-lg bg-gradient-to-br from-[#20c0f3] to-[#1ba0d1] flex items-center justify-center border-4 border-[#20c0f3] shadow-lg mx-auto">
<svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mt-4">
                    Khung Giờ #{timeSlot.id}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {timeSlot.durationMinutes || timeSlot.duration_minutes || 0} phút
                  </p>
                </div>
              </div>

              {/* Information Section */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Thông Tin Khung Giờ
                    </h4>
                    
                    <div className="space-y-4">
                      {/* ID */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          ID Khung Giờ
                        </label>
                        <p className="text-gray-900 bg-white p-3 rounded border">
                          #{timeSlot.id}
                        </p>
                      </div>

                      {/* Specialty */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Chuyên khoa <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            {loadingSpecialties ? (
                              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 flex items-center">
                                <div className="animate-spin w-4 h-4 border-2 border-[#20c0f3] border-t-transparent rounded-full mr-2"></div>
                                <span className="text-gray-500">Đang tải chuyên khoa...</span>
                              </div>
                            ) : (
                              <select
                                value={formData.specialty_id}
                                onChange={(e) => setFormData({ ...formData, specialty_id: e.target.value })}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                                required
                              >
                                <option value="">Chọn chuyên khoa</option>
                                {specialties.map((specialty) => (
                                  <option key={specialty.id} value={specialty.id}>
                                    {specialty.specialtyName}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-900 bg-white p-3 rounded border">
                            {timeSlot.specialty_name || "Chưa xác định"}
                          </p>
                        )}
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Thời lượng (phút) <span className="text-red-500">*</span>
                        </label>
                        {isEditing ? (
                          <div>
                            <input
                              type="number"
                              min="5"
                              max="300"
                              step="5"
                              value={formData.duration_minutes}
                              onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                              placeholder="Nhập thời lượng khám..."
                            />
                            {/* Duration Suggestions */}
                            <div className="mt-3">
                              <p className="text-sm text-gray-600 mb-2">Gợi ý thời lượng phổ biến:</p>
                              <div className="flex flex-wrap gap-2">
                                {[15, 30, 45, 60, 90, 120].map((duration) => (
                                  <button
                                    key={duration}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, duration_minutes: duration })}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                      formData.duration_minutes == duration
                                        ? 'bg-[#20c0f3] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
>
                                    {duration} phút
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-900 bg-white p-3 rounded border">
                            {timeSlot.durationMinutes || timeSlot.duration_minutes || "—"} phút
                          </p>
                        )}
                      </div>

                      {/* Efficiency */}
                    

                      {/* Status */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Trạng Thái
                        </label>
                        <div className={`p-3 rounded border ${
                          timeSlot.active 
                            ? "bg-green-50 border-green-200 text-green-700" 
                            : "bg-red-50 border-red-200 text-red-700"
                        }`}>
                          <div className="flex items-center gap-2">
                            <svg className={`w-4 h-4 ${timeSlot.active ? "text-green-600" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {timeSlot.active ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              )}
                            </svg>
                            <span className="font-medium">
                              {timeSlot.active ? "Hoạt Động" : "Không Hoạt Động"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Created At */}
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Changes */}
            {isEditing && formData.specialty_id && formData.duration_minutes && (
              <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-semibold text-yellow-800">Xem trước thay đổi</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
<div className="text-sm">
                    <span className="text-yellow-700 font-medium">Chuyên khoa mới:</span>
                    <p className="text-yellow-900 font-semibold">
                      {specialties.find(s => s.id == formData.specialty_id)?.specialtyName || "—"}
                    </p>
                  </div>
                  <div className="text-sm">
                    <span className="text-yellow-700 font-medium">Thời lượng mới:</span>
                    <p className="text-yellow-900 font-semibold">{formData.duration_minutes} phút</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-yellow-700 font-medium">Hiệu suất mới:</span>
                    <p className="text-yellow-900 font-semibold">
                      {formData.duration_minutes ? Math.floor(60 / formData.duration_minutes) : 0} ca/giờ
                    </p>
                  </div>
                </div>
              </div>
            )}

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
              
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hủy
                  </button>
                  <button
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
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
                        Lưu Thay Đổi
                      </>
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

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

export default DetailTimeSlot;