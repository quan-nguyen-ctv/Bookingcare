import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaClock, FaPhoneAlt } from "react-icons/fa";
import '../assets/css/flaticon.css'; 

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

const slides = [
  {
    image: "/images/slider-bg-1.jpg",
    title: "Welcome to our chiropractic centre",
    desc: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
    button: "Book an appointment",
  },
  {
    image: "/images/bg_2.jpg",
    title: "Chiropractic care for the whole family",
    desc: "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
    button: "Book an appointment",
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [current, setCurrent] = useState(0);

  // Xác định vùng sát viền (ví dụ 60px)
  const EDGE_SIZE = 60;

  // Đổi slide khi rê chuột sát viền trái/phải
  const handleMouseMove = (e) => {
    const { left, right } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    if (x - left < EDGE_SIZE) {
      setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    } else if (right - x < EDGE_SIZE) {
      setCurrent((prev) => (prev + 1) % slides.length);
    }
  };

  // Auto slide mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000); // 5 giây

    return () => clearInterval(timer);
  }, []);

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

  return (
    <main className="bg-[#f9f9f9]">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: toast.type })}
        />
      )}
      {/* Hero Section */}
       <section
        className="relative h-[400px] md:h-[500px] overflow-hidden z-10"
        onMouseMove={handleMouseMove}
      >
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${current === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          style={{
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="container mx-auto h-full flex items-center justify-end relative z-20">
            <div className="w-full md:w-1/2 text-white px-4 md:px-0">
              <h1 className="mb-4 text-3xl md:text-5xl font-bold">{slide.title}</h1>
              <p className="mb-6">{slide.desc}</p>
              <button
                className="bg-[#23cf7c] text-white px-6 py-2 rounded font-semibold shadow transition hover:bg-transparent hover:text-[#23cf7c] border border-[#23cf7c]"
                onClick={handleBookClick}
              >
                {slide.button}
              </button>
            </div>
          </div>
        </div>
      ))}
        {/* Có thể bỏ nút chuyển slide nếu muốn chỉ dùng chuột */}
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
   
        <div className="flex flex-col md:flex-row w-full max-w-[1200px] mx-auto z-30 relative bottom-12">
          {/* Phần màu xanh chiếm 7/10 */}
          <div className="bg-[#23cf7c] shadow-lg p-8 w-full md:w-6/10 md:max-w-[70%]">
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
                  className="bg-[#283df8] text-white px-6 py-2 rounded font-semibold shadow transition hover:bg-transparent hover:text-[#283df8 ] border border-[#283df8]"
                >
                  Send message
                </button>
              </div>
            </form>
          </div>
          {/* Phần trắng chiếm 3/10 */}
          <div className="bg-white shadow-lg p-8 flex flex-col justify-between w-full md:w-4/10 md:max-w-[30%]">
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
              <span className="flaticon-chiropractic text-4xl text-[#23cf7c]"></span>
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
              <span className="flaticon-acupuncture text-4xl text-[#23cf7c]"></span>
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
              <span className="flaticon-electrotherapy text-4xl text-[#23cf7c]"></span>
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
              <span className="flaticon-examination text-4xl text-[#23cf7c]"></span>
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
              <span className="flaticon-lymph-nodes text-4xl text-[#23cf7c]"></span>
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
              <span className="flaticon-bone text-4xl text-[#23cf7c]"></span>
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
};

export default HomePage;