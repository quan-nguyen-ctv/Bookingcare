import React, { useEffect, useState } from "react";

const ProfileView = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

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
              value={user.name || ""}
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
              value={user.phone || ""}
              disabled
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">BirthDay</label>
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