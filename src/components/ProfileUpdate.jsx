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
  FaLock,
  FaCheckCircle,
  FaSpinner,
  FaSave,
  FaTimes,
  FaEdit
} from "react-icons/fa";

// Enhanced Toast component
const Toast = ({ message, type = "success", onClose }) => (
  <div className="fixed top-6 right-6 z-50 animate-slide-in">
    <div className={`flex items-center bg-white border rounded-xl shadow-xl px-6 py-4 min-w-[320px] ${
      type === "success" ? "border-green-400" : "border-red-400"
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
        type === "success" ? "bg-green-100" : "bg-red-100"
      }`}>
        {type === "success" ? (
          <FaCheckCircle className="text-green-600" />
        ) : (
          <FaTimes className="text-red-600" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{message}</p>
        <div className={`h-1 ${type === "success" ? "bg-green-400" : "bg-red-400"} rounded-full mt-2 animate-progress`} />
      </div>
      <button 
        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors" 
        onClick={onClose}
      >
        <FaTimes />
      </button>
    </div>
  </div>
);

const ProfileUpdate = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    birthday: "",
    address: "",
    phone_number: "",
    gender: "",
    password: "",
    retype_password: "",
    role_id: 3,
    active: true,
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setToast({ show: true, message: "Please login to continue", type: "error" });
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:6868/api/v1/users/details", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = res.data.data;
        let birthdayValue = "";
        if (data.birthday && data.birthday.includes("-")) {
          const parts = data.birthday.split("-");
          birthdayValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        setForm({
          fullname: data.fullname || "",
          email: data.email || "",
          birthday: birthdayValue,
          address: data.address || "",
          phone_number: data.phone_number || "",
          gender: data.gender || "",
          password: "",
          retype_password: "",
          role_id: data.role?.id || 3,
          active: data.is_active ?? true,
        });
        setUserId(data.id);
      } catch (err) {
        console.error("Error fetching user:", err);
        setToast({ show: true, message: "Failed to load profile data", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone_number.trim()) newErrors.phone_number = "Phone number is required";
    
    if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (form.password && form.password !== form.retype_password) {
      newErrors.retype_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setToast({ show: true, message: "Please fix the errors below", type: "error" });
      return;
    }

    setUpdating(true);
    const token = localStorage.getItem("token");
    
    if (!token || !userId) {
      setToast({ show: true, message: "Session expired. Please login again", type: "error" });
      setUpdating(false);
      return;
    }

    try {
      await axios.put(`http://localhost:6868/api/v1/users/details/${userId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setToast({ show: true, message: "Profile updated successfully!", type: "success" });
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.error("Error updating user:", err);
      setToast({ show: true, message: "Failed to update profile. Please try again.", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#23cf7c] text-4xl mb-4 mx-auto" />
          <p className="text-[#223a66] text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

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
              Account Settings
            </span>
            <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight mt-2">
              Update <span className="font-bold">Profile</span>
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90">
              Keep your information up to date
            </p>
          </div>
        </div>
      </section>

      {/* Update Form */}
      <section className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center">
                  <FaEdit className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#223a66]">Profile Information</h2>
                  <p className="text-gray-600">Update your personal details</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                    <FaUser className="text-[#23cf7c]" />
                    Full Name *
                  </label>
                  <input
                    className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300 ${
                      errors.fullname ? "border-red-300 focus:ring-red-500" : "border-gray-200"
                    }`}
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                  {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
                </div>

                <div>
                  <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                    <FaEnvelope className="text-[#23cf7c]" />
                    Email Address *
                  </label>
                  <input
                    className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300 ${
                      errors.email ? "border-red-300 focus:ring-red-500" : "border-gray-200"
                    }`}
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                    <FaPhone className="text-[#23cf7c]" />
                    Phone Number *
                  </label>
                  <input
                    className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300 ${
                      errors.phone_number ? "border-red-300 focus:ring-red-500" : "border-gray-200"
                    }`}
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                  {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
                </div>

                <div>
                  <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                    <FaMapMarkerAlt className="text-[#23cf7c]" />
                    Address
                  </label>
                  <input
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                    <FaBirthdayCake className="text-[#23cf7c]" />
                    Birthday
                  </label>
                  <input
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300"
                    name="birthday"
                    value={form.birthday}
                    onChange={handleChange}
                    type="date"
                  />
                </div>

                <div>
                  <label className="block text-[#223a66] font-semibold mb-2 text-sm flex items-center gap-2">
                    {form.gender === 'Female' || form.gender === 'nu' ? 
                      <FaVenus className="text-[#23cf7c]" /> : 
                      <FaMars className="text-[#23cf7c]" />
                    }
                    Gender
                  </label>
                  <select
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Password Section */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold text-[#223a66] mb-6 flex items-center gap-2">
                  <FaLock className="text-[#23cf7c]" />
                  Change Password
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#223a66] font-semibold mb-2 text-sm">
                      New Password
                    </label>
                    <input
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300 ${
                        errors.password ? "border-red-300 focus:ring-red-500" : "border-gray-200"
                      }`}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="Enter new password"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-[#223a66] font-semibold mb-2 text-sm">
                      Confirm Password
                    </label>
                    <input
                      className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300 ${
                        errors.retype_password ? "border-red-300 focus:ring-red-500" : "border-gray-200"
                      }`}
                      name="retype_password"
                      value={form.retype_password}
                      onChange={handleChange}
                      type="password"
                      placeholder="Confirm new password"
                    />
                    {errors.retype_password && <p className="text-red-500 text-xs mt-1">{errors.retype_password}</p>}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => navigate("/profile")}
                  disabled={updating}
                >
                  <FaTimes />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#23cf7c] to-[#20c997] text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfileUpdate;
