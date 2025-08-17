import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [date, setDate] = useState(() => {
    // Mặc định là hôm nay
    return new Date().toISOString().split("T")[0];
  });

  // Lấy doctorId từ localStorage
  const doctorData = JSON.parse(localStorage.getItem("doctor_details"));
  const doctorId = doctorData?.id;

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeSlot = (startTime, endTime) => {
    if (!startTime || !endTime) return "Giờ không xác định";
    return `${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`;
  };

  const getTimeStatus = (startTime, endTime) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    
    if (date !== today) return "scheduled";
    
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const scheduleStart = startHour * 60 + startMin;
    const scheduleEnd = endHour * 60 + endMin;
    
    if (currentTime < scheduleStart - 30) return "upcoming";
    if (currentTime >= scheduleStart - 30 && currentTime <= scheduleEnd) return "active";
    return "completed";
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!doctorId) {
        showToast("Không tìm thấy thông tin bác sĩ", "error");
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("doctor_token");
        if (!token) {
          showToast("Phiên đăng nhập đã hết hạn", "error");
          return;
        }

        const res = await fetch(
          `http://localhost:6868/api/v1/schedules/doctor?doctorId=${doctorId}&dateSchedule=${date}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Không thể tải lịch trình");
        }

        const json = await res.json();
        
        // Sắp xếp lịch theo thời gian bắt đầu
        const sorted = (json?.data || []).sort((a, b) => {
          return new Date(`1970-01-01T${a.start_time}`) - new Date(`1970-01-01T${b.start_time}`);
        });
        
        setSchedules(sorted);
        
        if (sorted.length === 0) {
          showToast("Không có lịch trình nào trong ngày này", "info");
        } else {
          showToast(`Đã tải ${sorted.length} khung giờ làm việc`);
        }
        
      } catch (error) {
        console.error("Error fetching schedules:", error);
        showToast("Lỗi khi tải lịch trình", "error");
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchSchedules();
  }, [doctorId, date]);

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
    const status = getTimeStatus(schedule.start_time, schedule.end_time);
    const timeSlot = formatTimeSlot(schedule.start_time, schedule.end_time);
    
    if (status === "active") {
      showToast(`Đang trong giờ làm việc: ${timeSlot}`, "info");
    } else if (status === "upcoming") {
      showToast(`Sắp tới giờ làm việc: ${timeSlot}`, "info");
    } else if (status === "completed") {
      showToast(`Đã hoàn thành khung giờ: ${timeSlot}`, "info");
    } else {
      showToast(`Khung giờ đã lên lịch: ${timeSlot}`, "info");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#20c0f3] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải lịch trình...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] p-3 rounded-xl">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Lịch Khám Bệnh</h1>
              <p className="text-gray-600">Quản lý lịch trình làm việc của bạn</p>
            </div>
          </div>

          {/* Date Selection Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <label htmlFor="dateSchedule" className="text-lg font-semibold text-gray-800">
                  Chọn Ngày
                </label>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input
                  id="dateSchedule"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                />
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  {formatDate(date)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Khung Giờ Làm Việc
              </h2>
              <div className="text-sm text-gray-500">
                Tổng: {schedules.length} khung giờ
              </div>
            </div>
          </div>

          <div className="p-6">
            {schedules.length > 0 ? (
              <>
                {/* Legend */}
                <div className="mb-6 flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Sắp tới</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Đang hoạt động</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Đã hoàn thành</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">Đã lên lịch</span>
                  </div>
                </div>

                {/* Schedule Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {schedules.map((schedule) => {
                    const status = getTimeStatus(schedule.start_time, schedule.end_time);
                    const isSelected = selectedSchedule?.id === schedule.id;
                    
                    let statusColor = "bg-purple-500 hover:bg-purple-600";
                    let statusText = "Đã lên lịch";
                    let statusIcon = (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    );

                    if (status === "upcoming") {
                      statusColor = "bg-green-500 hover:bg-green-600";
                      statusText = "Sắp tới";
                      statusIcon = (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      );
                    } else if (status === "active") {
                      statusColor = "bg-blue-500 hover:bg-blue-600 animate-pulse";
                      statusText = "Đang hoạt động";
                      statusIcon = (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      );
                    } else if (status === "completed") {
                      statusColor = "bg-gray-500 hover:bg-gray-600";
                      statusText = "Đã hoàn thành";
                      statusIcon = (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      );
                    }

                    return (
                      <button
                        key={schedule.id}
                        onClick={() => handleScheduleClick(schedule)}
                        className={`${statusColor} ${
                          isSelected ? 'ring-4 ring-blue-300' : ''
                        } text-white p-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {statusIcon}
                            <span className="text-xs font-medium">{statusText}</span>
                          </div>
                          {schedule.active && (
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          )}
                        </div>
                        
                        <div className="text-center">
                          <div className="text-lg font-bold mb-1">
                            {formatTimeSlot(schedule.start_time, schedule.end_time)}
                          </div>
                          <div className="text-xs opacity-80">
                            Khung giờ làm việc
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">
                    Không có lịch trình
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Chưa có khung giờ làm việc nào được lên lịch trong ngày này
                  </p>
                  <button 
                    onClick={() => showToast("Tính năng thêm lịch trình đang phát triển", "info")}
                    className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    Thêm Lịch Trình
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Details Modal/Card */}
        {selectedSchedule && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Chi Tiết Khung Giờ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Thời gian</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatTimeSlot(selectedSchedule.start_time, selectedSchedule.end_time)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Ngày</label>
                  <p className="text-gray-900">{formatDate(selectedSchedule.date_schedule)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Trạng thái</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    selectedSchedule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedSchedule.active ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">ID Lịch trình</label>
                  <p className="text-gray-900 font-mono">#{selectedSchedule.id}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => showToast("Tính năng chỉnh sửa đang phát triển", "info")}
                className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Chỉnh sửa
              </button>
              <button 
                onClick={() => setSelectedSchedule(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
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

export default DoctorSchedule;