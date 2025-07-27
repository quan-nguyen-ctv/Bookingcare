import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import DoctorHeader from "./DoctorHeader";
import { FaUserMd, FaCalendarAlt, FaHistory } from "react-icons/fa";

const doctorMenu = [
  { label: "Manage Doctor's Patient", icon: <FaUserMd />, to: "/doctor/patients" },
  { label: "Doctor's Dashboard", icon: <FaCalendarAlt />, to: "/doctor/dashboard" },
  { label: "View Doctor's Schedule", icon: <FaCalendarAlt />, to: "/doctor/schedule" },
  { label: "History", icon: <FaHistory />, to: "/doctor/history" },
];

const DoctorLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("doctor_token");
    if (!token) {
      navigate("/doctor-login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
        <div className="flex items-center gap-2 px-4 py-6 border-b">
          <img src="/images/logo.png" alt="Novena" className="h-10" />
        </div>
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {doctorMenu.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    "flex items-center gap-2 px-3 py-2 rounded font-semibold " +
                    (isActive ? "bg-[#223a66] text-white" : "hover:bg-gray-100 text-[#223a66]")
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-blue-100 rounded-lg p-3 flex flex-col items-center">
            <img src="/images/doctor.png" alt="Make an Appointments" className="h-16 mb-2" />
            <div className="text-xs text-center text-[#223a66] font-semibold mb-1">
              Make an Appointments
            </div>
            <div className="text-[10px] text-gray-500 text-center">
              Best Health Care here
            </div>
          </div>
          <div className="text-xs text-gray-400 mt-4 text-center">
            Novena Dashboard
            <br />
            © All Rights Reserved
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <DoctorHeader />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;