import React from "react";
import { Link } from "react-router-dom";

const Register = () => (
  <main className="bg-white min-h-screen">
    {/* Banner */}
    <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative mb-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
      ></div>
      <div className="relative z-10 text-center">
        <div className="text-white text-sm mb-1">Account</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          Login & Register
        </h1>
      </div>
    </section>
    {/* Register Form */}
    <section className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-2">
      <div className="flex-1 flex justify-center">
        <img src="/images/login.jpg" alt="Register" className="max-w-xs w-full" />
      </div>
      <div className="flex-1 max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-2">Register</h2>
          <p className="text-[#6f8ba4] text-sm">
            Mollitia dicta commodi est recusandae iste, natus eum asperiores corrupti qui velit. Iste dolorum atque similique praesentium soluta.
          </p>
        </div>
        <form className="space-y-4">
          <div className="flex gap-4">
            <input type="text" placeholder="Full Name" className="flex-1 p-3 rounded border border-gray-200 focus:outline-none" />
            <input type="text" placeholder="Phone Number" className="flex-1 p-3 rounded border border-gray-200 focus:outline-none" />
          </div>
          <input type="email" placeholder="Email" className="w-full p-3 rounded border border-gray-200 focus:outline-none" />
          <input type="password" placeholder="Password" className="w-full p-3 rounded border border-gray-200 focus:outline-none" />
          <input type="password" placeholder="Repassword" className="w-full p-3 rounded border border-gray-200 focus:outline-none" />
          <button type="submit" className="bg-[#f75757] hover:bg-[#223a66] text-white font-semibold px-8 py-1.5 rounded-xl transition text-sm flex items-center gap-2 ml-[170px]">
            REGISTER
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
          Have already an account?{" "}
          <Link to="/login" className="text-[#223a66] font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </section>
  </main>
);

export default Register;