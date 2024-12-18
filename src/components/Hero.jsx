import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import bgImage from "../assets/bgImg.jpeg";

function Hero() {
  const { isAuthenticated } = useStore();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative w-[95%] mx-auto mt-20 mb-8  rounded-3xl overflow-hidden shadow-lg">
        
          {/* Background Image */}
          <div className="relative w-full h-[85vh]">
            <img
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={bgImage}
              alt="Background"
            />

            {/* Text Overlay */}
            <div className="relative z-10 flex flex-col justify-center h-full pl-36 pr-8">
              <h1 className="text-white text-7xl font-bold leading-tight mb-4">
                Experience The <br />
                <span
                  className="text-green-400"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #a3e635, #10b981)',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Magic Of <br></br>
                  Group Study
                </span>
              </h1>
              <p className="text-black text-xl mb-6 "
               style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                Join hands to make learning a collaborative journey.
              </p>
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <button className="bg-green-600 text-white py-3 px-6 rounded-md text-lg hover:bg-green-700 transition">
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <Link to="/login">
                  <button className="bg-green-600 text-white py-3 px-6 rounded-md text-lg hover:bg-green-700 transition">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        
      </section>
    </div>
  );
}

export default Hero;
