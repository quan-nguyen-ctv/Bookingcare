import React, { useState, useEffect } from "react";

const AddSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [form, setForm] = useState({
    doctorId: "",
    clinicId: "",
    dateSchedule: "",
    startTime: "",
    endTime: "",
    price: "",
    bookingLimit: "",
    active: true,
  });

  useEffect(() => {
    fetch("http://localhost:6868/api/v1/doctors")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) setDoctors(data.data);
        else if (Array.isArray(data.doctors)) setDoctors(data.doctors);
        else setDoctors([]);
      });
    fetch("http://localhost:6868/api/v1/clinics")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) setClinics(data.data);
        else if (Array.isArray(data.clinics)) setClinics(data.clinics);
        else setClinics([]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (
      !form.doctorId ||
      !form.clinicId ||
      !form.dateSchedule ||
      !form.startTime ||
      !form.endTime ||
      !form.price ||
      !form.bookingLimit
    ) {
      alert("Please fill all required fields.");
      return;
    }
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("http://localhost:6868/api/v1/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: form.doctorId,
          clinic_id: form.clinicId,
          date_schedule: form.dateSchedule,
          start_time: form.startTime,
          end_time: form.endTime,
          price: Number(form.price),
          booking_limit: Number(form.bookingLimit),
          active: form.active,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Add schedule failed");
      alert("Schedule added successfully!");
      setForm({
        doctorId: "",
        clinicId: "",
        dateSchedule: "",
        startTime: "",
        endTime: "",
        price: "",
        bookingLimit: "",
        active: true,
      });
    } catch (err) {
      alert(err.message || "Error adding schedule");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-[#223a66] mb-2">Schedule <span className="text-base font-normal text-gray-400">- Add Schedule</span></h2>
      <form
        className="bg-white rounded-xl shadow p-8 max-w-4xl mx-auto mt-4"
        onSubmit={handleSubmit}
      >
        <div className="text-lg font-bold text-[#00bcd4] mb-6">Schedule Info</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor */}
          <div>
            <label className="block font-semibold mb-1">Doctor</label>
            <select
              name="doctorId"
              value={form.doctorId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Doctor</option>
              {Array.isArray(doctors) && doctors.map((doctors) => (
                <option key={doctors.id} value={doctors.id}>
                  {doctors.user?.fullname || doctors.fullname || doctors.name || "No name"}
                </option>
              ))}
            </select>   
          </div>
          {/* Clinic */}
          <div>
            <label className="block font-semibold mb-1">Clinic</label>
            <select
              name="clinicId"
              value={form.clinicId}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Clinic</option>
              {clinics.map((cl) => (
                <option key={cl.id} value={cl.id}>
                  {cl.name}
                </option>
              ))}
            </select>
          </div>
          {/* Date */}
          <div>
            <label className="block font-semibold mb-1">Date Schedule</label>
            <input
              type="date"
              name="dateSchedule"
              value={form.dateSchedule}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* Price */}
          <div>
            <label className="block font-semibold mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              min={0}
            />
          </div>
          {/* Start Time */}
          <div>
            <label className="block font-semibold mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* End Time */}
          <div>
            <label className="block font-semibold mb-1">End Time</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          {/* Booking Limit */}
          <div>
            <label className="block font-semibold mb-1">Booking Limit</label>
            <input
              type="number"
              name="bookingLimit"
              value={form.bookingLimit}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
              min={1}
            />
          </div>
          {/* Active */}
          <div>
            <label className="block font-semibold mb-1">Active</label>
            <select
              name="active"
              value={form.active ? "true" : "false"}
              onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.value === "true" }))}
              className="w-full border rounded px-3 py-2 bg-gray-100"
              disabled
            >
              <option value="true">Active</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            type="button"
            className="bg-yellow-400 text-black px-6 py-2 rounded font-bold hover:bg-yellow-500"
            onClick={() => setForm({
              doctorId: "",
              clinicId: "",
              dateSchedule: "",
              startTime: "",
              endTime: "",
              price: "",
              bookingLimit: "",
              active: true,
            })}
          >
            CANCEL
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700"
          >
            SAVE
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSchedule;