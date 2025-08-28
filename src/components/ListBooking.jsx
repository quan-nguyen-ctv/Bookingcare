import React, { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaTrash, FaEye, FaTimes } from "react-icons/fa"; // Import icons
import "react-toastify/dist/ReactToastify.css";

// Modal xác nhận xóa
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTrash className="text-red-600 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-[#223a66]">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
              onClick={onClose}
              disabled={loading}
            >
              <FaTimes />
             Hủy Bỏ
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
              disabled={loading}
            >
              <FaTrash />
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
      toast.error("Vui lòng điền đầy đủ thông tin ngân hàng!");
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
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4 text-[#223a66]">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-[#223a66]">Tên ngân hàng *</label>
              <input
                type="text"
                value={formData.bank_name}
                onChange={(e) => handleInputChange("bank_name", e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#23cf7c] focus:outline-none transition-colors"
                placeholder="Nhập tên ngân hàng"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[#223a66]">Tên chủ tài khoản *</label>
              <input
                type="text"
                value={formData.holder_name}
                onChange={(e) => handleInputChange("holder_name", e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#23cf7c] focus:outline-none transition-colors"
                placeholder="Nhập tên chủ tài khoản"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-[#223a66]">Số tài khoản *</label>
              <input
                type="text"
                value={formData.account_number}
                onChange={(e) => handleInputChange("account_number", e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#23cf7c] focus:outline-none transition-colors"
                placeholder="Nhập số tài khoản"
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
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

function convertToDateString(dateStr) {
  if (!dateStr) return "";
  // Handles both ISO and yyyy-mm-dd
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("vi-VN");
}

const ListBooking = () => {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [dateSchedule, setDateSchedule] = useState("");
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({}); // New state for delete loading
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete modal
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
          toast.error("Bạn chưa đăng nhập hoặc token không hợp lệ.");
          setLoading(false);
          return;
        }
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        if (!userId) {
          setError("Không thể lấy thông tin người dùng từ token.");
          toast.error("Không thể lấy thông tin người dùng từ token.");
          setLoading(false);
          return;
        }
        
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
        const errorMessage = err.message || "Đã xảy ra lỗi.";
        setError(errorMessage);
        toast.error(errorMessage);
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
    if (dateSchedule) {
      // Lọc theo b.schedule?.date_schedule
      filtered = filtered.filter((b) => b.schedule?.date_schedule === dateSchedule);
    }
    const total = filtered.length;
    setTotalPages(Math.ceil(total / limit) || 1);
    const start = page * limit;
    const end = start + limit;
    setBookings(filtered.slice(start, end));
    // Nếu page vượt quá tổng số trang sau khi filter, reset về 0
    if (page > 0 && start >= total) setPage(0);
  }, [allBookings, limit, page, keyword, status, dateSchedule]); // Đổi dependency từ dateBooking thành dateSchedule

  // Debounce search
  // const handleSearchChange = (e) => {
  //   if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //   timeoutRef.current = setTimeout(() => setKeyword(e.target.value), 500);
  // };

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
            booking_id: selectedBookingId,
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

      // Thay alert bằng toast success
      toast.success("Yêu cầu hoàn tiền đã được gửi thành công!");
      
      // Đóng modal sau khi thành công
      setShowConfirmModal(false);
      setSelectedBookingId(null);
      
    } catch (error) {
console.error("Error canceling booking:", error);
      alert(error.message || "Có lỗi xảy ra khi yêu cầu hoàn tiền");
    } finally {
      setCancelLoading(prev => ({ ...prev, [selectedBookingId]: false }));
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async () => {
    try {
      setDeleteLoading(prev => ({ ...prev, [selectedBookingId]: true }));
      
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:6868/api/v1/bookings/${selectedBookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Lỗi khi xóa lịch hẹn");
      }

      // Remove booking from state
      setAllBookings(prev => 
        prev.filter(booking => booking.id !== selectedBookingId)
      );

      toast.success("Lịch hẹn đã được xóa thành công!");
      
      // Close modal after success
      setShowDeleteModal(false);
      setSelectedBookingId(null);
      
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error(error.message || "Có lỗi xảy ra khi xóa lịch hẹn");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [selectedBookingId]: false }));
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

  // Open delete modal
  const openDeleteModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedBookingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-10">
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
      />
      
      <div className="mb-8 mt-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-wrap gap-4 bg-white rounded-xl shadow-md p-4 border border-gray-200 w-full md:w-auto">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Limit</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23cf7c] bg-gray-50"
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
              <label className="block text-sm font-medium mb-1 text-gray-700">Date Schedule</label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23cf7c] bg-gray-50"
                value={dateSchedule}
                onChange={(e) => {
                  setDateSchedule(e.target.value);
                  setPage(0);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#23cf7c] bg-gray-50"
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
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium mb-1 text-gray-700">Search</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#23cf7c] bg-gray-50"
                placeholder="Tìm theo chuyên khoa, mã thanh toán..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(0);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
        <h2 className="text-3xl font-light text-[#223a66] mb-6 text-center">
           <span className="font-bold">My Bookings</span>
        </h2>
        
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-[#23cf7c] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-xl">Chưa có lịch hẹn nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#223a66] to-[#2c4a7a] text-white">
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Ngày Đặt</th>
                  <th className="px-4 py-3 text-left font-semibold">Dịch Vụ</th>
                  <th className="px-4 py-3 text-left font-semibold">Số Tiền</th>
                  <th className="px-4 py-3 text-left font-semibold">Phương Thức</th>
                  <th className="px-4 py-3 text-left font-semibold">Code</th>
                  <th className="px-4 py-3 text-left font-semibold">Trạng Thái</th>
                  <th className="px-4 py-3 text-center font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b, index) => (
                  <tr key={b.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-4 py-4 font-semibold text-[#223a66]">#{b.id}</td>
                    <td className="px-4 py-4">{convertToDateString(b.schedule?.date_schedule)}</td>
                    <td className="px-4 py-4">{b.schedule?.specialty_name || "Không rõ"}</td>
                    <td className="px-4 py-4 font-semibold text-[#23cf7c]">{b.amount?.toLocaleString() || "0"} VND</td>
                    <td className="px-4 py-4">{b.payment_method || "-"}</td>
                    <td className="px-4 py-4 font-mono text-sm">{b.payment_code || "-"}</td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(b.status)}`}>
                        {b.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-300 hover:shadow-md flex items-center gap-1"
                          onClick={() => navigate(`/account/bookings/${b.id}`)}
                          title="View Details"
                        >
                          <FaEye className="text-sm" />
                        </button>
                        
                        <button
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg transition-all duration-300 hover:shadow-md text-xs font-medium disabled:opacity-50"
                          disabled={b.status !== "paid" || cancelLoading[b.id]}
                          onClick={() => openCancelModal(b.id)}
                          title="Request Refund"
                        >
                          {cancelLoading[b.id] ? "..." : "Cancel"}
                        </button>
                        
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-300 hover:shadow-md disabled:opacity-50 flex items-center gap-1"
                          onClick={() => openDeleteModal(b.id)}
                          disabled={b.status === "paid" || deleteLoading[b.id]}
                          title="Delete Booking"
                        >
                          {deleteLoading[b.id] ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          ) : (
                            <FaTrash className="text-sm" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteBooking}
        title="Xóa Lịch Hẹn "
        message="Bạn có chắc chắn muốn xóa đặt phòng này không? Hành động này không thể hoàn tác.."
        loading={deleteLoading[selectedBookingId]}
      />
    </div>
  );
};

export default ListBooking;