import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:6868/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: phone,
          password: password,
          role_id: 1 // role_id admin (sửa theo API của bạn)
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Sai thông tin đăng nhập!");
        return;
      }
      const data = await response.json();
      if (data.role !== "admin" || !data.token) {
        setError("Bạn không có quyền truy cập admin!");
        return;
      }
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      navigate("/admin");
    } catch (err) {
      setError("Lỗi hệ thống. Vui lòng thử lại sau!");
    }
  };

  return (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <form className="bg-white shadow rounded p-8 w-full max-w-sm" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold text-[#223a66] mb-4 text-center">Admin Login</h2>
        <input
          type="text"
          placeholder="Phone number"
          className="w-full p-2 mb-3 rounded border border-gray-200"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded border border-gray-200"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-[#223a66] text-white font-semibold py-2 rounded"
        >
          Đăng nhập Admin
        </button>
        <button
          type="button"
          className="w-full bg-gray-300 text-[#223a66] font-semibold py-2 rounded mt-2"
          onClick={() => {
            localStorage.setItem("user", JSON.stringify({ role: "admin", name: "Admin Test" }));
            localStorage.setItem("token", "token_gia_test");
            navigate("/admin");
          }}
        >
          Đăng nhập test admin (token giả)
        </button>
      </form>
    </main>
  );
};

export default AdminLogin;