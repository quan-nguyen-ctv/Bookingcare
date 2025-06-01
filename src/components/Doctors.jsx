import React, { useEffect, useState } from "react";

// Mock data cho tất cả chuyên khoa
const mockDoctors = [
  // Cardiology
  {
    id: 1,
    name: "Nguyen Van Binh",
    specialty: "Cardiology",
    img: "/images/1.jpg",
  },
  {
    id: 2,
    name: "Tran Thi Lan",
    specialty: "Cardiology",
    img: "/images/2.jpg",
  },
  // Ophthalmology
  {
    id: 3,
    name: "Le Quang Hieu",
    specialty: "Ophthalmology",
    img: "/images/3.jpg",
  },
  {
    id: 4,
    name: "Pham Thi Mai",
    specialty: "Ophthalmology",
    img: "/images/4.jpg",
  },
  // Dental Care
  {
    id: 5,
    name: "Nguyen Van Son",
    specialty: "Dental Care",
    img: "/images/doctor-5.jpg",
  },
  {
    id: 6,
    name: "Do Thi Hoa",
    specialty: "Dental Care",
    img: "/images/doctor-6.jpg",
  },
  // Child Care
  {
    id: 7,
    name: "Pham Van An",
    specialty: "Child Care",
    img: "/images/doctor-7.jpg",
  },
  {
    id: 8,
    name: "Nguyen Thi Dao",
    specialty: "Child Care",
    img: "/images/doctor-8.jpg",
  },
  // Bone & Joint Centre
  {
    id: 9,
    name: "Tran Van Minh",
    specialty: "Bone & Joint Centre",
    img: "/images/doctor-9.jpg",
  },
  {
    id: 10,
    name: "Le Thi Bich",
    specialty: "Bone & Joint Centre",
    img: "/images/doctor-10.jpg",
  },
  // Digestive Health
  {
    id: 11,
    name: "Ha Van Quyet",
    specialty: "Digestive Health",
    img: "/images/test-thumb1.jpg",
  },
  {
    id: 12,
    name: "Hai Thuy Vi",
    specialty: "Digestive Health",
    img: "/images/test-thumb2.jpg",
  },
  {
    id: 13,
    name: "Nguyen Chi Thanh",
    specialty: "Digestive Health",
    img: "/images/test-thumb3.jpg",
  },
  {
    id: 14,
    name: "Le Thi Thu",
    specialty: "Digestive Health",
    img: "/images/test-thumb1.jpg",
  },
];

const specialties = [
  "Cardiology",
  "Ophthalmology",
  "Dental Care",
  "Child Care",
  "Bone & Joint Centre",
  "Digestive Health",
];

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [activeSpecialty, setActiveSpecialty] = useState("Cardiology");

  useEffect(() => {
    setDoctors(mockDoctors.filter((d) => d.specialty === activeSpecialty));
  }, [activeSpecialty]);

  return (
    <main className="bg-white min-h-screen">
      {/* Banner */}
      <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
        ></div>
        <div className="relative z-10 text-center">
          <div className="text-white text-sm mb-1">All Doctors</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Specalized Doctors
          </h1>
        </div>
      </section>

      {/* Section Title */}
      <section className="container mx-auto px-4 mb-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-2">
            Doctors
          </h2>
          <div className="w-16 h-1 bg-[#f75757] mx-auto mb-4 rounded"></div>
          <p className="text-[#6f8ba4] max-w-2xl mx-auto">
            We provide a wide range of creative services adipisicing elit. Autem
            maxime rem modi eaque, voluptate. Beatae officiis neque
          </p>
        </div>
        {/* Specialties Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {specialties.map((spec) => (
            <button
              key={spec}
              className={`px-4 py-2 rounded font-semibold text-sm transition ${
                activeSpecialty === spec
                  ? "bg-[#f75757] text-white"
                  : "bg-gray-100 text-[#223a66] hover:bg-[#f75757] hover:text-white"
              }`}
              onClick={() => setActiveSpecialty(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
        {/* Doctors Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center"
              >
                <div className="w-56 h-40 flex items-center justify-center mb-4">
                  <img
                    src={doctor.img}
                    alt={doctor.name}
                    className="h-40 w-full object-cover rounded"
                  />
                </div>
                <h3 className="font-bold text-[#223a66] mb-1">{doctor.name}</h3>
                <p className="text-[#6f8ba4] text-sm">{doctor.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Doctors;