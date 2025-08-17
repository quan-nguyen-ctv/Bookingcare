import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SpecialtyDetail = () => {
  const { id } = useParams();
  const [specialty, setSpecialty] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:6868/api/v1/specialties/${id}`);
      const json = await res.json();
      setSpecialty(json?.data || null);
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-8">Đang tải dữ liệu...</div>;
  if (!specialty) return <div className="p-8">Không tìm thấy chuyên khoa.</div>;

  return (
    <main className="bg-white min-h-screen">
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            <img
              src={`http://localhost:6868/uploads/${specialty.specialtyImage}`}
              alt={specialty.specialtyName}
              className="h-64 w-64 object-cover rounded mb-4"
            />
            <div className="font-bold text-[#223a66] text-2xl mb-2">{specialty.specialtyName}</div>
            <div className="text-[#6f8ba4] mb-2">{specialty.description}</div>
            <div className="text-[#223a66] font-medium mb-2">
              <span className="font-semibold">Giá dịch vụ: </span>
              {specialty.price?.toLocaleString("vi-VN")} đ
            </div>
            <div className="text-[#223a66] font-medium mb-2">
              <span className="font-semibold">Mã chuyên khoa: </span>
              {specialty.id}
            </div>
            <button
              className="bg-[#223a66] text-white px-4 py-2 rounded mt-4"
              onClick={() => navigate(-1)}
            >
              Quay lại
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SpecialtyDetail;