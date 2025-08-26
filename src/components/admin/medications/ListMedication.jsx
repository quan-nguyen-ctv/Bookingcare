import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        name: medicationData.medicationName || medicationData.name || "",
        price: medicationData.price || "",
        description: medicationData.description || ""
      });
    } else {
      setFormData({ name: "", price: "", description: "" });
    }
  }, [medicationData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên thuốc!", {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            {isEdit ? "Chỉnh Sửa Thuốc" : "Thêm Thuốc Mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors duration-200"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tên Thuốc <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                placeholder="Nhập tên thuốc..."
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Giá Thuốc</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                placeholder="Nhập giá thuốc..."
                min="0"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mô Tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent transition-all duration-200"
                placeholder="Nhập mô tả thuốc..."
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#20c0f3] hover:bg-[#1ba0d1] text-white py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang Lưu...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? "Cập Nhật" : "Thêm Mới"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ListMedication = () => {
  const [allMedications, setAllMedications] = useState([]);
  const [medications, setMedications] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const token = localStorage.getItem("admin_token");
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Fetch all medications (chỉ gọi 1 lần)
  useEffect(() => {
    const fetchMedications = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:6868/api/v1/medications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const responseData = res.data.data;
        let medicationList = [];
        
        if (responseData && Array.isArray(responseData.medications)) {
          medicationList = responseData.medications;
        } else if (Array.isArray(responseData)) {
          medicationList = responseData;
        }
        
        setAllMedications(medicationList);
      } catch (err) {
        console.error("Error fetching medications:", err);
        showToast("Lỗi khi tải danh sách thuốc", "error");
        setAllMedications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, [token]);

  // Filter and paginate medications
  useEffect(() => {
    let filteredMedications = allMedications;

    // Filter by search term
    if (search.trim()) {
      filteredMedications = allMedications.filter(medication => {
        const name = (medication.medicationName || medication.name || '').toLowerCase();
        const description = (medication.description || '').toLowerCase();
        const searchLower = search.toLowerCase();
        
        return name.includes(searchLower) || description.includes(searchLower);
      });
    }

    // Reset page when search changes
    setPage(1);

    // Apply pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    setMedications(filteredMedications.slice(start, end));

    // Store filtered medications for pagination calculation
    setFilteredMedications(filteredMedications);
  }, [allMedications, search, page, limit]);

  // State for filtered medications (for pagination)
  const [filteredMedications, setFilteredMedications] = useState([]);

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "—";
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
        return;
      }

      const payload = {
        medicationName: formData.name.trim()
      };

      // Chỉ thêm price và description nếu có giá trị
      if (formData.price && !isNaN(formData.price)) {
        payload.price = parseFloat(formData.price);
      }
      if (formData.description?.trim()) {
        payload.description = formData.description.trim();
      }

      let response;
      if (isEdit) {
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
        
        // Refresh data bằng cách gọi lại API
        const refetchRes = await axios.get(`http://localhost:6868/api/v1/medications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const responseData = refetchRes.data.data;
        let medicationList = [];
        
        if (responseData && Array.isArray(responseData.medications)) {
          medicationList = responseData.medications;
        } else if (Array.isArray(responseData)) {
          medicationList = responseData;
        }
        
        setAllMedications(medicationList);
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
      
      // Remove from current list
      setAllMedications(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting medication:", error);
      showToast("Lỗi khi xóa thuốc", "error");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMedication(null);
  };

  const totalPage = Math.ceil(filteredMedications.length / limit);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-6 h-6 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Danh Sách Thuốc
            </h1>
            <p className="text-gray-600 mt-1">Quản lý danh sách các loại thuốc trong hệ thống</p>
          </div>
          <button
            onClick={handleAddMedication}
            className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm Thuốc Mới
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Bộ Lọc Tìm Kiếm
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng/trang</label>
              <select
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
              >
                {[5, 10, 20, 50].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                placeholder="Tìm kiếm tên thuốc hoặc mô tả..."
              />
            </div>

            {search && (
              <div className="flex items-end">
                <button
                  onClick={() => setSearch("")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Xóa tìm kiếm
                </button>
              </div>
            )}
          </div>

          {/* Search Results Info */}
          {search && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tìm thấy <strong>{filteredMedications.length}</strong> kết quả cho từ khóa "<strong>{search}</strong>"
              </p>
            </div>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">Đang tải danh sách thuốc...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên Thuốc</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mô Tả</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medications.length > 0 ? (
                  medications.map((item) => (
                    <tr key={item.id || Math.random()} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {search ? (
                          <span 
                            dangerouslySetInnerHTML={{
                              __html: (item.medicationName || item.name || "—")
                                .replace(
                                  new RegExp(`(${search})`, 'gi'),
                                  '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
                                )
                            }}
                          />
                        ) : (
                          item.medicationName || item.name || "—"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={item.description}>
                          {search && item.description ? (
                            <span 
                              dangerouslySetInnerHTML={{
                                __html: item.description
                                  .replace(
                                    new RegExp(`(${search})`, 'gi'),
                                    '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
                                  )
                              }}
                            />
                          ) : (
                            item.description || "—"
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                            onClick={() => handleEditMedication(item)}
                            title="Chỉnh sửa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Sửa
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                            onClick={() => handleDeleteMedication(item.id)}
                            title="Xóa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        <p className="text-lg font-medium">
                          {search ? `Không tìm thấy thuốc nào với từ khóa "${search}"` : "Không có thuốc nào"}
                        </p>
                        <p className="text-sm mt-1">
                          {search ? "Hãy thử tìm kiếm với từ khóa khác" : "Hãy thêm thuốc mới"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPage > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Hiển thị {((page - 1) * limit) + 1} - {Math.min(page * limit, filteredMedications.length)} trong tổng số {filteredMedications.length} kết quả
                {search && ` (lọc từ ${allMedications.length} thuốc)`}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"} transition-colors duration-200`}
                  onClick={() => page > 1 && setPage(page - 1)}
                  disabled={page === 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {Array.from({ length: totalPage }, (_, i) => i + 1)
                  .filter(i => i === 1 || i === totalPage || (i >= page - 1 && i <= page + 1))
                  .map((i, index, array) => (
                    <React.Fragment key={i}>
                      {index > 0 && array[index - 1] !== i - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${page === i ? "bg-[#20c0f3] text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"} transition-colors duration-200`}
                        onClick={() => setPage(i)}
                      >
                        {i}
                      </button>
                    </React.Fragment>
                  ))}
                
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${page === totalPage ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"} transition-colors duration-200`}
                  onClick={() => page < totalPage && setPage(page + 1)}
                  disabled={page === totalPage}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          fontSize: '14px',
          borderRadius: '8px',
        }}
      />
    </div>
  );
};

export default ListMedication;