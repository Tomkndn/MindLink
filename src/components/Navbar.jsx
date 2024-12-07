import React from 'react';

function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center px-10 py-5 bg-gray-900 text-white fixed top-0 left-0 right-0 z-50 shadow-lg w-full h-[60px]">
        {/* Brand Logo */}
        <div className="text-2xl font-bold">Mind Link</div>

        {/* Navbar Links */}
        <ul className="flex space-x-8 list-none m-0 p-0">
          <li>
            <a
              href="#about"
              className="text-white font-medium hover:text-green-500 transition duration-300"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#classroom"
              className="text-white font-medium hover:text-green-500 transition duration-300"
            >
              Classroom
            </a>
          </li>
          <li>
            <a
              href="#dashboard"
              className="text-white font-medium hover:text-green-500 transition duration-300"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#meetings"
              className="text-white font-medium hover:text-green-500 transition duration-300"
            >
              Meetings
            </a>
          </li>
        </ul>

        {/* Signup Button */}
        <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition duration-300">
          Signup
        </button>
      </nav>
    </div>
  );
}

export default Navbar;