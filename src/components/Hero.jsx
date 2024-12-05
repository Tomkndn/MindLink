import React from 'react';

function Hero() {
  return (
    <div>
      <section className="mb-10 w-full flex justify-center items-center relative top-[70px] px-[3vw] pb-[3vw]">
        {/* Image Container */}
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          <img
            src="https://media.istockphoto.com/id/1295309857/photo/group-of-business-people-meeting-discussing-analyzing-graphs-financial-data-and-planning-a.jpg?s=612x612&w=0&k=20&c=uSZEmg02C2MdPgSE7l6qYh4h60pMuJMe2EXtWdjNXDY="
            alt="Main Visual"
            className="w-full object-cover rounded-lg"
          />

          {/* Text Overlay */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-black bg-opacity-50 p-10 rounded-lg">
            <h1 className="text-white text-4xl font-bold mb-4">
              Experience <span className="text-orange-500">The Magic Of Group Study</span>
            </h1>
            <p className="text-white text-lg leading-6">
              Join hands to make learning a collaborative journey.
            </p>
            <button className="mt-6 bg-green-600 text-white py-3 px-6 rounded-md text-lg hover:bg-green-700 transition">
              Login
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;

