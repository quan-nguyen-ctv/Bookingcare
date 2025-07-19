import React, { useState } from "react";

const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
      ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
    style={{ minWidth: 220 }}
  >
    {message}
    <button
      onClick={onClose}
      className="ml-4 text-white font-bold"
      style={{ background: "transparent", border: "none", cursor: "pointer" }}
    >
      ×
    </button>
  </div>
);

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
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:6868/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          active: true,
          role_id: parseInt(form.role_id),
        }),
      });

      const result = await res.json();
      console.log("Server response:", result);

      if (res.ok && result.status === "success") {
        showToast("Thêm user thành công!");
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
      } else {
        showToast(result.message || "Thêm user thất bại", "error");
      }
    } catch (err) {
      console.error("Lỗi khi gọi API:", err);
      showToast("Lỗi server", "error");
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: toast.type })}
        />
      )}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-8 border">
        <h2 className="text-lg font-bold text-[#20c0f3] mb-6">User Info</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Full Name</label>
            <input
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Full Name"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Address"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">E-mail</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="E-mail"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Phone</label>
            <input
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Phone"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              className="block border border-gray-300 rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="block border border-gray-300 rounded px-3 py-2 w-full"
            >
              <option value="">Select</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Password"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Retype Password</label>
            <input
              type="password"
              name="retype_password"
              value={form.retype_password}
              onChange={handleChange}
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Retype Password"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Role</label>
            <select
              name="role_id"
              value={form.role_id}
              onChange={handleChange}
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              required
            >
              <option value="">Select</option>
              <option value="3">Customer</option>
              <option value="2">Doctor</option>
              <option value="1">Admin</option>
            </select>
          </div>
          <div className="col-span-2 flex gap-4 mt-4">
            <button
              type="button"
              className="bg-[#ffc107] hover:bg-yellow-400 text-white font-bold px-6 py-2 rounded"
              onClick={() =>
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
                })
              }
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="bg-[#007bff] hover:bg-blue-600 text-white font-bold px-6 py-2 rounded"
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
