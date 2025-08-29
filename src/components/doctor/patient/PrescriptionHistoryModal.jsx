import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PrescriptionHistoryModal = ({ isOpen, onClose, bookingId }) => {
  const [loading, setLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  // Fetch prescription history từ API
  const fetchPrescriptionHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("doctor_token");
      
      const response = await axios.get(
        `http://localhost:6868/api/v1/histories/${bookingId}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (response.data && response.data.data && response.data.data.prescriptions) {
        setPrescriptions(response.data.data.prescriptions);
      }
    } catch (error) {
      console.error("Error fetching prescription history:", error);
      toast.error("Không thể tải lịch sử đơn thuốc");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data khi modal mở
  useEffect(() => {
    if (isOpen && bookingId) {
      fetchPrescriptionHistory();
    }
  }, [isOpen, bookingId]);

  // Reset data khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setPrescriptions([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] p-6 text-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Lịch Sử Đơn Thuốc</h2>
              <p className="opacity-90 mt-1">
                Xem các đơn thuốc đã gửi cho bệnh nhân
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-[#20c0f3] border-t-transparent rounded-full mr-3"></div>
              <span className="text-gray-600">Đang tải lịch sử đơn thuốc...</span>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-12">
<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có đơn thuốc nào</h3>
              <p className="text-gray-400">Bệnh nhân này chưa được kê đơn thuốc nào.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#20c0f3]">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-gray-800">Thông tin chung</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium ml-2">#{bookingId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tổng số đơn thuốc:</span>
                    <span className="font-medium ml-2">{prescriptions.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ngày xem:</span>
                    <span className="font-medium ml-2">{new Date().toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              {/* Prescription List */}
              <div className="space-y-4">
                {prescriptions.map((prescription, index) => (
                  <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#20c0f3] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <h4 className="font-semibold text-gray-800">Thuốc #{prescription.id}</h4>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        ID: {prescription.id}
</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <label className="block text-xs font-medium text-blue-700 mb-1 uppercase tracking-wide">
                          Tên thuốc
                        </label>
                        <p className="text-sm font-semibold text-blue-900">
                          {prescription.medicine || "Không xác định"}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-3">
                        <label className="block text-xs font-medium text-green-700 mb-1 uppercase tracking-wide">
                          Cách sử dụng
                        </label>
                        <p className="text-sm text-green-900">
                          {prescription.descriptionUsage || prescription.desciptionUsage || "Chưa có hướng dẫn"}
                        </p>
                      </div>
                      
                      <div className="bg-orange-50 rounded-lg p-3">
                        <label className="block text-xs font-medium text-orange-700 mb-1 uppercase tracking-wide">
                          Số lượng
                        </label>
                        <p className="text-sm font-semibold text-orange-900">
                          {prescription.unit || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-[#20c0f3]/10 to-[#1ba0d1]/10 rounded-lg p-4 border border-[#20c0f3]/20">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                  </svg>
                  <h4 className="font-semibold text-[#20c0f3]">Tóm tắt đơn thuốc</h4>
                </div>
                <p className="text-sm text-gray-700">
                  Bệnh nhân đã được kê tổng cộng <span className="font-semibold">{prescriptions.length} loại thuốc</span> trong lần khám này.
                  Vui lòng theo dõi tình trạng sức khỏe của bệnh nhân và tư vấn khi cần thiết.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <button
              onClick={onClose}
className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
            {prescriptions.length > 0 && (
              <button
                onClick={() => {
                  toast.info("Tính năng in đơn thuốc đang phát triển");
                }}
                className="px-6 py-2 bg-[#20c0f3] hover:bg-[#1ba0d1] text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                In đơn thuốc
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHistoryModal;