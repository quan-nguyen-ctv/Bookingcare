import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTimeSlot = () => {
  const [formData, setFormData] = useState({
    duration_minutes: 30,
    specialty_id: ""
  });
  const [specialties, setSpecialties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
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
    fetchSpecialties();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.specialty_id) {
      showToast("Vui lòng chọn chuyên khoa", "error");
      return;
    }

    if (!formData.duration_minutes || formData.duration_minutes <= 0) {
      showToast("Vui lòng nhập thời lượng hợp lệ", "error");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        showToast("Vui lòng đăng nhập để tiếp tục", "error");
        return;
      }

      const payload = {
        duration_minutes: parseInt(formData.duration_minutes),
        specialty_id: parseInt(formData.specialty_id)
      };

      const response = await fetch("http://localhost:6868/api/v1/time-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Tạo khung giờ thất bại");
      }
showToast("Tạo khung giờ thành công!");
      
      // Reset form
      setFormData({
        duration_minutes: 30,
        specialty_id: ""
      });

      // Navigate back to list after 1.5s
      setTimeout(() => {
        navigate("/admin/time-slots/list");
      }, 1500);

    } catch (error) {
      console.error("Error creating time slot:", error);
      showToast(error.message || "Tạo khung giờ thất bại", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/time-slots/list");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-6 h-6 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Thêm Khung Giờ Mới
            </h1>
            <p className="text-gray-600 mt-1">Tạo khung giờ khám bệnh cho chuyên khoa</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] p-6 text-white">
            <h2 className="text-xl font-semibold">Thông Tin Khung Giờ</h2>
            <p className="text-blue-100 mt-1">Vui lòng điền đầy đủ thông tin bên dưới</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Specialty Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chuyên khoa <span className="text-red-500">*</span>
              </label>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-colors"
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Chọn chuyên khoa mà khung giờ này áp dụng</p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thời lượng (phút) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="300"
                  step="5"
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange('duration_minutes', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-colors"
                  placeholder="Nhập thời lượng khám..."
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Thời gian dự kiến cho mỗi ca khám (từ 5 đến 300 phút)</p>
              
              {/* Duration Suggestions */}
              <div className="mt-3">
<p className="text-sm text-gray-600 mb-2">Gợi ý thời lượng phổ biến:</p>
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

            {/* Preview Info */}
            {formData.specialty_id && formData.duration_minutes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-blue-800">Xem trước thông tin</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Chuyên khoa:</span>
                    <span className="font-medium text-blue-900">
                      {specialties.find(s => s.id == formData.specialty_id)?.specialtyName || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Thời lượng:</span>
                    <span className="font-medium text-blue-900">
                      {formData.duration_minutes} phút
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Số ca/giờ:</span>
                    <span className="font-medium text-blue-900">
                      {formData.duration_minutes ? Math.floor(60 / formData.duration_minutes) : 0} ca
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                disabled={isLoading}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#20c0f3] hover:bg-[#1ba0d1] text-white rounded-lg transition-colors duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Tạo Khung Giờ
                  </>
                )}
              </button>
            </div>
          </form>
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

export default AddTimeSlot;