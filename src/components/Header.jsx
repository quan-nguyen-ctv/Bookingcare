import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  // Chỉ giữ các route có thật, hoặc:
{ label: "Medical Services", href: "/medical-services" },
  { label: "Doctors", href: "/doctors" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  // { label: "Login", href: "/login" },
];

const Header = () => {
  const [open, setOpen] = useState(false);

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
          <ul className="flex gap-8 items-center">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  "text-[#223a66] font-medium transition" +
                  (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                }
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  "text-[#223a66] font-medium transition" +
                  (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                }
              >
                About
              </NavLink>
            </li>
               <li>
              <NavLink
                to="/medical-services"
                className={({ isActive }) =>
                  "text-[#223a66] font-medium transition" +
                  (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                }
              >
            Medical Services     
                     </NavLink>
            </li>
               <li>
              <NavLink
                to="/doctors"
                className={({ isActive }) =>
                  "text-[#223a66] font-medium transition" +
                  (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                }
              >
            Doctors     
                     </NavLink>
            </li>
              <li>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  "text-[#223a66] font-medium transition" +
                  (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                }
              >
            BLogs    
                     </NavLink>
            </li>
             <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  "text-[#223a66] font-medium transition" +
                  (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                }
              >
            Contact     
                     </NavLink>
            </li>
              <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  "text-[#223a66] font-medium transition" +
                  (isActive ? " text-[#f75757]" : " hover:text-[#f75757]")
                }
              >
            Login
                     </NavLink>
            </li>
            {/* Các nav item khác giữ nguyên hoặc chuyển sang NavLink nếu muốn */}
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