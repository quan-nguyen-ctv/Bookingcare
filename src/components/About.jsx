import React from "react";

const aboutCards = [
  {
    img: "/images/about-1.jpg",
    title: "Healthcare for Kids",
    desc: "Voluptate aperiam esse possimus maxime repellendus, nihil quod accusantium...",
  },
  {
    img: "/images/about-2.jpg",
    title: "Medical Counseling",
    desc: "Voluptate aperiam esse possimus maxime repellendus, nihil quod accusantium...",
  },
  {
    img: "/images/about-3.jpg",
    title: "Modern Equipments",
    desc: "Voluptate aperiam esse possimus maxime repellendus, nihil quod accusantium...",
  },
  {
    img: "/images/about-4.jpg",
    title: "Qualified Doctors",
    desc: "Voluptate aperiam esse possimus maxime repellendus, nihil quod accusantium...",
  },
];

const About = () => (
  <main className="bg-white min-h-screen">
    {/* Banner */}
    <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/images/about-banner.jpg')" }}></div>
      <div className="relative z-10 text-center">
        <div className="text-white text-sm mb-1">About Us</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">About Us</h1>
      </div>
    </section>

    {/* Main Content */}
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-4">
            Personal care <br /> for your healthy living
          </h2>
        </div>
        <div className="flex-1 text-[#6f8ba4]">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt, quod laborum alias. Vitae dolorum, officiis dicta! Sepe ullam facere et, consequatur incidunt, quae esse, quis ut reprehenderit dignissimos, libero delectus.
          </p>
        </div>
      </div>
      <div className="flex justify-center mb-10">
        <img src="/images/sign.png" alt="Signature" className="w-[670px] h-50 md:h-35 opacity-60 ml-24 filter contrast-200 brightness-75" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {aboutCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4 flex flex-col items-center text-center">
            <img src={card.img} alt={card.title} className="w-full h-32 object-cover rounded mb-4" />
            <h3 className="font-bold text-[#223a66] mb-2">{card.title}</h3>
            <p className="text-[#6f8ba4] text-sm">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default About;