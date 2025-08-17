import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScheduleDetail from "./ScheduleDetail";

const ListSchedule = () => {
  const [allSchedules, setAllSchedules] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [doctorId, setDoctorId] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [dateSchedule, setDateSchedule] = useState("");
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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

  // Fetch doctors and specialties
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [doctorsRes, specialtiesRes] = await Promise.all([
          fetch("http://localhost:6868/api/v1/doctors"),
          fetch("http://localhost:6868/api/v1/specialties")
        ]);

        const doctorsData = await doctorsRes.json();
        const specialtiesData = await specialtiesRes.json();

        setDoctors(Array.isArray(doctorsData.data?.doctors) ? doctorsData.data.doctors : []);
        setSpecialties(Array.isArray(specialtiesData.data?.specialtyList) ? specialtiesData.data.specialtyList : []);
      } catch (error) {
        showToast("Lỗi khi tải dữ liệu ban đầu", "error");
      }
    };

    fetchInitialData();
  }, []);

  // Fetch schedules with filters
  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          showToast("Vui lòng đăng nhập để tiếp tục", "error");
          return;
        }

        let url = `http://localhost:6868/api/v1/schedules`;
        const params = new URLSearchParams();
        
        if (doctorId) params.append('doctorId', doctorId);
        if (specialtyId) params.append('specialtyId', specialtyId);
        if (dateSchedule) params.append('dateSchedule', dateSchedule);
        if (search) params.append('search', search);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch schedules');
        }

        const data = await response.json();
        const arr = Array.isArray(data.data?.scheduleResponseList) ? data.data.scheduleResponseList : [];
        setAllSchedules(arr);
        setPage(1);
      } catch (error) {
        showToast("Lỗi khi tải danh sách lịch khám", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [doctorId, specialtyId, dateSchedule, search]);

  // Pagination
  useEffect(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    setSchedules(allSchedules.slice(start, end));
  }, [allSchedules, page, limit]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch khám này?")) {
      try {
        const token = localStorage.getItem("admin_token");
        const response = await fetch(`http://localhost:6868/api/v1/schedules/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          setAllSchedules(prev => prev.filter(item => item.id !== id));
          showToast("Xóa lịch khám thành công!");
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        showToast("Không thể xóa lịch khám. Vui lòng thử lại!", "error");
      }
    }
  };

  const handleExtendNextWeek = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("http://localhost:6868/api/v1/schedules/extend-week", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showToast("Đã mở rộng lịch khám tuần tới thành công!");
        // Refetch schedules
        window.location.reload();
      } else {
        throw new Error('Failed to extend');
      }
    } catch (error) {
      showToast("Lỗi khi mở rộng lịch khám", "error");
    }
  };

  const totalPage = Math.ceil(allSchedules.length / limit);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <svg className="w-6 h-6 text-[#20c0f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Danh Sách Lịch Khám
            </h1>
            <p className="text-gray-600 mt-1">Quản lý lịch khám của các bác sĩ</p>
          </div>
          <button
            onClick={() => navigate('/admin/schedules/add')}
            className="bg-[#20c0f3] hover:bg-[#1ba0d1] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm Lịch Khám
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng/trang</label>
              <select
                value={limit}
                onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
              >
                {[5, 10, 20, 50].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bác sĩ</label>
              <select
                value={doctorId}
                onChange={e => { setDoctorId(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
              >
                <option value="">Tất cả bác sĩ</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.fullname || doctor.user?.fullname || doctor.name || "Chưa có tên"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Chuyên khoa</label>
              <select
                value={specialtyId}
                onChange={e => { setSpecialtyId(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
              >
                <option value="">Tất cả chuyên khoa</option>
                {specialties.map(sp => (
                  <option key={sp.id} value={sp.id}>
                    {sp.specialtyName || sp.specialty_name || sp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ngày khám</label>
              <input
                type="date"
                value={dateSchedule}
                onChange={e => { setDateSchedule(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20c0f3] focus:border-transparent"
                placeholder="Tìm kiếm..."
              />
            </div>

            <div className="flex items-end">
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                onClick={handleExtendNextWeek}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mở Rộng Tuần
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">Đang tải danh sách lịch khám...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bác Sĩ</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Chuyên Khoa</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày Khám</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời Gian</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giới Hạn</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.length > 0 ? (
                  schedules.map(sch => (
                    <tr key={sch.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{sch.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sch.doctor_name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sch.specialty_name || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sch.date_schedule ? new Date(sch.date_schedule).toLocaleDateString('vi-VN') : "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {sch.start_time?.slice(0,5)} - {sch.end_time?.slice(0,5)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {sch.booking_limit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                            onClick={() => navigate(`/admin/schedules/${sch.id}`)}
                            title="Xem chi tiết"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Xem
                          </button>
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                            onClick={() => navigate(`/admin/schedules/edit/${sch.id}`)}
                            title="Chỉnh sửa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Sửa
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                            onClick={() => handleDelete(sch.id)}
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
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium">Không có lịch khám nào</p>
                        <p className="text-sm mt-1">Hãy thêm lịch khám mới hoặc điều chỉnh bộ lọc</p>
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
                Hiển thị {((page - 1) * limit) + 1} - {Math.min(page * limit, allSchedules.length)} trong tổng số {allSchedules.length} kết quả
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

      {/* Schedule Detail Modal */}
      {detailId && (
        <ScheduleDetail
          scheduleId={detailId}
          onClose={() => setDetailId(null)}
          onSaved={() => {
            setDetailId(null);
            // Refetch schedules
            window.location.reload();
          }}
        />
      )}

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

export default ListSchedule;