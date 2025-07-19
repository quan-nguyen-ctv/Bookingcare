import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Toast component
const Toast = ({ message, onClose }) => (
  <div className="fixed top-6 right-6 z-50">
    <div className="flex items-center bg-white border border-green-400 rounded shadow px-4 py-2 min-w-[280px]">
      <span className="text-green-600 text-xl mr-2">✔️</span>
      <span className="flex-1 text-sm text-gray-800">{message}</span>
      <button className="ml-2 text-gray-400 hover:text-gray-600" onClick={onClose}>×</button>
    </div>
    <div className="h-1 bg-green-400 animate-pulse mt-1 rounded" style={{ width: "90%" }} />
  </div>
);

const ProfileUpdate = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    birthday: "",
    address: "",
    phone_number: "",
    gender: "",
    password: "",
    retype_password: "",
    role_id: 3,  // default user role
    active: true,
  });
  const [toast, setToast] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://localhost:6868/api/v1/users/details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const data = res.data.data;
        // Convert birthday to yyyy-MM-dd if needed
        let birthdayValue = "";
        if (data.birthday && data.birthday.includes("-")) {
          const parts = data.birthday.split("-");
          birthdayValue = `${parts[2]}-${parts[1]}-${parts[0]}`; // dd-MM-yyyy => yyyy-MM-dd
        }

        setForm({
          fullname: data.fullname || "",
          email: data.email || "",
          birthday: birthdayValue,
          address: data.address || "",
          phone_number: data.phone_number || "",
          gender: data.gender || "",
          password: "",
          retype_password: "",
          role_id: data.role?.id || 3,
          active: data.is_active ?? true,
        });
        setUserId(data.id);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !userId) return;

    axios.put(`http://localhost:6868/api/v1/users/details/${userId}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setToast(true);
        setTimeout(() => {
          setToast(false);
          navigate("/profile");
        }, 1800);
      })
      .catch((err) => {
        console.error("Error updating user:", err);
      });
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {toast && (
        <Toast
          message="Update profile successfully."
          onClose={() => setToast(false)}
        />
      )}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-8 border">
        <h2 className="text-2xl font-bold text-[#223a66] mb-2 flex items-center gap-2">
          Profile <span className="text-base font-normal text-gray-400">• Update Profile</span>
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6" onSubmit={handleUpdate}>
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              className="border rounded px-3 py-2 w-full"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Address</label>
            <input
              className="border rounded px-3 py-2 w-full"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">E-mail</label>
            <input
              className="border rounded px-3 py-2 w-full"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Number</label>
            <input
              className="border rounded px-3 py-2 w-full"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">BirthDay</label>
            <input
              className="border rounded px-3 py-2 w-full"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              type="date"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Gender</label>
            <select
              className="border rounded px-3 py-2 w-full"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="nam">Male</option>
              <option value="nu">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Password</label>
            <input
              className="border rounded px-3 py-2 w-full"
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Retype Password</label>
            <input
              className="border rounded px-3 py-2 w-full"
              name="retype_password"
              value={form.retype_password}
              onChange={handleChange}
              type="password"
              required
            />
          </div>
          <div className="col-span-2 flex gap-4 mt-8">
            <button
              type="button"
              className="bg-[#ffc107] hover:bg-yellow-400 text-white font-bold px-6 py-2 rounded"
              onClick={() => navigate("/profile")}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="bg-[#007bff] hover:bg-blue-600 text-white font-bold px-6 py-2 rounded"
            >
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;
