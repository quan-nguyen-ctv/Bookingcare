import React from "react";

const services = [
  {
    img: "/images/service-2.jpg",
    title: "Cardiology",
    link: "#",
  },
  {
    img: "/images/service-8.jpg",
    title: "Ophthalmology",
    link: "#",
  },
  {
    img: "/images/service-3.jpg",
    title: "Dental Care",
    link: "#",
  },
  {
    img: "/images/service-1.jpg",
    title: "Child Care",
    link: "#",
  },
  {
    img: "/images/service-6.jpg",
    title: "Bone & Joint Centre",
    link: "#",
  },
  {
    img: "/images/service-4 .jpg",
    title: "Digestive Health",
    link: "#",
  },
];

const MedicalServices = () => (
  <main className="bg-white min-h-screen">
    {/* Banner */}
    <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/images/about-banner.jpg')" }}></div>
      <div className="relative z-10 text-center">
        <div className="text-white text-sm mb-1">Our services</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">All Department Care Department</h1>
      </div>
    </section>

    {/* Section Title */}
    <section className="container mx-auto px-4 mb-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-2">Award winning patient care</h2>
        <div className="w-16 h-1 bg-[#f75757] mx-auto mb-4 rounded"></div>
        <p className="text-[#6f8ba4] max-w-2xl mx-auto">
          Let us better understand the need for pain so that we can become more resilient, even as joy gets entangled in the troubles of those who praise us. Let him seek greater things.
        </p>
      </div>
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col">
            <img
              src={service.img}
              alt={service.title}
              className="w-[280px] h-35 object-cover rounded mb-4" // Giảm từ h-40 xuống h-32
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h3 className="font-bold text-[#223a66] mb-1">{service.title}</h3>
              </div>
              <a
                href={service.link}
                className="text-[#223a66] text-sm font-semibold flex items-center gap-1 hover:text-[#f75757] transition"
              >
                Learn More <span className="ml-1">&gt;</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default MedicalServices;