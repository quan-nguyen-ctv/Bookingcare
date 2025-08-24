import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [originalBooking, setOriginalBooking] = useState(null);
  const [editData, setEditData] = useState({
    status: "",
    payment_method: "",
    payment_code: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchBookingDetail = async () => {
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

        const res = await fetch(`http://localhost:6868/api/v1/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          throw new Error("Không thể tải thông tin đặt khám");
        }

        const result = await res.json();
        const bookingData = result.data || null;
        setBooking(bookingData);
        setOriginalBooking(bookingData);
        setEditData({
          status: bookingData?.status || "",
          payment_method: bookingData?.payment_method || "",
          payment_code: bookingData?.payment_code || "",
          notes: bookingData?.notes || "",
        });
      } catch (error) {
        console.error("Error fetching booking:", error);
        toast.error("Lỗi khi tải thông tin đặt khám", {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetail();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!editData.status.trim()) {
      toast.error("Vui lòng chọn trạng thái", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    if (!editData.payment_method.trim()) {
      toast.error("Vui lòng chọn phương thức thanh toán", {
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
        status: editData.status,
        payment_method: editData.payment_method,
        payment_code: editData.payment_code,
        notes: editData.notes,
      };
      
      const res = await fetch(`http://localhost:6868/api/v1/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Cập nhật đặt khám thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        setEditMode(false);
        const updatedBooking = { ...booking, ...payload };
        setBooking(updatedBooking);
        setOriginalBooking(updatedBooking);
      } else {
        toast.error(data.message || "Cập nhật thất bại!", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    } catch (err) {
      console.error("Error updating booking:", err);
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
        status: originalBooking?.status || "",
        payment_method: originalBooking?.payment_method || "",
        payment_code: originalBooking?.payment_code || "",
        notes: originalBooking?.notes || "",
      });
      setEditMode(false);
    } else {
      navigate("/admin/bookings/list");
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'paid': 'bg-purple-100 text-purple-800'
    };

    const statusLabels = {
      'pending': 'Chờ xác nhận',
      'confirmed': 'Đã xác nhận',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy',
      'paid': 'Đã thanh toán'
    };

    return (
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      'cash': 'Tiền mặt',
      'momo': 'MoMo',
      'vnpay': 'VNPay',
      'bank': 'Chuyển khoản'
    };
    return labels[method] || method;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600">Không tìm thấy đặt khám</h3>
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
          <span className="font-medium">Đang tải thông tin đặt khám...</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy đặt khám</h3>
          <p className="text-gray-500">Đặt khám không tồn tại hoặc đã bị xóa</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Chi Tiết Đặt Khám #{id}
                </h2>
                <p className="text-blue-100 mt-1">Xem và cập nhật thông tin đặt khám</p>
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
            {/* Patient Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Thông Tin Bệnh Nhân
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Tên Bệnh Nhân</label>
                  <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {booking.user?.fullname || "—"}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {booking.user?.email || "—"}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Số Điện Thoại</label>
                  <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {booking.user?.phone || "—"}
                  </div>
                </div>

                {/* <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Ngày Sinh</label>
                  <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {booking.user?.dob ? new Date(booking.user.dob).toLocaleDateString('vi-VN') : "—"}
                  </div>
                </div> */}
              </div>
            </div>

            {/* Booking Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thông Tin Đặt Khám
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Trạng Thái <span className="text-red-500">*</span>
                  </label>
                  {editMode ? (
                    <select
                      name="status"
                      value={editData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn trạng thái</option>
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                      <option value="paid">Đã thanh toán</option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      {getStatusBadge(booking.status)}
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phương Thức Thanh Toán <span className="text-red-500">*</span>
                  </label>
                  {editMode ? (
                    <select
                      name="payment_method"
                      value={editData.payment_method}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Chọn phương thức</option>
                      <option value="cash">Tiền mặt</option>
                      <option value="momo">MoMo</option>
                      <option value="vnpay">VNPay</option>
                      <option value="bank">Chuyển khoản</option>
                    </select>
                  ) : (
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      {getPaymentMethodLabel(booking.payment_method)}
                    </div>
                  )}
                </div>

                {/* Payment Code */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Mã Thanh Toán</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="payment_code"
                      value={editData.payment_code}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                      placeholder="Nhập mã thanh toán..."
                    />
                  ) : (
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      {booking.payment_code || "—"}
                    </div>
                  )}
                </div>

                {/* Total Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Tổng Tiền</label>
                  <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-medium text-green-600">
                    {booking.amount ? formatCurrency(booking.amount) : "—"}
                  </div>
                </div>

                {/* Change Count */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Số Lần Thay Đổi</label>
                  <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">
                      {booking.change_count || 0} lần
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Ngày Đặt</label>
                  <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {formatDate(booking.created_at)}
                  </div>
                </div>

                {/* Updated Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Cập Nhật Lần Cuối</label>
                  <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    {formatDate(booking.updated_at)}
                  </div>
                </div>

                {/* Notes */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Ghi Chú</label>
                  {editMode ? (
                    <textarea
                      name="notes"
                      value={editData.notes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                      placeholder="Nhập ghi chú về đặt khám..."
                    />
                  ) : (
                    <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px]">
                      {booking.notes || "Không có ghi chú"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={() => navigate("/admin/bookings/list")}
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

export default BookingDetailAdmin;