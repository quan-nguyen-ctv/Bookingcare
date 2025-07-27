import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:6868/api/v1/schedules/${id}`)
      .then(res => res.json())
      .then(data => {
        setSchedule(data.data || null);
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setSchedule(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:6868/api/v1/schedules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`
        },
        body: JSON.stringify(schedule)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Cập nhật lịch thành công!");
        setTimeout(() => {
          navigate("/admin/schedules/list");
        }, 1200);
      } else {
        toast.error(data.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống. Vui lòng thử lại sau!");
    }
    setSaving(false);
  };

  if (!id) return null;
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={1500} />
      <h2 className="text-3xl font-bold text-[#223a66] mb-2">
        Schedule{" "}
        <span className="text-base font-normal text-gray-400">
          - Update Schedule
        </span>
      </h2>
      <div className="bg-white rounded-xl shadow p-8 max-w-3xl mx-auto">
        <h3 className="text-lg font-bold text-[#009ca6] mb-6">Schedule Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">Doctor ID</label>
            <input
              type="number"
              name="doctor_id"
              value={schedule.doctor_id || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Clinic ID</label>
            <input
              type="number"
              name="clinic_id"
              value={schedule.clinic_id || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Date Schedule</label>
            <input
              type="date"
              name="date_schedule"
              value={schedule.date_schedule || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={schedule.price || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Start Time</label>
            <input
              type="time"
              name="start_time"
              value={schedule.start_time?.slice(0,5) || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">End Time</label>
            <input
              type="time"
              name="end_time"
              value={schedule.end_time?.slice(0,5) || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Booking Limit</label>
            <input
              type="number"
              name="booking_limit"
              value={schedule.booking_limit || ""}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Active</label>
            <select
              name="active"
              value={schedule.active ? "true" : "false"}
              onChange={e => setSchedule(prev => ({
                ...prev,
                active: e.target.value === "true"
              }))}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-8">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded font-bold"
            onClick={() => navigate("/admin/schedules/list")}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            className="bg-[#223a66] text-white px-4 py-2 rounded font-bold"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;