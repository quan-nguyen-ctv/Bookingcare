import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaUserMd, FaUser, FaClinicMedical, FaList, FaCalendarAlt, FaClock, FaMoneyCheckAlt, FaEnvelope } from "react-icons/fa";
import AdminHeader from "./AdminHeader";

const adminMenu = [
  { label: "Dashboard", icon: <FaList />, to: "/admin" },
  { label: "Users", icon: <FaUser />, to: "/admin/users" },
  { label: "Clinics", icon: <FaClinicMedical />, to: "/admin/clinics" },
  { label: "Specialty", icon: <FaList />, to: "/admin/specialty" },
  {
    label: "Doctors", icon: <FaUserMd />, children: [
      { label: "Add Doctor", to: "/admin/doctors/add" },
      { label: "List Doctor", to: "/admin/doctors/list" }
    ]
  },
  {
    label: "Schedules", icon: <FaCalendarAlt />, children: [
      { label: "Time Slots", to: "/admin/schedules/timeslots" }
    ]
  },
  { label: "Bookings", icon: <FaList />, to: "/admin/bookings" },
  { label: "Refund Invoice", icon: <FaMoneyCheckAlt />, to: "/admin/refund-invoice" },
  { label: "Contacts", icon: <FaEnvelope />, to: "/admin/contacts" },
];

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r min-h-screen flex flex-col">
        <div className="flex items-center gap-2 px-4 py-6 border-b">
          <img src="/images/logo.png" alt="Novena" className="h-10" />
        </div>
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {adminMenu.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <div className="flex items-center gap-2 px-3 py-2 font-semibold text-[#223a66]">
                    {item.icon}
                    {item.label}
                  </div>
                  <ul className="ml-7 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <NavLink
                          to={child.to}
                          className={({ isActive }) =>
                            "block px-3 py-1 rounded text-sm " +
                            (isActive ? "bg-[#f75757] text-white" : "hover:bg-gray-100 text-[#223a66]")
                          }
                        >
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.label}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      "flex items-center gap-2 px-3 py-2 rounded font-semibold " +
                      (isActive ? "bg-[#f75757] text-white" : "hover:bg-gray-100 text-[#223a66]")
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-blue-100 rounded-lg p-3 flex flex-col items-center">
            <img src="/images/doctor.png" alt="Make an Appointments" className="h-16 mb-2" />
            <div className="text-xs text-center text-[#223a66] font-semibold mb-1">Make an Appointments</div>
            <div className="text-[10px] text-gray-500 text-center">Best Health Care here</div>
          </div>
          <div className="text-xs text-gray-400 mt-4 text-center">Novena Dashboard<br />© All Rights Reserved</div>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;