import React, { useEffect, useState } from "react";

const ListBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchBookings = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:6868/api/v1/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    console.log("result.data", result.data);
    console.log("result.data.bookingList", result.data.bookingList);

    if (!res.ok) {
      console.error("API error:", result);
      throw new Error("API trả về lỗi");
    }

    const bookingsData = result?.data?.bookingList;

    if (Array.isArray(bookingsData)) {
      setBookings(bookingsData);
    } else {
      console.error("Dữ liệu trả về không hợp lệ:", result.data);
      setBookings([]);
    }
  } catch (err) {
    console.error("Lỗi khi lấy danh sách bookings:", err);
    setBookings([]);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Danh sách Booking</h2>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Tên khách</th>
            <th className="border p-2">payment method</th>
            <th className="border p-2">payment code </th>
            <th className="border p-2">change acount </th>
            <th className="border p-2">Tổng tiền</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Ngày đặt</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bookings) && bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border p-2">{booking.id}</td>
                <td className="border p-2">{booking.user_id}</td>
                <td className="border p-2">{booking.payment_method}</td>
                <td className="border p-2">{booking.payment_code}</td>
                <td className="border p-2">{booking.change_count}</td>
                <td className="border p-2">{booking.amount} VNĐ</td>
                <td className="border p-2">{booking.status}</td>
                <td className="border p-2">
                  {new Date(booking.bookingDate).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                Không có booking nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListBookings;
