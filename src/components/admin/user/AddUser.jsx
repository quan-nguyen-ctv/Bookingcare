import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddUser = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    birthday: "",
    password: "",
    retype_password: "",
    address: "",
    phone_number: "",
    gender: "",
    role_id: "",
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

  const resetForm = () => {
    setForm({
      fullname: "",
      email: "",
      birthday: "",
      password: "",
      retype_password: "",
      address: "",
      phone_number: "",
      gender: "",
      role_id: "",
    });
  };

  const validateForm = () => {
    if (!form.fullname.trim()) {
      showToast("Vui lòng nhập họ tên", "error");
      return false;
    }
    if (!form.email.trim()) {
      showToast("Vui lòng nhập email", "error");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      showToast("Email không hợp lệ", "error");
      return false;
    }
    if (!form.phone_number.trim()) {
      showToast("Vui lòng nhập số điện thoại", "error");
      return false;
    }
    if (!/^[0-9]{10,11}$/.test(form.phone_number.replace(/\s/g, ""))) {
      showToast("Số điện thoại không hợp lệ", "error");
      return false;
    }
    if (!form.password) {
      showToast("Vui lòng nhập mật khẩu", "error");
      return false;
    }
    if (form.password.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự", "error");
      return false;
    }
    if (form.password !== form.retype_password) {
      showToast("Mật khẩu xác nhận không khớp", "error");
      return false;
    }
    if (!form.role_id) {
      showToast("Vui lòng chọn vai trò", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        showToast("Vui lòng đăng nhập để tiếp tục", "error");
        return;
      }

      const res = await fetch("http://localhost:6868/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          active: true,
          role_id: parseInt(form.role_id),
        }),
      });

      const result = await res.json();

      if (res.ok && result.status === "success") {
        showToast("Thêm người dùng thành công!");
        resetForm();
      } else {
        throw new Error(result.message || "Thêm người dùng thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      showToast(err.message || "Lỗi kết nối đến server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Thêm Người Dùng Mới
            </h2>
            <p className="text-blue-100 mt-2">
              Tạo tài khoản người dùng mới trong hệ thống
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <svg
                  className="w-5 h-5 text-[#20c0f3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Thông Tin Cá Nhân
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Họ và Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    placeholder="Nhập họ và tên"
                    required
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
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Số Điện Thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                {/* Birthday */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ngày Sinh
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={form.birthday}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Giới Tính
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Vai Trò <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role_id"
                    value={form.role_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="3">Khách Hàng</option>
                    <option value="2">Bác Sĩ</option>
                    <option value="1">Quản Trị Viên</option>
                  </select>
                </div>

                {/* Address - Full width */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Địa Chỉ
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <svg
                  className="w-5 h-5 text-[#20c0f3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Thông Tin Bảo Mật
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mật Khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    placeholder="Nhập mật khẩu"
                    required
                    minLength="6"
                  />
                  <p className="text-xs text-gray-500">
                    Mật khẩu phải có ít nhất 6 ký tự
                  </p>
                </div>

                {/* Retype Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="retype_password"
                    value={form.retype_password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={resetForm}
                disabled={isLoading}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang Lưu...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Lưu Người Dùng
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
          fontSize: "14px",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default AddUser;
