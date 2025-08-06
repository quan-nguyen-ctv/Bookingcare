import React, { useEffect, useState } from "react";
import { FaPlay, FaQuoteLeft, FaAward, FaUsers, FaCalendarAlt, FaHeart, FaShieldAlt, FaStar } from "react-icons/fa";

const stats = [
  { number: 25, label: "Years of Experience", icon: <FaCalendarAlt /> },
  { number: 10000, label: "Happy Patients", icon: <FaUsers /> },
  { number: 50, label: "Expert Doctors", icon: <FaHeart /> },
  { number: 30, label: "Awards Won", icon: <FaAward /> },
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

const About = () => {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-r from-[#223a66] to-[#2c4a7a] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/about-banner.jpg')",
            filter: "brightness(0.7)"
          }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
            Learn About Us
          </span>
          <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight mt-2">
            About Our <span className="font-bold text-[#23cf7c]">Clinic</span>
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90">
            Dedicated to providing exceptional healthcare with compassion and excellence
          </p>
        </div>
      </section>

      {/* Main About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Content */}
            <div>
              <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
                Welcome to Our Medical Center
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-6 mt-2">
                Your Health, <span className="font-bold">Our Mission</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                With over 25 years of excellence in healthcare, we combine advanced 
                medical technology with compassionate care to deliver the best outcomes 
                for our patients and their families.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our state-of-the-art facility houses the latest medical equipment and 
                technologies, while our team of expert physicians and healthcare professionals 
                work tirelessly to provide personalized treatment plans for every patient.
              </p>
              
              {/* Feature List */}
              <div className="space-y-4 mb-8">
                {[
                  "24/7 Emergency Medical Services",
                  "State-of-the-art Medical Equipment",
                  "Experienced Medical Professionals", 
                  "Comprehensive Health Checkups"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#23cf7c] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image with Play Button */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/about.jpg"
                  alt="About Our Clinic"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <a
                    href="https://vimeo.com/45830194"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-20 h-20 bg-[#23cf7c] rounded-full flex items-center justify-center text-white hover:bg-[#1eb567] transition duration-300 shadow-lg group"
                  >
                    <FaPlay className="text-2xl ml-1 group-hover:scale-110 transition duration-300" />
                  </a>
                </div>
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#23cf7c] rounded-full flex items-center justify-center">
                    <FaShieldAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#223a66]">Certified</h4>
                    <p className="text-sm text-gray-600">Healthcare Provider</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
              Our Achievements
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-4 mt-2">
              Trusted by <span className="font-bold">Thousands</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Numbers that speak for our commitment to excellence in healthcare
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition duration-300 group"
              >
                <div className="text-[#23cf7c] text-4xl mb-4 group-hover:scale-110 transition duration-300 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-[#223a66] mb-2">
                  <StatCounter value={stat.number} />
                  {stat.number >= 1000 ? '+' : ''}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
                Our Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-4 mt-2">
                Healthcare <span className="font-bold">History</span>
              </h2>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Founded in 1998, our medical center has been at the forefront of healthcare 
                innovation for over two decades. What started as a small clinic has grown into 
                a comprehensive healthcare facility serving thousands of patients annually.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Our commitment to excellence has earned us numerous accolades and the trust 
                of our community. We continue to invest in the latest medical technologies 
                and attract the finest healthcare professionals to ensure our patients receive 
                world-class care.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Today, we stand as a beacon of hope and healing, dedicated to improving 
                the health and well-being of every individual who walks through our doors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#223a66] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="uppercase text-blue-200 font-semibold tracking-widest text-sm">
              Patient Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-light mb-4 mt-2">
              Happy Clients & <span className="font-bold">Feedback</span>
            </h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Real experiences from real patients who trust us with their health
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition duration-300">
              <div className="flex items-start gap-4 mb-6">
                <FaQuoteLeft className="text-[#23cf7c] text-2xl flex-shrink-0 mt-1" />
                <p className="text-blue-100 text-lg leading-relaxed">
                  "The care I received here was exceptional. The doctors were thorough, 
                  compassionate, and made me feel comfortable throughout my treatment. 
                  I couldn't have asked for better healthcare."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src="/images/person_1.jpg" 
                  alt="Sarah Johnson" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#23cf7c]" 
                />
                <div>
                  <h4 className="font-bold text-lg">Sarah Johnson</h4>
                  <p className="text-blue-200 text-sm">Marketing Manager</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition duration-300">
              <div className="flex items-start gap-4 mb-6">
                <FaQuoteLeft className="text-[#23cf7c] text-2xl flex-shrink-0 mt-1" />
                <p className="text-blue-100 text-lg leading-relaxed">
                  "Outstanding medical facility with state-of-the-art equipment. 
                  The staff is incredibly professional and the doctors are among 
                  the best I've ever encountered. Highly recommend!"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src="/images/person_2.jpg" 
                  alt="Michael Chen" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#23cf7c]" 
                />
                <div>
                  <h4 className="font-bold text-lg">Michael Chen</h4>
                  <p className="text-blue-200 text-sm">Business Owner</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="uppercase text-[#223a66] font-semibold tracking-widest text-sm">
              Our Core Values
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-[#223a66] mb-4 mt-2">
              What We <span className="font-bold">Stand For</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaHeart />,
                title: "Compassionate Care",
                description: "We treat every patient with empathy, respect, and genuine concern for their wellbeing."
              },
              {
                icon: <FaShieldAlt />,
                title: "Safety First",
                description: "Patient safety is our top priority in every procedure and treatment we provide."
              },
              {
                icon: <FaStar />,
                title: "Excellence",
                description: "We strive for the highest standards in medical care and patient satisfaction."
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center hover:shadow-xl transition duration-300">
                <div className="text-[#23cf7c] text-4xl mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[#223a66] mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;