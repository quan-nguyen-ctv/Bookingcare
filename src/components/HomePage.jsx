import React from "react";
import { FaUserMd, FaClock, FaPhoneAlt } from "react-icons/fa";
import '../assets/css/flaticon.css'; 

const HomePage = () => (
  <main className="bg-[#f9f9f9]">
    {/* Hero Section */}
    <section className="relative">
        <div className="bg-[#223a66] w-full">
        <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row items-center">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Welcome to our <br /> chiropractic centre
            </h1>
            <p className="text-[#dbeafe] mb-6 max-w-xl">
              Far far away, behind the word mountains, far from the countries
              Vokalia and Consonantia, there live the blind texts.
            </p>
            <button className="bg-[#f75757] text-white px-6 py-2 rounded font-semibold shadow hover:bg-[#e13b3b] transition">
              Book an appointment
            </button>
          </div>
          <div className="flex-1 flex justify-center mt-8 md:mt-0">
            <img
              src="/images/slider-bg-1.jpg"
              alt="Hero"
              className="rounded-xl w-full max-w-md h-72 object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Info Cards */}
    {/* <section className="container mx-auto px-4 -mt-16 mb-12 relative z-10">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white rounded-xl shadow-lg flex-1 p-6 flex flex-col gap-2 border border-gray-100">
          <div className="flex items-center gap-3">
            <FaUserMd className="text-2xl text-[#223a66]" />
            <span className="font-bold text-[#223a66]">24 Hours Service</span>
          </div>
          <div className="text-[#223a66] font-semibold">Online Appointment</div>
          <p className="text-[#6f8ba4] text-sm">
            Get all time support for emergency. We have introduced the principle
            of family medicine.
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
            <div>
              Mon - Fri :{" "}
              <span className="float-right">9:00 - 20:00</span>
            </div>
            <div>
              Saturday :{" "}
              <span className="float-right">9:00 - 17:00</span>
            </div>
            <div>
              Sunday : <span className="float-right">Closed</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg flex-1 p-6 flex flex-col gap-2 border border-gray-100">
          <div className="flex items-center gap-3">
            <FaPhoneAlt className="text-2xl text-[#223a66]" />
            <span className="font-bold text-[#223a66]">Emergency Cases</span>
          </div>
          <div className="text-[#223a66] font-semibold">
            (+01) 123 456 7890
          </div>
          <p className="text-[#6f8ba4] text-sm">
            Get all time support for emergency. We have introduced the principle
            of family medicine. Get connected with us for any urgency.
          </p>
        </div>
      </div>
    </section> */}

    {/* Appointment Section */}
    <section className="bg-[#223a66] py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="bg-white rounded-xl shadow-lg flex-1 p-8">
            <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
              Booking an Appointment
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-4">
              Free Consultation
            </h2>
            <form className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="flex-1 p-3 rounded border border-gray-200 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone number"
                  className="flex-1 p-3 rounded border border-gray-200 focus:outline-none"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <select className="flex-1 p-3 rounded border border-gray-200 focus:outline-none">
                  <option>Select Services</option>
                  <option>Spinal Manipulation</option>
                  <option>Electrotherapy</option>
                  <option>Manual Lymphatic</option>
                  <option>Medical Acupuncture</option>
                  <option>Therapeutic Exercise</option>
                  <option>Joint Mobilization</option>
                </select>
                <select className="flex-1 p-3 rounded border border-gray-200 focus:outline-none">
                  <option>Select Chiropractor</option>
                  <option>John Doe</option>
                  <option>William Smith</option>
                  <option>Danny Green</option>
                  <option>Jason Thompson</option>
                </select>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Date"
                  className="flex-1 p-3 rounded border border-gray-200 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Time"
                  className="flex-1 p-3 rounded border border-gray-200 focus:outline-none"
                />
              </div>
              <div className="flex justify-center md:justify-start">
                <button
                  type="submit"
                  className="bg-[#f75757] text-white px-8 py-3 rounded font-semibold hover:bg-[#e13b3b] transition"
                >
                  Send message
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#223a66] mb-4">
                Business Hours
              </h2>
              <div className="text-[#223a66] mb-4">
                <h4 className="font-semibold">Opening Days:</h4>
                <p>
                  <span className="block">Monday – Friday: 9am to 20 pm</span>
                  <span className="block">Saturday: 9am to 17 pm</span>
                </p>
                <h4 className="font-semibold mt-4">Vacations:</h4>
                <p>
                  <span className="block">All Sunday Days</span>
                  <span className="block">All Official Holidays</span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#223a66] mb-2">
                For Emergency Cases
              </h3>
              <span className="text-2xl font-bold text-[#f75757]">
                (+01) 123 456 7890
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Services Section */}
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
          We offer Services
        </span>
        <h2 className="text-3xl font-bold text-[#223a66] mt-2">Our Benefits</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="flex gap-4 items-start">
            <span className="flaticon-chiropractic text-4xl text-[#f75757]"></span>
            <div>
              <h3 className="font-bold text-[#223a66]">Spinal Manipulation</h3>
              <p className="text-[#6f8ba4]">
                Even the all-powerful Pointing has no control about the blind
                texts it is an almost unorthographic.
              </p>
              <a
                href="#"
                className="text-[#f75757] font-semibold hover:underline text-sm"
              >
                Read more
              </a>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="flaticon-acupuncture text-4xl text-[#f75757]"></span>
            <div>
              <h3 className="font-bold text-[#223a66]">Medical Acupuncture</h3>
              <p className="text-[#6f8ba4]">
                Even the all-powerful Pointing has no control about the blind
                texts it is an almost unorthographic.
              </p>
              <a
                href="#"
                className="text-[#f75757] font-semibold hover:underline text-sm"
              >
                Read more
              </a>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-8">
          <div className="flex gap-4 items-start">
            <span className="flaticon-electrotherapy text-4xl text-[#f75757]"></span>
            <div>
              <h3 className="font-bold text-[#223a66]">Electrotherapy</h3>
              <p className="text-[#6f8ba4]">
                Even the all-powerful Pointing has no control about the blind
                texts it is an almost unorthographic.
              </p>
              <a
                href="#"
                className="text-[#f75757] font-semibold hover:underline text-sm"
              >
                Read more
              </a>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="flaticon-examination text-4xl text-[#f75757]"></span>
            <div>
              <h3 className="font-bold text-[#223a66]">Therapeutic Exercise</h3>
              <p className="text-[#6f8ba4]">
                Even the all-powerful Pointing has no control about the blind
                texts it is an almost unorthographic.
              </p>
              <a
                href="#"
                className="text-[#f75757] font-semibold hover:underline text-sm"
              >
                Read more
              </a>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-8">
          <div className="flex gap-4 items-start">
            <span className="flaticon-lymph-nodes text-4xl text-[#f75757]"></span>
            <div>
              <h3 className="font-bold text-[#223a66]">Manual Lymphatic</h3>
              <p className="text-[#6f8ba4]">
                Even the all-powerful Pointing has no control about the blind
                texts it is an almost unorthographic.
              </p>
              <a
                href="#"
                className="text-[#f75757] font-semibold hover:underline text-sm"
              >
                Read more
              </a>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="flaticon-bone text-4xl text-[#f75757]"></span>
            <div>
              <h3 className="font-bold text-[#223a66]">Joint Mobilization</h3>
              <p className="text-[#6f8ba4]">
                Even the all-powerful Pointing has no control about the blind
                texts it is an almost unorthographic.
              </p>
              <a
                href="#"
                className="text-[#f75757] font-semibold hover:underline text-sm"
              >
                Read more
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default HomePage;