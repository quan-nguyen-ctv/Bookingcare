import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import ScheduleDetail from "./ScheduleDetail"; // import file detail

const ListSchedule = () => {
  const [allSchedules, setAllSchedules] = useState([]); // lưu toàn bộ
  const [schedules, setSchedules] = useState([]); // lưu trang hiện tại
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [doctorId, setDoctorId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [dateSchedule, setDateSchedule] = useState("");
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:6868/api/v1/doctors")
      .then(res => res.json())
      .then(data => setDoctors(Array.isArray(data.data?.doctors) ? data.data.doctors : []));
    fetch("http://localhost:6868/api/v1/specialties")
      .then(res => res.json())
      .then(data => setSpecialties(Array.isArray(data.data?.specialtyList) ? data.data.specialtyList : []));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    let url = `http://localhost:6868/api/v1/schedules`;
    if (doctorId) url += `?doctorId=${doctorId}`;
    if (specialtyId) url += (url.includes("?") ? "&" : "?") + `specialtyId=${specialtyId}`;
    if (dateSchedule) url += (url.includes("?") ? "&" : "?") + `dateSchedule=${dateSchedule}`;
    if (search) url += (url.includes("?") ? "&" : "?") + `search=${encodeURIComponent(search)}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const arr = Array.isArray(data.data?.scheduleResponseList) ? data.data.scheduleResponseList : [];
        setAllSchedules(arr);
        setPage(1); // reset về trang đầu khi filter
      });
  }, [doctorId, specialtyId, dateSchedule, search]);

  useEffect(() => {
    // Phân trang ở frontend
    const start = (page - 1) * limit;
    const end = start + limit;
    setSchedules(allSchedules.slice(start, end));
  }, [allSchedules, page, limit]);

  const totalPage = Math.ceil(allSchedules.length / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#223a66] mb-2">
        Schedule <span className="text-base font-normal text-gray-400">- Schedule List</span>
      </h2>
      <div className="bg-white rounded-xl shadow p-6 mt-4">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block font-semibold mb-1">Limit</label>
            <select
              value={limit}
              onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
              className="border rounded px-3 py-2"
            >
              {[5, 10, 20, 50].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Doctor</label>
            <select
              value={doctorId}
              onChange={e => { setDoctorId(e.target.value); setPage(1); }}
              className="border rounded px-3 py-2"
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullname || doctor.user?.fullname || doctor.name || "No name"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Specialty</label>
            <select
              value={specialtyId}
              onChange={e => { setSpecialtyId(e.target.value); setPage(1); }}
              className="border rounded px-3 py-2"
            >
              <option value="">Select Specialty</option>
              {specialties.map(sp => (
                <option key={sp.id} value={sp.id}>
                  {sp.specialtyName || sp.specialty_name || sp.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Date Schedule</label>
            <input
              type="date"
              value={dateSchedule}
              onChange={e => { setDateSchedule(e.target.value); setPage(1); }}
              className="border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Search</label>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="border rounded px-3 py-2"
              placeholder="Search"
            />
          </div>
          <div className="flex items-end">
            <button
              className="bg-[#223a66] text-white px-4 py-2 rounded font-bold"
              onClick={() => setPage(1)}
            >
              EXTEND NEXT WEEK
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-[#223a66]">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Doctor Name</th>
                <th className="px-4 py-2">Specialty Name</th>
                <th className="px-4 py-2">Date Schedule</th>
                <th className="px-4 py-2">Start Time</th>
                <th className="px-4 py-2">Booking Limit</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? (
                schedules.map(sch => (
                  <tr key={sch.id} className="border-b">
                    <td className="px-4 py-2">#{sch.id}</td>
                    <td className="px-4 py-2">{sch.doctor_name}</td>
                    <td className="px-4 py-2">{sch.specialty_name}</td>
                    <td className="px-4 py-2">{sch.date_schedule?.split("-").reverse().join("-")}</td>
                    <td className="px-4 py-2">{sch.start_time?.slice(0,5)} - {sch.end_time?.slice(0,5)}</td>
                    <td className="px-4 py-2">{sch.booking_limit}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        title="View"
                        className="text-[#223a66] hover:text-blue-600"
                        onClick={() => navigate(`/admin/schedules/${sch.id}`)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        title="Edit"
                        className="text-yellow-500 hover:text-yellow-700"
                        onClick={() => navigate(`/admin/schedules/${sch.id}`)}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button title="Delete" className="text-red-500 hover:text-red-700">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">No schedules found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-300 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-[#223a66]"}`}
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
          >
            &lt;
          </button>
          {page > 2 && (
            <>
              <button className="px-3 py-1 rounded bg-gray-200 text-[#223a66]" onClick={() => setPage(1)}>1</button>
              <span className="px-2">...</span>
            </>
          )}
          {Array.from({ length: totalPage }, (_, i) => i + 1)
            .filter(i => i === page || i === page - 1 || i === page + 1)
            .map(i => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${page === i ? "bg-[#223a66] text-white" : "bg-gray-200 text-[#223a66]"}`}
                onClick={() => setPage(i)}
              >
                {i}
              </button>
            ))}
          {page < totalPage - 1 && (
            <>
              <span className="px-2">...</span>
              <button className="px-3 py-1 rounded bg-gray-200 text-[#223a66]" onClick={() => setPage(totalPage)}>{totalPage}</button>
            </>
          )}
          <button
            className={`px-3 py-1 rounded ${page === totalPage ? "bg-gray-300 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-[#223a66]"}`}
            onClick={() => page < totalPage && setPage(page + 1)}
            disabled={page === totalPage}
          >
            &gt;
          </button>
        </div>
      </div>
      {detailId && (
        <ScheduleDetail
          scheduleId={detailId}
          onClose={() => setDetailId(null)}
          onSaved={() => {
            setDetailId(null);
            // reload schedules if needed
            // you can refetch here if you want
          }}
        />
      )}
    </div>
  );
};

export default ListSchedule;