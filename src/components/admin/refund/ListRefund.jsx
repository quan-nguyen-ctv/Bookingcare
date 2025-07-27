import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
      ${type === "error" ? "bg-red-500" : "bg-green-500"}`}>
      {message}
      <button onClick={onClose} className="ml-4 text-white font-bold" style={{ background: "transparent", border: "none", cursor: "pointer" }}>×</button>
  </div>
);

// Modal component
const RefundModal = ({ isOpen, onClose, refundData, onConfirm, loading }) => {
  if (!isOpen || !refundData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Refund Invoice</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Invoice ID:</span>
            <span className="font-semibold text-blue-600">{refundData.id}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Booking ID:</span>
            <span className="font-semibold text-blue-600">{refundData.bookingId || refundData.booking_id}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Refund amount:</span>
            <span className="font-semibold text-blue-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(refundData.refundAmount || refundData.amount || 0)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Bank Name:</span>
            <span className="font-semibold text-blue-600">{refundData.bankName || refundData.bank_name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Holder Name:</span>
            <span className="font-semibold text-blue-600">{refundData.holderName || refundData.holder_name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Account Number:</span>
            <span className="font-semibold text-blue-600">{refundData.accountNumber || refundData.account_number || "N/A"}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              {refundData.status || 'Wait Refund'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          {refundData.status?.toLowerCase() !== 'completed' && refundData.status?.toLowerCase() !== 'refunded' && (
            <button
              className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
              onClick={() => onConfirm(refundData.id)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Refunded"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ListRefund = () => {
  const [refunds, setRefunds] = useState([]);
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
  const navigate = useNavigate();

  const token = localStorage.getItem("admin_token");

  const showToast = (message, type = "success") => {
      setToast({ show: true, message, type });
      setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const fetchRefunds = async () => {
    try {
      let url = `http://localhost:6868/api/v1/refundInvoices`;
      const params = new URLSearchParams();
      
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.dateRefund) params.append('dateRefund', filters.dateRefund);
      if (filters.status) params.append('status', filters.status);
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.page) params.append('page', filters.page);
      if (filters.sort) params.append('sort', filters.sort);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
      });
      setRefunds(res.data.data?.content || []);
    } catch (err) {
      showToast("Lỗi khi tải danh sách", "error");
    }
  };

  useEffect(() => {
      fetchRefunds();
  }, [refresh, filters]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, keyword: searchTerm }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilters(prev => ({ ...prev, keyword: "" }));
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">COMPLETED</span>;
      case 'wait refund':
      case 'waitrefund':
        return <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">WAIT REFUND</span>;
      case 'processing':
        return <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">PROCESSING</span>;
      case 'cancelled':
        return <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">CANCELLED</span>;
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">{status || 'UNKNOWN'}</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const handleViewRefund = (refund) => {
    setSelectedRefund(refund);
    setShowRefundModal(true);
  };

  const handleConfirmRefund = async (refundId) => {
    try {
      setRefundLoading(true);
      
      const response = await axios.put(
        `http://localhost:6868/api/v1/refundInvoices/${refundId}`,
        { status: "COMPLETED" },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        showToast("Hoàn tiền thành công!");
        
        // Cập nhật status trong state
        setRefunds(prev => 
          prev.map(refund => 
            refund.id === refundId 
              ? { ...refund, status: "COMPLETED" }
              : refund
          )
        );
        
        setShowRefundModal(false);
        setSelectedRefund(null);
      }
    } catch (error) {
      console.error("Error confirming refund:", error);
      showToast("Lỗi khi xác nhận hoàn tiền", "error");
    } finally {
      setRefundLoading(false);
    }
  };

  const closeRefundModal = () => {
    setShowRefundModal(false);
    setSelectedRefund(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {toast.show && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: "", type: toast.type })} />
      )}
      
      <h2 className="text-3xl font-bold text-[#223a66] mb-2">
        Refund Invoice <span className="text-base font-normal text-gray-400">- Invoice List</span>
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Limit</label>
          <select
            value={filters.limit}
            onChange={(e) => setFilters(prev => ({ ...prev, limit: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Refund</label>
          <input
            type="date"
            value={filters.dateRefund}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRefund: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select Status</option>
            <option value="WAIT REFUND">Wait Refund</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Booking ID"
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex gap-2 items-end">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
          {filters.keyword && (
            <button
              onClick={clearSearch}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">ID Booking</th>
              <th className="border px-3 py-2">Refund Amount</th>
              <th className="border px-3 py-2">Bank Name</th>
              <th className="border px-3 py-2">Holder Name</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {refunds.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 text-gray-400">Không có hóa đơn hoàn tiền nào.</td>
              </tr>
            ) : (
              refunds.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="border px-3 py-2">#{item.id}</td>
                  <td className="border px-3 py-2">{item.bookingId || item.booking_id}</td>
                  <td className="border px-3 py-2">{formatCurrency(item.refundAmount || item.amount)}</td>
                  <td className="border px-3 py-2">{item.bankName || item.bank_name}</td>
                  <td className="border px-3 py-2">{item.holderName || item.holder_name}</td>
                  <td className="border px-3 py-2">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="border px-3 py-2">
                    <button
                      title="View"
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleViewRefund(item)}
                    >
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
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
            disabled={filters.page === 0}
          >
            &lt;
          </button>
          <span className="px-3 py-1 border rounded bg-gray-100">
            {filters.page + 1}
          </span>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Refund Modal */}
      <RefundModal
        isOpen={showRefundModal}
        onClose={closeRefundModal}
        refundData={selectedRefund}
        onConfirm={handleConfirmRefund}
        loading={refundLoading}
      />
    </div>
  );
};

export default ListRefund;