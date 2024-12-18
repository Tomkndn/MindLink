import React from "react";
import demo from "../assets/6804681.jpg";

const ServiceSection = () => {
  return (
    <div className="relative flex items-center justify-between bg-gradient-to-r from-lime-200 to-lime-400 p-12 rounded-3xl mt-6 w-full max-w-7xl mx-auto shadow-lg">
      {/* Left Content */}
      <div className="flex flex-col space-y-6 w-1/2 ">
        {/* Badge */}
        <div className="bg-green-700 text-white text-2xl font-semibold px-6 py-2 rounded-full shadow-md w-max">
          Our Services
        </div>

        {/* Service List */}
        <ul className="space-y-3 text-gray-800 text-[1.25 rem] font-medium leading-relaxed"
        style={{fontFamily:"'Poppins', sans-serif"}}>
          <li className="flex items-center">
            <span className="text-green-600 mr-2 text-xl">✔</span> Live Study Sessions
          </li>
          <li className="flex items-center">
            <span className="text-green-600 mr-2 text-xl">✔</span> Groups Creation
          </li>
          <li className="flex items-center">
            <span className="text-green-600 mr-2 text-xl">✔</span> Meeting Scheduler
          </li>
          <li className="flex items-center">
            <span className="text-green-600 mr-2 text-xl">✔</span> Notes and Resource Sharing
          </li>
          <li className="flex items-center">
            <span className="text-green-600 mr-2 text-xl">✔</span> Focus Sessions
          </li>
        </ul>
      </div>

      {/* Right Content */}
      <div className="relative w-1/2 flex justify-end">
        {/* Background Circle Decoration */}
        <div className="absolute -top-4 -right-4  bg-gray-600 w-44 h-44 rounded-full opacity-50 z-0"></div>

        {/* Image */}
        <img
          src={demo}
          alt="Service Illustration"
          className="relative z-10 w-72 h-auto drop-shadow-lg transform hover:scale-105 transition-transform duration-300"
        />
        
      </div>
    </div>
  );
};

export default ServiceSection;
