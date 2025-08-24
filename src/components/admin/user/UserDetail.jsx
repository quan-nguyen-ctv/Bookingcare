import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);
  const [editData, setEditData] = useState({
    fullname: "",
    email: "",
    phone_number: "",
    address: "",
    birthday: "",
    gender: "",
    role_id: 3,
    is_active: true,
    password: "",
    retype_password: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchUserDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          toast.error("Vui lòng đăng nhập để tiếp tục", {
            position: "top-right",
            autoClose: 4000,
          });
          navigate("/admin/login");
          return;
        }

        const res = await fetch(`http://localhost:6868/api/v1/users/get-by-id/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          throw new Error("Không thể tải thông tin người dùng");
        }

        const result = await res.json();
        const userData = result.data || null;
        setUser(userData);
        setOriginalUser(userData);
        setEditData({
          fullname: userData?.fullname || "",
          email: userData?.email || "",
          phone_number: userData?.phone_number || "",
          address: userData?.address || "",
          birthday: userData?.birthday ? userData.birthday.split("T")[0] : "",
          gender: userData?.gender || "",
          role_id: userData?.role?.id || 3,
          is_active: userData?.is_active ?? true,
          password: "",
          retype_password: ""
        });
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Lỗi khi tải thông tin người dùng", {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    if (!editData.fullname.trim()) {
      toast.error("Vui lòng nhập họ tên", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (!editData.email.trim()) {
      toast.error("Vui lòng nhập email", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      toast.error("Email không hợp lệ", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (!editData.phone_number.trim()) {
      toast.error("Vui lòng nhập số điện thoại", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (editData.password && editData.password !== editData.retype_password) {
      toast.error("Mật khẩu xác nhận không khớp", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (editData.password && editData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("admin_token");
      const payload = {
        fullname: editData.fullname,
        email: editData.email,
        phone_number: editData.phone_number,
        address: editData.address,
        birthday: editData.birthday,
        gender: editData.gender,
        role_id: editData.role_id,
        active: editData.is_active,
      };

      // Chỉ thêm password nếu có nhập
      if (editData.password) {
        payload.password = editData.password;
        payload.retype_password = editData.retype_password;
      }
      
      const res = await fetch(`http://localhost:6868/api/v1/users/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        toast.success("Cập nhật người dùng thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        setEditMode(false);
        const updatedUser = { ...user, ...payload, role: { ...user.role, id: payload.role_id } };
        setUser(updatedUser);
        setOriginalUser(updatedUser);
        setEditData(prev => ({ ...prev, password: "", retype_password: "" }));
      } else {
        const errorData = await res.text();
        toast.error(errorData || "Cập nhật thất bại!", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Lỗi kết nối đến server", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (editMode) {
      setEditData({
        fullname: originalUser?.fullname || "",
        email: originalUser?.email || "",
        phone_number: originalUser?.phone_number || "",
        address: originalUser?.address || "",
        birthday: originalUser?.birthday ? originalUser.birthday.split("T")[0] : "",
        gender: originalUser?.gender || "",
        role_id: originalUser?.role?.id || 3,
        is_active: originalUser?.is_active ?? true,
        password: "",
        retype_password: ""
      });
      setEditMode(false);
    } else {
      navigate("/admin/users");
    }
  };

  const getRoleColor = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getRoleLabel = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
        return 'Quản Trì Viên';
      case 'doctor':
        return 'Bác Sĩ';
      case 'user':
        return 'Khách Hàng';
      default:
        return roleName || '—';
    }
  };

  const getGenderDisplay = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      case 'other':
        return 'Khác';
      default:
        return gender || '—';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600">Không tìm thấy người dùng</h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium">Đang tải thông tin người dùng...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy người dùng</h3>
          <p className="text-gray-500">Người dùng không tồn tại hoặc đã bị xóa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Chi Tiết Người Dùng #{id}
                </h2>
                <p className="text-blue-100 mt-1">Xem và cập nhật thông tin người dùng</p>
              </div>
              {!editMode && (
                <button
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  onClick={() => setEditMode(true)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Chỉnh Sửa
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thông Tin Cá Nhân
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Họ Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={editMode ? editData.fullname : user.fullname || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editMode ? editData.email : user.email || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Số Điện Thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={editMode ? editData.phone_number : user.phone_number || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                  />
                </div>

                {/* Birthday */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ngày Sinh
                  </label>
                  {editMode ? (
                    <input
                      type="date"
                      name="birthday"
                      value={editData.birthday}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    />
                  ) : (
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      {formatDate(user.birthday)}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Giới Tính
                  </label>
                  {editMode ? (
                    <select
                      name="gender"
                      value={editData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      {getGenderDisplay(user.gender)}
                    </div>
                  )}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Vai Trò
                  </label>
                  {editMode ? (
                    <select
                      name="role_id"
                      value={editData.role_id}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    >
                      <option value={1}>Quản Trị Viên</option>
                      <option value={2}>Bác Sĩ</option>
                      <option value={3}>Khách Hàng</option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(user.role?.name)}`}>
                        {getRoleLabel(user.role?.name)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Trạng Thái
                  </label>
                  {editMode ? (
                    <select
                      name="is_active"
                      value={editData.is_active ? "true" : "false"}
                      onChange={e => setEditData(prev => ({
                        ...prev,
                        is_active: e.target.value === "true"
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    >
                      <option value="true">Hoạt Động</option>
                      <option value="false">Không Hoạt Động</option>
                    </select>
                  ) : (
                    <div className={`px-4 py-3 border rounded-lg ${
                      user.is_active 
                        ? "bg-green-50 border-green-200 text-green-700" 
                        : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                      <div className="flex items-center gap-2">
                        <svg className={`w-5 h-5 ${user.is_active ? "text-green-600" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {user.is_active ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          )}
                        </svg>
                        <span className="font-medium">
                          {user.is_active ? "Hoạt Động" : "Không Hoạt Động"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address - Full width */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Địa Chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editMode ? editData.address : user.address || ""}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                      editMode 
                        ? "focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent" 
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                    disabled={!editMode}
                    placeholder="Nhập địa chỉ..."
                  />
                </div>

                {/* Password fields - Only show in edit mode */}
                {editMode && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Mật Khẩu Mới
                        <span className="text-sm text-gray-500 font-normal ml-2">(Để trống nếu không đổi)</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={editData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                        placeholder="Nhập mật khẩu mới..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Xác Nhận Mật Khẩu
                      </label>
                      <input
                        type="password"
                        name="retype_password"
                        value={editData.retype_password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                        placeholder="Nhập lại mật khẩu mới..."
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => navigate("/admin/users/list")}
                disabled={saving}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay Lại
              </button>

              <div className="flex gap-3">
                {editMode && (
                  <button
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hủy
                  </button>
                )}
                
                {editMode && (
                  <button
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang Lưu...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Cập Nhật
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
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

export default UserDetail;