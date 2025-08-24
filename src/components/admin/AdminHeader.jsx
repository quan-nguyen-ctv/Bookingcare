import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminHeader = () => {
  const [accountMenu, setAccountMenu] = useState(false);
  const [notificationsMenu, setNotificationsMenu] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin_user"));

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

  const handleLogout = () => {
    try {
      localStorage.removeItem("admin_user");
      localStorage.removeItem("admin_token");
      setAccountMenu(false);
      showToast("Đăng xuất thành công!");

      // Delay navigation to show toast
      setTimeout(() => {
        navigate("/admin-login");
      }, 1000);
    } catch (error) {
      console.error("Error during logout:", error);
      showToast("Có lỗi xảy ra khi đăng xuất", "error");
    }
  };

  const handleProfileClick = () => {
    setAccountMenu(false);
    showToast("Chức năng đang phát triển", "info");
  };

  // Mock notifications for demonstration
  const notifications = [
    {
      id: 1,
      title: "Cuộc hẹn mới",
      message: "Bạn có 3 cuộc hẹn mới cần xác nhận",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      title: "Người dùng mới",
      message: "5 người dùng mới đã đăng ký",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: 3,
      title: "Báo cáo hệ thống",
      message: "Báo cáo tuần đã sẵn sàng",
      time: "2 giờ trước",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side - Logo/Brand */}
          <div className="flex items-center">
            <NavLink
              to="/admin"
              className="flex items-center gap-3 text-[#20c0f3] hover:text-[#1ba0d1] transition-colors"
            >
              <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] p-2 rounded-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">BookingCare</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </NavLink>
          </div>

          {/* Right side - Actions and User Menu */}
          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            {/* <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/admin/users/add")}
                className="p-2 text-gray-600 hover:text-[#20c0f3] hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Thêm người dùng"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </button>

              <button
                onClick={() => navigate("/admin/specialties/add")}
                className="p-2 text-gray-600 hover:text-[#20c0f3] hover:bg-blue-50 rounded-lg transition-colors duration-200"
                title="Thêm chuyên khoa"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </button>
            </div> */}

            {/* Notifications */}
            {/* <div className="relative">
              <button
                className="relative p-2 text-gray-600 hover:text-[#20c0f3] hover:bg-blue-50 rounded-lg transition-colors duration-200"
                onClick={() => setNotificationsMenu(!notificationsMenu)}
                title="Thông báo"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM10.586 7.414L14 4l5 5-3.586 3.586M7 17l4.586-4.586M2 2l20 20"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636L12 12m6.364-6.364a9 9 0 010 12.728m0-12.728L5.636 18.364a9 9 0 1012.728 0L5.636 5.636a9 9 0 0112.728 0z"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsMenu && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                  onMouseLeave={() => setNotificationsMenu(false)}
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Thông báo</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                !notification.read ? "bg-blue-500" : "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {notification.title}
                              </h4>
                              <p className="text-gray-600 text-sm mt-1">
                                {notification.message}
                              </p>
                              <p className="text-gray-400 text-xs mt-2">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <svg
                          className="w-12 h-12 text-gray-300 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M15 17h5l-5 5v-5z"
                          />
                        </svg>
                        <p className="text-gray-500">Không có thông báo mới</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-4 border-t border-gray-200">
                      <button className="w-full text-center text-[#20c0f3] hover:text-[#1ba0d1] font-medium text-sm">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div> */}

            {/* Search */}
            {/* <div className="hidden lg:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div> */}

            {/* User Account Menu */}
            <div className="relative">
              <button
                className="flex items-center gap-3 p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none"
                onClick={() => setAccountMenu(!accountMenu)}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="font-medium text-sm">{user?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "admin@bookingcare.com"}
                  </p>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {accountMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                  onMouseLeave={() => setAccountMenu(false)}
                >
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-medium text-gray-900">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user?.email || "admin@bookingcare.com"}
                    </p>
                  </div>

                  <div className="py-2">
                    {/* <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-gray-700">Hồ sơ cá nhân</span>
                    </button>

                    <button
                      onClick={() => {
                        setAccountMenu(false);
                        showToast("Chức năng đang phát triển", "info");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-gray-700">Cài đặt</span>
                    </button> */}

                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="text-red-600">Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
          fontSize: "14px",
          borderRadius: "8px",
        }}
      />
    </>
  );
};

export default AdminHeader;