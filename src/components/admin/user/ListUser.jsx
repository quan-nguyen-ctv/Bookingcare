import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        showToast("Vui lòng đăng nhập để tiếp tục", "error");
        return;
      }

      const res = await fetch("http://localhost:6868/api/v1/users", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok && json.data && json.data.users) {
        // Filter active users
        const activeUsers = json.data.users.filter(user => user.is_active === true);
        setUsers(activeUsers);
      } else {
        throw new Error("Không thể lấy danh sách người dùng");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách user:", err);
      showToast("Lỗi khi tải danh sách người dùng", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`http://localhost:6868/api/v1/users/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        showToast("Xóa người dùng thành công");
        fetchUsers();
      } else {
        const errorText = await res.text();
        throw new Error(errorText || "Xóa người dùng thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi xóa user:", err);
      showToast(err.message || "Lỗi khi xóa người dùng", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({
      email: item.email || "",
      address: item.address || "",
      password: "",
      retype_password: "",
      active: item.is_active ?? true,
      fullname: item.fullname || "",
      phone_number: item.phone_number || "",
      birthday: item.birthday ? item.birthday.split("T")[0] : "",
      gender: item.gender || "",
      role_id: item.role?.id || 3,
    });
  };

  const validateEditForm = () => {
    if (!editData.fullname.trim()) {
      showToast("Vui lòng nhập họ tên", "error");
      return false;
    }
    if (!editData.email.trim()) {
      showToast("Vui lòng nhập email", "error");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      showToast("Email không hợp lệ", "error");
      return false;
    }
    if (!editData.phone_number.trim()) {
      showToast("Vui lòng nhập số điện thoại", "error");
      return false;
    }
    if (editData.password && editData.password !== editData.retype_password) {
      showToast("Mật khẩu xác nhận không khớp", "error");
      return false;
    }
    if (editData.password && editData.password.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự", "error");
      return false;
    }
    return true;
  };

  const handleSave = async (id) => {
    if (!validateEditForm()) return;

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`http://localhost:6868/api/v1/users/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        showToast("Cập nhật người dùng thành công");
        fetchUsers();
        setEditId(null);
      } else {
        const errorText = await res.text();
        throw new Error(errorText || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      showToast(err.message || "Lỗi khi cập nhật người dùng", "error");
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-6 h-6 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Danh Sách Người Dùng
            </h1>
            <p className="text-gray-600 mt-1">Quản lý tài khoản người dùng trong hệ thống</p>
          </div>
          <button
            onClick={() => navigate('/admin/users/add')}
            className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm Người Dùng
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">Đang tải danh sách người dùng...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Họ Tên</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Số ĐT</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày Sinh</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giới Tính</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vai Trò</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editId === item.id ? (
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                            value={editData.fullname}
                            onChange={(e) => setEditData({ ...editData, fullname: e.target.value })}
                          />
                        ) : (
                          <span className="font-medium">{item.fullname}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editId === item.id ? (
                          <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          />
                        ) : (
                          item.email
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editId === item.id ? (
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                            value={editData.phone_number}
                            onChange={(e) => setEditData({ ...editData, phone_number: e.target.value })}
                          />
                        ) : (
                          item.phone_number || "—"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editId === item.id ? (
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                            value={editData.birthday}
                            onChange={(e) => setEditData({ ...editData, birthday: e.target.value })}
                          />
                        ) : (
                          item.birthday ? new Date(item.birthday).toLocaleDateString('vi-VN') : "—"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editId === item.id ? (
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                            value={editData.gender}
                            onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                          >
                            <option value="">Chọn</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                        ) : (
                          getGenderDisplay(item.gender)
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editId === item.id ? (
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                            value={editData.role_id}
                            onChange={(e) => setEditData({ ...editData, role_id: Number(e.target.value) })}
                          >
                            <option value={1}>Quản Trị Viên</option>
                            <option value={2}>Bác Sĩ</option>
                            <option value={3}>Khách Hàng</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(item.role?.name)}`}>
                            {item.role?.name === 'admin' ? 'Quản Trị Viên' : 
                             item.role?.name === 'doctor' ? 'Bác Sĩ' : 
                             item.role?.name === 'user' ? 'Khách Hàng' : 
                             item.role?.name || '—'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editId === item.id ? (
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                            value={editData.active}
                            onChange={(e) => setEditData({ ...editData, active: e.target.value === "true" })}
                          >
                            <option value="true">Hoạt Động</option>
                            <option value="false">Không Hoạt Động</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.is_active ? 'Hoạt Động' : 'Không Hoạt Động'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editId === item.id ? (
                          <div className="flex gap-2">
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                              onClick={() => handleSave(item.id)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Lưu
                            </button>
                            <button
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                              onClick={() => setEditId(null)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                              onClick={() => navigate(`/admin/users/${item.id}`)}
                              title="Xem chi tiết"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Xem
                            </button>
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                              onClick={() => handleEdit(item)}
                              title="Chỉnh sửa"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Sửa
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                              onClick={() => handleDelete(item.id)}
                              title="Xóa"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Xóa
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <p className="text-lg font-medium">Chưa có người dùng nào</p>
                        <p className="text-sm mt-1">Hãy thêm người dùng đầu tiên vào hệ thống</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

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

export default ListUser;
