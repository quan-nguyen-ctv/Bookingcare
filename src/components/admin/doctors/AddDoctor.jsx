import React, { useState, useEffect } from "react";

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

const AddDoctor = () => {
  const [user, setUser] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [experience, setExperience] = useState("");
  const [qualification, setQualification] = useState("");
  const [bio, setBio] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [specialties, setSpecialties] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setSpecialties(JSON.parse(localStorage.getItem("specialties") || "[]"));
    // Lấy user từ localStorage, lọc role doctor
    const allUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(allUsers.filter(u => u.role === "doctor"));
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let imageUrl = "";
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }
    const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    doctors.push({
      id: Date.now(),
      user,
      specialty,
      image: imageUrl,
      experience,
      qualification,
      bio,
    });
    localStorage.setItem("doctors", JSON.stringify(doctors));
    setUser("");
    setSpecialty("");
    setImageFile(null);
    setExperience("");
    setQualification("");
    setBio("");
    showToast("Thêm bác sĩ thành công!", "success");
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: toast.type })}
        />
      )}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-8 border">
        <h2 className="text-lg font-bold text-[#20c0f3] mb-6">Doctor Info</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">User</label>
            <select
              className="block border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-[#20c0f3]"
              value={user}
              onChange={e => setUser(e.target.value)}
              required
            >
              <option value="">Select User</option>
              {users.map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Specialty</label>
            <select
              className="block border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-[#20c0f3]"
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              required
            >
              <option value="">Select Specialty</option>
              {specialties.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Doctor Image</label>
            <input
              type="file"
              accept="image/*"
              className="block border border-gray-300 rounded px-3 py-2 w-full bg-white"
              onChange={e => setImageFile(e.target.files[0])}
            />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className="h-16 mt-2 rounded"
              />
            )}
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Experience</label>
            <input
              className="block border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-[#20c0f3]"
              value={experience}
              onChange={e => setExperience(e.target.value)}
              placeholder="Experience"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Qualification</label>
            <textarea
              className="block border border-gray-300 rounded px-3 py-2 w-full min-h-[40px] focus:outline-none focus:border-[#20c0f3]"
              value={qualification}
              onChange={e => setQualification(e.target.value)}
              placeholder="Qualification"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Bio</label>
            <textarea
              className="block border border-gray-300 rounded px-3 py-2 w-full min-h-[60px] focus:outline-none focus:border-[#20c0f3]"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Bio"
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              className="bg-[#ffc107] hover:bg-yellow-400 text-white font-bold px-6 py-2 rounded"
              onClick={() => {
                setUser("");
                setSpecialty("");
                setImageFile(null);
                setExperience("");
                setQualification("");
                setBio("");
              }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="bg-[#007bff] hover:bg-blue-600 text-white font-bold px-6 py-2 rounded"
            >
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;  