import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Modal
const RefundModal = ({ isOpen, onClose, refundData, onConfirm, onReject, loading }) => {
  if (!isOpen || !refundData) return null;

  const isProcessed = refundData.status?.toUpperCase() === "REFUNDED" || refundData.status?.toUpperCase() === "REJECTED";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Chi Tiết Hoàn Tiền
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors duration-200" 
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {{
            "Mã Hóa Đơn": `#${refundData.id}`,
            "Mã Đặt Khám": refundData.bookingId || refundData.booking_id,
            "Số Tiền Hoàn": new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(refundData.amount || 0),
            "Ngân Hàng": refundData.bankName || refundData.bank_name,
            "Chủ Tài Khoản": refundData.holderName || refundData.holder_name,
            "Số Tài Khoản": refundData.accountNumber || refundData.account_number || "—"
          }}

          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-semibold text-gray-600">Trạng Thái:</span>
            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
              refundData.status?.toUpperCase() === "REFUNDED" ? "bg-green-100 text-green-800" :
              refundData.status?.toUpperCase() === "REJECTED" ? "bg-red-100 text-red-800" :
              "bg-blue-100 text-blue-800"
            }`}>
              {refundData.status === "WAIT REFUND" ? "Chờ Hoàn Tiền" :
               refundData.status === "REFUNDED" ? "Đã Hoàn Tiền" :
               refundData.status === "REJECTED" ? "Đã Từ Chối" :
               refundData.status || 'Chờ Hoàn Tiền'}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50" 
            onClick={onClose} 
            disabled={loading}
          >
            Đóng
          </button>
          
          {!isProcessed && (
            <>
              <button 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                onClick={() => onReject(refundData.id)} 
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {loading ? "Đang Xử Lý..." : "Từ Chối"}
              </button>
              <button 
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                onClick={() => onConfirm(refundData.id)} 
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {loading ? "Đang Xử Lý..." : "Phê Duyệt"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ListRefund = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({
    limit: 10,
    dateRefund: "",
    status: "",
    keyword: "",
    page: 0,
    sort: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [refundLoading, setRefundLoading] = useState(false);

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

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:6868/api/v1/refundInvoices", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: filters.limit,
          page: filters.page,
          keyword: filters.keyword,
          dateRefund: filters.dateRefund,
          status: filters.status,
          sort: filters.sort
        }
      });

      const data = res.data?.data?.refundInvoiceResponses || [];
      setRefunds(data);
    } catch (err) {
      console.error("Lỗi khi gọi API refund:", err);
      showToast("Lỗi khi tải danh sách hoàn tiền", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [refresh, filters]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, keyword: searchTerm, page: 0 }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilters(prev => ({ ...prev, keyword: "", page: 0 }));
  };

  const handleViewRefund = (refund) => {
    setSelectedRefund(refund);
    setShowRefundModal(true);
  };

  const handleConfirmRefund = async (refundId) => {
    try {
      setRefundLoading(true);
      const res = await axios.put(
        `http://localhost:6868/api/v1/refundInvoices/refunded/${refundId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.status === 200) {
        showToast("Phê duyệt hoàn tiền thành công!");
        setRefunds(prev => prev.map(r => r.id === refundId ? { ...r, status: "REFUNDED" } : r));
        setShowRefundModal(false);
        setSelectedRefund(null);
      }
    } catch (err) {
      console.error("Error confirming refund:", err);
      showToast("Lỗi khi phê duyệt hoàn tiền", "error");
    } finally {
      setRefundLoading(false);
    }
  };

  const handleRejectRefund = async (refundId) => {
    try {
      setRefundLoading(true);
      const res = await axios.put(
        `http://localhost:6868/api/v1/refundInvoices/refunded/${refundId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.status === 200) {
        showToast("Từ chối hoàn tiền thành công!");
        setRefunds(prev => prev.map(r => r.id === refundId ? { ...r, status: "REJECTED" } : r));
        setShowRefundModal(false);
        setSelectedRefund(null);
      }
    } catch (err) {
      console.error("Error rejecting refund:", err);
      showToast("Lỗi khi từ chối hoàn tiền", "error");
    } finally {
      setRefundLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'WAIT REFUND':
        return <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Chờ Hoàn Tiền</span>;
      case 'REFUNDED':
        return <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Đã Hoàn Tiền</span>;
      case 'REJECTED':
        return <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Đã Từ Chối</span>;
      default:
        return <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Không Xác Định</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-6 h-6 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Danh Sách Hoàn Tiền
            </h1>
            <p className="text-gray-600 mt-1">Quản lý các yêu cầu hoàn tiền từ khách hàng</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Bộ Lọc Tìm Kiếm
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng/trang</label>
              <select
                value={filters.limit}
                onChange={(e) => setFilters(prev => ({ ...prev, limit: Number(e.target.value), page: 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
              >
                {[5, 10, 20, 50].map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày hoàn tiền</label>
              <input
                type="date"
                value={filters.dateRefund}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRefund: e.target.value, page: 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="WAIT REFUND">Chờ Hoàn Tiền</option>
                <option value="REFUNDED">Đã Hoàn Tiền</option>
                <option value="REJECTED">Đã Từ Chối</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mã đặt khám..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm Kiếm
              </button>
              {filters.keyword && (
                <button
                  onClick={clearSearch}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">Đang tải danh sách hoàn tiền...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã Đặt Khám</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Số Tiền Hoàn</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngân Hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Chủ Tài Khoản</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {refunds.length > 0 ? (
                  refunds.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.bookingId || item.booking_id || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium text-green-600">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.bankName || item.bank_name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.holderName || item.holder_name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                          onClick={() => handleViewRefund(item)}
                          title="Xem chi tiết"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg font-medium">Không có yêu cầu hoàn tiền nào</p>
                        <p className="text-sm mt-1">Chưa có yêu cầu hoàn tiền nào hoặc điều chỉnh bộ lọc</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Hiển thị {(filters.page * filters.limit) + 1} - {Math.min((filters.page + 1) * filters.limit, refunds.length)} trong tổng số {refunds.length} kết quả
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-2 rounded-lg text-sm font-medium ${filters.page === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"} transition-colors duration-200`}
                onClick={() => setFilters(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                disabled={filters.page === 0}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <span className="px-3 py-2 rounded-lg text-sm font-medium bg-[#20c0f3] text-white">
                {filters.page + 1}
              </span>
              
              <button
                className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        refundData={selectedRefund}
        onConfirm={handleConfirmRefund}
        onReject={handleRejectRefund}
        loading={refundLoading}
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

export default ListRefund;
