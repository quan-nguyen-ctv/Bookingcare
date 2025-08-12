import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSpecialty = () => {
  const [form, setForm] = useState({
    name: "",
    image: null,
    desc: "",
    price: "",
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("Kích thước file không được vượt quá 5MB", "error");
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast("Vui lòng chọn file hình ảnh", "error");
        return;
      }
    }
    setForm({ ...form, image: file });
  };

  const resetForm = () => {
    setForm({ name: "", image: null, desc: "", price: "" });
    // Reset file input
    const fileInput = document.getElementById('specialty-image');
    if (fileInput) fileInput.value = '';
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      showToast("Vui lòng nhập tên chuyên khoa", "error");
      return false;
    }
    if (!form.image) {
      showToast("Vui lòng chọn hình ảnh chuyên khoa", "error");
      return false;
    }
    if (!form.price || form.price <= 0) {
      showToast("Vui lòng nhập giá hợp lệ", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("specialty_name", form.name);
      formData.append("specialty_image", form.image);
      formData.append("description", form.desc);
      formData.append("price", form.price);

      const token = localStorage.getItem("admin_token");
      if (!token) {
        showToast("Vui lòng đăng nhập để tiếp tục", "error");
        return;
      }

      const res = await fetch("http://localhost:6868/api/v1/specialties", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Không đặt Content-Type cho FormData
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        showToast("Thêm chuyên khoa thành công!");
        resetForm();
      } else {
        throw new Error(result.message || "Tạo chuyên khoa thất bại");
      }
    } catch (err) {
      console.error("Error:", err);
      showToast(err.message || "Lỗi khi thêm chuyên khoa", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Thêm Chuyên Khoa Mới
            </h2>
            <p className="text-blue-100 mt-2">Thêm chuyên khoa y tế vào hệ thống</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Specialty Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên Chuyên Khoa <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                  name="name"
                  placeholder="Nhập tên chuyên khoa"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Specialty Image */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hình Ảnh Chuyên Khoa <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#20c0f3] transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="specialty-image"
                    onChange={handleFileChange}
                    required
                  />
                  <label
                    htmlFor="specialty-image"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    {form.image ? (
                      <div className="text-center">
                        <img
                          src={URL.createObjectURL(form.image)}
                          alt="preview"
                          className="h-32 w-32 object-cover rounded-lg mx-auto mb-2 border-4 border-[#20c0f3]"
                        />
                        <p className="text-sm text-gray-600">Nhấn để thay đổi ảnh</p>
                        <p className="text-xs text-gray-500 mt-1">{form.image.name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600">Nhấn để tải ảnh lên</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (Tối đa 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô Tả</label>
                <textarea
                  name="desc"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Mô tả chi tiết về chuyên khoa..."
                  value={form.desc}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                  placeholder="Nhập giá khám"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200 mt-8">
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
                    Lưu Chuyên Khoa
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

export default AddSpecialty;
