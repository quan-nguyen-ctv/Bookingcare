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
  const [form, setForm] = useState({
    name: "",
    image: null,
    desc: "",
    price: "",
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.image) {
        return showToast("Vui lòng chọn ảnh!", "error");
      }

      const formData = new FormData();
      formData.append("file", form.image);

      // Upload image first
      const uploadRes = await fetch("http://localhost:6868/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Upload ảnh thất bại");

      const { fileName } = await uploadRes.json();

      const body = {
        specialty_name: form.name,
        specialty_image: fileName,
        description: form.desc,
        price: Number(form.price),
      };

      const res = await fetch("http://localhost:6868/api/v1/specialties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Tạo chuyên khoa thất bại");

      showToast("Thêm chuyên khoa thành công!");
      setForm({ name: "", image: null, desc: "", price: "" });
    } catch (err) {
      console.error("Error:", err);
      showToast("Lỗi khi thêm chuyên khoa", "error");
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
        <h2 className="text-lg font-bold text-[#20c0f3] mb-6">Specialty Info</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Specialty Name</label>
            <input
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              name="name"
              placeholder="Enter specialty name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Specialty Image</label>
            <input
              type="file"
              accept="image/*"
              className="block border border-gray-300 rounded px-3 py-2 w-full bg-white"
              onChange={handleFileChange}
              required
            />
            {form.image && (
              <img
                src={URL.createObjectURL(form.image)}
                alt="preview"
                className="h-16 mt-2 rounded"
              />
            )}
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Description</label>
            <textarea
              name="desc"
              className="block border border-gray-300 rounded px-3 py-2 w-full min-h-[80px]"
              placeholder="Description"
              value={form.desc}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-semibold text-[#223a66] mb-2">Price</label>
            <input
              type="number"
              name="price"
              className="block border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              className="bg-[#ffc107] hover:bg-yellow-400 text-white font-bold px-6 py-2 rounded"
              onClick={() => setForm({ name: "", image: null, desc: "", price: "" })}
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
