import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [originalSchedule, setOriginalSchedule] = useState(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchScheduleDetail = async () => {
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

        const res = await fetch(`http://localhost:6868/api/v1/schedules/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error("Không thể tải thông tin lịch khám");
        }

        const data = await res.json();
        const scheduleData = data.data || null;
        setSchedule(scheduleData);
        setOriginalSchedule(scheduleData);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        toast.error("Lỗi khi tải thông tin lịch khám", {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSchedule(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    if (!schedule.date_schedule) {
      toast.error("Vui lòng chọn ngày khám", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (!schedule.start_time || !schedule.end_time) {
      toast.error("Vui lòng nhập đầy đủ thời gian khám", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (schedule.start_time >= schedule.end_time) {
      toast.error("Thời gian kết thúc phải sau thời gian bắt đầu", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (!schedule.price || schedule.price <= 0) {
      toast.error("Giá khám phải lớn hơn 0", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (!schedule.booking_limit || schedule.booking_limit <= 0) {
      toast.error("Giới hạn đặt lịch phải lớn hơn 0", {
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
      const res = await fetch(`http://localhost:6868/api/v1/schedules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(schedule)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Cập nhật lịch khám thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        setEditMode(false);
        setOriginalSchedule(schedule);
      } else {
        toast.error(data.message || "Cập nhật thất bại!", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (err) {
      console.error("Error updating schedule:", err);
      toast.error("Lỗi kết nối đến server", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (editMode) {
      setSchedule(originalSchedule);
      setEditMode(false);
    } else {
      navigate("/admin/schedules");
    }
  };

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600">Không tìm thấy lịch khám</h3>
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
          <span className="font-medium">Đang tải thông tin lịch khám...</span>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy lịch khám</h3>
          <p className="text-gray-500">Lịch khám không tồn tại hoặc đã bị xóa</p>
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
                  Chi Tiết Lịch Khám #{id}
                </h2>
                <p className="text-blue-100 mt-1">Xem và cập nhật thông tin lịch khám</p>
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
                Thông Tin Lịch Khám
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    ID Bác Sĩ
                  </label>
                  <input
                    type="number"
                    name="doctor_id"
                    value={schedule.doctor_id || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Clinic ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    ID Phòng Khám
                  </label>
                  <input
                    type="number"
                    name="clinic_id"
                    value={schedule.clinic_id || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Date Schedule */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ngày Khám <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_schedule"
                    value={schedule.date_schedule || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Giá Khám (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={schedule.price || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                    min="0"
                    step="1000"
                  />
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Giờ Bắt Đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    value={schedule.start_time?.slice(0,5) || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Giờ Kết Thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    value={schedule.end_time?.slice(0,5) || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>

                {/* Booking Limit */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Giới Hạn Đặt Lịch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="booking_limit"
                    value={schedule.booking_limit || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                    min="1"
                    max="50"
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
                      value={schedule.active ? "true" : "false"}
                      onChange={e => setSchedule(prev => ({
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
                      schedule.active 
                        ? "bg-green-50 border-green-200 text-green-700" 
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                      <div className="flex items-center gap-2">
                        <svg className={`w-5 h-5 ${schedule.active ? "text-green-600" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {schedule.active ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                        <span className="font-medium">
                          {schedule.active ? "Hoạt Động" : "Không Hoạt Động"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => navigate("/admin/schedules/list")}
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

export default ScheduleDetail;