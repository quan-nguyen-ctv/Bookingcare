import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:6868/";

const MedicalServiceDetail = () => {
  const navigate = useNavigate();
  const { idNameSpecialty } = useParams();
  const id =
    typeof idNameSpecialty === "string" && idNameSpecialty.includes("-")
      ? idNameSpecialty.split("-")[0]
      : "";

  const [specialty, setSpecialty] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE_URL}api/v1/specialties/${id}`)
      .then((res) => res.json())
      .then((data) => setSpecialty(data?.data || null))
      .catch(() => setSpecialty(null));

    fetch(`${API_BASE_URL}api/v1/clinics?specialtyId=${id}`)
      .then((res) => res.json())
      .then((data) => setClinics(data?.data || []))
      .catch(() => setClinics([]));

    fetch(`${API_BASE_URL}api/v1/doctors?specialtyId=${id}`)
      .then((res) => res.json())
      .then((data) => setDoctors(data?.data?.doctors || []))
      .catch(() => setDoctors([]));

    fetch(`${API_BASE_URL}api/v1/schedules?specialtyId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        const scheduleList = data?.data?.scheduleResponseList;
        if (Array.isArray(scheduleList)) {
          setSchedules(scheduleList);
        } else {
          console.warn("Schedule list is not an array", data);
          setSchedules([]);
        }
      })
      .catch(() => setSchedules([]));
  }, [id]);

  return (
    <div>
      {/* Banner */}
      <section className="relative bg-gradient-to-r from-[#223a66] to-[#4e8cff] h-48 flex items-center justify-center mb-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
        ></div>
        <div className="relative z-10 text-center">
          <div className="text-white text-sm mb-1">Department Details</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {specialty?.specialtyName || "Đang tải..."}
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Description */}
          <div className="flex-1 bg-white rounded-xl shadow p-6">
            {specialty?.specialtyImage && (
              <img
                src={`http://localhost:6868/uploads/${encodeURIComponent(
                  specialty.specialtyImage
                )}`}
                alt={specialty?.specialtyName}
                className="w-full h-74 object-cover rounded-lg mb-6"
              />
            )}
            <h3 className="text-xl font-bold text-[#223a66] mb-4">
              {specialty?.specialtyName}
            </h3>
            <div className="border-b mb-4"></div>
            <div className="prose max-w-none text-gray-700">
              {specialty?.description && typeof specialty.description === "string" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: specialty.description }}
                />
              ) : (
                "No description available"
              )}
            </div>
          </div>

          {/* Info */}
          <div className="w-full lg:w-96 bg-white rounded-xl shadow p-6">
            <h5 className="text-lg font-semibold mb-4 text-[#223a66]">
              Time Schedule
            </h5>
            <ul className="mb-4">
              <li className="flex justify-between py-1 border-b text-gray-700">
                <span>Monday - Friday</span>
                <span>7:00 - 17:00</span>
              </li>
              <li className="flex justify-between py-1 border-b text-gray-700">
                <span>Saturday</span>
                <span>7:00 - 16:00</span>
              </li>
              <li className="flex justify-between py-1 border-b text-gray-700">
                <span>Sunday</span>
                <span>Closed</span>
              </li>
              <li className="flex justify-between py-1 text-gray-700">
                <span>Costs</span>
                <span>${specialty?.price || "Đang cập nhật"}</span>
              </li>
            </ul>
            <div className="mt-4">
              <h5 className="font-semibold text-[#223a66] mb-2">Address</h5>
              {clinics.length > 0 ? (
                clinics.map((clinic) => (
                  <p key={clinic.id} className="text-gray-700 text-sm">
                    - {clinic?.address}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Đang cập nhật địa chỉ</p>
              )}
            </div>
          </div>
        </div>

        {/* Doctors */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-[#223a66] mb-4">
            Doctors in this Department
          </h3>
          <div className="border-b mb-6"></div>
          <div className="grid grid-cols-1 gap-6">
           {doctors.length > 0 ? (
  doctors.map((doctor) => {
    const doctorSchedules = schedules
  .filter(
    (s) =>
      s.doctor_id === doctor.id &&
      s.date_schedule === new Date().toISOString().split("T")[0]
  )
  .sort((a, b) => a.start_time.localeCompare(b.start_time));


    return (
      <div
        key={doctor?.id}
        className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6"
      >
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <img
            src={
              doctor?.avatar
                ? `http://localhost:6868/uploads/${encodeURIComponent(
                    doctor.avatar
                  )}`
                : "/images/doctor.png"
            }
            alt="Doctor avatar"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h4 className="text-lg font-bold text-[#223a66]">
              {doctor?.user?.fullname}
            </h4>
            <p className="text-gray-600 text-sm">Email: {doctor?.user?.email}</p>
            <p className="text-gray-600 text-sm">Phone: {doctor?.user?.phone_number}</p>
            <p className="text-gray-600 text-sm">Gender: {doctor?.user?.gender}</p>
            <p className="text-gray-600 text-sm">Birthday: {doctor?.user?.birthday}</p>
            {doctor?.bio && (
              <p className="text-gray-600 text-sm">Bio: {doctor.bio}</p>
            )}
            <p className="text-gray-600 text-sm">
              Experience: {doctor?.experience} years
            </p>
            {doctor?.qualification && (
              <p className="text-gray-600 text-sm">
                Qualification: {doctor.qualification}
              </p>
            )}
            <button
              className="text-blue-600 underline mt-2 text-sm"
              onClick={() => navigate(`/Doctors-detail/${doctor.id}`)}
            >
              See more
            </button>
          </div>
        </div>
      <div className="md:w-1/2 mt-4 md:mt-0">
  <h5 className="font-semibold mb-2 text-[#223a66]">Today's Schedule:</h5>
  {doctorSchedules.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {doctorSchedules.map((s) => (
        <button
          key={s.id}
          className="px-3 py-1 border rounded text-sm"
        >
          {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
        </button>
      ))}
    </div>
  ) : (
    <span className="text-sm text-gray-500">Không có lịch hôm nay</span>
  )}
</div>


      </div>
    );
  })
) : (
  <div className="text-center text-gray-500 py-8">
    Không có bác sĩ nào trong chuyên khoa này.
  </div>
)}

          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalServiceDetail;
