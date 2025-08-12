import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminHeader from "./AdminHeader";

const adminMenu = [
  { 
    label: "Bảng Điều Khiển", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ), 
    to: "/admin" 
  },
  { 
    label: "Quản Lý Người Dùng", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ), 
    children: [
      { label: "Thêm Người Dùng", to: "/admin/users/add" },
      { label: "Danh Sách Người Dùng", to: "/admin/users/list" },
    ]
  },
  { 
    label: "Quản Lý Phòng Khám", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ), 
    children: [
      { label: "Thêm Phòng Khám", to: "/admin/clinics/add" },
      { label: "Danh Sách Phòng Khám", to: "/admin/clinics/list" }
    ]
  },
  { 
    label: "Quản Lý Chuyên Khoa", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ), 
    children: [
      { label: "Thêm Chuyên Khoa", to: "/admin/specialties/add" },
      { label: "Danh Sách Chuyên Khoa", to: "/admin/specialties/list" }
    ]
  },
  {
    label: "Quản Lý Bác Sĩ", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ), 
    children: [
      { label: "Thêm Bác Sĩ", to: "/admin/doctors/add" },
      { label: "Danh Sách Bác Sĩ", to: "/admin/doctors/list" }
    ]
  },
  {
    label: "Quản Lý Lịch Trình", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ), 
    children: [
      { label: "Thêm Lịch Trình", to: "/admin/schedules/add" },
      { label: "Danh Sách Lịch Trình", to: "/admin/schedules/list" }
    ]
  },
  { 
    label: "Quản Lý Đặt Lịch", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ), 
    children: [
      { label: "Danh Sách Đặt Lịch", to: "/admin/bookings/list" },
      { label: "Thêm Đặt Lịch", to: "/admin/bookings/add" }
    ]
  },
  { 
    label: "Hóa Đơn Hoàn Tiền", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ), 
    to: "/admin/refund-invoice" 
  },
  { 
    label: "Liên Hệ", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ), 
    to: "/admin/contacts/list" 
  },
  { 
    label: "Kho Thuốc", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ), 
    to: "/admin/medications" 
  }
];

const AdminLayout = () => {
  const [openMenus, setOpenMenus] = useState({});
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
    } else {
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
    const token = localStorage.getItem("admin_token");
    if (!token) {
      showToast("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!", "error");
      setTimeout(() => {
        navigate("/admin-login");
      }, 2000);
    }
  }, [navigate]);

  // Auto-expand menu if current path matches
  useEffect(() => {
    const currentPath = location.pathname;
    adminMenu.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => currentPath.startsWith(child.to));
        if (hasActiveChild) {
          setOpenMenus(prev => ({ ...prev, [item.label]: true }));
        }
      }
    });
  }, [location.pathname]);

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isMenuItemActive = (item) => {
    if (item.to) {
      return location.pathname === item.to;
    }
    if (item.children) {
      return item.children.some(child => location.pathname.startsWith(child.to));
    }
    return false;
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">BookingCare</h2>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
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
            {adminMenu.map((item) =>
              item.children ? (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isMenuItemActive(item)
                        ? "bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#20c0f3]"
                    }`}
                    onClick={() => toggleMenu(item.label)}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${isMenuItemActive(item) ? 'text-white' : 'text-gray-500 group-hover:text-[#20c0f3]'}`}>
                        {item.icon}
                      </div>
                      {!sidebarCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>
                    {!sidebarCollapsed && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openMenus[item.label] ? "rotate-180" : ""
                        } ${isMenuItemActive(item) ? 'text-white' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  {openMenus[item.label] && !sidebarCollapsed && (
                    <ul className="ml-6 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <NavLink
                            to={child.to}
                            className={({ isActive }) =>
                              `block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                isActive
                                  ? "bg-[#20c0f3] text-white font-medium"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-[#20c0f3]"
                              }`
                            }
                          >
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
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
                    <div className={`${location.pathname === item.to ? 'text-white' : 'text-gray-500 group-hover:text-[#20c0f3]'}`}>
                      {item.icon}
                    </div>
                    {!sidebarCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#20c0f3] p-2 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Hỗ Trợ Y Tế</p>
                  <p className="text-xs text-gray-600">Chăm sóc sức khỏe tốt nhất</p>
                </div>
              </div>
              <button className="w-full bg-[#20c0f3] hover:bg-[#1ba0d1] text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200">
                Đặt Lịch Khám
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                BookingCare Dashboard
              </p>
              <p className="text-xs text-gray-400 mt-1">
                © 2024 All Rights Reserved
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader />
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

export default AdminLayout;
