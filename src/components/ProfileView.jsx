import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBirthdayCake, 
  FaVenus, 
  FaMars,
  FaEdit,
  FaSpinner,
  FaUserCircle,
  FaCalendarAlt,
  FaIdCard
} from "react-icons/fa";

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view your profile");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:6868/api/v1/users/details", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.data) {
          setUser(response.data.data);
        } else {
          setError("Unable to load profile data");
        }
      } catch (err) {
        console.error("Fetch user failed:", err);
        setError("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#23cf7c] text-4xl mb-4 mx-auto" />
          <p className="text-[#223a66] text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUserCircle className="text-gray-400 text-6xl mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Unable to Load Profile</h3>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#23cf7c] text-white px-6 py-2 rounded-full hover:bg-[#20c997] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-[#223a66] to-[#2c4a7a] overflow-hidden mb-12">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/profile-bg.jpg')",
            filter: "brightness(0.3)"
          }}
        />
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
              Account Information
            </span>
            <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight mt-2">
              My <span className="font-bold">Profile</span>
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90">
              Personal information and account details
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              <div className="w-32 h-32 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {user.fullname?.charAt(0)?.toUpperCase() || <FaUserCircle />}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-[#223a66] mb-2">{user.fullname || "User"}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/profile/update")}
                    className="bg-gradient-to-r from-[#23cf7c] to-[#20c997] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <FaEdit />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => navigate("/list-booking")}
                    className="bg-white border-2 border-[#23cf7c] text-[#23cf7c] hover:bg-[#23cf7c] hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                  >
                    <FaCalendarAlt />
                    My Bookings
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#223a66] flex items-center gap-2">
                  <FaUser className="text-[#23cf7c]" />
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                      <FaUser className="text-[#23cf7c]" />
                      Full Name
                    </label>
                    <p className="text-gray-700 font-medium">{user.fullname || "Not specified"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                      <FaBirthdayCake className="text-[#23cf7c]" />
                      Birthday
                    </label>
                    <p className="text-gray-700 font-medium">{formatDate(user.birthday)}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                      {user.gender === 'Female' || user.gender === 'nu' ? 
                        <FaVenus className="text-[#23cf7c]" /> : 
                        <FaMars className="text-[#23cf7c]" />
                      }
                      Gender
                    </label>
                    <p className="text-gray-700 font-medium">{user.gender || "Not specified"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#223a66] flex items-center gap-2">
                  <FaPhone className="text-[#23cf7c]" />
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                      <FaEnvelope className="text-[#23cf7c]" />
                      Email Address
                    </label>
                    <p className="text-gray-700 font-medium break-all">{user.email || "Not specified"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                      <FaPhone className="text-[#23cf7c]" />
                      Phone Number
                    </label>
                    <p className="text-gray-700 font-medium">{user.phone_number || "Not specified"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#23cf7c]" />
                      Address
                    </label>
                    <p className="text-gray-700 font-medium">{user.address || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-[#223a66] mb-6 flex items-center gap-2">
                <FaIdCard className="text-[#23cf7c]" />
                Account Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                  <FaIdCard className="text-blue-600 text-2xl mb-2 mx-auto" />
                  <p className="text-sm font-semibold text-blue-800">User ID</p>
                  <p className="text-blue-600 font-bold">#{user.id}</p>
                </div>

                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                  <FaUser className="text-green-600 text-2xl mb-2 mx-auto" />
                  <p className="text-sm font-semibold text-green-800">Role</p>
                  <p className="text-green-600 font-bold">{user.role?.name || "User"}</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
                  <FaCalendarAlt className="text-purple-600 text-2xl mb-2 mx-auto" />
                  <p className="text-sm font-semibold text-purple-800">Status</p>
                  <p className="text-purple-600 font-bold">
                    {user.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-[#223a66] mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate("/profile/update")}
                  className="bg-white border-2 border-[#23cf7c] text-[#23cf7c] hover:bg-[#23cf7c] hover:text-white p-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3"
                >
                  <FaEdit />
                  Update Profile
                </button>
                <button
                  onClick={() => navigate("/list-booking")}
                  className="bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white p-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3"
                >
                  <FaCalendarAlt />
                  View Bookings
                </button>
                <button
                  onClick={() => navigate("/doctors")}
                  className="bg-white border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white p-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3"
                >
                  <FaUserCircle />
                  Find Doctors
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfileView;
