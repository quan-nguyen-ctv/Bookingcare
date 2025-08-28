import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCalendarAlt, FaDollarSign, FaInfoCircle } from "react-icons/fa";

const MedicalServices = () => {
  const [specialties, setSpecialties] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await fetch("http://localhost:6868/api/v1/specialties");
        const json = await res.json();
        console.log("Phản hồi API:", json);

        if (
          !json ||
          json.status !== "success" ||
          !json.data ||
          !Array.isArray(json.data.specialtyList)
        ) {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }

        setSpecialties(json.data.specialtyList);
      } catch (err) {
        console.error("Lỗi:", err);
        setError(err.message || "Đã xảy ra lỗi.");
      }
    };

    fetchSpecialties();
  }, []);

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
            Chăm sóc sức khỏe xuất sắc
          </span>
          <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight mt-2">
            Dịch Vụ<span className="font-bold text-[#23cf7c]">Chăm Sóc</span>
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90">
            Giải pháp chăm sóc sức khỏe toàn diện với công nghệ tiên tiến
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
              Dịch Vụ Của Chúng Tôi
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-4 mt-2">
              Thành Tựu <span className="font-bold">Chăm Sóc Tận Tâm</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Chúng ta hãy hiểu rõ hơn về nhu cầu đau đớn để có thể trở nên kiên cường hơn.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center mb-8">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tab List */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-[#223a66] mb-6">
                 Dịch Vụ
                </h3>
                <ul className="space-y-3">
                  {specialties.map((tab, idx) => (
                    <li key={tab.id}>
                      <button
                        className={`w-full flex items-center py-4 px-4 text-left rounded-xl transition font-medium ${
                          activeTab === idx
                            ? "bg-[#23cf7c] text-white shadow-lg transform scale-105"
                            : "bg-white text-[#223a66] hover:bg-[#23cf7c] hover:text-white shadow-sm hover:shadow-md"
                        }`}
                        onClick={() => setActiveTab(idx)}
                      >
                        
                        <span className="flex-1">{tab.specialtyName}</span>
                        <FaArrowRight className={`ml-2 transition-transform ${activeTab === idx ? 'rotate-90' : ''}`} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tab Content */}
            <div className="lg:col-span-2">
              {specialties.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Image */}
                  <div
                    className="w-full h-80 bg-cover bg-center transition-all duration-500"
                    style={{
                      backgroundImage: `url("http://localhost:6868/uploads/${encodeURIComponent(
                        specialties[activeTab].specialtyImage
                      )}")`,
                    }}
                  />
                  
                  {/* Content */}
                  <div className="p-8">
                    <h3
                      className="text-3xl font-bold text-[#223a66] mb-4 cursor-pointer hover:text-[#23cf7c] transition duration-300"
                      onClick={() =>
                        navigate(
                          `/MedicalServices/${specialties[activeTab].id}-${encodeURIComponent(
                            specialties[activeTab].specialtyName.replace(/\s+/g, "-")
                          )}`
                        )
                      }
                    >
                      {specialties[activeTab].specialtyName}
                    </h3>
                    
                    {/* Service Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#23cf7c] rounded-full flex items-center justify-center">
                          <FaDollarSign className="text-white text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#223a66]">Chi Phí</p>
                          <p className="text-[#23cf7c] font-bold text-lg">
                            {specialties[activeTab].price?.toLocaleString("vi-VN")} VND
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#223a66] rounded-full flex items-center justify-center">
                          <FaCalendarAlt className="text-white text-lg" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#223a66]">Thời Gian</p>
                          <p className="text-gray-600">T2 - T^, 7:00 - 21:00</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <FaInfoCircle className="text-[#23cf7c]" />
                        <h4 className="font-semibold text-[#223a66]">Thông Tin Về Dịch Vụ</h4>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {specialties[activeTab].description}
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* <button
                        onClick={() => navigate('/booking')}
                        className="bg-[#23cf7c] hover:bg-[#1eb567] text-white px-6 py-3 rounded-full font-medium transition duration-300 shadow-lg flex items-center justify-center gap-2"
                      >
                        <FaCalendarAlt />
                        Book Appointment
                      </button> */}
                      <button
                        onClick={() =>
                          navigate(
                            `/MedicalServices/${specialties[activeTab].id}-${encodeURIComponent(
                              specialties[activeTab].specialtyName.replace(/\s+/g, "-")
                            )}`
                          )
                        }
                        className="border-2 border-[#223a66] text-[#223a66] hover:bg-[#223a66] hover:text-white px-6 py-3 rounded-full font-medium transition duration-300 flex items-center justify-center gap-2"
                      >
                        <FaInfoCircle />
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
              Tại sao nên chọn 
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-4 mt-2">
              Sự Xuất Sắc Trong <span className="font-bold">Chăm Sóc Vẻ Đẹp</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏆",
                title: "Giải Thưởng",
                description: "Được công nhận về sự xuất sắc trong chăm sóc bệnh nhân và đổi mới y tế"
              },
              {
                icon: "👨‍⚕️",
                title: "Chuyên Gia",
                description: "Bác sĩ được cấp phép hành nghề với nhiều năm kinh nghiệm chuyên môn"
              },
              {
                icon: "🔬",
                title: "Công nghệ tiên tiến",
                description: "Thiết bị hiện đại cho chẩn đoán và điều trị chính xác"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#223a66] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalServices;
