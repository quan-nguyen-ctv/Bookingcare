import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Medical Services", href: "/medical-services" },
  { label: "Doctors", href: "/list-doctor" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },

  
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const [accountMenu, setAccountMenu] = useState(false);
  const navigate = useNavigate();

  // Lấy user từ localStorage (nếu đã đăng nhập)
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    setAccountMenu(false);
    navigate("/login");
  };

  return (
    <header>
      {/* Top bar */}
      {/* <div className="bg-[#223a66] text-white text-sm flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FaEnvelope className="inline-block" /> support@novena.com
          </span>
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt className="inline-block" /> Address: Số 5 Tôn Thất Thuyết
          </span>
        </div>
        <div>
          Call Now : <span className="font-bold">823-4565-13456</span>
        </div>
      </div> */}
      {/* Logo & Navigation */}
      <div className="bg-white flex items-center justify-between px-8 py-4 shadow relative">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Novena Logo" className="h-15 w-35" />
         
        </div>
        {/* Desktop Nav */}
        <nav className="flex-1 justify-center hidden md:flex">
          <ul className="flex gap-12 items-center">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    "text-[#223a66] font-medium transition" +
                    (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                  }
                  end={link.href === "/"}
                >
                  {link.label}
                </NavLink>
              </li>
              
            ))}
           
            {/* Account menu */}
            <li className="relative ml-[435px]">
              {user ? (
                <button
                  className="flex items-center gap-2 text-[#223a66] font-medium focus:outline-none"
                  onClick={() => setAccountMenu((v) => !v)}
                >
                  <FaUserCircle className="text-2xl" />
                  <span>{user.name || "Account"}</span>
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    "text-[#223a66] font-medium transition" +
                    (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                  }
                >
                  <FaUserCircle className="inline-block text-xl mr-1" />
                  Login
                </NavLink>
              )}

              
              {/* Dropdown menu */}
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
                  <NavLink
                    to="/profile/update"
                    className="block px-4 py-2 hover:bg-gray-100 text-[#223a66] text-sm"
                    onClick={() => setAccountMenu(false)}
                  >
                    Update Profile
                  </NavLink>
                  <NavLink
                    to="/list-booking"
                    className="block px-4 py-2 hover:bg-gray-100 text-[#223a66] text-sm"
                    onClick={() => setAccountMenu(false)}
                  >
                    List Booking
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#f75757] text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-auto text-[#223a66] text-2xl"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
        {/* Mobile Nav Drawer */}
        {open && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
            <div className="bg-white w-64 h-full shadow-lg p-6 flex flex-col">
              <button
                className="self-end mb-6 text-2xl text-[#223a66]"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
              <ul className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        "text-[#223a66] font-medium transition" +
                        (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                      }
                      onClick={() => setOpen(false)}
                      end={link.href === "/"}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
                {/* Account menu for mobile */}
                {user ? (
                  <>
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 text-[#223a66] text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/profile/update"
                      className="block px-4 py-2 hover:bg-gray-100 text-[#223a66] text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Update Profile
                    </NavLink>
                    <NavLink
                      to="/list-booking"
                      className="block px-4 py-2 hover:bg-gray-100 text-[#223a66] text-sm"
                      onClick={() => setOpen(false)}
                    >
                      List Booking
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#f75757] text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      "text-[#223a66] font-medium transition" +
                      (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                    }
                    onClick={() => setOpen(false)}
                  >
                    <FaUserCircle className="inline-block text-xl mr-1" />
                    Login
                  </NavLink>
                )}
              </ul>
            </div>
            <div className="flex-1" onClick={() => setOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;