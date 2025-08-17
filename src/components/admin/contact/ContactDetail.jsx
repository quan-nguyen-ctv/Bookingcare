import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

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
          status: data.status || "Pending",
        });
      } catch (err) {
        showToast("Lỗi khi tải dữ liệu", "error");
      }
      setLoading(false);
    };
    
    if (id) fetchDetail();
  }, [id]);

  const handleEditClick = () => {
    setEditMode(true);
  };

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
      showToast("Đã phản hồi thành công!");
      setEditMode(false);
      setContact({
        ...contact,
        reply: editData.reply,
        status: editData.status,
      });
    }
  } catch (err) {
    showToast("Lỗi khi gửi phản hồi", "error");
  }
  navigate("/admin/contacts/list", { state: { updated: true } });


};


  const getStatusBadge = (status) => {
  switch (status) {
    case 'Replied':
      return <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Đã phản hồi</span>;
    case 'AwaitReply':
      return <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Chờ phản hồi</span>;
    default:
      return <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">Không xác định</span>;
  }
};


  if (loading) return <div className="p-8">Đang tải dữ liệu...</div>;
  if (!contact) return <div className="p-8">Không tìm thấy liên hệ.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
            ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
          style={{ minWidth: 220 }}
        >
          {toast.message}
        </div>
      )}
      
      <h2 className="text-2xl font-bold text-[#223a66] mb-4">Chi tiết liên hệ</h2>
      
      <div className="mb-4">
        <strong>ID:</strong> {contact.id}
      </div>
      
      <div className="mb-4">
        <strong>Họ tên:</strong> {contact.name}
      </div>
      
      <div className="mb-4">
        <strong>Email:</strong> {contact.email}
      </div>
      
      <div className="mb-4">
        <strong>Tin nhắn:</strong>
        <div className="mt-2 p-3 bg-gray-50 rounded border">
          {contact.message}
        </div>
      </div>
      
      <div className="mb-4">
        <strong>Ngày tạo:</strong> {new Date(contact.createdAt).toLocaleString('vi-VN')}
      </div>
      
      <div className="mb-4">
        <strong>Ngày cập nhật:</strong> {new Date(contact.updatedAt).toLocaleString('vi-VN')}
      </div>
      
      <div className="mb-4">
        <strong>Trạng thái:</strong>{" "}
        {editMode ? (
          <select
  className="border px-2 py-1 rounded w-full mt-2"
  value={editData.status}
  onChange={e => setEditData({ ...editData, status: e.target.value })}
>
  <option value="AwaitReply">Await Reply</option>
  <option value="Replied">Replied</option>
</select>

        ) : (
          <div className="mt-2">{getStatusBadge(contact.status)}</div>
        )}
      </div>
      
      <div className="mb-4">
        <strong>Phản hồi:</strong>
        {editMode ? (
          <textarea
            className="border px-2 py-1 rounded w-full mt-2"
            rows={4}
            value={editData.reply}
            onChange={e => setEditData({ ...editData, reply: e.target.value })}
            placeholder="Nhập phản hồi..."
          />
        ) : (
          <div className="mt-2 p-3 bg-gray-50 rounded border min-h-[60px]">
            {contact.reply || <span className="text-gray-400">Chưa có phản hồi</span>}
          </div>
        )}
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          className="bg-[#223a66] text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
        {!editMode ? (
          <button
            className="bg-yellow-400 text-white px-4 py-2 rounded"
            onClick={handleEditClick}
          >
            Sửa
          </button>
        ) : (
          <>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSave}
            >
              Lưu
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setEditMode(false)}
            >
              Hủy
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactDetail;