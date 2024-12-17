import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { toast } from 'react-toastify';

function Navbar() {
  const { isAuthenticated, logout } = useStore()
  
  const logouthandler = () => {
    logout()
    toast.success("Logged out successfully", { position: "bottom-right" })
  }

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
        {
          isAuthenticated ?
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition duration-300" onClick={logouthandler}>
            Log out
            </button>
            :
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 hover:scale-105 transition duration-300">
              <Link to="/signup">Signup</Link>
            </button>
        }
      </nav>
    </div>
  );
}

export default Navbar;
