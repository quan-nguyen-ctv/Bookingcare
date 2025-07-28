import React, { useEffect, useState } from "react";
import axios from "axios";
import AddClinic from "./AddClinic";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
      ${type === "error" ? "bg-red-500" : "bg-green-500"}`}>
      {message}
      <button onClick={onClose} className="ml-4 text-white font-bold" style={{ background: "transparent", border: "none", cursor: "pointer" }}>×</button>
  </div>
);

const ListClinic = () => {
  const [clinics, setClinics] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("admin_token");

  const showToast = (message, type = "success") => {
      setToast({ show: true, message, type });
      setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const fetchClinics = async () => {
      try {
      const res = await axios.get("http://localhost:6868/api/v1/clinics", {
          headers: { Authorization: `Bearer ${token}` }
      });
      setClinics(res.data.data?.clinicList || []);

      } catch (err) {
      showToast("Lỗi khi tải danh sách", "error");
      }
  };

  useEffect(() => {
      fetchClinics();
  }, [refresh]);

  const handleDelete = async (id) => {
      try {
      await axios.delete(`http://localhost:6868/api/v1/clinics/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      showToast("Xóa phòng khám thành công!");
      setRefresh(r => !r);
      } catch (err) {
      showToast("Xóa thất bại", "error");
      }
  };

  return (
      <div className="overflow-x-auto">
      {toast.show && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: "", type: toast.type })} />
      )}
      <table className="min-w-full border text-center mt-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2">Tên</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">SĐT</th>
            <th className="border px-3 py-2">Địa chỉ</th>
            <th className="border px-3 py-2">Ảnh</th>
            <th className="border px-3 py-2">Trạng thái</th>
            <th className="border px-3 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {clinics.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-4 text-gray-400">Không có phòng khám nào.</td>
            </tr>
          ) : (
            clinics.map((item, idx) => (
              <tr key={item.id} className="border-b">
                <td className="border px-3 py-2">{idx + 1}</td>
                <td className="border px-3 py-2">{item.clinicName}</td>
                <td className="border px-3 py-2">{item.email}</td>
                <td className="border px-3 py-2">{item.phone}</td>
                <td className="border px-3 py-2">{item.address}</td>
                <td className="border px-3 py-2">
                  {item.clinicImage && (
                    <img
                      src={`http://localhost:6868/uploads/${item.clinicImage}`}
                      alt="clinic"
                      className="h-10 mx-auto"
                    />
                  )}
                </td>
                <td className="border px-3 py-2">
                  {item.active ? "Hoạt động" : "Không hoạt động"}
                </td>
                <td className="border px-3 py-2 flex gap-2 justify-center">
                  <button
                    title="Edit"
                    className="text-yellow-500 hover:text-yellow-700"
                    onClick={() => navigate(`/admin/clinics/${item.id}`)}
                  >
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                  <button
                    title="Delete"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListClinic;