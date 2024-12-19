import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-16">
      <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-10">

        {/* Middle Section: Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 ">
          <div>
            <h4 className="font-semibold mb-2 ml-5">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm hover:text-green-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/careers" className="text-sm hover:text-green-400 transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="/blog" className="text-sm hover:text-green-400 transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 ml-5">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="text-sm hover:text-green-400 transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm hover:text-green-400 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/help" className="text-sm hover:text-green-400 transition">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 ml-5">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="/terms" className="text-sm hover:text-green-400 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm hover:text-green-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-sm hover:text-green-400 transition">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 ml-5">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-green-400 transition"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-green-400 transition"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-green-400 transition"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright and Social Media */}
        <div className="border-t border-green-700 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Study Group App. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
