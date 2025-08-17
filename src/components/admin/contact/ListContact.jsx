import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";


const ListContact = () => {
  const [contacts, setContacts] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [refresh, setRefresh] = useState(false);
  const [limit, setLimit] = useState(5);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("admin_token");

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2000);
  };

  const fetchContacts = async () => {
    try {
      let url = `http://localhost:6868/api/v1/contacts`;
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit);
      if (status) params.append('status', status);
      if (search) params.append('keyword', search); // đổi từ search -> keyword
      if (page) params.append('page', page);

      if (params.toString()) url += `?${params.toString()}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setContacts(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 0);
    } catch (err) {
      showToast("Lỗi khi tải danh sách", "error");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [refresh, limit, status, search, page]);

  const handleSearch = () => {
    setSearch(searchTerm);
    setPage(0); // reset về trang 1 khi tìm kiếm
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) return;
    try {
      await axios.delete(`http://localhost:6868/api/v1/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast("Xóa liên hệ thành công!");
      setRefresh(r => !r);
    } catch (err) {
      showToast("Xóa thất bại", "error");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Replied":
        return <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Replied</span>;
      case "AwaitReply":
        return <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Await Reply</span>;
      default:
        return <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs">Unknown</span>;
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ show: false, message: "", type: toast.type })} />
      )}

      <h2 className="text-3xl font-bold text-[#223a66] mb-2">
        Contact <span className="text-base font-normal text-gray-400">- Contact List</span>
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {/* Limit */}
        <div>
          <label className="block text-sm font-medium mb-1">Limit</label>
          <select value={limit} onChange={(e) => { setLimit(e.target.value); setPage(0); }} className="border rounded px-3 py-2">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(0); }} className="border rounded px-3 py-2">
            <option value="">Select Status</option>
            <option value="Replied">Replied</option>
            <option value="AwaitReply">Await Reply</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Search</label>
          <div className="flex gap-2">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={handleKeyPress} placeholder="Search by name, email..." className="border rounded px-3 py-2 flex-1" />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Search</button>
            {search && (
              <button onClick={() => { setSearch(""); setSearchTerm(""); setPage(0); }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Full Name</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Message</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-gray-400">Không có liên hệ nào.</td>
              </tr>
            ) : (
              contacts.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="border px-3 py-2">{item.id}</td>
                  <td className="border px-3 py-2">{item.name}</td>
                  <td className="border px-3 py-2">{item.email}</td>
                  <td className="border px-3 py-2 max-w-xs truncate" title={item.message}>{item.message}</td>
                  <td className="border px-3 py-2">{getStatusBadge(item.status)}</td>
                  <td className="border px-3 py-2 flex gap-2 justify-center">
                    <button title="View" className="text-blue-500 hover:text-blue-700" onClick={() => navigate(`/admin/contacts/${item.id}`)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button title="Delete" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Trang trước
        </button>
        <span>Trang {page + 1} / {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default ListContact;
