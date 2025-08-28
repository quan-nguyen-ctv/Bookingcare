import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  // Validation
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!phone.trim()) {
      errors.phone = "Số điện thoại không được để trống";
    } else if (!validatePhone(phone)) {
      errors.phone = "Số điện thoại phải có 10-11 chữ số";
    }
    
    if (!password.trim()) {
      errors.password = "Mật khẩu không được để trống";
    } else if (password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:6868/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone_number: phone,
          password: password,
          role_id: 3
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Sai thông tin đăng nhập!");
        toast.error(errorData.message || "Sai thông tin đăng nhập!");
        return;
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      toast.success("Đăng nhập thành công!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Lỗi hệ thống. Vui lòng thử lại sau!");
      toast.error("Lỗi hệ thống. Vui lòng thử lại sau!");
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <ToastContainer position="top-right" autoClose={1500} />
      {/* Banner */}
      <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8 mt-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
        ></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Đăng nhập & Đăng ký
          </h1>
        </div>
      </section>

      {/* Login Form */}
      <section className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-2">
        <div className="flex-1 flex justify-center">
          <img src="/images/login.jpg" alt="Login" className="max-w-xs w-full" />
        </div>
        <div className="flex-1 max-w-md mx-auto">
          <div className="text-center mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-2">Đăng nhập</h2>
            <p className="text-[#6f8ba4] text-sm mb-4">
              Vui lòng đăng nhập để sử dụng hệ thống.
            </p>
          </div>
          <form className="space-y-2" onSubmit={handleLogin}>
            <div>
              <input
                type="text"
                placeholder="Số điện thoại"
                className={`w-full p-2 rounded border ${fieldErrors.phone ? 'border-red-500' : 'border-gray-200'} focus:outline-none text-sm`}
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              {fieldErrors.phone && <div className="text-red-500 text-xs mt-1">{fieldErrors.phone}</div>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Mật khẩu"
                className={`w-full p-2 rounded border ${fieldErrors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none text-sm`}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              {fieldErrors.password && <div className="text-red-500 text-xs mt-1">{fieldErrors.password}</div>}
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex justify-center mt-2">
              <button
                type="submit"
                className="bg-[#f75757] hover:bg-[#223a66] text-white font-semibold px-8 py-1.5 rounded-xl transition text-sm flex items-center gap-2"
                style={{ minWidth: 90 }}
              >
                ĐĂNG NHẬP <span className="ml-1">&#8594;</span>
              </button>
            </div>
          </form>
          <div className="text-left mt-2 text-xs md:text-sm">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-[#223a66] font-semibold hover:underline">
              Đăng ký
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
