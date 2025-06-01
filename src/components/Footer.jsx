import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <img src="/images/logo.png" alt="Logo" className="mb-4 w-40" />
            <p>
              Tempora dolorem voluptatum nam vero assumenda voluptate, facilis ad eos obcaecati tenetur veritatis eveniet distinctio possimus.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="https://www.facebook.com/themefisher" className="text-blue-600 hover:text-blue-800">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com/themefisher" className="text-blue-400 hover:text-blue-600">
                <FaTwitter />
              </a>
              <a href="https://www.pinterest.com/themefisher/" className="text-blue-700 hover:text-blue-900">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Department */}
          <div>
            <h4 className="text-xl font-semibold mb-3">Department</h4>
            <div className="border-b-2 w-10 border-blue-500 mb-4"></div>
            <ul className="space-y-2">
              <li><a href="#!" className="hover:text-blue-600">Surgery</a></li>
              <li><a href="#!" className="hover:text-blue-600">Women's Health</a></li>
              <li><a href="#!" className="hover:text-blue-600">Radiology</a></li>
              <li><a href="#!" className="hover:text-blue-600">Cardioc</a></li>
              <li><a href="#!" className="hover:text-blue-600">Medicine</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xl font-semibold mb-3">Support</h4>
            <div className="border-b-2 w-10 border-blue-500 mb-4"></div>
            <ul className="space-y-2">
              <li><a href="#!" className="hover:text-blue-600">Terms & Conditions</a></li>
              <li><a href="#!" className="hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="#!" className="hover:text-blue-600">Company Support</a></li>
              <li><a href="#!" className="hover:text-blue-600">FAQ</a></li>
              <li><a href="#!" className="hover:text-blue-600">Company Licence</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-3">Get in Touch</h4>
            <div className="border-b-2 w-10 border-blue-500 mb-4"></div>

            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <FaEnvelope />
                <span className="font-semibold">Support Available 24/7</span>
              </div>
              <p className="mt-2 text-blue-600"><a href="mailto:support@email.com">support@email.com</a></p>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <FaPhone />
                <span className="font-semibold">Mon to Fri : 08:30 - 18:00</span>
              </div>
              <p className="mt-2 text-blue-600"><a href="tel:+23-456-6588">+1234567890</a></p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; 2021, Designed & Developed by <a href="https://themefisher.com" className="text-blue-500 hover:underline">FptAptech</a></p>

          <form className="mt-4 md:mt-0 flex space-x-2">
            <input
              type="text"
              placeholder="Your Email address"
              className="px-4 py-2 border rounded-full focus:outline-none"
              required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">Subscribe</button>
          </form>
        </div>

        {/* Back to top */}
        <div className="mt-6 text-left">
          <a href="#top" className="inline-block text-blue-600 hover:text-blue-800">
            <FaArrowUp size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
