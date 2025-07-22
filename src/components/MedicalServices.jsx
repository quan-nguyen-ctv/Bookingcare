import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

        // ✅ Kiểm tra và truy xuất mảng đúng cách
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
    <main className="bg-white min-h-screen">
      <section className="container mx-auto px-4 mb-5">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#223a66]">
            Award winning patient care
          </h2>
          <div className="w-16 h-1 bg-[#f5f1f1] mx-auto mb-4 rounded"></div>
          <p className="text-[#6f8ba4] max-w-2xl mx-auto">
            Let us better understand the need for pain so that we can become more resilient.
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          {/* Tab List */}
          <div className="md:w-1/3 w-full">
            <ul className="flex md:flex-col flex-row gap-2 md:gap-0 overflow-x-auto">
              {specialties.map((tab, idx) => (
                <li key={tab.id}>
                  <button
                    className={`w-full flex items-center py-4 px-4 text-left rounded transition font-semibold text-[#223a66] ${
                      activeTab === idx
                        ? "bg-[#f75757] text-white cursor-default"
                        : "hover:bg-[#f5f5f5] cursor-pointer"
                    }`}
                    onClick={() => setActiveTab(idx)}
                    disabled={activeTab === idx}
                  >
                    <span className="text-2xl mr-3">🏥</span>
                    {tab.specialtyName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tab Content */}
          <div className="md:w-2/3 w-full">
            {specialties.length > 0 && (
              <>
                <div
                  className="w-full h-[320px] bg-cover bg-center rounded-lg mb-6 transition-all duration-300"
                  style={{
                    backgroundImage: `url("http://localhost:6868/uploads/${encodeURIComponent(
                      specialties[activeTab].specialtyImage
                    )}")`,
                  }}
                ></div>
                {/* Thông tin chuyên khoa */}
                <h3
                  className="text-2xl font-bold text-[#223a66] mb-2 cursor-pointer hover:underline"
                  onClick={() =>
                    navigate(
                      `/MedicalServices/${specialties[activeTab].id}-${encodeURIComponent(
                        specialties[activeTab].specialtyName.replace(/\s+/g, "-")
                      )}`
                    )
                  }
                >
                  Khoa: {specialties[activeTab].specialtyName}
                </h3>
               
                <div className="flex flex-col gap-2 items-start text-[#223a66] font-medium">
                  <div>
                    <span className="font-semibold">Giá dịch vụ: </span>
                    {specialties[activeTab].price?.toLocaleString("vi-VN")} đ
                  </div>
                  <div>
                    <span className="font-semibold">Mô tả chuyên khoa: </span>
                    <p className="text-[#6f8ba4] text-center mb-4">
                  {specialties[activeTab].description}
                </p>
                  </div>
                  {/* Thêm các trường khác nếu có */}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MedicalServices;
