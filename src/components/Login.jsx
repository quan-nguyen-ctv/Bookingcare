import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Mock user data
const mockAccounts = [
  { phone: "0123456789", password: "user123", role: "user", name: "User Demo" },
  { phone: "0987654321", password: "doctor123", role: "doctor", name: "Doctor Demo" },
  { phone: "0111222333", password: "admin123", role: "admin", name: "Admin Demo" },
];

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const found = mockAccounts.find(
      (acc) => acc.phone === phone && acc.password === password
    );
    if (found) {
      // Lưu thông tin user vào localStorage/sessionStorage nếu muốn
      localStorage.setItem("user", JSON.stringify(found));
      // Phân luồng theo role
      if (found.role === "admin") navigate("/admin");
      else if (found.role === "doctor") navigate("/doctor");
      else navigate("/");
    } else {
      setError("Sai số điện thoại hoặc mật khẩu!");
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
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Login & Register
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
            <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-2">Login</h2>
            <p className="text-[#6f8ba4] text-sm mb-4">
              Mollitia dicta commodi est recusandae iste, natus eum asperiores corrupti qui velit. Iste dolorum atque similique praesentium soluta.
            </p>
          </div>
          <form className="space-y-2" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Number phone"
              className="w-full p-2 rounded border border-gray-200 focus:outline-none text-sm"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 rounded border border-gray-200 focus:outline-none text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex justify-center mt-2">
              <button
                type="submit"
                className="bg-[#f75757] hover:bg-[#223a66] text-white font-semibold px-8 py-1.5 rounded-xl transition text-sm flex items-center gap-2"
                style={{ minWidth: 90 }}
              >
                LOGIN <span className="ml-1">&#8594;</span>
              </button>
            </div>
          </form>
          <div className="text-left mt-2 text-xs md:text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#223a66] font-semibold hover:underline">
              Register
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;