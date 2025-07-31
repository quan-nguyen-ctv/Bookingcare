import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all
      ${type === "error" ? "bg-red-500" : "bg-green-500"}`}>
      {message}
      <button onClick={onClose} className="ml-4 text-white font-bold" style={{ background: "transparent", border: "none", cursor: "pointer" }}>×</button>
  </div>
);

// Add/Edit Medication Modal
const MedicationModal = ({ isOpen, onClose, medicationData, onSave, loading, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: ""
  });

  useEffect(() => {
    if (medicationData) {
      setFormData({
        name: medicationData.name || "",
        price: medicationData.price || "",
        description: medicationData.description || ""
      });
    } else {
      setFormData({ name: "", price: "", description: "" });
    }
  }, [medicationData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {isEdit ? "Edit Medication" : "Add Medication"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Medication Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter medication name"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter price"
                min="0"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter description"
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500 transition disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ListMedication = () => {
  const [medications, setMedications] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState({
    limit: 5,
    keyword: "",
    page: 0,
    sort: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const token = localStorage.getItem("admin_token");

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const fetchMedications = async () => {
    try {
      let url = `http://localhost:6868/api/v1/medications`;
      const params = new URLSearchParams();
      
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.keyword) params.append('search', filters.keyword);
      if (filters.page) params.append('page', filters.page);
      if (filters.sort) params.append('sort', filters.sort);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Sửa logic xử lý data response
      const responseData = res.data.data;
      if (responseData && Array.isArray(responseData.medications)) {
        setMedications(responseData.medications);
      } else if (Array.isArray(responseData)) {
        setMedications(responseData);
      } else {
        setMedications([]);
      }
    } catch (err) {
      console.error("Error fetching medications:", err);
      showToast("Lỗi khi tải danh sách thuốc", "error");
      setMedications([]); // Set empty array để tránh crash
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [refresh, filters]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, keyword: searchTerm, page: 0 }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilters(prev => ({ ...prev, keyword: "", page: 0 }));
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "0 ₫";
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleAddMedication = () => {
    setSelectedMedication(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditMedication = (medication) => {
    setSelectedMedication(medication);
    setIsEdit(true);
    setShowModal(true);
  };

const handleSaveMedication = async (formData) => {
  try {
    setModalLoading(true);

    if (!formData.name.trim()) {
      showToast("Tên thuốc không được để trống", "error");
      setModalLoading(false);
      return;
    }

    const payload = {
      medicationName: formData.name
    };

    let response;
    if (isEdit) {
      // Nếu API cập nhật yêu cầu khác thì sửa lại cho đúng
      response = await axios.put(
        `http://localhost:6868/api/v1/medications/${selectedMedication.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
    } else {
      response = await axios.post(
        `http://localhost:6868/api/v1/medications`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
    }

    if (response.status === 200 || response.status === 201) {
      showToast(isEdit ? "Cập nhật thuốc thành công!" : "Thêm thuốc thành công!");
      setShowModal(false);
      setSelectedMedication(null);
      setRefresh(prev => !prev);
    }
  } catch (error) {
    console.error("Error saving medication:", error);
    showToast(isEdit ? "Lỗi khi cập nhật thuốc" : "Lỗi khi thêm thuốc", "error");
  } finally {
    setModalLoading(false);
  }
};



  const handleDeleteMedication = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thuốc này?")) return;
    
    try {
      await axios.delete(`http://localhost:6868/api/v1/medications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("Xóa thuốc thành công!");
      setRefresh(prev => !prev);
    } catch (error) {
      console.error("Error deleting medication:", error);
      showToast("Lỗi khi xóa thuốc", "error");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedication(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ show: false, message: "", type: toast.type })} 
        />
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-[#223a66]">
          Medication <span className="text-base font-normal text-gray-400">- Medication List</span>
        </h2>
        <button
          onClick={handleAddMedication}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Medication
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Limit</label>
          <select
            value={filters.limit}
            onChange={(e) => setFilters(prev => ({ ...prev, limit: e.target.value, page: 0 }))}
            className="border rounded px-3 py-2 w-full"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search medication name..."
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex gap-2 items-end">
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
          {filters.keyword && (
            <button
              onClick={clearSearch}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Medication Name</th>
              <th className="border px-3 py-2">Price</th>
              <th className="border px-3 py-2">Description</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {!medications || medications.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-gray-400">Không có thuốc nào.</td>
              </tr>
            ) : (
              medications.map((item) => (
                <tr key={item.id || Math.random()} className="border-b">
                  <td className="border px-3 py-2">#{item.id}</td>
                  <td className="border px-3 py-2 font-semibold">{item.medicationName || item.name}</td>
                  <td className="border px-3 py-2 text-green-600 font-semibold">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="border px-3 py-2 max-w-xs truncate" title={item.description}>
                    {item.description || "N/A"}
                  </td>
                  <td className="border px-3 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        title="Edit"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditMedication(item)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteMedication(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
            disabled={filters.page === 0}
          >
            &lt;
          </button>
          <span className="px-3 py-1 border rounded bg-gray-100">
            {filters.page + 1}
          </span>
          <button
            className="px-3 py-1 border rounded"
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Medication Modal */}
      <MedicationModal
        isOpen={showModal}
        onClose={closeModal}
        medicationData={selectedMedication}
        onSave={handleSaveMedication}
        loading={modalLoading}
        isEdit={isEdit}
      />
    </div>
  );
};

export default ListMedication;