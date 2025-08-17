import React, { useEffect, useState } from "react";
import axios from "axios";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    user: "",
    specialty: "",
    image: "",
    experience: "",
    qualification: "",
    bio: ""
  });
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("admin_token");
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

  const fetchDoctors = async () => {
    if (!token) {
      showToast("Vui lòng đăng nhập với quyền admin để xem danh sách", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:6868/api/v1/doctors", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const list = res.data.data?.doctors || [];
      console.log("Danh sách bác sĩ:", list);

      // Ghép lại đúng tên trường cho bảng
      const mappedList = list.map(item => ({
        id: item.id,
        user: item.user?.fullname || item.user?.name || "",
        specialty: item.specialty?.specialtyName || "",
        image: item.avatar || "",
        experience: item.experience || "",
        qualification: item.qualification || "",
        bio: item.bio || ""
      }));

      setDoctors(mappedList);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách bác sĩ:", err);
      showToast("Lỗi khi tải danh sách bác sĩ", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditData({
      user: item.user,
      specialty: item.specialty,
      image: item.image,
      experience: item.experience,
      qualification: item.qualification,
      bio: item.bio
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(
        `http://localhost:6868/api/v1/doctors/${id}`,
        {
          user: editData.user,
          specialty: editData.specialty,
          image: editData.image,
          experience: editData.experience,
          qualification: editData.qualification,
          bio: editData.bio
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const updated = doctors.map((doc) =>
        doc.id === id ? { ...doc, ...editData } : doc
      );
      setDoctors(updated);
      setEditId(null);
      showToast("Cập nhật thông tin bác sĩ thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      showToast("Lỗi khi cập nhật thông tin bác sĩ", "error");
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:6868/api/v1/doctors/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const newList = doctors.filter(item => item.id !== deleteId);
      setDoctors(newList);
      setDeleteId(null);
      showToast("Xóa bác sĩ thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      showToast("Không thể xóa bác sĩ. Vui lòng thử lại!", "error");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-6 h-6 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Danh Sách Bác Sĩ
            </h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin bác sĩ trong hệ thống</p>
          </div>
          <button
            onClick={() => navigate('/admin/doctors/add')}
            className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm Bác Sĩ
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">Đang tải danh sách bác sĩ...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Họ Tên</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Chuyên Khoa</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ảnh</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kinh Nghiệm</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bằng Cấp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiểu Sử</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-lg font-medium">Chưa có bác sĩ nào</p>
                        <p className="text-sm mt-1">Hãy thêm bác sĩ đầu tiên vào hệ thống</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  doctors.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {idx + 1}
                      </td>
                      {["user", "specialty", "image", "experience", "qualification", "bio"].map((field) => (
                        <td key={field} className="px-6 py-4 whitespace-nowrap">
                          {editId === item.id ? (
                            <input
                              className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent w-full"
                              value={editData[field]}
                              onChange={e => setEditData({ ...editData, [field]: e.target.value })}
                            />
                          ) : (
                            field === "image" ? (
                              item.image ? (
                                <img 
                                  src={`http://localhost:6868/uploads/${item.image}`} 
                                  alt="Doctor avatar" 
                                  className="h-12 w-12 rounded-full object-cover border-2 border-gray-200" 
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              )
                            ) : (
                              <span className={`text-sm ${field === "bio" || field === "qualification" ? "max-w-xs truncate block" : ""} text-gray-900`}>
                                {item[field] || "—"}
                              </span>
                            )
                          )}
                        </td>
                      ))}
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
                              onClick={() => navigate(`/admin/doctors/${item.id}`)}
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
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Sửa
                            </button>
                            <button 
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                              onClick={() => handleDelete(item.id)}
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

export default ListDoctor;