import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const [accountMenu, setAccountMenu] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("admin_user"));

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    setAccountMenu(false);
    navigate("/admin-login");
  };

  return (
    <header className="w-full flex items-center justify-end px-8 py-3 border-b bg-white">
      <div className="flex items-center gap-4">
        {/* Account menu */}
        <div className="relative">
          <button
            className="flex items-center gap-2 text-[#223a66] font-medium focus:outline-none"
            onClick={() => setAccountMenu((v) => !v)}
          >
            <FaUserCircle className="text-2xl" />
            <span>{user?.name || "Admin"}</span>
          </button>
          {accountMenu && user && (
            <div
              className="absolute right-0 mt-2 w-44 bg-white rounded shadow-lg border z-50"
              onMouseLeave={() => setAccountMenu(false)}
            >
              <NavLink
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 text-[#223a66] text-sm"
                onClick={() => setAccountMenu(false)}
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#f75757] text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {/* Các icon khác nếu muốn */}
        {/* <button className="p-2 hover:bg-gray-100 rounded">
          <img src="/images/icon-dashboard.svg" alt="Dashboard" className="h-6 w-6" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <img src="/images/icon-star.svg" alt="Star" className="h-6 w-6" />
        </button> */}
      </div>
    </header>
  );
};

export default AdminHeader;