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
    name: "",
    email: "",
    birthday: "",
    password: "",
    address: "",
    phone: "",
    gender: "",
    role: "",
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({ ...form, id: Date.now() });
    localStorage.setItem("users", JSON.stringify(users));
    setForm({
      name: "",
      email: "",
      birthday: "",
      password: "",
      address: "",
      phone: "",
      gender: "",
      role: "",
    });
    showToast("Thêm user thành công!", "success");
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
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Address</label>
            <input
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">E-mail</label>
            <input
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-mail"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Contact Number</label>
            <input
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">BirthDay</label>
            <input
              type="date"
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Gender</label>
            <select
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              name="gender"
              value={form.gender}
              onChange={handleChange}
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
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Role</label>
            <select
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="customer">Customer</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div className="col-span-2 flex gap-4 mt-4">
            <button
              type="button"
              className="bg-[#ffc107] hover:bg-yellow-400 text-white font-bold px-6 py-2 rounded"
              onClick={() =>
                setForm({
                  name: "",
                  email: "",
                  birthday: "",
                  password: "",
                  address: "",
                  phone: "",
                  gender: "",
                  role: "",
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