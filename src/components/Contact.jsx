import React from "react";

const Contact = () => (
  <main className="bg-white min-h-screen">
    {/* Map Banner */}
    <section className="w-full h-80">
      <iframe
        title="Google Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.005013712127!2d105.8194542154022!3d21.03178439313206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3a7c7b7e2d%3A0x8c3b6e5e7b8e9e0!2zTm92ZW5hIE1lZGljYWwgQ2VudGVy!5e0!3m2!1svi!2s!4v1685531234567!5m2!1svi!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      ></iframe>
    </section>

    {/* Contact Form */}
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-2">Contact us</h2>
        <div className="w-16 h-1 bg-[#f75757] mx-auto mb-4 rounded"></div>
        <p className="text-[#6f8ba4] max-w-xl mx-auto">
          Laboriosam exercitationem molestias beatae eos pariatur, similique, excepturi mollitia sit perferendis maiores ratione aliquam?
        </p>
      </div>
      <form className="bg-[#f4f8fb] rounded-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Your Full Name"
            className="flex-1 p-3 rounded border border-gray-200 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Your Email Address"
            className="flex-1 p-3 rounded border border-gray-200 focus:outline-none"
          />
        </div>
        <textarea
          rows={5}
          placeholder="Your Message"
          className="w-full p-3 rounded border border-gray-200 focus:outline-none mb-6"
        ></textarea>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-[#223a66] hover:bg-[#f75757] text-white font-semibold px-8 py-2 rounded transition"
          >
            SEND MESSAGE
          </button>
        </div>
      </form>
    </section>
  </main>
);

export default Contact;