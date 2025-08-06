import React, { useState } from "react";
import axios from "axios";

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

const AddClinic = ({ onAdded }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const token = localStorage.getItem("admin_token");

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageName = "";
      if (imageFile) {
        // Upload image file to server (nếu backend hỗ trợ)
        const formData = new FormData();
        formData.append("file", imageFile);
        const imgRes = await axios.post(
          "http://localhost:6868/api/v1/images/clinic-upload",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        imageName = imgRes.data?.image || "";
      }
      await axios.post(
        "http://localhost:6868/api/v1/clinics",
        { name, address, image: imageName, phone, email, description: desc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("Thêm phòng khám thành công!");
      setName(""); setAddress(""); setPhone(""); setEmail(""); setImageFile(null); setDesc("");
      if (onAdded) onAdded();
    } catch (err) {
      showToast("Thêm thất bại", "error");
    }
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
        <h2 className="text-lg font-bold text-[#20c0f3] mb-6">Clinic Info</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Clinic Name</label>
            <input
              className="block border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-[#20c0f3]"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Clinic Name"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Address</label>
            <input
              className="block border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-[#20c0f3]"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Address"
              required
            />
          </div>
          
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Phone</label>
            <input
              className="block border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-[#20c0f3]"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Email</label>
            <input
              className="block border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-[#20c0f3]"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Clinic Image</label>
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
            <label className="block font-semibold text-[#223a66] mb-2">Description</label>
            <textarea
              className="block border border-gray-300 rounded px-3 py-2 w-full min-h-[60px] focus:outline-none focus:border-[#20c0f3]"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Description"
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-400 text-white rounded shadow hover:bg-yellow-500 transition-all mr-auto"
              style={{ minWidth: 120 }}
            >
              Add Clinic
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClinic;