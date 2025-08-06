import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone_number: "",
    email: "",
    password: "",
    retype_password: "",
    address: "",
    birthday: "",
    gender: "nam",
    role_id: 3,
    active: true
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // Thêm state cho field errors
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullname.trim()) {
      errors.fullname = "Họ tên không được để trống";
    } else if (formData.fullname.length < 2) {
      errors.fullname = "Họ tên phải có ít nhất 2 ký tự";
    }
    
    if (!formData.phone_number.trim()) {
      errors.phone_number = "Số điện thoại không được để trống";
    } else if (!validatePhone(formData.phone_number)) {
      errors.phone_number = "Số điện thoại phải có 10-11 chữ số";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email không được để trống";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Email không hợp lệ";
    }
    
    if (!formData.password.trim()) {
      errors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    if (!formData.retype_password.trim()) {
      errors.retype_password = "Nhập lại mật khẩu không được để trống";
    } else if (formData.password !== formData.retype_password) {
      errors.retype_password = "Mật khẩu không khớp";
    }
    
    if (!formData.address.trim()) {
      errors.address = "Địa chỉ không được để trống";
    }
    
    if (!formData.birthday) {
      errors.birthday = "Ngày sinh không được để trống";
    } else {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 1 || age > 150) {
        errors.birthday = "Tuổi phải từ 1-150";
      }
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      const response = await fetch("http://localhost:6868/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Đăng ký thất bại!");
        toast.error(errorData.message || "Đăng ký thất bại!");
        return;
      }

      toast.success("Đăng ký thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Register error:", err);
      setError("Lỗi hệ thống. Vui lòng thử lại sau!");
      toast.error("Lỗi hệ thống. Vui lòng thử lại sau!");
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={1500} />
      {/* Banner */}
      <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
        ></div>
        <div className="relative z-10 text-center">
          <div className="text-white text-sm mb-1">Account</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Login & Register</h1>
        </div>
      </section>

      {/* Register Form */}
      <section className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-2">
        <div className="flex-1 flex justify-center">
          <img src="/images/login.jpg" alt="Register" className="max-w-xs w-full" />
        </div>
        <div className="flex-1 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-2">Register</h2>
            <p className="text-[#6f8ba4] text-sm">Tạo tài khoản mới để sử dụng hệ thống.</p>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Full Name *"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className={`w-full p-3 rounded border ${fieldErrors.fullname ? 'border-red-500' : 'border-gray-200'} focus:outline-none`}
                />
                {fieldErrors.fullname && <div className="text-red-500 text-xs mt-1">{fieldErrors.fullname}</div>}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Phone Number *"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={`w-full p-3 rounded border ${fieldErrors.phone_number ? 'border-red-500' : 'border-gray-200'} focus:outline-none`}
                />
                {fieldErrors.phone_number && <div className="text-red-500 text-xs mt-1">{fieldErrors.phone_number}</div>}
              </div>
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Email *"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded border ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none`}
              />
              {fieldErrors.email && <div className="text-red-500 text-xs mt-1">{fieldErrors.email}</div>}
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password *"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full p-3 rounded border ${fieldErrors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none`}
              />
              {fieldErrors.password && <div className="text-red-500 text-xs mt-1">{fieldErrors.password}</div>}
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Re-enter Password *"
                name="retype_password"
                value={formData.retype_password}
                onChange={handleChange}
                className={`w-full p-3 rounded border ${fieldErrors.retype_password ? 'border-red-500' : 'border-gray-200'} focus:outline-none`}
              />
              {fieldErrors.retype_password && <div className="text-red-500 text-xs mt-1">{fieldErrors.retype_password}</div>}
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Address *"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-3 rounded border ${fieldErrors.address ? 'border-red-500' : 'border-gray-200'} focus:outline-none`}
              />
              {fieldErrors.address && <div className="text-red-500 text-xs mt-1">{fieldErrors.address}</div>}
            </div>
            
            <div>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className={`w-full p-3 rounded border ${fieldErrors.birthday ? 'border-red-500' : 'border-gray-200'} focus:outline-none`}
              />
              {fieldErrors.birthday && <div className="text-red-500 text-xs mt-1">{fieldErrors.birthday}</div>}
            </div>
            
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-200 focus:outline-none"
            >
              <option value="nam">Nam</option>
              <option value="nữ">Nữ</option>
              <option value="khác">Khác</option>
            </select>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#f75757] hover:bg-[#223a66] text-white font-semibold px-8 py-1.5 rounded-xl transition text-sm flex items-center gap-2"
              >
                REGISTER
              </button>
            </div>
          </form>
          <div className="text-center mt-4 text-sm">
            Have already an account?{" "}
            <Link to="/login" className="text-[#223a66] font-semibold hover:underline">
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
