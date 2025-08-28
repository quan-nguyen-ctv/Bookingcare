import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    message: "",
    reply: "",
    status: "AwaitReply",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("admin_token");
        const res = await axios.get(`http://localhost:6868/api/v1/contacts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.data;
        setContact(data);
        setEditData({
          name: data.name || "",
          email: data.email || "",
          message: data.message || "",
          reply: data.reply || "",
          status: data.status || "AwaitReply",
        });
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu", { position: "top-right", autoClose: 3000 });
      }
      setLoading(false);
    };
    if (id) fetchDetail();
  }, [id]);

  const handleEditClick = () => setEditMode(true);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const payload = {
        name: contact.name,
        email: contact.email,
        message: contact.message,
        reply: editData.reply,
        status: editData.status,
      };
      const res = await axios.put(`http://localhost:6868/api/v1/contacts/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        toast.success("Đã phản hồi thành công!", { position: "top-right", autoClose: 3000 });
        setEditMode(false);
        setContact({
          ...contact,
          reply: editData.reply,
          status: editData.status,
        });
      }
    } catch (err) {
      toast.error("Lỗi khi gửi phản hồi", { position: "top-right", autoClose: 3000 });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Replied':
        return <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Đã phản hồi</span>;
      case 'AwaitReply':
        return <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Chờ phản hồi</span>;
      default:
        return <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Không xác định</span>;
    }
  };

  if (loading) return (
<div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex items-center gap-3 text-gray-600">
        <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="font-medium">Đang tải dữ liệu...</span>
      </div>
    </div>
  );
  if (!contact) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-600">Không tìm thấy liên hệ</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Chi Tiết Liên Hệ #{contact.id}
                </h2>
                <p className="text-blue-100 mt-1">Xem và phản hồi liên hệ khách hàng</p>
              </div>
              {!editMode && (
                <button
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  onClick={handleEditClick}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
<label className="block text-sm font-semibold text-gray-700 mb-1">Họ tên</label>
                <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">{contact.name}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">{contact.email}</div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tin nhắn</label>
                <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 min-h-[60px]">{contact.message}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày tạo</label>
                <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">{new Date(contact.createdAt).toLocaleString('vi-VN')}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ngày cập nhật</label>
                <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">{new Date(contact.updatedAt).toLocaleString('vi-VN')}</div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái</label>
                {editMode ? (
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent mt-1"
                    value={editData.status}
                    onChange={e => setEditData({ ...editData, status: e.target.value })}
                  >
                    <option value="AwaitReply">Chờ phản hồi</option>
                    <option value="Replied">Đã phản hồi</option>
                  </select>
                ) : (
                  <div className="mt-2">{getStatusBadge(contact.status)}</div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phản hồi</label>
                {editMode ? (
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent mt-1"
                    rows={4}
                    value={editData.reply}
                    onChange={e => setEditData({ ...editData, reply: e.target.value })}
                    placeholder="Nhập phản hồi..."
                  />
                ) : (
                  <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 min-h-[60px] mt-2">
                    {contact.reply || <span className="text-gray-400">Chưa có phản hồi</span>}
</div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => navigate("/admin/contacts/list")}
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
                    onClick={() => setEditMode(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Hủy
                  </button>
                )}
                {editMode && (
                  <button
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                    onClick={handleSave}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lưu
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

export default ContactDetail;