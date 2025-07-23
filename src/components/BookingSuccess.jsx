import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ToastError, ToastSuccess } from "../notification";


const BookingSuccess = () => {
  const navigate = useNavigate();
  const { idBooking } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");
  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
  const [statusPay, setStatusPay] = useState("");
  const idBookingSuccess = searchParams.get("bookingId");

  useEffect(() => {
    if (
      location.pathname.includes("/booking/result/") &&
      idBooking &&
      vnp_TransactionNo &&
      vnp_ResponseCode === "00"
    ) {
      payOrderSuccess(idBooking, vnp_TransactionNo, vnp_ResponseCode);

      async function payOrderSuccess(bookingId, vnp_TransactionNo, vnp_ResponseCode) {
        try {
          const res = await fetch(
            `http://localhost:6868/api/v1/bookings/payBooking/${bookingId}?vnp_TransactionNo=${vnp_TransactionNo}&vnp_ResponseCode=${vnp_ResponseCode}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await res.json();
          if (res.ok && data.status === "success") {
            ToastSuccess("Booking payment successfully.");
            navigate(`/booking/success?bookingId=${bookingId}`);
          } else {
            ToastError(data.message || "Payment failed.");
          }
        } catch (error) {
          ToastError(error.message || "Payment failed.");
        }
      }
    } else if (idBooking && vnp_TransactionNo && vnp_ResponseCode === "24") {
      setStatusPay("Pay_failed");
    }
  }, [idBooking, vnp_TransactionNo, vnp_ResponseCode, location.pathname, navigate]);

  return (
    <div className="appointment-container mt-5">
      <div className="appointment-check-icon">
        {statusPay === "Pay_failed" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="50"
            height="50"
          >
            <rect x="2" y="2" width="20" height="14" rx="2" fill="#4A90E2" />
            <path
              d="M4 6h16M4 10h16M4 14h16"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="5" fill="#FF3D00" />
            <path
              d="M10 10L14 14M14 10L10 14"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <img
            src="https://png.pngtree.com/png-vector/20221010/ourmid/pngtree-approval-symbol-check-mark-circle-drawn-hand-green-sign-ok-png-image_6251572.png"
            alt="success"
            className="tick-icon-sc"
          />
        )}
      </div>
      {statusPay === "Pay_failed" ? (
        <>
          <h1 className="appointment-title pay-failt-sc">Payment Failed!</h1>
          <div className="box-appoint-note">
            <p className="appointment-note">
              Note: Your payment was not successful. Please try again or contact support.
            </p>
          </div>
          <div className="appointment-btn-sc">
            <button
              className="btn btn-main btn-round-full btn-book-conf ic-appoint-sc"
              onClick={() => navigate("/")}
            >
              Return to Home!
              <i className="icofont-simple-right"></i>
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="appointment-title">Booking successful!</h1>
          <div className="box-appoint-note">
            <p className="appointment-note">
              Note: Your appointment has been transferred to the medical facility. Please do not book through other channels to avoid duplicate schedules.
            </p>
          </div>
          <div className="appointment-btn-sc">
            <button
              className="btn btn-main btn-round-full btn-book-conf ic-appoint-sc"
              onClick={() => navigate(`/account/bookings/${idBookingSuccess}`)}
            >
              See detailed appointment schedule here!
              <i className="icofont-simple-right"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingSuccess;