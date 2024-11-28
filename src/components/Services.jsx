import React from "react";
import demo from "../assets/facebookIcon.png";

const ServiceSection = () => {
  return (
    <div className="mb-16 relative flex items-center justify-between bg-lime-200 p-20 rounded-3xl mt-6 w-full max-w-5xl mx-auto h-96">
      {/* Left Content */}
      <div className="flex flex-col space-y-4">
        {/* Badge */}
        <div className="bg-green-700 text-white text-xl font-bold px-8 py-4 rounded-full w-max">
          Our Services
        </div>
        {/* Heading */}
        <h2 className="text-2xl font-semibold">Heading for this Section</h2>
        {/* Description */}
        <p className="text-gray-800">
          our leader yogesh is great<br />
          our sub lead kundan is smart<br />
          our friend saikat is handsome<br />
        </p>
      </div>

      {/* Right Image and Box */}
      <div className=" flex-shrink-0">
        {/* Light Grey Image Placeholder */}
          <img className="relative w-60 z-20" src={demo} />
    
        {/* Dark Grey Box Attached to Image */}
        <div className="bg-gray-600 w-32 h-28 rounded-lg absolute top-[15rem] left-[40.25rem] z-10"></div>
      </div>
    </div>
  );
};

export default ServiceSection;
