import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaClock, FaMapMarkerAlt, FaDollarSign, FaUserMd, FaCalendarAlt, FaPhone, FaEnvelope, FaGraduationCap, FaAward, FaBirthdayCake, FaVenus, FaMars } from "react-icons/fa";

const API_BASE_URL = "http://localhost:6868/";

const MedicalServiceDetail = () => {
  const navigate = useNavigate();
  const { idNameSpecialty } = useParams();
  const id =
    typeof idNameSpecialty === "string" && idNameSpecialty.includes("-")
      ? idNameSpecialty.split("-")[0]
      : "";

  const [specialty, setSpecialty] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBooking = async (schedule, doctor) => {
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
      alert("Token không hợp lệ.");
      return;
    }

    const paymentCode = Math.floor(100000 + Math.random() * 900000).toString();

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
          payment_code: paymentCode,
          amount: schedule.price || 100000,
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

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch specialty
        const specialtyRes = await fetch(`${API_BASE_URL}api/v1/specialties/${id}`);
        const specialtyData = await specialtyRes.json();
        setSpecialty(specialtyData?.data || null);

        // Fetch clinics
        const clinicsRes = await fetch(`${API_BASE_URL}api/v1/clinics?specialtyId=${id}`);
        const clinicsData = await clinicsRes.json();
        setClinics(clinicsData?.data?.clinicList || []);

        // Fetch doctors
        const doctorsRes = await fetch(`${API_BASE_URL}api/v1/doctors?specialtyId=${id}`);
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData?.data?.doctors || []);

        // Fetch schedules
        const schedulesRes = await fetch(`${API_BASE_URL}api/v1/schedules?specialtyId=${id}`);
        const schedulesData = await schedulesRes.json();
        const scheduleList = schedulesData?.data?.scheduleResponseList;
        setSchedules(Array.isArray(scheduleList) ? scheduleList : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#23cf7c] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-r from-[#223a66] to-[#2c4a7a] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/about-banner.jpg')",
            filter: "brightness(0.7)"
          }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
            Medical Department
          </span>
          <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight mt-2">
            {specialty?.specialtyName || <span className="font-bold">Specialty</span>}
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90">
            Expert care and advanced treatment options
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              
              {/* Description */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  {specialty?.specialtyImage && (
                    <div className="mb-8 rounded-2xl overflow-hidden">
                      <img
                        src={`http://localhost:6868/uploads/${encodeURIComponent(specialty.specialtyImage)}`}
                        alt={specialty?.specialtyName}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
                      About Department
                    </span>
                    <h2 className="text-3xl font-light text-[#223a66] mb-4 mt-2">
                      {specialty?.specialtyName || <span className="font-bold">Specialty Overview</span>}
                    </h2>
                  </div>
                  
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    {specialty?.description && typeof specialty.description === "string" ? (
                      <div dangerouslySetInnerHTML={{ __html: specialty.description }} />
                    ) : (
                      <p className="text-gray-500 italic">No description available for this specialty.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule & Info Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#223a66] to-[#2c4a7a] p-6 text-white">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <FaClock />
                      Schedule & Information
                    </h3>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Time Schedule */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-[#223a66] mb-4 flex items-center gap-2">
                        <FaClock className="text-[#23cf7c]" />
                        Working Hours
                      </h4>
                      <div className="space-y-3">
                        {[
                          ["Monday - Friday", "7:00 - 17:00"],
                          ["Saturday", "7:00 - 16:00"],
                          ["Sunday", "Closed"]
                        ].map(([day, time], index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-700 font-medium">{day}</span>
                            <span className="text-[#223a66] font-semibold">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cost */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-[#223a66] mb-4 flex items-center gap-2">
                        <FaDollarSign className="text-[#23cf7c]" />
                        Consultation Fee
                      </h4>
                      <div className="bg-[#23cf7c]/10 rounded-xl p-4 border border-[#23cf7c]/20">
                        <div className="text-center">
                          <span className="text-[#23cf7c] font-bold text-2xl">
                            ${specialty?.price || "Contact us"}
                          </span>
                          <p className="text-gray-600 text-sm mt-1">Starting from</p>
                        </div>
                      </div>
                    </div>

                    {/* Locations */}
                    <div>
                      <h4 className="font-semibold text-[#223a66] mb-4 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#23cf7c]" />
                        Our Locations
                      </h4>
                      <div className="space-y-3">
                        {clinics.length > 0 ? (
                          clinics.map((clinic) => (
                            <div key={clinic.id} className="bg-gray-50 rounded-xl p-4">
                              <h5 className="font-medium text-[#223a66] mb-1">
                                {clinic.clinicName || "Clinic"}
                              </h5>
                              <p className="text-gray-600 text-sm">
                                {clinic.address || "Address updating..."}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm italic">Locations updating...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctors Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
                  Our Medical Team
                </span>
                <h2 className="text-3xl font-light text-[#223a66] mb-4 mt-2">
                  Expert <span className="font-bold">Doctors</span>
                </h2>
                <p className="text-gray-600">
                  Meet our experienced medical professionals specialized in this department
                </p>
              </div>
              
              <div className="space-y-6">
                {doctors.length > 0 ? (
                  doctors.map((doctor) => {
                    // const doctorSchedules = schedules
                    //   .filter((s) => {
                    //     const today = new Date().toISOString().split("T")[0];
                    //     const now = new Date();
                    //     const endTime = new Date(`${today}T${s.end_time}`);
                    //     return (
                    //       s.doctor_id === doctor.id &&
                    //       s.date_schedule === today &&
                    //       s.active &&
                    //       endTime > now
                    //     );
                    //   })
                    //   .sort((a, b) => a.start_time.localeCompare(b.start_time));

                    // // Log để kiểm tra
                    // console.log(`=== Doctor: ${doctor?.user?.fullname} (ID: ${doctor.id}) ===`);
                    // console.log('All schedules:', schedules);
                    // // console.log('Doctor schedules:', doctorSchedules);
                    // console.log('Today:', new Date().toISOString().split("T")[0]);
                    // console.log('Current time:', new Date());
                    // console.log('Filtered schedules for this doctor:', schedules.filter(s => s.doctor_id === doctor.id));
                    // console.log('=== End Doctor Info ===');

                    return (
                      <div key={doctor?.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          
                          {/* Doctor Info */}
                          <div className="lg:col-span-1">
                            <div className="flex flex-col items-center text-center">
                              <img
                                src={
                                  doctor?.avatar
                                    ? `http://localhost:6868/uploads/${encodeURIComponent(doctor.avatar)}`
                                    : "/images/doctor.png"
                                }
                                alt="Doctor avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-[#23cf7c] mb-4 shadow-lg"
                              />
                              <h3 className="text-xl font-bold text-[#223a66] mb-2">
                                {doctor?.user?.fullname}
                              </h3>
                              <p className="text-[#23cf7c] font-medium mb-4">
                                {specialty?.specialtyName} Specialist
                              </p>
                              <button
                                className="bg-[#223a66] hover:bg-[#1a2d52] text-white px-6 py-2 rounded-full transition duration-300 text-sm"
                                onClick={() => navigate(`/Doctors-detail/${doctor.id}`)}
                              >
                                View Profile
                              </button>
                            </div>
                          </div>

                          {/* Doctor Details */}
                          <div className="lg:col-span-1">
                            <h4 className="font-semibold text-[#223a66] mb-4">Doctor Information</h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <FaEnvelope className="text-[#23cf7c] w-4" />
                                <span className="text-gray-700 text-sm">{doctor?.user?.email}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <FaPhone className="text-[#23cf7c] w-4" />
                                <span className="text-gray-700 text-sm">{doctor?.user?.phone_number}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {doctor?.user?.gender === 'Male' ? 
                                  <FaMars className="text-[#23cf7c] w-4" /> : 
                                  <FaVenus className="text-[#23cf7c] w-4" />
                                }
                                <span className="text-gray-700 text-sm">{doctor?.user?.gender}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <FaBirthdayCake className="text-[#23cf7c] w-4" />
                                <span className="text-gray-700 text-sm">{doctor?.user?.birthday}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <FaAward className="text-[#23cf7c] w-4" />
                                <span className="text-gray-700 text-sm">{doctor?.experience} years experience</span>
                              </div>
                              {doctor?.qualification && (
                                <div className="flex items-center gap-3">
                                  <FaGraduationCap className="text-[#23cf7c] w-4" />
                                  <span className="text-gray-700 text-sm">{doctor.qualification}</span>
                                </div>
                              )}
                            </div>
                            {doctor?.bio && (
                              <div className="mt-4">
                                <p className="text-gray-600 text-sm italic">"{doctor.bio}"</p>
                              </div>
                            )}
                          </div>

                          {/* Schedule - Simplified Version */}
                          <div className="lg:col-span-1">
                            <h4 className="font-semibold text-[#223a66] mb-4 flex items-center gap-2">
                              <FaCalendarAlt className="text-[#23cf7c]" />
                              Available Times
                            </h4>
                            {(() => {
                              // Filter schedules for this doctor
                              const doctorSchedules = schedules.filter(s => s.doctor_id == doctor.id);
                              
                              return doctorSchedules.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                  {doctorSchedules
                                    .filter((schedule) => {
                                      const now = new Date();
                                      const scheduleDateStr = Array.isArray(schedule.date_schedule)
                                        ? schedule.date_schedule.join("-")
                                        : schedule.date_schedule;
                                      const startTimeStr = Array.isArray(schedule.start_time)
                                        ? schedule.start_time.join(":")
                                        : schedule.start_time;

                                      const scheduleDateTime = new Date(`${scheduleDateStr}T${startTimeStr}`);

                                      return (
                                        schedule.active &&
                                        schedule.number_booked < schedule.booking_limit &&
                                        scheduleDateTime > now
                                      );
                                    })
                                    .map((schedule) => (
                                      <button
                                        key={schedule.id}
                                        className="bg-gradient-to-r from-[#23cf7c]/10 to-[#20c997]/10 border-2 border-[#23cf7c] text-[#23cf7c] hover:from-[#23cf7c] hover:to-[#20c997] hover:text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
                                        onClick={() => handleBooking(schedule, doctor)}
                                        disabled={false} // Add loading state if needed
                                      >
                                        <div className="text-sm">
                                          {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                                        </div>
                                        <div className="text-xs opacity-75">
                                          {schedule.booking_limit - schedule.number_booked} slots left
                                        </div>
                                      </button>
                                    ))}
                                </div>
                              ) : (
                                <div className="bg-gray-100 rounded-xl p-4 text-center">
                                  <FaCalendarAlt className="text-gray-400 text-2xl mb-2 mx-auto" />
                                  <p className="text-gray-500 text-sm">No available slots</p>
                                  <p className="text-gray-400 text-xs mt-1">Please check back later</p>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <FaUserMd className="text-gray-300 text-6xl mb-4 mx-auto" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">No Doctors Available</h3>
                    <p className="text-gray-400">
                      Currently no doctors are assigned to this specialty.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MedicalServiceDetail;
