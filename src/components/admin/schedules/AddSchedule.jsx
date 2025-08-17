import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [form, setForm] = useState({
    doctorId: "",
    clinicId: "",
    dateSchedule: "",
    startTime: "",
    endTime: "",
    price: "",
    bookingLimit: "",
    active: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        toast.error("Vui lòng đăng nhập để tiếp tục", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      try {
        setDataLoading(true);

        // Fetch doctors and clinics concurrently
        const [doctorsRes, clinicsRes] = await Promise.all([
          fetch("http://localhost:6868/api/v1/doctors", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:6868/api/v1/clinics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const doctorsData = await doctorsRes.json();
        const clinicsData = await clinicsRes.json();

        if (doctorsRes.ok) {
          const doctorsArray = doctorsData?.data?.doctors || [];
          setDoctors(doctorsArray);
        } else {
          toast.error("Không thể tải danh sách bác sĩ", {
            position: "top-right",
            autoClose: 4000,
          });
        }

        if (clinicsRes.ok) {
          const clinicsArray = clinicsData?.data?.clinicList || [];
          setClinics(clinicsArray);
        } else {
          toast.error("Không thể tải danh sách phòng khám", {
            position: "top-right",
            autoClose: 4000,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Lỗi kết nối đến server", {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      doctorId: "",
      clinicId: "",
      dateSchedule: "",
      startTime: "",
      endTime: "",
      price: "",
      bookingLimit: "",
      active: true,
    });
  };

  const validateForm = () => {
    const required = [
      "doctorId",
      "clinicId",
      "dateSchedule",
      "startTime",
      "endTime",
      "price",
      "bookingLimit",
    ];

    for (let field of required) {
      if (!form[field]) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc", {
          position: "top-right",
          autoClose: 4000,
        });
        return false;
      }
    }

    // Validate time range
    if (form.startTime >= form.endTime) {
      toast.error("Thời gian kết thúc phải sau thời gian bắt đầu", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    // Validate date (not in the past)
    const selectedDate = new Date(form.dateSchedule);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      toast.error("Không thể tạo lịch khám trong quá khứ", {
        position: "top-right",
        autoClose: 4000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("http://localhost:6868/api/v1/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: form.doctorId,
          clinic_id: form.clinicId,
          date_schedule: form.dateSchedule,
          start_time: form.startTime,
          end_time: form.endTime,
          price: Number(form.price),
          booking_limit: Number(form.bookingLimit),
          active: form.active,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Thêm lịch khám thất bại");
      }

      toast.success("Thêm lịch khám thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      resetForm();
    } catch (err) {
      console.error("Error adding schedule:", err);
      toast.error(err.message || "Lỗi khi thêm lịch khám", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center gap-3 text-gray-600">
          <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="font-medium">Đang tải dữ liệu...</span>
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
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Thêm Lịch Khám Mới
            </h2>
            <p className="text-blue-100 mt-2">
              Tạo lịch khám cho bác sĩ tại phòng khám
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <svg
                  className="w-5 h-5 text-[#20c0f3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Thông Tin Lịch Khám
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Doctor Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Bác Sĩ <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="doctorId"
                    value={form.doctorId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Chọn bác sĩ</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.user?.fullname || "Chưa có tên"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clinic Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phòng Khám <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="clinicId"
                    value={form.clinicId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Chọn phòng khám</option>
                    {clinics.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.clinicName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ngày Khám <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateSchedule"
                    value={form.dateSchedule}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Giá Khám (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Nhập giá khám"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    required
                    min={0}
                    step={1000}
                  />
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Giờ Bắt Đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Giờ Kết Thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Booking Limit */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Giới Hạn Đặt Lịch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bookingLimit"
                    value={form.bookingLimit}
                    onChange={handleChange}
                    placeholder="Số lượng bệnh nhân tối đa"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                    required
                    min={1}
                    max={50}
                  />
                </div>

                {/* Active Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Trạng Thái
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-green-700 font-medium">Hoạt Động</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                onClick={resetForm}
                disabled={isLoading}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#20c0f3] hover:bg-[#1ba0d1] text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang Lưu...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Lưu Lịch Khám
                  </>
                )}
              </button>
            </div>
          </form>
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
          fontSize: "14px",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default AddSchedule;
