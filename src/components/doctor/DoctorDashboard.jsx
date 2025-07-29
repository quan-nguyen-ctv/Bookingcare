import React, { useEffect, useState } from "react";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy userId từ localStorage
    const doctorData = JSON.parse(localStorage.getItem("doctor_user"));
    const userId = doctorData?.data?.id;
    const token = localStorage.getItem("doctor_token");

    if (!userId || !token) return;

    // Gọi API GET /api/v1/doctors/user/{userId}
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:6868/api/v1/doctors/user/${userId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const doctorInfo = data?.data || null;

          setDoctor(doctorInfo);
          localStorage.setItem("doctor_details", JSON.stringify(doctorInfo));

          // ✅ Lưu doctorId vào localStorage
          if (doctorInfo?.id) {
            localStorage.setItem("doctor_id", doctorInfo.id);
            console.log("Doctor ID saved:", doctorInfo.id);
          }
        } else {
          setDoctor(null);
        }
      } catch (error) {
        console.error("Fetch doctor failed:", error);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!doctor) return <div>No doctor data found.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Avatar + Basic Info */}
      <div className="flex flex-col items-center w-full md:w-1/3">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <img
            src={`http://localhost:6868/api/v1/images/view/${doctor.avatar || "default.png"}`}
            alt={doctor.user?.fullname}
            className="w-20 h-20 object-cover rounded-full"
          />
        </div>
        <div className="font-bold text-[#223a66] text-lg mb-2">
          {doctor.user?.fullname}
        </div>
        <div className="text-gray-500 mb-1">
          <span className="font-semibold">Phone:</span> {doctor.user?.phone_number}
        </div>
        <div className="text-gray-500 mb-1">
          <span className="font-semibold">Email:</span> {doctor.user?.email}
        </div>
        <div className="text-gray-500 mb-1">
          <span className="font-semibold">Gender:</span>{" "}
          {doctor.user?.gender === "male"
            ? "Male"
            : doctor.user?.gender === "female"
            ? "Female"
            : doctor.user?.gender}
        </div>
        <div className="text-gray-500 mb-1">
          <span className="font-semibold">Birthday:</span> {doctor.user?.birthday}
        </div>
        <div className="text-gray-500 mb-1">
          <span className="font-semibold">Address:</span> {doctor.user?.address}
        </div>
      </div>

      {/* Detail Info */}
      <div className="flex-1 bg-white rounded-xl shadow p-6">
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Doctor ID:</span>{" "}
          {doctor.id}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Doctor:</span>{" "}
          {doctor.user?.fullname}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Phone:</span>{" "}
          {doctor.user?.phone_number}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Email:</span>{" "}
          {doctor.user?.email}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Gender:</span>{" "}
          {doctor.user?.gender}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Birthday:</span>{" "}
          {doctor.user?.birthday}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Address:</span>{" "}
          {doctor.user?.address}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Role:</span>{" "}
          {doctor.user?.role}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Specialty:</span>{" "}
          {doctor.specialty?.specialtyName}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Experience:</span>{" "}
          {doctor.experience}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Qualification:</span>{" "}
          {doctor.qualification}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-[#223a66]">Bio:</span>{" "}
          {doctor.bio}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
