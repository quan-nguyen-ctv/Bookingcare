import React, { useState } from "react";
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPaperPlane,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [statusMsg, setStatusMsg] = useState("");
  const [statusType, setStatusType] = useState(""); // success, error
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:6868/api/v1/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `${formData.subject ? `Subject: ${formData.subject}\n` : ''}${formData.phone ? `Phone: ${formData.phone}\n` : ''}Message: ${formData.message}`,
          reply: "Đang xử lý",
          status: "Chưa phản hồi",
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setStatusMsg("Thank you for contacting us! We'll get back to you within 24 hours.");
        setStatusType("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        setStatusMsg("Something went wrong. Please try again later.");
        setStatusType("error");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setStatusMsg("Network error. Please check your connection and try again.");
      setStatusType("error");
    }

    setLoading(false);
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section with Map */}
      <section className="relative h-96 bg-gradient-to-r from-[#223a66] to-[#2c4a7a] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/spa-contact-bg.jpg')",
            filter: "brightness(0.4)"
          }}
        />
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
              Get In Touch
            </span>
            <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight mt-2">
              Contact <span className="font-bold">Us</span>
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
              We're here to help you on your wellness journey. Reach out to us anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
                Contact Information
              </span>
              <h2 className="text-3xl font-light text-[#223a66] mb-4 mt-2">
                Ways to <span className="font-bold">Reach Us</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {/* Phone */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaPhone className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-[#223a66] mb-2">Call Us</h3>
                <p className="text-gray-600 text-sm mb-2">+1 (555) 123-4567</p>
                <p className="text-gray-500 text-xs">24/7 Emergency</p>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-[#223a66] mb-2">Email Us</h3>
                <p className="text-gray-600 text-sm mb-2">info@medicalcenter.com</p>
                <p className="text-gray-500 text-xs">Quick Response</p>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-[#223a66] mb-2">Visit Us</h3>
                <p className="text-gray-600 text-sm mb-2">123 Medical Center</p>
                <p className="text-gray-500 text-xs">Health City</p>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-[#23cf7c] to-[#20c997] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClock className="text-white text-xl" />
                </div>
                <h3 className="font-semibold text-[#223a66] mb-2">Hours</h3>
                <p className="text-gray-600 text-sm mb-2">Mon - Fri: 7:00 - 17:00</p>
                <p className="text-gray-500 text-xs">Sat: 7:00 - 16:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-8">
                  <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
                    Send Message
                  </span>
                  <h2 className="text-3xl font-light text-[#223a66] mb-4 mt-2">
                    Get in <span className="font-bold">Touch</span>
                  </h2>
                  <p className="text-gray-600">
                    Ready to start your wellness journey? Send us a message and we'll respond within 24 hours.
                  </p>
                </div>

                {/* Status Message */}
                {statusMsg && (
                  <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                    statusType === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {statusType === 'success' ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaExclamationCircle className="text-red-500" />
                    )}
                    <span className="text-sm">{statusMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#223a66] font-medium mb-2 text-sm">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-[#223a66] font-medium mb-2 text-sm">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#223a66] font-medium mb-2 text-sm">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300"
                        placeholder="Enter your phone"
                      />
                    </div>
                    <div>
                      <label className="block text-[#223a66] font-medium mb-2 text-sm">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300"
                        placeholder="What's this about?"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#223a66] font-medium mb-2 text-sm">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23cf7c] focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#23cf7c] to-[#20c997] text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="h-16 bg-gradient-to-r from-[#223a66] to-[#2c4a7a] flex items-center px-6">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <FaMapMarkerAlt />
                    Our Location
                  </h3>
                </div>
                <div className="h-96">
                  <iframe
                    title="Medical Center Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.005013712127!2d105.8194542154022!3d21.03178439313206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3a7c7b7e2d%3A0x8c3b6e5e7b8e9e0!2zTm92ZW5hIE1lZGljYWwgQ2VudGVy!5e0!3m2!1svi!2s!4v1685531234567!5m2!1svi!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-6 bg-gray-50">
                  <div className="flex items-center gap-3 mb-2">
                    <FaMapMarkerAlt className="text-[#23cf7c]" />
                    <span className="font-semibold text-[#223a66]">Medical Center</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    123 Health Street, Medical District<br />
                    Health City, HC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#223a66] to-[#2c4a7a] py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Ready to Start Your <span className="font-bold">Wellness Journey?</span>
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Book your appointment today and take the first step towards better health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#23cf7c] hover:bg-[#20c997] text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:shadow-lg">
                Book Appointment
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#223a66] font-semibold py-4 px-8 rounded-full transition-all duration-300">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
