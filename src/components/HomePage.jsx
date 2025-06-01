import React from "react";
import { FaUserMd, FaClock, FaPhoneAlt } from "react-icons/fa";

const HomePage = () => (
  <main className="bg-[#f9f9f9]">
    {/* Hero Section */}
    <section className="relative">
      <img
        src="/images/slider-bg-1.jpg"
        alt="Hero"
        className="w-full h-[340px] md:h-[600px] object-cover"
      />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-xl">
            <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
              Total Health Care Solution
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#223a66] mt-2 mb-4 leading-tight">
              Your Most Trusted <br /> Health Partner
            </h1>
            <p className="text-[#6f8ba4] mb-6">
              A repudiandae ipsam labore ipsa voluptatum quidem
              quae laudantium quisquam aperiam maiores sunt fugit, deserunt rem suscipit placeat.
            </p>
            <button className="bg-[#f75757] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#e13b3b] transition">
              Make Appointment
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Info Cards */}
    <section className="container mx-auto px-4 -mt-16 mb-12 relative z-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white rounded-xl shadow-lg flex-1 p-6 flex flex-col gap-2 border border-gray-100">
          <div className="flex items-center gap-3">
            <FaUserMd className="text-2xl text-[#223a66]" />
            <span className="font-bold text-[#223a66]">24 Hours Service</span>
          </div>
          <div className="text-[#223a66] font-semibold">Online Appoinment</div>
          <p className="text-[#6f8ba4] text-sm">
            Get All time support for emergency. We have introduced the principle of family medicine.
          </p>
          <button className="mt-2 bg-[#223a66] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#1a2c4b] transition">
            MAKE APPOINTMENT
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg flex-1 p-6 flex flex-col gap-2 border border-gray-100">
          <div className="flex items-center gap-3">
            <FaClock className="text-2xl text-[#223a66]" />
            <span className="font-bold text-[#223a66]">Timing schedule</span>
          </div>
          <div className="text-[#223a66] font-semibold">Working Hours</div>
          <div className="text-[#6f8ba4] text-sm">
            <div>Sun - Wed : <span className="float-right">7:00 - 17:00</span></div>
            <div>Thu - Fri : <span className="float-right">8:00 - 17:00</span></div>
            <div>Sat - sun : <span className="float-right">9:00 - 17:00</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg flex-1 p-6 flex flex-col gap-2 border border-gray-100">
          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-2xl text-[#223a66]" />
            <span className="font-bold text-[#223a66]">Emergency Cases</span>
          </div>
          <div className="text-[#223a66] font-semibold">1-800-700-6200</div>
          <p className="text-[#6f8ba4] text-sm">
            Get All time support for emergency. We have introduced the principle of family medicine. Get Connected with us for any urgency.
          </p>
        </div>
      </div>
    </section>

    {/* Gallery & Personal Care Section */}
    <section className="container mx-auto px-4 mb-16">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <img
            src="/images/img-1.jpg"
            alt="Gallery 1"
            className="rounded-xl object-cover w-full h-64 md:h-80"
          />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <img
            src="/images/img-2.jpg"
            alt="Gallery 2"
            className="rounded-xl object-cover w-full h-64 md:h-80"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-2">
            Personal care <br /> &amp; healthy living
          </h2>
          <p className="text-[#6f8ba4]">
            We provide best leading medicine service
          </p>
        </div>
      </div>
    </section>
  </main>
);

export default HomePage;