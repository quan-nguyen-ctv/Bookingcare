import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Thêm dòng này

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:6868/api/v1/doctors/${id}`);
      const json = await res.json();
      setDoctor(json?.data || null);
      setLoading(false);
    };

    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const today = new Date().toISOString().split("T")[0];

        const res = await fetch(
          `http://localhost:6868/api/v1/schedules/doctor?doctorId=${id}&dateSchedule=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        const sorted = (json?.data || []).sort(
          (a, b) =>
            new Date(`1970-01-01T${a.start_time}`) -
            new Date(`1970-01-01T${b.start_time}`)
        );
        setSchedules(sorted);
      } catch (error) {
        console.error("Lỗi khi lấy lịch trình:", error);
        setSchedules([]);
      }
    };

    fetchDoctor();
    fetchSchedules();
  }, [id]);

  const handleScheduleSelect = async (schedule) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập để đặt lịch.");
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    } catch (e) {
      console.error("Lỗi giải mã token:", e);
      alert("Token không hợp lệ. Vui lòng đăng nhập lại.");
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
          payment_method: "VNPay", // Bạn có thể thay bằng "MOMO" nếu cần
          payment_code: randomPaymentCode,
          amount: schedule.price || 1000000, // fallback nếu không có giá
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
      console.error("Lỗi đặt lịch:", err);
      alert("Đã xảy ra lỗi khi đặt lịch.");
    }
  };

  if (loading) return <div className="p-8">Đang tải dữ liệu...</div>;
  if (!doctor) return <div className="p-8">Không tìm thấy bác sĩ.</div>;

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="bg-white min-h-screen">
      <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
        ></div>
        <div className="relative z-10 text-center">
          <h1 className="text-1xl md:text-1xl font-bold text-white mb-2">Doctor Detail</h1>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {doctor.user?.fullname || doctor.user?.name}
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            <img
              src={`http://localhost:6868/api/v1/images/view/${doctor.avatar || "default.png"}`}
              alt={doctor.user?.fullname || doctor.user?.name}
              className="h-48 w-48 object-cover rounded mb-4"
            />
            <div className="font-bold text-[#223a66] text-lg mb-1">
              {doctor.user?.fullname || doctor.user?.name}
            </div>
            <div className="text-[#6f8ba4] mb-2">
              {doctor.specialty?.specialtyName}
            </div>
            <div className="flex gap-2 justify-center mt-2">
              <a href="#" className="text-[#223a66]"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-[#223a66]"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-[#223a66]"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="text-[#223a66]"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#223a66] mb-2">
              Introducing to myself
            </h3>
            <div className="mb-2">
              <span className="font-semibold">Experience:</span> {doctor.experience}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Qualification:</span> {doctor.qualification}
            </div>
            <div className="mb-2">{doctor.bio}</div>
            <div className="mb-2">
              <span className="font-semibold">Address:</span> {doctor.user?.address || "Đang cập nhật"}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Date:</span> {today}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Select Time:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {schedules.length > 0 ? (
                  schedules.map((schedule) => (
                    <button
                      key={schedule.id}
                      className="px-3 py-1 border rounded text-sm hover:bg-blue-100"
                      onClick={() => handleScheduleSelect(schedule)}
                    >
                      {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                    </button>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Không có lịch hôm nay</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#dce8f4] rounded-xl p-6 mb-8">
          <h4 className="font-bold text-[#223a66] mb-2">My Educational Qualifications</h4>
          <div className="mb-2">
            <span className="font-semibold">Doctor:</span> {doctor.user?.fullname || doctor.user?.name}
          </div>
          <div className="mb-2">
            <span className="font-semibold">Specialty:</span> {doctor.specialty?.specialtyName}
          </div>
          <ul className="list-disc ml-6 text-[#6f8ba4]">
            <li>{doctor.experience}</li>
            <li>{doctor.qualification}</li>
            <li>{doctor.bio}</li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default DoctorDetail;
