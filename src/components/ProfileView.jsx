import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Hiện loading khi fetch data
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:6868/api/v1/users/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setUser(response.data.data);
        } else {
          setError("Cannot load user data.");
        }
      })
      .catch((err) => {
        console.error("Fetch user failed:", err);
        setError("Failed to load user data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center mt-10">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow p-8 border mb-7">
        <h2 className="text-2xl font-bold text-[#223a66] mb-2 flex items-center gap-2">
          Profile <span className="text-base font-normal text-gray-400">• Profile View</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              className="border rounded px-3 py-2 w-full bg-gray-100"
              value={user.fullname || ""}
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Address</label>
            <input
              className="border rounded px-3 py-2 w-full bg-gray-100"
              value={user.address || ""}
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">E-mail</label>
            <input
              className="border rounded px-3 py-2 w-full bg-gray-100"
              value={user.email || ""}
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Number</label>
            <input
              className="border rounded px-3 py-2 w-full bg-gray-100"
              value={user.phone_number || ""}
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Birthday</label>
            <input
              className="border rounded px-3 py-2 w-full bg-gray-100"
              value={user.birthday || ""}
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Gender</label>
            <input
              className="border rounded px-3 py-2 w-full bg-gray-100"
              value={user.gender || ""}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
