    import React, { useEffect, useState } from "react";
    import ConfirmDeleteModal from "../ConfirmDeleteModal";
    

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

    const ListSpecialty = () => {
    const [specialties, setSpecialties] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ name: "", image: "", desc: "" });
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("specialties") || "[]");
        setSpecialties(data);
    }, []);

      const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

    const handleDelete = (id) => {
        setDeleteId(id);
    };

    const confirmDelete = () => {
        const newList = specialties.filter(item => item.id !== deleteId);
    setSpecialties(newList);
    localStorage.setItem("specialties", JSON.stringify(newList));
    setDeleteId(null);
    showToast("Xóa chuyên ngành thành công!", "success");
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setEditData({ name: item.name, image: item.image, desc: item.desc });
    };

  const handleSave = (id) => {
    const newList = specialties.map(item =>
      item.id === id ? { ...item, ...editData } : item
    );
    setSpecialties(newList);
    localStorage.setItem("specialties", JSON.stringify(newList));
    setEditId(null);
    showToast("Chỉnh sửa chuyên ngành thành công!", "success");
  };

    return (
        <div className="overflow-x-auto">
             {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: toast.type })}
        />
      )}
        <table className="min-w-full border text-center">
            <thead>
            <tr className="bg-gray-100">
                <th className="border px-3 py-2">ID</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Image</th>
                <th className="border px-3 py-2">Description</th>
                <th className="border px-3 py-2">Action</th>
            </tr>
            </thead>
            <tbody>
            {specialties.map((item, idx) => (
                <tr key={item.id} className="border-b">
                <td className="border px-3 py-2">{idx + 1}</td>
                <td className="border px-3 py-2">
                    {editId === item.id ? (
                    <input
                        className="border px-2 py-1"
                        value={editData.name}
                        onChange={e => setEditData({ ...editData, name: e.target.value })}
                    />
                    ) : (
                    item.name
                    )}
                </td>
                <td className="border px-3 py-2">
                    {editId === item.id ? (
                    <input
                        className="border px-2 py-1"
                        value={editData.image}
                        onChange={e => setEditData({ ...editData, image: e.target.value })}
                    />
                    ) : (
                    item.image && <img src={item.image} alt={item.name} className="h-10 mx-auto" />
                    )}
                </td>
                <td className="border px-3 py-2">
                    {editId === item.id ? (
                    <input
                        className="border px-2 py-1"
                        value={editData.desc}
                        onChange={e => setEditData({ ...editData, desc: e.target.value })}
                    />
                    ) : (
                    item.desc
                    )}
                </td>
                <td className="border px-3 py-2 space-x-1">
                    {editId === item.id ? (
                    <>
                        <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => handleSave(item.id)}
                        >
                        Save
                        </button>
                        <button
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                        onClick={() => setEditId(null)}
                        >
                        Cancel
                        </button>
                    </>
                    ) : (
                    <>
                        <button
                        className="bg-yellow-400 text-white px-2 py-1 rounded"
                        onClick={() => handleEdit(item)}
                        >
                        Edit
                        </button>
                        <button
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(item.id)}
                        >
                        Delete
                        </button>
                    </>
                    )}
                </td>
                </tr>
            ))}
            {specialties.length === 0 && (
                <tr>
                <td colSpan={5} className="py-4 text-gray-400">No specialties found.</td>
                </tr>
            )}
            </tbody>
        </table>
        <ConfirmDeleteModal
            open={!!deleteId}
            onClose={() => setDeleteId(null)}
            onConfirm={confirmDelete}
        />
        </div>
    );
    };

    export default ListSpecialty;