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
        console.error("Error fetching doctor:", error);
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
        const sorted = (json?.data || []).sort(
          (a, b) =>
            new Date(`1970-01-01T${a.start_time}`) -
            new Date(`1970-01-01T${b.start_time}`)
        );
        setSchedules(sorted);
      } catch (error) {
        console.error("Error fetching schedules:", error);
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
      alert("Please login to book an appointment.");
      setBookingLoading(false);
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
    } catch (e) {
      console.error("Token decode error:", e);
      alert("Invalid token. Please login again.");
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
        alert("Booking failed: " + result.message);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("An error occurred while booking.");
    }
    
    setBookingLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-[#23cf7c] text-4xl mb-4 mx-auto" />
          <p className="text-[#223a66] text-lg">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaUserMd className="text-gray-400 text-6xl mb-4 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Doctor Not Found</h3>
          <p className="text-gray-400">The doctor you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/list-doctor')}
            className="mt-4 bg-[#23cf7c] text-white px-6 py-2 rounded-full hover:bg-[#20c997] transition-colors"
          >
            Browse All Doctors
          </button>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

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
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
              Medical Professional
            </span>
            <h1 className="text-4xl md:text-5xl font-light mb-4 leading-tight mt-2">
              Dr. <span className="font-bold">{doctor.user?.fullname || doctor.user?.name}</span>
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90">
              {doctor.specialty?.specialtyName} Specialist
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Doctor Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
                  {/* Doctor Image */}
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

                  {/* Doctor Info */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#223a66] mb-2">
                      Dr. {doctor.user?.fullname || doctor.user?.name}
                    </h2>
                    <p className="text-[#23cf7c] font-semibold mb-4">
                      {doctor.specialty?.specialtyName} Specialist
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <FaAward className="text-[#23cf7c] w-4" />
                        <span className="text-gray-700 text-sm">{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaGraduationCap className="text-[#23cf7c] w-4" />
                        <span className="text-gray-700 text-sm">{doctor.qualification}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaMapMarkerAlt className="text-[#23cf7c] w-4" />
                        <span className="text-gray-700 text-sm">{doctor.user?.address || "Health City"}</span>
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

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#223a66]">500+</div>
                        <div className="text-xs text-gray-500">Patients</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#223a66]">{doctor.experience}</div>
                        <div className="text-xs text-gray-500">Years Exp</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[#223a66]">4.9</div>
                        <div className="text-xs text-gray-500">Rating</div>
                      </div>
                    </div>

                    {/* Contact Buttons */}
                    {/* <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-[#23cf7c] to-[#20c997] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                        <FaPhone className="inline mr-2" />
                        Call Now
                      </button>
                      <button className="w-full border-2 border-[#23cf7c] text-[#23cf7c] py-3 rounded-xl font-semibold hover:bg-[#23cf7c] hover:text-white transition-all duration-300">
                        <FaEnvelope className="inline mr-2" />
                        Send Message
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>

              {/* Doctor Details & Booking */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* About Doctor */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center">
                      <FaStethoscope className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#223a66]">About Dr. {doctor.user?.fullname}</h3>
                      <p className="text-gray-600">Professional Background & Expertise</p>
                    </div>
                  </div>

                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    <p className="text-lg mb-4">{doctor.bio || "A dedicated healthcare professional committed to providing exceptional patient care."}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-[#223a66] mb-3 flex items-center gap-2">
                          <FaGraduationCap className="text-[#23cf7c]" />
                          Education & Qualifications
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <FaCheckCircle className="text-[#23cf7c] text-xs" />
                            {doctor.qualification}
                          </li>
                          <li className="flex items-center gap-2">
                            <FaCheckCircle className="text-[#23cf7c] text-xs" />
                            Board Certified {doctor.specialty?.specialtyName}
                          </li>
                          <li className="flex items-center gap-2">
                            <FaCheckCircle className="text-[#23cf7c] text-xs" />
                            Advanced Medical Training
                          </li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-[#223a66] mb-3 flex items-center gap-2">
                          <FaAward className="text-[#23cf7c]" />
                          Experience & Expertise
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center gap-2">
                            <FaCheckCircle className="text-[#23cf7c] text-xs" />
                            {doctor.experience} years clinical experience
                          </li>
                          <li className="flex items-center gap-2">
                            <FaCheckCircle className="text-[#23cf7c] text-xs" />
                            Specialized in {doctor.specialty?.specialtyName}
                          </li>
                          <li className="flex items-center gap-2">
                            <FaCheckCircle className="text-[#23cf7c] text-xs" />
                            Patient-centered care approach
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointment Booking */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center">
                      <FaCalendarAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#223a66]">Book Appointment</h3>
                      <p className="text-gray-600">Available slots for {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FaClock className="text-[#23cf7c]" />
                      <span className="font-semibold text-[#223a66]">sửa theo style spa chuyên nghiệp:</span>
                    </div>

                    {schedules.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {schedules
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
                                    {schedule.booking_limit - schedule.number_booked} slots left
                                  </div>
                                </>
                              )}
                            </button>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <FaCalendarAlt className="text-gray-400 text-4xl mb-4 mx-auto" />
                        <h4 className="font-semibold text-gray-500 mb-2">No Available Slots Today</h4>
                        <p className="text-gray-400 text-sm">
                          Please check back tomorrow or contact us directly.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Booking Info */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <FaHeart className="text-[#23cf7c]" />
                      <h4 className="font-semibold text-[#223a66]">Booking Information</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Consultation fee starts from $100</li>
                      <li>• Please arrive 15 minutes before your appointment</li>
                      <li>• Bring your medical records and ID</li>
                      <li>• Free cancellation up to 24 hours before appointment</li>
                    </ul>
                  </div>
                </div>

                {/* Reviews Section (Optional) */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center">
                      <FaStar className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#223a66]">Patient Reviews</h3>
                      <p className="text-gray-600">What patients say about Dr. {doctor.user?.fullname}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Sample Review */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src="/images/patient-avatar.jpg"
                          alt="Patient"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h5 className="font-semibold text-[#223a66]">John Smith</h5>
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(star => (
                              <FaStar key={star} className="text-yellow-500 text-sm" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">
                        "Excellent doctor! Very professional and caring. The treatment was effective and the staff was friendly."
                      </p>
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
