import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const DoctorLogin = () => {
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
          role_id: 2,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        setError(data.message || "Sai thông tin đăng nhập!");
        return;
      }

      const token = data.token;
      localStorage.setItem("doctor_token", token);

      // Decode token để lấy userId
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Gọi API để lấy doctorId bằng userId
      const doctorRes = await fetch(`http://localhost:6868/api/v1/doctors/user/${userId}`, {
         method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const doctorData = await doctorRes.json();
      console.log("✅ Dữ liệu từ API /doctors/user/{userId}:", doctorData);
      
      if (!doctorRes.ok || !doctorData.data?.id) {
        setError("Không tìm thấy thông tin bác sĩ.");
        return;
      }

      const doctorId = doctorData.data.id;
      localStorage.setItem("doctorId", doctorId);

      navigate("/doctor/patients");
    } catch (err) {
      console.error("Lỗi:", err);
      setError("Lỗi hệ thống. Vui lòng thử lại sau!");
    }
  };

  return (
    <main className="bg-white min-h-screen flex items-center justify-center">
      <form className="bg-white shadow rounded p-8 w-full max-w-sm" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold text-[#223a66] mb-4 text-center">Doctor Login</h2>
        <input
          type="text"
          placeholder="Phone number"
          className="w-full p-2 mb-3 rounded border border-gray-200"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded border border-gray-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}
        <button
          type="submit"
          className="w-full bg-[#223a66] text-white p-2 rounded hover:bg-[#1d2a4d] transition"
        >
          Đăng nhập
        </button>
      </form>
    </main>
  );
};

export default DoctorLogin;
