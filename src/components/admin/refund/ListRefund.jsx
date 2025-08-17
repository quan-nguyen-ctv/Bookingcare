import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

// Toast Component
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
      ${type === "error" ? "bg-red-500" : "bg-green-500"}`}>
    {message}
    <button onClick={onClose} className="ml-4 text-white font-bold" style={{ background: "transparent", border: "none", cursor: "pointer" }}>×</button>
  </div>
);

// Modal
const RefundModal = ({ isOpen, onClose, refundData, onConfirm, onReject, loading }) => {
  if (!isOpen || !refundData) return null;

  const isProcessed = refundData.status?.toUpperCase() === "REFUNDED" || refundData.status?.toUpperCase() === "REJECTED";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Refund Invoice</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold" disabled={loading}>×</button>
        </div>

        <div className="space-y-3 mb-6">
          {[
            ["Invoice ID", refundData.id],
            ["Booking ID", refundData.bookingId || refundData.booking_id],
            ["Refund amount", new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(refundData.amount || 0)],
            ["Bank Name", refundData.bankName || refundData.bank_name],
            ["Holder Name", refundData.holderName || refundData.holder_name],
            ["Account Number", refundData.accountNumber || refundData.account_number || "N/A"]
          ].map(([label, value], index) => (
            <div className="flex justify-between" key={index}>
              <span className="text-gray-600">{label}:</span>
              <span className="font-semibold text-blue-600">{value}</span>
            </div>
          ))}

          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`px-2 py-1 rounded text-xs ${
              refundData.status?.toUpperCase() === "REFUNDED" ? "bg-green-500 text-white" :
              refundData.status?.toUpperCase() === "REJECTED" ? "bg-red-500 text-white" :
              "bg-blue-500 text-white"
            }`}>
              {refundData.status || 'Wait Refund'}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition disabled:opacity-50" 
            onClick={onClose} 
            disabled={loading}
          >
            Cancel
          </button>
          
          {!isProcessed && (
            <>
              <button 
                className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
                onClick={() => onReject(refundData.id)} 
                disabled={loading}
              >
                {loading ? "Processing..." : "Reject"}
              </button>
              <button 
                className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                onClick={() => onConfirm(refundData.id)} 
                disabled={loading}
              >
                {loading ? "Processing..." : "Approve"}
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
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({
    limit: 5,
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

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2500);
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
      showToast("Lỗi khi tải danh sách", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [refresh, filters]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, keyword: searchTerm }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilters(prev => ({ ...prev, keyword: "" }));
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
        showToast("Hoàn tiền thành công!");
        setRefunds(prev => prev.map(r => r.id === refundId ? { ...r, status: "REFUNDED" } : r));
        setShowRefundModal(false);
        setSelectedRefund(null);
      }
    } catch (err) {
      console.error("Error confirming refund:", err);
      showToast("Lỗi khi xác nhận hoàn tiền", "error");
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
        showToast("Từ chối hoàn tiền thành công!", "success");
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
        return <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">WAIT REFUND</span>;
      case 'REFUNDED':
        return <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">REFUNDED</span>;
      case 'REJECTED':
        return <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">REJECTED</span>;
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">UNKNOWN</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <h2 className="text-3xl font-bold text-[#223a66] mb-2">
        Refund Invoice <span className="text-base font-normal text-gray-400">- Invoice List</span>
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Limit</label>
          <select value={filters.limit} onChange={(e) => setFilters(prev => ({ ...prev, limit: e.target.value }))} className="border rounded px-3 py-2 w-full">
            {[5, 10, 20, 50].map(val => <option key={val} value={val}>{val}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date Refund</label>
          <input type="date" value={filters.dateRefund} onChange={(e) => setFilters(prev => ({ ...prev, dateRefund: e.target.value }))} className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} className="border rounded px-3 py-2 w-full">
            <option value="">Select Status</option>
            <option value="WAIT REFUND">Wait Refund</option>
            <option value="REFUNDED">Refunded</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} placeholder="Booking ID" className="border rounded px-3 py-2 w-full" />
        </div>
        <div className="flex gap-2 items-end">
          <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Search</button>
          {filters.keyword && <button onClick={clearSearch} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Clear</button>}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-center">
          <thead>
            <tr className="bg-gray-100">
              {["ID", "ID Booking", "Refund Amount", "Bank Name", "Holder Name", "Status", "Action"].map((col, i) => (
                <th key={i} className="border px-3 py-2">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-4 text-gray-400">Đang tải dữ liệu...</td></tr>
            ) : refunds.length === 0 ? (
              <tr><td colSpan={7} className="py-4 text-gray-400">Không có hóa đơn hoàn tiền nào.</td></tr>
            ) : (
              refunds.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="border px-3 py-2">#{item.id}</td>
                  <td className="border px-3 py-2">{item.bookingId || item.booking_id}</td>
                  <td className="border px-3 py-2">{formatCurrency(item.amount)}</td>
                  <td className="border px-3 py-2">{item.bankName || item.bank_name}</td>
                  <td className="border px-3 py-2">{item.holderName || item.holder_name}</td>
                  <td className="border px-3 py-2">{getStatusBadge(item.status)}</td>
                  <td className="border px-3 py-2">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleViewRefund(item)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded" onClick={() => setFilters(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))} disabled={filters.page === 0}>
            &lt;
          </button>
          <span className="px-3 py-1 border rounded bg-gray-100">{filters.page + 1}</span>
          <button className="px-3 py-1 border rounded" onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}>
            &gt;
          </button>
        </div>
      </div>

      {/* Modal */}
      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        refundData={selectedRefund}
        onConfirm={handleConfirmRefund}
        onReject={handleRejectRefund}
        loading={refundLoading}
      />
    </div>
  );
};

export default ListRefund;
