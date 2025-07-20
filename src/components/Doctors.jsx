import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
          setActiveSpecialtyId(list[0].id); // chọn chuyên khoa đầu tiên mặc định
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
    <main className="bg-white min-h-screen">
      <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/images/about-banner.jpg')" }}></div>
        <div className="relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Specialized Doctors</h1>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-2">Doctors</h2>
          <p className="text-[#6f8ba4] max-w-2xl mx-auto">We provide a wide range of creative services.</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {specialties.map((spec) => (
            <button
              key={spec.id}
              className={`px-4 py-2 rounded font-semibold text-sm transition ${
                activeSpecialtyId === spec.id
                  ? "bg-[#f75757] text-white"
                  : "bg-gray-100 text-[#223a66] hover:bg-[#f75757] hover:text-white"
              }`}
              onClick={() => setActiveSpecialtyId(spec.id)}
            >
              {spec.specialtyName}
            </button>
          ))}
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center">
              <div className="w-56 h-40 flex items-center justify-center mb-4">
                <img
                  src={`http://localhost:6868/api/v1/images/view/${doctor.avatar || "default.png"}`}
                  alt={doctor.bio}
                  className="h-40 w-full object-cover rounded"
                />
              </div>
              <h3 className="font-bold text-[#223a66] mb-1">{doctor.bio}</h3>
              <p className="text-[#6f8ba4] text-sm">{doctor.specialty?.specialtyName || "Không rõ chuyên khoa"}</p>
              <button
                className="mt-3 px-4 py-2 bg-[#223a66] text-white rounded hover:bg-[#f75757] transition"
                onClick={() => navigate(`/Doctors-detail/${doctor.id}`)}
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Doctors;
