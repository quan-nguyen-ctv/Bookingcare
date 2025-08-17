import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDoctor = () => {
  const [userId, setUserId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [experience, setExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setUserId("");
    setSpecialtyId("");
    setImageFile(null);
    setExperience("");
    setQualification("");
    setBio("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("specialty_id", specialtyId);
    formData.append("experience", experience);
    formData.append("qualification", qualification);
    formData.append("bio", bio);
    formData.append("active", "true");

    if (imageFile) {
      formData.append("avatar", imageFile);
    }

    try {
      const token = localStorage.getItem("admin_token");

      const response = await fetch("http://localhost:6868/api/v1/doctors", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Thêm bác sĩ thành công!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        resetForm();
      } else {
        toast.error(result.message || "Thêm bác sĩ thất bại", {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Lỗi gửi dữ liệu:", error);
      toast.error("Lỗi kết nối đến server. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm Bác Sĩ Mới
          </h2>
          <p className="text-blue-100 mt-2">Điền thông tin chi tiết để thêm bác sĩ vào hệ thống</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                User ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Nhập ID người dùng"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Specialty ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Nhập ID chuyên khoa"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh Bác Sĩ</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#20c0f3] transition-colors duration-200">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="doctor-image"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <label
                htmlFor="doctor-image"
                className="flex flex-col items-center cursor-pointer"
              >
                {imageFile ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="preview"
                      className="h-24 w-24 object-cover rounded-full mx-auto mb-2 border-4 border-[#20c0f3]"
                    />
                    <p className="text-sm text-gray-600">Nhấn để thay đổi ảnh</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-sm text-gray-600">Nhấn để tải ảnh lên</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kinh Nghiệm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Ví dụ: 5 năm kinh nghiệm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bằng Cấp <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200 resize-none"
              rows="3"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="Mô tả bằng cấp và chứng chỉ..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiểu Sử <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200 resize-none"
              rows="4"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Mô tả chi tiết về bác sĩ..."
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
              onClick={resetForm}
              disabled={isLoading}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hủy Bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-[#20c0f3] hover:bg-[#1ba0d1] text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
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
                  Lưu Thông Tin
                </>
              )}
            </button>
          </div>
        </form>
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

export default AddDoctor;
