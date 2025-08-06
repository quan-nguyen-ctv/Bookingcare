import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserMd, FaClock, FaPhoneAlt, FaHeart, FaEye, FaBone, FaChild } from "react-icons/fa";

const Toast = ({ message, type, onClose }) => (
  <div
    className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
      ${type === "error" ? "bg-red-500" : "bg-green-500"}`}
    style={{ minWidth: 220 }}
  >
    {message}
    <button
      onClick={onClose}
      className="ml-4 text-white font-bold"
      style={{ background: "transparent", border: "none", cursor: "pointer" }}
    >
      ×
    </button>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Bạn cần đăng nhập để đặt lịch!", "error");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    navigate("/booking");
  };

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        // Lấy specialty đầu tiên để hiển thị doctors
        const specialtyRes = await fetch("http://localhost:6868/api/v1/specialties");
        const specialtyJson = await specialtyRes.json();
        const specialties = specialtyJson?.data?.specialtyList || [];
        
        if (specialties.length > 0) {
          const firstSpecialtyId = specialties[0].id;
          const doctorsRes = await fetch(`http://localhost:6868/api/v1/doctors?specialtyId=${firstSpecialtyId}&page=0`);
          const doctorsJson = await doctorsRes.json();
          const doctorsList = doctorsJson?.data?.doctors || [];
          
          // Lấy 3 bác sĩ đầu tiên
          setDoctors(doctorsList.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
        // Fallback data nếu API fail
        setDoctors([
          {
            id: 1,
            bio: "Dr. Sarah Johnson",
            specialty: { specialtyName: "Cardiologist" },
            avatar: null,
            experience: "15 years"
          },
          {
            id: 2,
            bio: "Dr. Michael Chen",
            specialty: { specialtyName: "Neurologist" },
            avatar: null,
            experience: "12 years"
          },
          {
            id: 3,
            bio: "Dr. Emily Davis",
            specialty: { specialtyName: "Pediatrician" },
            avatar: null,
            experience: "10 years"
          }
        ]);
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="bg-white">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: toast.type })}
        />
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-[#223a66] to-[#2c4a7a] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/home1.png')",
            filter: "brightness(0.7)"
          }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
            Your Health,
            <span className="block font-bold text-[#23cf7c]">Our Priority</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 opacity-90">
            Experience world-class medical care with cutting-edge technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookClick}
              className="bg-[#23cf7c] hover:bg-[#1eb567] text-white px-8 py-4 rounded-full text-lg font-medium transition duration-300 shadow-lg"
            >
              Book Appointment
            </button>
            <Link
              to="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-[#223a66] px-8 py-4 rounded-full text-lg font-medium transition duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
              We offer Services
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-4 mt-2">
              Our <span className="font-bold">Specialties</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive healthcare solutions tailored to your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaUserMd className="text-4xl" />,
                title: "General Medicine",
                description: "Complete health checkups and preventive care with experienced physicians"
              },
              {
                icon: <FaHeart className="text-4xl" />,
                title: "Cardiology",
                description: "Advanced heart care and cardiovascular treatments by specialists"
              },
              {
                icon: <FaEye className="text-4xl" />,
                title: "Ophthalmology", 
                description: "Comprehensive eye care and vision treatments with latest technology"
              },
              {
                icon: <FaBone className="text-4xl" />,
                title: "Orthopedics",
                description: "Bone, joint, and muscle care solutions for all ages"
              },
              {
                icon: <FaChild className="text-4xl" />,
                title: "Pediatrics",
                description: "Specialized care for children and infants with gentle approach"
              },
              {
                icon: <FaClock className="text-4xl" />,
                title: "Emergency Care",
                description: "24/7 emergency medical services for urgent healthcare needs"
              }
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition duration-300 text-center group"
              >
                <div className="text-[#23cf7c] mb-4 group-hover:scale-110 transition duration-300 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#223a66] mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
                About Our Clinic
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-6 mt-2">
                Why Choose <span className="font-bold">Our Care</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                With over 20 years of excellence in healthcare, we combine advanced 
                medical technology with compassionate care to deliver the best outcomes 
                for our patients and their families.
              </p>
              <div className="space-y-6">
                {[
                  { number: "25+", text: "Years of Experience" },
                  { number: "10,000+", text: "Happy Patients" },
                  { number: "50+", text: "Expert Doctors" },
                  { number: "24/7", text: "Emergency Care" }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#23cf7c] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {stat.number}
                      </span>
                    </div>
                    <span className="text-[#223a66] font-medium text-lg">
                      {stat.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/home2.jpg"
                alt="Medical Team"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#223a66] text-white p-6 rounded-2xl">
                <h4 className="font-bold text-xl mb-1">Award Winning</h4>
                <p className="text-sm opacity-90">Healthcare Provider</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
              Our Medical Team
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-4 mt-2">
              Meet Our <span className="font-bold">Specialists</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our team of experienced doctors are here to provide you with the best care
            </p>
          </div>

          {loadingDoctors ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#23cf7c]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {doctors.map((doctor, index) => (
                <div
                  key={doctor.id || index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        doctor.avatar 
                          ? `http://localhost:6868/api/v1/images/view/${doctor.avatar}`
                          : "/images/doctor.png"
                      }
                      alt={doctor.bio}
                      className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-[#223a66] mb-2">
                      {doctor.bio}
                    </h3>
                    <p className="text-[#23cf7c] font-medium mb-1">
                      {doctor.specialty?.specialtyName || doctor.specialty}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {doctor.experience || "Experienced professional"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/list-doctor"
              className="bg-[#223a66] hover:bg-[#1a2d52] text-white px-8 py-3 rounded-full font-medium transition duration-300"
            >
              View All Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#223a66] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
              Patient Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-light mb-4 mt-2">
              What Our <span className="font-bold">Patients Say</span>
            </h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Real experiences from real patients
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "John Smith",
                text: "Exceptional care and professional service. The doctors here are truly outstanding.",
                rating: 5
              },
              {
                name: "Maria Garcia",
                text: "I felt comfortable and well-cared for throughout my treatment. Highly recommended!",
                rating: 5
              },
              {
                name: "David Wilson",
                text: "The facilities are modern and the staff is incredibly friendly and knowledgeable.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-blue-100 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <h4 className="font-bold">
                  {testimonial.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
            Ready to Get Started
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-6 mt-2">
            Book Your <span className="font-bold">Appointment</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Take the first step towards better health. Our team is ready to provide you with exceptional care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleBookClick}
              className="bg-[#23cf7c] hover:bg-[#1eb567] text-white px-8 py-4 rounded-full text-lg font-medium transition duration-300 shadow-lg"
            >
              Book Appointment Now
            </button>
            <Link
              to="/contact"
              className="border-2 border-[#223a66] text-[#223a66] hover:bg-[#223a66] hover:text-white px-8 py-4 rounded-full text-lg font-medium transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              {
                icon: "📍",
                title: "Visit Us",
                info: "123 Medical Street, Health City"
              },
              {
                icon: "📞",
                title: "Call Us",
                info: "(+01) 123 456 7890"
              },
              {
                icon: "✉️",
                title: "Email Us",
                info: "info@medicalcenter.com"
              },
              {
                icon: "🕒",
                title: "Working Hours",
                info: "Mon-Fri: 9AM-8PM"
              }
            ].map((contact, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-4">{contact.icon}</div>
                <h3 className="font-bold text-[#223a66] mb-2">{contact.title}</h3>
                <p className="text-gray-600">{contact.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;