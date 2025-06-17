import React, { createContext, useContext, useState } from "react";

// Tạo context lưu danh sách booking tạm thời
const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  // Hàm thêm booking mới
  const addBooking = (booking) => setBookings((prev) => [...prev, booking]);

  return (
    <BookingContext.Provider value={{ bookings, addBooking }}>
      {children}
    </BookingContext.Provider>
  );
};