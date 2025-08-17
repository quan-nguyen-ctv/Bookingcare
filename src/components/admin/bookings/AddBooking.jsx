import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBooking = () => {
  const [users, setUsers] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");

  const [amount, setAmount] = useState(0);
  const [paymentMethod] = useState("");
  const [paymentCode] = useState(Math.floor(100000 + Math.random() * 900000).toString());
  const [reason] = useState("");
  const [status] = useState("PENDING");

  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSpecialties, setLoadingSpecialties] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  
  const navigate = useNavigate();

  const token = localStorage.getItem("admin_token");

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
    } else if (type === "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (type === "info") {
      toast.info(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const axiosWithToken = axios.create({
    baseURL: "http://localhost:6868/api/v1",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Load users
  useEffect(() => {
    if (!token) {
      showToast("Không tìm thấy token admin. Vui lòng đăng nhập lại!", "error");
      return;
    }

    setLoadingUsers(true);
    axiosWithToken
      .get("/users/role?roleName=user")
      .then(res => {
        const userList = res.data?.data || [];
        setUsers(userList);
        showToast(`Đã tải ${userList.length} người dùng`);
      })
      .catch(err => {
        console.error("❌ User API error:", err);
        showToast("Lỗi khi tải danh sách người dùng", "error");
      })
      .finally(() => setLoadingUsers(false));
  }, [token]);

  // Load specialties
  useEffect(() => {
    setLoadingSpecialties(true);
    axios.get("http://localhost:6868/api/v1/specialties")
      .then(res => {
        const list = res.data?.data?.specialtyList || [];
        setSpecialties(list);
        if (list.length > 0) {
          setSelectedSpecialty(list[0].id);
        }
        showToast(`Đã tải ${list.length} chuyên khoa`);
      })
      .catch(err => {
        console.error("❌ Specialty API error:", err);
        showToast("Lỗi khi tải danh sách chuyên khoa", "error");
        setSpecialties([]);
      })
      .finally(() => setLoadingSpecialties(false));
  }, []);

  // Load doctors when specialty changes
  useEffect(() => {
    if (!selectedSpecialty) return;

    setLoadingDoctors(true);
    axios.get(`http://localhost:6868/api/v1/doctors?specialtyId=${selectedSpecialty}&page=0`)
      .then(res => {
        const list = res.data?.data?.doctors || [];
        setDoctors(list);
        setSelectedDoctor(list[0]?.id || "");
        showToast(`Đã tải ${list.length} bác sĩ cho chuyên khoa này`);
      })
      .catch(err => {
        console.error("❌ Doctor API error:", err);
        showToast("Lỗi khi tải danh sách bác sĩ", "error");
        setDoctors([]);
      })
      .finally(() => setLoadingDoctors(false));
  }, [selectedSpecialty]);

  // Load schedules when doctor or date changes
  useEffect(() => {
    if (!selectedDoctor || !scheduleDate) return;

    setLoadingSchedules(true);
    axios.get(`http://localhost:6868/api/v1/schedules/doctor?doctorId=${selectedDoctor}&dateSchedule=${scheduleDate}`)
      .then(res => {
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setSchedules(list);
        if (list.length > 0) {
          setSelectedSchedule(list[0]?.id.toString() || "");
          showToast(`Đã tải ${list.length} khung giờ khám`);
        } else {
          showToast("Không có lịch khám trong ngày này", "info");
        }
      })
      .catch(err => {
        console.error("❌ Schedule API error:", err);
        showToast("Lỗi khi tải lịch khám", "error");
        setSchedules([]);
      })
      .finally(() => setLoadingSchedules(false));
  }, [selectedDoctor, scheduleDate]);

  // Update amount when schedule changes
  useEffect(() => {
    const selected = schedules.find(s => String(s.id) === selectedSchedule);
    if (selected) {
      setAmount(selected.price || 0);
    }
  }, [selectedSchedule, schedules]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser || !selectedSpecialty || !selectedDoctor || !scheduleDate || !selectedSchedule) {
      showToast("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("admin_token");

    try {
      const res = await axios.post(
        "http://localhost:6868/api/v1/bookings",
        {
          schedule_id: Number(selectedSchedule),
          user_id: Number(selectedUser),
          payment_method: paymentMethod,
          payment_code: paymentCode,
          amount: Number(amount),
          reason,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast("Đặt lịch khám thành công!");
      
      // Delay navigation to show success toast
      setTimeout(() => {
        navigate("/admin/bookings/list");
      }, 1500);
      
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Lỗi khi đặt lịch khám";
      showToast(errorMessage, "error");
      console.error("❌ Booking API error:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Đặt Lịch Khám</h1>
              <p className="text-gray-600">Tạo lịch hẹn mới cho bệnh nhân</p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Thông Tin Đặt Lịch
            </h2>
            <p className="text-gray-600 mt-1">Vui lòng điền đầy đủ thông tin để tạo lịch hẹn</p>
          </div>

          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            {/* Patient Selection */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Thông Tin Bệnh Nhân
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chọn Bệnh Nhân *
                </label>
                <div className="relative">
                  <select 
                    value={selectedUser} 
                    onChange={e => setSelectedUser(e.target.value)} 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">-- Chọn bệnh nhân --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.fullname || u.name} - {u.phone_number}
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {loadingUsers && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Doctor Selection */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Thông Tin Bác Sĩ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chuyên Khoa *
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedSpecialty} 
                      onChange={e => setSelectedSpecialty(e.target.value)} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                    >
                      {specialties.map(s => (
                        <option key={s.id} value={s.id}>{s.specialtyName}</option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {loadingSpecialties && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bác Sĩ *
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedDoctor} 
                      onChange={e => setSelectedDoctor(e.target.value)} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">-- Chọn bác sĩ --</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.user?.fullname || "Không rõ tên"}
                        </option>
                      ))}
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {loadingDoctors && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Selection */}
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Lịch Khám Bệnh
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ngày Khám *
                  </label>
                  <input 
                    type="date" 
                    value={scheduleDate} 
                    onChange={e => setScheduleDate(e.target.value)} 
                    min={new Date().toISOString().split('T')[0]}
                    required 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Khung Giờ Khám *
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedSchedule} 
                      onChange={e => setSelectedSchedule(e.target.value)} 
                      required 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">-- Chọn khung giờ --</option>
                      {schedules
                        .filter(s => s.active && s.number_booked < s.booking_limit)
                        .map(s => {
                          const date = typeof s.date_schedule === "string" ? s.date_schedule : (s.date_schedule || []).join("-");
                          const start = typeof s.start_time === "string" ? s.start_time : (s.start_time || []).join(":");
                          const end = typeof s.end_time === "string" ? s.end_time : (s.end_time || []).join(":");
                          const availableSlots = s.booking_limit - s.number_booked;
                          return (
                            <option key={s.id} value={s.id}>
                              {start.slice(0, 5)} - {end.slice(0, 5)} ({availableSlots} chỗ trống)
                            </option>
                          );
                        })}
                    </select>
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {loadingSchedules && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {amount > 0 && (
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Thông Tin Thanh Toán
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <label className="block text-sm font-medium text-gray-600">Chi Phí Khám</label>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(amount)}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <label className="block text-sm font-medium text-gray-600">Mã Thanh Toán</label>
                    <p className="text-lg font-mono text-gray-800">{paymentCode}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/bookings/list")}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Hủy Bỏ
              </button>
              <button
                type="submit"
                disabled={loading || !selectedUser || !selectedSchedule}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Đang Xử Lý...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Đặt Lịch Khám
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
          fontSize: '14px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default AddBooking;
