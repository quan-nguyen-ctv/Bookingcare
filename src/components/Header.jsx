import React, { useState, useEffect } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaBars, FaTimes, FaUserCircle, FaPhone, FaClock } from "react-icons/fa";
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
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:6868/api/v1/users/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data?.data || null);
        }
      } catch (err) {
        setUser(null);
      }
    };
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAccountMenu(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Contact Info */}
      <div className="bg-gradient-to-r from-[#223a66] to-[#2c4a7a] text-white py-2 px-8 hidden lg:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FaPhone className="text-[#23cf7c]" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-[#23cf7c]" />
              <span>info@medicalcenter.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-[#23cf7c]" />
              <span>Mon - Fri: 7:00 - 17:00</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#23cf7c]" />
            <span>123 Medical Center, Health City</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className={`bg-white/95 backdrop-blur-lg transition-all duration-300 ${
        scrolled ? 'shadow-lg py-3' : 'shadow-md py-4'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/images/logo.png" 
              alt="Medical Center Logo" 
              className={`transition-all duration-300 ${
                scrolled ? 'h-12 w-auto' : 'h-16 w-auto'
              }`} 
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `relative text-[#223a66] font-medium transition-all duration-300 hover:text-[#23cf7c] py-2 ${
                        isActive ? 'text-[#23cf7c]' : ''
                      } group`
                    }
                    end={link.href === "/"}
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#23cf7c] transition-all duration-300 group-hover:w-full"></span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Account & CTA */}
          <div className="flex items-center gap-4">
            {/* Emergency Button */}
            

            {/* Account Menu */}
            <div className="relative">
              {user ? (
                <button
                  className="flex items-center gap-2 text-[#223a66] font-medium focus:outline-none hover:text-[#23cf7c] transition-colors duration-300"
                  onClick={() => setAccountMenu(!accountMenu)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#23cf7c] to-[#20c997] flex items-center justify-center text-white font-semibold">
                    {user?.fullname?.charAt(0)?.toUpperCase() || <FaUserCircle />}
                  </div>
                  <span className="hidden md:block">{user?.fullname}</span>
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="flex items-center gap-2 text-[#223a66] font-medium hover:text-[#23cf7c] transition-colors duration-300"
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="hidden md:block">Login</span>
                </NavLink>
              )}

              {/* Dropdown Menu */}
              {accountMenu && user && (
                <div
                  className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                  onMouseLeave={() => setAccountMenu(false)}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-[#223a66]">{user?.fullname}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-[#223a66] text-sm transition-colors duration-200"
                    onClick={() => setAccountMenu(false)}
                  >
                    <FaUserCircle className="text-[#23cf7c]" />
                    My Profile
                  </NavLink>
                  
                  <NavLink
                    to="/profile/update"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-[#223a66] text-sm transition-colors duration-200"
                    onClick={() => setAccountMenu(false)}
                  >
                    <svg className="w-4 h-4 text-[#23cf7c]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Update Profile
                  </NavLink>
                  
                  <NavLink
                    to="/list-booking"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-[#223a66] text-sm transition-colors duration-200"
                    onClick={() => setAccountMenu(false)}
                  >
                    <svg className="w-4 h-4 text-[#23cf7c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    My Bookings
                  </NavLink>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 text-[#f75757] text-sm transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-[#223a66] text-2xl hover:text-[#23cf7c] transition-colors duration-300"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <img src="/images/logo.png" alt="Logo" className="h-12 w-auto" />
              <button
                className="text-[#223a66] text-2xl hover:text-[#f75757] transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              {/* User info for mobile */}
              {user && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#23cf7c] to-[#20c997] flex items-center justify-center text-white font-semibold text-lg">
                    {user?.fullname?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-[#223a66]">{user?.fullname}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              )}

              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg text-[#223a66] font-medium transition-all duration-300 ${
                          isActive 
                            ? 'bg-[#23cf7c]/10 text-[#23cf7c] border-l-4 border-[#23cf7c]' 
                            : 'hover:bg-gray-50 hover:text-[#23cf7c]'
                        }`
                      }
                      onClick={() => setOpen(false)}
                      end={link.href === "/"}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
                
                {user ? (
                  <>
                    <div className="border-t border-gray-200 my-4" />
                    <li>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-3 rounded-lg text-[#223a66] font-medium hover:bg-gray-50 hover:text-[#23cf7c] transition-all duration-300"
                        onClick={() => setOpen(false)}
                      >
                        My Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/list-booking"
                        className="block px-4 py-3 rounded-lg text-[#223a66] font-medium hover:bg-gray-50 hover:text-[#23cf7c] transition-all duration-300"
                        onClick={() => setOpen(false)}
                      >
                        My Bookings
                      </NavLink>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-lg text-[#f75757] font-medium hover:bg-red-50 transition-all duration-300"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="pt-4">
                    <NavLink
                      to="/login"
                      className="block px-4 py-3 rounded-lg text-center bg-gradient-to-r from-[#23cf7c] to-[#20c997] text-white font-medium"
                      onClick={() => setOpen(false)}
                    >
                      Login / Register
                    </NavLink>
                  </li>
                )}
              </ul>

              {/* Emergency & Booking buttons for mobile */}
              <div className="mt-6 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#f75757] to-[#ff6b6b] text-white px-4 py-3 rounded-lg font-medium">
                  <FaPhone className="animate-pulse" />
                  Emergency Call
                </button>
                <button className="w-full flex items-center justify-center bg-gradient-to-r from-[#23cf7c] to-[#20c997] text-white px-4 py-3 rounded-lg font-medium">
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;