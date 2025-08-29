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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  
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
    
      
      const response = await fetch(`http://localhost:6868/api/v1/time-slots/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("📊 Response status:", response.status); // Debug
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText); // Debug
        throw new Error(`HTTP ${response.status}: Failed to fetch time slot`);
      }

      const data = await response.json();
      console.log("📋 Raw API response:", data); // Debug
      
      // Xử lý response structure
      const slotData = data.data || data;
      console.log("✅ Processed slot data:", slotData); // Debug
      
      setTimeSlot(slotData);
      setFormData({
        duration_minutes: slotData.duration_minutes || slotData.durationMinutes || 30,
        specialty_id: slotData.specialty_id || ""
      });
      
      console.log("💾 State updated with:", {
        timeSlot: slotData,
        formData: {
          duration_minutes: slotData.duration_minutes || slotData.durationMinutes || 30,
          specialty_id: slotData.specialty_id || ""
        }
      }); // Debug
      
    } catch (error) {
      console.error("💥 Error fetching time slot:", error);
      showToast(error.message || "Lỗi khi tải thông tin khung giờ", "error");
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!formData.specialty_id) {
      showToast("Vui lòng chọn chuyên khoa", "error");
      return;
    }

    if (!formData.duration_minutes || formData.duration_minutes <= 0) {
      showToast("Vui lòng nhập thời lượng hợp lệ", "error");
      return;
    }

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Cập nhật khung giờ thất bại");
      }

      showToast("Cập nhật khung giờ thành công!");
      setIsEditing(false);
      
      // Refresh data
      await fetchTimeSlotDetail();

    } catch (error) {
      console.error("Error updating time slot:", error);
      showToast(error.message || "Cập nhật khung giờ thất bại", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (timeSlot) {
      setFormData({
        duration_minutes: timeSlot.durationMinutes || 30,
        specialty_id: timeSlot.specialty_id || ""
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khung giờ này? Hành động này không thể hoàn tác!")) {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`http://localhost:6868/api/v1/time-slots/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          showToast("Xóa khung giờ thành công!");
          setTimeout(() => {
            navigate("/admin/time-slots/list");
          }, 1500);
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error("Error deleting time slot:", error);
        showToast("Không thể xóa khung giờ. Vui lòng thử lại!", "error");
      }
    }
  };

  const getStatusBadge = (active) => {
    return active ? (
      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
        🟢 Kích hoạt
      </span>
    ) : (
      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
        🔴 Tạm dừng
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-600">
            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="font-medium">Đang tải thông tin khung giờ...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!timeSlot) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy khung giờ</h3>
          <p className="text-gray-400 mb-4">Khung giờ này có thể đã bị xóa hoặc không tồn tại.</p>
          <button
            onClick={() => navigate("/admin/time-slots/list")}
            className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/admin/time-slots/list")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại danh sách
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-6 h-6 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Chi Tiết Khung Giờ #{timeSlot.id}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? "Đang chỉnh sửa thông tin khung giờ" : "Xem và quản lý thông tin khung giờ"}
            </p>
          </div
          >
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={isSaving}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] p-6 text-white">
                <h2 className="text-xl font-semibold">Thông Tin Khung Giờ</h2>
                <p className="text-blue-100 mt-1">
                  {isEditing ? "Chỉnh sửa thông tin bên dưới" : "Xem chi tiết thông tin khung giờ"}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ID Khung Giờ</label>
                  <div className="bg-gray-100 px-4 py-3 rounded-lg">
                    <span className="text-gray-800 font-mono">#{timeSlot.id}</span>
                  </div>
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
                          onChange={(e) => handleInputChange('specialty_id', e.target.value)}
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
                    <div className="bg-gray-100 px-4 py-3 rounded-lg">
                      <span className="text-gray-800">{timeSlot.specialty_name || "—"}</span>
                    </div>
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
                        onChange={(e) => handleInputChange('duration_minutes', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                        placeholder="Nhập thời lượng khám..."
                      />
                      
                      {/* Duration Suggestions */}
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Gợi ý thời lượng:</p>
                        <div className="flex flex-wrap gap-2">
                          {[15, 30, 45, 60, 90, 120].map((duration) => (
                            <button
                              key={duration}
                              type="button"
                              onClick={() => handleInputChange('duration_minutes', duration)}
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
                    <div className="bg-gray-100 px-4 py-3 rounded-lg">
                      <span className="text-gray-800 font-semibold">{timeSlot.durationMinutes || "—"} phút</span>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
                  <div>{getStatusBadge(timeSlot.active)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            
            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m14-6v6m4-6v6m-7-7l-4 4m0-8l4-4" />
                </svg>
                Thống Kê Nhanh
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID khung giờ:</span>
                  <span className="font-medium text-gray-800">{timeSlot.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chuyên khoa:</span>
                  <span className="font-medium text-gray-800">
                    {timeSlot.specialty_name || "Chưa xác định"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Thời lượng:</span>
                  <span className="font-medium text-gray-800">
                    {timeSlot.durationMinutes} phút
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số ca/giờ:</span>
                  <span className="font-medium text-gray-800">
                    {timeSlot.durationMinutes ? Math.floor(60 / timeSlot.durationMinutes) : 0} ca
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái:</span>
                  <span className={`font-medium ${timeSlot.active ? 'text-green-600' : 'text-red-600'}`}>
                    {timeSlot.active ? 'Kích hoạt' : 'Tạm dừng'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Người tạo:</span>
                  <span className="font-medium text-gray-800">
                    {timeSlot.created_by || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày tạo:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(timeSlot.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Người sửa:</span>
                  <span className="font-medium text-gray-800">
                    {timeSlot.updated_by || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày sửa:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(timeSlot.updatedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" />
                </svg>
                Ghi Chú
              </h3>
              <div className="text-sm text-gray-600">
                {timeSlot.notes || "Không có ghi chú nào."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Changes (chỉ hiển thị khi đang edit) */}
      {isEditing && formData.specialty_id && formData.duration_minutes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m-1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-yellow-800">Xem trước thay đổi</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-yellow-700">Chuyên khoa mới:</span>
              <span className="font-medium text-yellow-900">
                {specialties.find(s => s.id == formData.specialty_id)?.specialtyName || "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-700">Thời lượng mới:</span>
              <span className="font-medium text-yellow-900">
                {formData.duration_minutes} phút
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-700">Số ca/giờ mới:</span>
              <span className="font-medium text-yellow-900">
                {formData.duration_minutes ? Math.floor(60 / formData.duration_minutes) : 0} ca
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Lịch Sử Hoạt Động
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-green-900">
                Khung giờ được tạo
              </div>
              <div className="text-xs text-green-700 mt-1">
                {new Date(timeSlot.createdAt).toLocaleString("vi-VN")}
              </div>
              <div className="text-xs text-green-600 mt-1">
                Bởi: {timeSlot.created_by || "Hệ thống"}
              </div>
            </div>
          </div>
          
          {timeSlot.updatedAt !== timeSlot.createdAt && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-blue-900">
                  Khung giờ được cập nhật
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {new Date(timeSlot.updatedAt).toLocaleString("vi-VN")}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Bởi: {timeSlot.updated_by || "Hệ thống"}
                </div>
              </div>
            </div>
          )}
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