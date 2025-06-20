import React, { useState } from "react";

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

const AddSpecialty = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

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
    const specialties = JSON.parse(localStorage.getItem("specialties") || "[]");
    specialties.push({
      id: Date.now(),
      name,
      image: imageUrl,
      desc,
    });
    localStorage.setItem("specialties", JSON.stringify(specialties));
    setName("");
    setImageFile(null);
    setDesc("");
    showToast("Thêm chuyên ngành thành công!", "success");
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
        <h2 className="text-lg font-bold text-[#20c0f3] mb-6">Specialty Info</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Specialty Name</label>
            <input
              className="block border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:border-[#20c0f3]"
              placeholder="Enter specialty name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Specialty Image</label>
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
              className="block border border-gray-300 rounded px-3 py-2 w-full min-h-[80px] focus:outline-none focus:border-[#20c0f3]"
              placeholder="Description"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              className="bg-[#ffc107] hover:bg-yellow-400 text-white font-bold px-6 py-2 rounded"
              onClick={() => {
                setName("");
                setImageFile(null);
                setDesc("");
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

export default AddSpecialty;