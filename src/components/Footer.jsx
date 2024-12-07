import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-16">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-lg">
          &copy; {new Date().getFullYear()} Study Group App. All rights reserved.
        </p>
        <div className="mt-4">
          <a href="/about" className="text-sm hover:text-green-400 mx-2">
            About
          </a>
          <a href="/contact" className="text-sm hover:text-green-400 mx-2">
            Contact
          </a>
          <a href="/privacy" className="text-sm hover:text-green-400 mx-2">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
