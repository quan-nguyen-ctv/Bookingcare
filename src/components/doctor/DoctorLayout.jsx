import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoctorHeader from "./DoctorHeader";

const doctorMenu = [
  { 
    label: "Bảng Điều Khiển", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ), 
    to: "/doctor/dashboard" 
  },
  { 
    label: "Quản Lý Bệnh Nhân", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ), 
    to: "/doctor/patients" 
  },
  { 
    label: "Lịch Khám Bệnh", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ), 
    to: "/doctor/schedule" 
  },
  { 
    label: "Cuộc Hẹn", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ), 
    to: "/doctor/appointments" 
  },
  { 
    label: "Lịch Sử Khám", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ), 
    to: "/doctor/history" 
  },
  // { 
  //   label: "Hồ Sơ Bác Sĩ", 
  //   icon: (
  //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  //     </svg>
  //   ), 
  //   to: "/doctor/profile" 
  // },
];

const DoctorLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("doctor_token");
    if (!token) {
      showToast("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!", "error");
      setTimeout(() => {
        navigate("/doctors-login");
      }, 2000);
    }
  }, [navigate]);

  const isMenuItemActive = (to) => {
    return location.pathname === to;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-72'} bg-white border-r border-gray-200 shadow-sm min-h-screen flex flex-col transition-all duration-300`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">BookingCare</h2>
                <p className="text-xs text-gray-500">Doctor Portal</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 text-gray-500 hover:text-[#20c0f3] hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className={`w-5 h-5 transform transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {doctorMenu.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#20c0f3]"
                    }`
                  }
                  title={sidebarCollapsed ? item.label : ''}
                >
                  <div className={`${isMenuItemActive(item.to) ? 'text-white' : 'text-gray-500 group-hover:text-[#20c0f3]'}`}>
                    {item.icon}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#20c0f3] p-2 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Chăm Sóc Y Tế</p>
                  <p className="text-xs text-gray-600">Dịch vụ tốt nhất cho bạn</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/doctor/appointments')}
                className="w-full bg-[#20c0f3] hover:bg-[#1ba0d1] text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
              >
                Xem Cuộc Hẹn
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                BookingCare Doctor Portal
              </p>
              <p className="text-xs text-gray-400 mt-1">
                © 2024 All Rights Reserved
              </p>
            </div>
          </div>
        )}

        {/* Collapsed Footer */}
        {sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
              <div className="bg-[#20c0f3] p-2 rounded-full mx-auto">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <DoctorHeader />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontSize: '14px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default DoctorLayout;