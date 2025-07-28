import React, { useEffect, useState } from "react";

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(() => {
    // Mặc định là hôm nay
    return new Date().toISOString().split("T")[0];
  });


  

  // Lấy doctorId từ localStorage (giống DoctorDashboard)
  const doctorData = JSON.parse(localStorage.getItem("doctor_details"));
  const doctorId = doctorData?.id;

console.log("doctorId:", doctorId);

  console.log("doctorId:", doctorData);
  

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("doctor_token");
        const res = await fetch(
          `http://localhost:6868/api/v1/schedules/doctor?doctorId=${doctorId}&dateSchedule=${date}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        // Sắp xếp lịch theo thời gian bắt đầu
        const sorted = (json?.data || []).sort((a, b) => {
          return new Date(`1970-01-01T${a.start_time}`) - new Date(`1970-01-01T${b.start_time}`);
        });
        setSchedules(sorted);
      } catch (error) {
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) fetchSchedules();
  }, [doctorId, date]);

  return (
    <main className="bg-white min-h-screen">
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#223a66] mb-6">SCHEDULE</h1>
        <div className="flex items-center gap-4 mb-6">
          <label htmlFor="dateSchedule" className="font-semibold text-[#223a66]">
            Date Schedule
          </label>
          <input
            id="dateSchedule"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="mb-6">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {schedules.length > 0 ? (
                schedules.map(schedule => (
                  <button
                    key={schedule.id}
                    className={`font-semibold px-6 py-2 rounded shadow ${
                      schedule.active
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                  </button>
                ))
              ) : (
                <span className="text-gray-500">Không có lịch trong ngày này</span>
              )}
            </div>
          )}
        </div>
      </section>
      <footer className="text-center text-gray-400 mt-16">
        © 2024 Novena Clinic. All Rights Reserved
      </footer>
    </main>
  );
};

export default DoctorSchedule;