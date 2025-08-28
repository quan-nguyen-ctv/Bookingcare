import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { 
  FaUserMd, 
  FaGraduationCap, 
  FaAward, 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStethoscope,
  FaHeart,
  FaStar,
  FaCheckCircle,
  FaSpinner
} from "react-icons/fa";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:6868/api/v1/doctors/${id}`);
        const json = await res.json();
        setDoctor(json?.data || null);
      } catch (error) {
        console.error("Lỗi khi tải thông tin bác sĩ:", error);
      }
      setLoading(false);
    };

    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const today = new Date().toISOString().split("T")[0];
        const res = await fetch(
          `http://localhost:6868/api/v1/schedules/doctor?doctorId=${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        const allSchedules = json?.data || [];

        const todaySchedules = allSchedules.filter(
          (s) => s.date_schedule === today
        );

        const sorted = todaySchedules.sort(
          (a, b) =>
            new Date(`1970-01-01T${a.start_time}`) -
            new Date(`1970-01-01T${b.start_time}`)
        );
        setSchedules(sorted);
      } catch (error) {
        console.error("Lỗi khi tải lịch khám:", error);
        setSchedules([]);
      }
    };

    fetchDoctor();
    fetchSchedules();
  }, [id]);

  const handleScheduleSelect = async (schedule) => {
    setBookingLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Vui lòng đăng nhập để đặt lịch hẹn.");
      setBookingLoading(false);
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    } catch (e) {
      console.error("Lỗi giải mã token:", e);
      alert("Token không hợp lệ. Vui lòng đăng nhập lại.");
      setBookingLoading(false);
      return;
    }

    const randomPaymentCode = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const res = await fetch("http://localhost:6868/api/v1/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
schedule_id: schedule.id,
          user_id: userId,
          payment_method: "",
          payment_code: randomPaymentCode,
          amount: schedule.price || 1000000,
          reason: "",
          status: "PENDING",
        }),
      });

      const result = await res.json();

      if (result.status === "success") {
        const bookingId = result.data.id;
        navigate("/payment", {
          state: {
            bookingId,
            schedule,
            doctor,
            specialty: doctor.specialty,
            clinicId: schedule.clinic_id,
          },
        });
      } else {
        alert("Đặt lịch thất bại: " + result.message);
      }
    } catch (err) {
      console.error("Lỗi khi đặt lịch:", err);
      alert("Có lỗi xảy ra khi đặt lịch hẹn.");
    }
    
    setBookingLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#23cf7c] text-4xl mb-4 mx-auto" />
          <p className="text-[#223a66] text-lg">Đang tải thông tin bác sĩ...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUserMd className="text-gray-400 text-6xl mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Không tìm thấy bác sĩ</h3>
          <p className="text-gray-400">Bác sĩ bạn tìm kiếm hiện không tồn tại.</p>
          <button 
            onClick={() => navigate('/list-doctor')}
            className="mt-4 bg-[#23cf7c] text-white px-6 py-2 rounded-full hover:bg-[#20c997] transition-colors"
          >
            Xem danh sách bác sĩ
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-r from-[#223a66] to-[#2c4a7a] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/doctor-hero-bg.jpg')",
            filter: "brightness(0.3)"
          }}
        />
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4 mt-5">
          <div className="max-w-4xl mx-auto">
            <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
              Chuyên gia y tế
            </span>
            <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight mt-2">
              <span className="font-bold">Bác sĩ {doctor.user?.fullname || doctor.user?.name}</span>
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90">
              Chuyên khoa {doctor.specialty?.specialtyName}
            </p>
</div>
</div>
      </section>

      {/* Nội dung chính */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Thông tin bác sĩ */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
                  <div className="relative">
                    <img
                      src={
                        doctor?.avatar
                          ? `http://localhost:6868/uploads/${encodeURIComponent(doctor.avatar)}`
                          : "/images/doctor.png"
                      }
                      alt={doctor.user?.fullname}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-500 text-sm" />
                        <span className="text-sm font-semibold">4.9</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#223a66] mb-2">
                      Bác sĩ {doctor.user?.fullname || doctor.user?.name}
                    </h2>
                    <p className="text-[#23cf7c] font-semibold mb-4">
                      Chuyên khoa {doctor.specialty?.specialtyName}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <FaAward className="text-[#23cf7c] w-4" />
                        <span className="text-gray-700 text-sm">{doctor.experience} năm kinh nghiệm</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaGraduationCap className="text-[#23cf7c] w-4" />
                        <span className="text-gray-700 text-sm">{doctor.qualification}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-[#23cf7c] w-4" />
                        <span className="text-gray-700 text-sm">{doctor.user?.address || "Thành phố Sức khỏe"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-[#23cf7c] w-4" />
                        <span className="text-gray-700 text-sm">{doctor.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaPhone className="text-[#23cf7c] w-4" />
<span className="text-gray-700 text-sm">{doctor.user?.phone_number}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chi tiết & Đặt lịch */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Giới thiệu */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center">
                      <FaStethoscope className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#223a66]">Giới thiệu về {doctor.user?.fullname}</h3>
                      <p className="text-gray-600">Chuyên môn & kinh nghiệm</p>
                    </div>
                  </div>

                  <p className="text-lg mb-4 text-gray-700">{doctor.bio || "Bác sĩ tận tâm với nghề, luôn đặt sức khỏe bệnh nhân lên hàng đầu."}</p>
                </div>

                {/* Đặt lịch */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center">
                      <FaCalendarAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#223a66]">Đặt lịch hẹn</h3>
                      <p className="text-gray-600">Các khung giờ khả dụng hôm nay ({new Date().toLocaleDateString()})</p>
                    </div>
                  </div>

             {schedules.length > 0 ? (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
    {schedules
      .filter((schedule) => schedule.active) // 🔹 Chỉ lấy schedule.active === true
      .map((schedule) => (
        <button
          key={schedule.id}
          className="bg-gradient-to-r from-[#23cf7c]/10 to-[#20c997]/10 border-2 border-[#23cf7c] text-[#23cf7c] hover:from-[#23cf7c] hover:to-[#20c997] hover:text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
          onClick={() => handleScheduleSelect(schedule)}
          disabled={bookingLoading}
        >
          {bookingLoading ? (
            <FaSpinner className="animate-spin mx-auto" />
          ) : (
            <>
              <div className="text-sm">
                {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
              </div>
              <div className="text-xs opacity-75">
                Còn {schedule.booking_limit - schedule.number_booked} chỗ
              </div>
</>
          )}
        </button>
      ))}
  </div>
) : (
  <div className="text-center py-12 bg-gray-50 rounded-xl">
    <FaCalendarAlt className="text-gray-400 text-4xl mb-4 mx-auto" />
    <h4 className="font-semibold text-gray-500 mb-2">Hôm nay chưa có lịch trống</h4>
    <p className="text-gray-400 text-sm">
      Vui lòng quay lại sau hoặc liên hệ trực tiếp với chúng tôi.
    </p>
  </div>
)}

                </div>

                {/* Đánh giá */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center">
                      <FaStar className="text-white text-xl" />
                    </div>
                   
                  </div>

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DoctorDetail;