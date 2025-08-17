import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaArrowRight, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Doctors = () => {
  const [specialties, setSpecialties] = useState([]);
  const [activeSpecialtyId, setActiveSpecialtyId] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Gọi API lấy specialties
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch("http://localhost:6868/api/v1/specialties");
        const json = await res.json();
        const list = json?.data?.specialtyList;
        if (!Array.isArray(list)) throw new Error("Không thể load chuyên khoa");
        setSpecialties(list);
        if (list.length > 0) {
          setActiveSpecialtyId(list[0].id);
        }
      } catch (err) {
        setError("Lỗi load chuyên khoa: " + err.message);
      }
    };
    fetchSpecialties();
  }, []);

  // Gọi API lấy bác sĩ theo specialtyId
  useEffect(() => {
    if (!activeSpecialtyId) return;
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`http://localhost:6868/api/v1/doctors?specialtyId=${activeSpecialtyId}&page=0`);
        const json = await res.json();
        const list = json?.data?.doctors;
        if (!Array.isArray(list)) throw new Error("Không thể load bác sĩ");
        setDoctors(list);
      } catch (err) {
        setError("Lỗi load bác sĩ: " + err.message);
      }
    };
    fetchDoctors();
  }, [activeSpecialtyId]);

  return (
    <div className="bg-white min-h-screen">
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
            Medical Professionals
          </span>
          <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight mt-2">
            Our <span className="font-bold text-[#23cf7c]">Specialists</span>
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90">
            Meet our team of experienced and dedicated healthcare professionals
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
              Expert Medical Team
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-4 mt-2">
              Specialized <span className="font-bold">Doctors</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide a wide range of creative services with our experienced medical professionals.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center mb-8">
              {error}
            </div>
          )}

          {/* Specialty Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {specialties.map((spec) => (
              <button
                key={spec.id}
                className={`px-6 py-3 rounded-full font-medium text-sm transition duration-300 ${
                  activeSpecialtyId === spec.id
                    ? "bg-[#23cf7c] text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-[#223a66] hover:bg-[#23cf7c] hover:text-white shadow-sm"
                }`}
                onClick={() => setActiveSpecialtyId(spec.id)}
              >
                {spec.specialtyName}
              </button>
            ))}
          </div>

          {/* Doctor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 group">
                {/* Doctor Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={`http://localhost:6868/api/v1/images/view/${doctor.avatar || "default.png"}`}
                    alt={doctor.bio}
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                  
                  {/* Contact Icons */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                    <button className="w-10 h-10 bg-[#23cf7c] rounded-full flex items-center justify-center text-white hover:bg-[#1eb567] transition">
                      <FaPhoneAlt className="text-sm" />
                    </button>
                    <button className="w-10 h-10 bg-[#223a66] rounded-full flex items-center justify-center text-white hover:bg-[#1a2d52] transition">
                      <FaEnvelope className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-6 text-center">
                  <div className="mb-3">
                    <FaUserMd className="text-[#23cf7c] text-2xl mx-auto mb-2" />
                  </div>
                  <h3 className="text-xl font-bold text-[#223a66] mb-2">
                    {doctor.bio}
                  </h3>
                  <p className="text-[#23cf7c] font-medium mb-3">
                    {doctor.specialty?.specialtyName || "Không rõ chuyên khoa"}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Experienced healthcare professional
                  </p>
                  
                  {/* Action Button */}
                  <button
                    className="w-full bg-[#223a66] hover:bg-[#23cf7c] text-white py-3 rounded-full font-medium transition duration-300 flex items-center justify-center gap-2 group"
                    onClick={() => navigate(`/Doctors-detail/${doctor.id}`)}
                  >
                    View Profile
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {doctors.length === 0 && !error && (
            <div className="text-center py-16">
              <FaUserMd className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No Doctors Available</h3>
              <p className="text-gray-400">Please select a different specialty or try again later.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
            Need Medical Assistance?
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-6 mt-2">
            Book Your <span className="font-bold">Consultation</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Schedule an appointment with our experienced specialists for personalized healthcare solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/booking')}
              className="bg-[#23cf7c] hover:bg-[#1eb567] text-white px-8 py-4 rounded-full text-lg font-medium transition duration-300 shadow-lg"
            >
              Book Appointment
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-[#223a66] text-[#223a66] hover:bg-[#223a66] hover:text-white px-8 py-4 rounded-full text-lg font-medium transition duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Doctors;
