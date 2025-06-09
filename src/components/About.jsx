import React, { useEffect, useState } from "react";

const stats = [
  { number: 45, label: "Years of Experienced" },
  { number: 2342, label: "Happy Customers" },
  { number: 30, label: "Award Winning" },
];

const StatCounter = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const increment = Math.ceil(value / (duration / 16));
    const step = () => {
      start += increment;
      if (start < value) {
        setCount(start);
        requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    step();
    // eslint-disable-next-line
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
};

const About = () => (
  <main className="bg-white min-h-screen">
    {/* Banner */}
    {/* <section className="bg-[#223a66] h-56 flex flex-col justify-center items-center relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/about-banner.jpg')" }}
      ></div>
      <div className="relative z-10 text-center">
        <div className="text-white text-sm mb-1">About Us</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">About Us</h1>
      </div>
    </section> */}

    {/* About Section */}
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
        {/* Image with play button */}
        <div className="flex-1 flex justify-center order-2 md:order-1">
          <div className="relative w-full max-w-md h-80 rounded-xl overflow-hidden flex items-center justify-center">
            {/* <img
              src="/images/about.jpg"
              alt="About"
              className="object-cover w-full h-full rounded-xl"
            /> */}
            <a
              href="https://vimeo.com/45830194"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="bg-[#f75757] text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-lg hover:bg-[#223a66] transition">
                <i className="fa fa-play"></i>
              </span>
            </a>
          </div>
        </div>
        {/* Text */}
        <div className="flex-1 order-1 md:order-2">
          <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
            Welcome to Chiropractic
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#223a66] mb-4 mt-2">
            About Chiropractic
          </h2>
          <p className="text-[#6f8ba4]">
            Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.
          </p>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow flex flex-col items-center py-8"
          >
            <div className="text-4xl font-bold text-[#223a66] mb-2">
              <StatCounter value={stat.number} />
            </div>
            <div className="text-[#6f8ba4] text-center font-semibold">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* History */}
      <div className="max-w-3xl mx-auto mb-16">
        <h4 className="text-xl font-bold text-[#223a66] mb-2">Chiropractic History</h4>
        <p className="text-[#6f8ba4]">
          Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos dignissimos magni tempora adipisci aliquam labore, consequuntur tenetur alias fugiat reiciendis eius omnis ea blanditiis temporibus rerum laborum nostrum, vel dolores!
        </p>
      </div>
      {/* Testimonials */}
      <section className="bg-[#223a66] rounded-xl py-12 px-4 mb-12">
        <div className="text-center mb-8">
          <span className="uppercase text-[#f75757] font-semibold tracking-widest text-sm">
            Testimonies
          </span>
          <h2 className="text-3xl font-bold text-white mt-2">Happy Clients & Feedbacks</h2>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[#f75757] text-2xl">
                <i className="fa fa-quote-left"></i>
              </span>
              <span className="text-[#6f8ba4]">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <img src="/images/person_1.jpg" alt="Roger Scott" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-[#223a66] mb-0">Roger Scott</p>
                <span className="text-xs text-[#6f8ba4]">Marketing Manager</span>
              </div>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[#f75757] text-2xl">
                <i className="fa fa-quote-left"></i>
              </span>
              <span className="text-[#6f8ba4]">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <img src="/images/person_2.jpg" alt="Roger Scott" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-bold text-[#223a66] mb-0">Roger Scott</p>
                <span className="text-xs text-[#6f8ba4]">Marketing Manager</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </main>
);

export default About;