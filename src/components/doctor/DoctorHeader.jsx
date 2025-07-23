import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const DoctorHeader = () => {
  const [accountMenu, setAccountMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("doctor_token");
    console.log("Token:", token);
    
    if (!token) return;
    const fetchDoctorDetails = async () => {
      try {
        const res = await fetch("http://localhost:6868/api/v1/users/details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data?.data || null);
          
      localStorage.setItem("doctor_user", JSON.stringify(data));
        }
      } catch {
        setUser(null);
      }
    };
    fetchDoctorDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("doctor_user");
    localStorage.removeItem("doctor_token");
    setAccountMenu(false);
    navigate("/doctors-login");
  };

  return (
    <header className="w-full flex items-center justify-end px-8 py-3 border-b bg-white">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            className="flex items-center gap-2 text-[#223a66] font-medium focus:outline-none"
            onClick={() => setAccountMenu((v) => !v)}
          >
            <FaUserCircle className="text-2xl" />
            <span>{user?.user?.fullname || user?.name || "Doctor"}</span>
          </button>
          {accountMenu && user && (
            <div
              className="absolute right-0 mt-2 w-44 bg-white rounded shadow-lg border z-50"
              onMouseLeave={() => setAccountMenu(false)}
            >
              <NavLink
                to="/doctor/profile"
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
      </div>
    </header>
  );
};

export default DoctorHeader;