import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Modal xác nhận với form nhập thông tin ngân hàng
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  const [formData, setFormData] = useState({
    bank_name: "",
    holder_name: "",
    account_number: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bank_name.trim() || !formData.holder_name.trim() || !formData.account_number.trim()) {
      alert("Vui lòng điền đầy đủ thông tin ngân hàng!");
      return;
    }
    onConfirm(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Reset form khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setFormData({ bank_name: "", holder_name: "", account_number: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Tên ngân hàng *</label>
              <input
                type="text"
                value={formData.bank_name}
                onChange={(e) => handleInputChange("bank_name", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập tên ngân hàng"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tên chủ tài khoản *</label>
              <input
                type="text"
                value={formData.holder_name}
                onChange={(e) => handleInputChange("holder_name", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập tên chủ tài khoản"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Số tài khoản *</label>
              <input
                type="text"
                value={formData.account_number}
                onChange={(e) => handleInputChange("account_number", e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Nhập số tài khoản"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận yêu cầu hoàn tiền"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LIMIT_OPTIONS = [5, 10, 20];

const statusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-400 text-white";
    case "paid":
      return "bg-green-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    case "wait refund":
      return "bg-blue-400 text-white";
    case "refunded":
      return "bg-blue-600 text-white";
    default:
      return "bg-gray-300 text-gray-700";
  }
};

const ListBooking = () => {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState([]); // Lưu toàn bộ booking
  const [bookings, setBookings] = useState([]); // Booking hiển thị trang hiện tại
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(10); // Mặc định 10 booking/trang
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [dateBooking, setDateBooking] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const timeoutRef = useRef(null);

  // Fetch all bookings once
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token || token.split(".").length !== 3) {
          setError("Bạn chưa đăng nhập hoặc token không hợp lệ.");
          setLoading(false);
          return;
        }
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        if (!userId) {
          setError("Không thể lấy thông tin người dùng từ token.");
          setLoading(false);
          return;
        }
        // Không truyền limit, page cho API
        const res = await fetch(
          `http://localhost:6868/api/v1/bookings/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Lỗi khi lấy danh sách lịch hẹn.");
        setAllBookings(json.data?.rows || json.data || []);
        setError("");
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Lọc và phân trang trên frontend
  useEffect(() => {
    let filtered = [...allBookings];
    if (keyword) {
      filtered = filtered.filter(
        (b) =>
          b.schedule?.specialty_name?.toLowerCase().includes(keyword.toLowerCase()) ||
          b.payment_method?.toLowerCase().includes(keyword.toLowerCase()) ||
          b.payment_code?.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    if (status) {
      filtered = filtered.filter((b) => b.status?.toLowerCase() === status.toLowerCase());
    }
    if (dateBooking) {
      filtered = filtered.filter((b) => b.date_booking === dateBooking);
    }
    const total = filtered.length;
    setTotalPages(Math.ceil(total / limit) || 1);
    const start = page * limit;
    const end = start + limit;
    setBookings(filtered.slice(start, end));
    // Nếu page vượt quá tổng số trang sau khi filter, reset về 0
    if (page > 0 && start >= total) setPage(0);
  }, [allBookings, limit, page, keyword, status, dateBooking]);

  // Debounce search
  const handleSearchChange = (e) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setKeyword(e.target.value), 500);
  };

  const handleCancelBooking = async (bankingInfo) => {
    try {
      setCancelLoading(prev => ({ ...prev, [selectedBookingId]: true }));
      
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const response = await fetch(
        `http://localhost:6868/api/v1/bookings/user/${userId}/detail?bookingId=${selectedBookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bank_name: bankingInfo.bank_name,
            holder_name: bankingInfo.holder_name,
            account_number: bankingInfo.account_number,
            status: "paid"
          }),
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Lỗi khi yêu cầu hoàn tiền");
      }

      // Cập nhật status của booking trong state
      setAllBookings(prev => 
        prev.map(booking => 
          booking.id === selectedBookingId 
            ? { ...booking, status: "Wait Refund" }
            : booking
        )
      );

      alert("Yêu cầu hoàn tiền đã được gửi thành công!");
      setShowConfirmModal(false);
      setSelectedBookingId(null);
      
    } catch (error) {
      console.error("Error canceling booking:", error);
      alert(error.message || "Có lỗi xảy ra khi yêu cầu hoàn tiền");
    } finally {
      setCancelLoading(prev => ({ ...prev, [selectedBookingId]: false }));
    }
  };

  const openCancelModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowConfirmModal(true);
  };

  const closeCancelModal = () => {
    setShowConfirmModal(false);
    setSelectedBookingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Limit</label>
            <select
              className="border rounded px-2 py-1"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(0);
              }}
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date Booking</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={dateBooking}
              onChange={(e) => {
                setDateBooking(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="border rounded px-2 py-1"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
            >
              <option value="">All</option>
              <option value="pending">PENDING</option>
              <option value="paid">PAID</option>
              <option value="rejected">REJECTED</option>
              <option value="Wait Refund">WAIT REFUND</option>
              <option value="Refunded">REFUNDED</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            className="border rounded px-2 py-1 w-48"
            placeholder="Tìm kiếm..."
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <h2 className="text-2xl font-bold text-[#223a66] mb-4 text-center">Booking List</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Chưa có lịch hẹn nào.</div>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[#f5f5f5]">
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Specialty</th>
                <th className="px-3 py-2 text-left">Amount</th>
                <th className="px-3 py-2 text-left">Payment Method</th>
                <th className="px-3 py-2 text-left">Payment Code</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#f5f5f5]">
                  <td className="px-3 py-2 font-semibold">#{b.id}</td>
                  <td className="px-3 py-2">{b.schedule?.specialty_name || "Không rõ"}</td>
                  <td className="px-3 py-2">{b.amount?.toLocaleString() || "0"} VND</td>
                  <td className="px-3 py-2">{b.payment_method || "-"}</td>
                  <td className="px-3 py-2">{b.payment_code || "-"}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusBadge(b.status)}`}>
                      {b.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded mr-2 hover:bg-blue-700 transition text-sm"
                      onClick={() => navigate(`/account/bookings/${b.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm disabled:opacity-50"
                      disabled={b.status !== "paid" || cancelLoading[b.id]}
                      onClick={() => openCancelModal(b.id)}
                    >
                      {cancelLoading[b.id] ? "Canceling..." : "Cancel"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="inline-flex">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`px-3 py-1 border rounded mx-1 ${page === idx ? "bg-[#223a66] text-white" : "bg-white text-[#223a66] border-[#223a66]"}`}
                  onClick={() => setPage(idx)}
                >
                  {idx + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Confirm Modal với form */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={closeCancelModal}
        onConfirm={handleCancelBooking}
        title="Yêu cầu hoàn tiền"
        message="Vui lòng nhập thông tin tài khoản ngân hàng để nhận hoàn tiền:"
        loading={cancelLoading[selectedBookingId]}
      />
    </div>
  );
};

export default ListBooking;
