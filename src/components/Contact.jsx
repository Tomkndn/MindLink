import React from "react";
import image from "../assets/contactus.jpg";


const Contact = () => {
  return (
    <div className="flex items-center justify-between p-20 w-full max-w-5xl mx-auto mb-12">
      {/* Left Image and Boxes */}
      <div className="relative">
        {/* Light Grey Image Placeholder */}
        <img className="relative bg-blue-400 w-64 h-72 rounded-lg z-20" src={image}/>
        {/* Top Small Box */}
        <div className="bg-gray-600 w-24 h-24 rounded-lg absolute top-[-30px] right-[-25px] z-10"></div>

        {/* Bottom Small Box */}
        <div className="bg-gray-600 w-24 h-24 rounded-lg absolute bottom-[-30px] left-[-26px] z-10"></div>
      </div>

      {/* Right Content */}
      <div className="flex flex-col space-y-4">
        {/* Heading */}
        <h2 className="text-6xl font-bold">Contact Us</h2>
        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          our leader yogesh is great<br />
          our sub lead kundan is smart<br />
          our friend saikat is handsome<br />
          
        </p>
      </div>
    </div>
  );
};

export default Contact;
