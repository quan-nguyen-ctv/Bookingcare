import React, { useEffect, useState } from "react";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    // Lấy user đang đăng nhập
    const current = JSON.parse(localStorage.getItem("user"));
    // Lấy danh sách user từ localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    // Tìm user role doctor trùng phone/email với user đăng nhập
    const info =
      users.find(
        (u) =>
          u.role === "doctor" &&
          (u.phone === current?.phone || u.email === current?.email)
      ) || current;
    setDoctor(info);
  }, []);

  if (!doctor) return null;

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Avatar + Basic Info */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <img
            src="/images/doctor-avatar.png"
            alt="Doctor"
            className="w-20 h-20 object-cover rounded-full"
          />
        </div>
        <div className="font-bold text-[#223a66] text-lg mb-2">
          {doctor.name}
        </div>
        <div className="text-gray-500 mb-1">
          <span className="font-semibold">Phone:</span> {doctor.phone}
        </div>
        <div className="text-gray-500 mb-1">
          <span className="font-semibold">Email:</span> {doctor.email}
        </div>
        <div className="text-gray-500 mb-1">
          <span className="font-semibold">Gender:</span>{" "}
          {doctor.gender === "male"
            ? "Male"
            : doctor.gender === "female"
            ? "Female"
            : doctor.gender}
        </div>
        <div className="text-gray-500 mb-1">
          <span className="font-semibold">Birthday:</span> {doctor.birthday}
        </div>
        <div className="text-gray-500 mb-1">
          <span className="font-semibold">Address:</span> {doctor.address}
        </div>
      </div>
      {/* Detail Info */}
      <div className="flex-1 bg-white rounded-xl shadow p-6">
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Doctor:</span>{" "}
          {doctor.name}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Phone:</span>{" "}
          {doctor.phone}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Email:</span>{" "}
          {doctor.email}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Gender:</span>{" "}
          {doctor.gender}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Birthday:</span>{" "}
          {doctor.birthday}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Address:</span>{" "}
          {doctor.address}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Role:</span>{" "}
          {doctor.role}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;