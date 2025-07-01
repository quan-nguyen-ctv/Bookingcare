// import React from "react";
// import { Link } from "react-router-dom";

// const Register = () => (
//   <main className="bg-white min-h-screen">
//     {/* Banner */}
//     <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
//       <div
//         className="absolute inset-0 bg-cover bg-center opacity-20"
//         style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
//       ></div>
//       <div className="relative z-10 text-center">
//         <div className="text-white text-sm mb-1">Account</div>
//         <h1 className="text-3xl md:text-4xl font-bold text-white">
//           Login & Register
//         </h1>
//       </div>
//     </section>
//     {/* Register Form */}
//     <section className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-2">
//       <div className="flex-1 flex justify-center">
//         <img src="/images/login.jpg" alt="Register" className="max-w-xs w-full" />
//       </div>
//       <div className="flex-1 max-w-md mx-auto">
//         <div className="text-center mb-6">
//           <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-2">Register</h2>
//           <p className="text-[#6f8ba4] text-sm">
//             Mollitia dicta commodi est recusandae iste, natus eum asperiores corrupti qui velit. Iste dolorum atque similique praesentium soluta.
//           </p>
//         </div>
//         <form className="space-y-4">
//           <div className="flex gap-4">
//             <input type="text" placeholder="Full Name" className="flex-1 p-3 rounded border border-gray-200 focus:outline-none" />
//             <input type="text" placeholder="Phone Number" className="flex-1 p-3 rounded border border-gray-200 focus:outline-none" />
//           </div>
//           <input type="email" placeholder="Email" className="w-full p-3 rounded border border-gray-200 focus:outline-none" />
//           <input type="password" placeholder="Password" className="w-full p-3 rounded border border-gray-200 focus:outline-none" />
//           <input type="password" placeholder="Repassword" className="w-full p-3 rounded border border-gray-200 focus:outline-none" />
//           <button type="submit" className="bg-[#f75757] hover:bg-[#223a66] text-white font-semibold px-8 py-1.5 rounded-xl transition text-sm flex items-center gap-2 ml-[170px]">
//             REGISTER
//           </button>
//         </form>
//         <div className="text-center mt-4 text-sm">
//           Have already an account?{" "}
//           <Link to="/login" className="text-[#223a66] font-semibold hover:underline">
//             Login
//           </Link>
//         </div>
//       </div>
//     </section>
//   </main>
// );

// export default Register;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phone_number: "",
    email: "",
    password: "",
    retype_password: "",
    address: "",
    birthday: "",
    gender: "nam",       // mặc định
    role_id: 3,          // mặc định role user
    active: true
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.retype_password) {
      setError("Mật khẩu và nhập lại mật khẩu không khớp!");
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
        return;
      }

      // Thành công → chuyển hướng về trang đăng nhập
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError("Lỗi hệ thống. Vui lòng thử lại sau!");
    }
  };

  return (
    <main className="bg-white min-h-screen">
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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Full Name"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                className="flex-1 p-3 rounded border border-gray-200 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="flex-1 p-3 rounded border border-gray-200 focus:outline-none"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-200 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-200 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Re-enter Password"
              name="retype_password"
              value={formData.retype_password}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-200 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-200 focus:outline-none"
            />
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full p-3 rounded border border-gray-200 focus:outline-none"
            />
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

            <button
              type="submit"
              className="bg-[#f75757] hover:bg-[#223a66] text-white font-semibold px-8 py-1.5 rounded-xl transition text-sm flex items-center gap-2 ml-[170px]"
            >
              REGISTER
            </button>
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
