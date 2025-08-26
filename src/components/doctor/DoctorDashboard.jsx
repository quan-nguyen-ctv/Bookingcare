import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    completedAppointments: 0,
    pendingAppointments: 0,
  });

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

  useEffect(() => {
    const doctorData = JSON.parse(localStorage.getItem("doctor_user"));
    const userId = doctorData?.data?.id;
    const token = localStorage.getItem("doctor_token");

    if (!userId || !token) {
      showToast(
        "Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại!",
        "error"
      );
      return;
    }

    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:6868/api/v1/doctors/user/${userId}`,
          {
            method: "PUT", // Changed from PUT to GET
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          const doctorInfo = data?.data || null;

          if (doctorInfo) {
            setDoctor(doctorInfo);
            localStorage.setItem("doctor_details", JSON.stringify(doctorInfo));

            if (doctorInfo?.id) {
              localStorage.setItem("doctor_id", doctorInfo.id);
              console.log("Doctor ID saved:", doctorInfo.id);
            }

            showToast(`Chào mừng, ${doctorInfo.user?.fullname}!`);

            // Fetch additional stats
            await fetchDoctorStats(doctorInfo.id, token);
          } else {
            showToast("Không tìm thấy thông tin bác sĩ", "error");
            setDoctor(null);
          }
        } else {
          const errorData = await res.json();
          showToast(
            errorData.message || "Lỗi khi tải thông tin bác sĩ",
            "error"
          );
          setDoctor(null);
        }
      } catch (error) {
        console.error("Fetch doctor failed:", error);
        showToast("Lỗi kết nối đến server", "error");
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, []);

  const fetchDoctorStats = async (doctorId, token) => {
    try {
      // Mock API calls - replace with actual endpoints
      const appointmentsRes = await fetch(
        `http://localhost:6868/api/v1/appointments/doctor/${doctorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (appointmentsRes.ok) {
        const appointmentsData = await appointmentsRes.json();
        const appointments = appointmentsData.data || [];

        const today = new Date().toDateString();
        const todayAppointments = appointments.filter(
          (apt) => new Date(apt.appointment_date).toDateString() === today
        ).length;

        const completedAppointments = appointments.filter(
          (apt) => apt.status === "completed"
        ).length;

        const pendingAppointments = appointments.filter(
          (apt) => apt.status === "pending"
        ).length;

        setStats({
          todayAppointments,
          totalPatients: appointments.length,
          completedAppointments,
          pendingAppointments,
        });
      }
    } catch (error) {
      console.log("Could not fetch stats:", error);
    }
  };

  const getGenderDisplay = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      default:
        return gender || "—";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const StatCard = ({ title, value, icon, color, description }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {loading ? (
              <span className="animate-pulse bg-gray-200 h-8 w-16 rounded block"></span>
            ) : (
              value
            )}
          </p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#20c0f3] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải thông tin bác sĩ...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy thông tin
          </h3>
          <p className="text-gray-600 mb-6">
            Không thể tải thông tin bác sĩ. Vui lòng thử lại sau.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Welcome */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] rounded-xl p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm p-1">
                <img
                  src={`http://localhost:6868/api/v1/images/view/${
                    doctor.avatar || "default.png"
                  }`}
                  alt={doctor.user?.fullname}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Chào mừng, {doctor.user?.fullname}
                </h1>
                <p className="text-blue-100 text-lg">
                  {doctor.specialty?.specialtyName || "Bác sĩ chuyên khoa"}
                </p>
                <p className="text-blue-200 text-sm mt-2">
                  Hôm nay:{" "}
                  {new Date().toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Lịch Hôm Nay"
            value={stats.todayAppointments}
            description="Cuộc hẹn trong ngày"
            color="bg-blue-100"
            icon={
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />

          <StatCard
            title="Tổng Bệnh Nhân"
            value={stats.totalPatients}
            description="Tổng số bệnh nhân"
            color="bg-green-100"
            icon={
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Đã Hoàn Thành"
            value={stats.completedAppointments}
            description="Cuộc hẹn hoàn thành"
            color="bg-purple-100"
            icon={
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Chờ Xác Nhận"
            value={stats.pendingAppointments}
            description="Cuộc hẹn chờ xử lý"
            color="bg-orange-100"
            icon={
              <svg
                className="w-6 h-6 text-orange-600"
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
            }
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Thông Tin Cá Nhân
                </h3>
              </div>

              <div className="p-6">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#20c0f3] to-[#1ba0d1] p-1 mb-4">
                    <img
                      src={`http://localhost:6868/api/v1/images/view/${
                        doctor.avatar || "default.png"
                      }`}
                      alt={doctor.user?.fullname}
                      className="w-full h-full object-cover rounded-full bg-white"
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 text-center mb-2">
                    {doctor.user?.fullname}
                  </h4>
                  <span className="inline-block bg-[#20c0f3] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {doctor.specialty?.specialtyName || "Bác sĩ"}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {doctor.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium text-gray-900">
                        {doctor.user?.phone_number}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="font-medium text-gray-900">
                        {doctor.user?.address || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
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
                  Thông Tin Chuyên Môn
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ID Bác Sĩ
                      </label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="font-mono text-gray-900">#{doctor.id}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Giới Tính
                      </label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-900">
                          {getGenderDisplay(doctor.user?.gender)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngày Sinh
                      </label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-900">
                          {formatDate(doctor.user?.birthday)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Kinh Nghiệm
                      </label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-900">
                          {doctor.experience || "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Chuyên Khoa
                      </label>
                      <div className="bg-gradient-to-r from-[#20c0f3]/10 to-[#1ba0d1]/10 border border-[#20c0f3]/20 rounded-lg p-3">
                        <span className="text-[#20c0f3] font-semibold">
                          {doctor.specialty?.specialtyName || "Chưa xác định"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bằng Cấp
                      </label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-gray-900">
                          {doctor.qualification || "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vai Trò
                      </label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {doctor.user?.role?.name || "Bác sĩ"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {doctor.bio && (
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tiểu Sử
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 leading-relaxed">{doctor.bio}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Thao Tác Nhanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 group">
              <div className="bg-blue-500 text-white p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Xem Lịch Hẹn</p>
                <p className="text-sm text-gray-600">Quản lý cuộc hẹn</p>
              </div>
            </button>

            <button className="flex items-center justify-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 group">
              <div className="bg-green-500 text-white p-2 rounded-lg group-hover:bg-green-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Bệnh Nhân</p>
                <p className="text-sm text-gray-600">Danh sách bệnh nhân</p>
              </div>
            </button>

            <button className="flex items-center justify-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 group">
              <div className="bg-purple-500 text-white p-2 rounded-lg group-hover:bg-purple-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Thống Kê</p>
                <p className="text-sm text-gray-600">Báo cáo và phân tích</p>
              </div>
            </button>
          </div>
        </div> */}
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

export default DoctorDashboard;
