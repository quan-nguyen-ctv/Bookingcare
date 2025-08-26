import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PrescriptionModal = ({ isOpen, onClose, booking, doctorData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: "",
    prescriptions: [
      {
        id: 1,
        medicine: "",
        desciptionUsage: "",
        unit: 1
      }
    ]
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrescriptionChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addPrescription = () => {
    setFormData(prev => ({
      ...prev,
      prescriptions: [
        ...prev.prescriptions,
        {
          id: prev.prescriptions.length + 1,
          medicine: "",
          desciptionUsage: "",
          unit: 1
        }
      ]
    }));
  };

  const removePrescription = (index) => {
    if (formData.prescriptions.length > 1) {
      setFormData(prev => ({
        ...prev,
        prescriptions: prev.prescriptions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!booking || !booking.user || !booking.schedule) {
      toast.error("Thiếu thông tin booking");
      return;
    }

    if (!formData.diagnosis.trim()) {
      toast.error("Vui lòng nhập chẩn đoán");
      return;
    }

    const hasEmptyPrescription = formData.prescriptions.some(p => 
      !p.medicine.trim() || !p.desciptionUsage.trim() || p.unit <= 0
    );

    if (hasEmptyPrescription) {
      toast.error("Vui lòng điền đầy đủ thông tin đơn thuốc");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("doctor_token");

      const emailData = {
        toEmail: booking.user.email,
        subject: `Đơn thuốc từ Bác sĩ ${doctorData?.fullname || ""}`,
        booking_data: {
          doctor_name: doctorData?.fullname || "",
          specialty_name: doctorData?.specialty_name || "",
          clinic_name: doctorData?.clinic_name || "",
          clinic_address: doctorData?.clinic_address || "",
          start_time: booking.schedule.start_time,
          end_time: booking.schedule.end_time,
          date_schedule: booking.schedule.date_schedule,
          fullname: booking.user.fullname,
          email: booking.user.email,
          phone_number: booking.user.phone_number
        },
        medical_results: {
          doctor_name: doctorData?.fullname || "",
          specialty_name: doctorData?.specialty_name || "",
          clinic_name: doctorData?.clinic_name || "",
          fullname: booking.user.fullname,
          email: booking.user.email,
          phone_number: booking.user.phone_number,
          date_schedule: booking.schedule.date_schedule,
          diagnosis: formData.diagnosis,
          prescriptions: formData.prescriptions
        }
      };

      await axios.post(
        "http://localhost:6868/api/v1/email/medicalResult",
        emailData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success("Đã gửi đơn thuốc qua email thành công!");
      onClose();
      
      // Reset form
      setFormData({
        diagnosis: "",
        prescriptions: [
          {
            id: 1,
            medicine: "",
            desciptionUsage: "",
            unit: 1
          }
        ]
      });

    } catch (error) {
      console.error("Error sending prescription:", error);
      toast.error(error.response?.data?.message || "Lỗi khi gửi đơn thuốc");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] p-6 text-white rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Gửi Đơn Thuốc</h2>
              <p className="opacity-90 mt-1">
                Bệnh nhân: {booking?.user?.fullname} - {booking?.user?.phone_number}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Thông tin bệnh nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Họ tên:</span> 
                <span className="font-medium ml-2">{booking?.user?.fullname}</span>
              </div>
              <div>
                <span className="text-gray-600">Email:</span> 
                <span className="font-medium ml-2">{booking?.user?.email}</span>
              </div>
              <div>
                <span className="text-gray-600">SĐT:</span> 
                <span className="font-medium ml-2">{booking?.user?.phone_number}</span>
              </div>
              <div>
                <span className="text-gray-600">Ngày khám:</span> 
                <span className="font-medium ml-2">{booking?.schedule?.date_schedule}</span>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chẩn đoán <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
              rows="3"
              placeholder="Nhập chẩn đoán bệnh..."
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              required
            />
          </div>

          {/* Prescriptions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Đơn thuốc <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addPrescription}
                className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                + Thêm thuốc
              </button>
            </div>

            <div className="space-y-4">
              {formData.prescriptions.map((prescription, index) => (
                <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">Thuốc #{index + 1}</h4>
                    {formData.prescriptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên thuốc <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                        placeholder="Tên thuốc"
                        value={prescription.medicine}
                        onChange={(e) => handlePrescriptionChange(index, 'medicine', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cách dùng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                        placeholder="Ví dụ: Uống sau ăn"
                        value={prescription.desciptionUsage}
                        onChange={(e) => handlePrescriptionChange(index, 'desciptionUsage', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                        placeholder="1"
                        value={prescription.unit}
                        onChange={(e) => handlePrescriptionChange(index, 'unit', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#20c0f3] hover:bg-[#1ba0d1] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              )}
              {loading ? "Đang gửi..." : "Gửi đơn thuốc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrescriptionModal;