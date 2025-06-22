import React from "react";
import logo from "../assets/logo.png";

export const Footer = ({ darkMode }) => {
  return (
    <footer
      className={`w-full mt-auto px-6 py-10 transition-colors duration-300
        ${
          darkMode
            ? "bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 border-t border-gray-700"
            : "bg-gradient-to-r from-purple-100 to-pink-200 text-gray-800 border-t border-purple-300"
        }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 items-start text-sm">
        {/* Column 1: Logo, Name, and Description */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <img
              src={logo}
              alt="Connectsy Logo"
              className="w-12 h-12 rounded-xl shadow-md"
            />
            <span className="text-2xl font-bold tracking-wide">Connectsy</span>
          </div>
          <p className="hidden sm:block text-sm opacity-90 leading-relaxed">
            Connectsy is a modern platform to discover, connect, and collaborate
            with like-minded individuals. Whether you're here to make friends,
            find teammates, or just network — we've got you covered.
          </p>
          <p className="block sm:hidden text-sm opacity-90 leading-relaxed">
            Connect, chat & collaborate anytime.
          </p>
        </div>

        {/* Column 2: Contact Info */}
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
          <p>
            <span className="font-medium">Email:</span>{" "}
            <a
              href="mailto:tradahenish94@gmail.com"
              className={`underline hover:opacity-80 ${
                darkMode ? "text-pink-300" : "text-purple-700"
              }`}
            >
              tradahenish94@gmail.com
            </a>
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            <a
              href="tel:+918200079192"
              className={`underline hover:opacity-80 ${
                darkMode ? "text-pink-300" : "text-purple-700"
              }`}
            >
              +91 8200079192
            </a>
          </p>
          <p className="pt-2 text-xs opacity-80">
            © {new Date().getFullYear()} Connectsy. All rights reserved.
          </p>
        </div>

        {/* Column 3: Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center sm:text-right">
            Follow Us On
          </h3>
          <div className="flex justify-center sm:justify-end gap-6">
            {/* GitHub */}
            <a
              href="https://github.com/HenishTrada"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:scale-110 transition-transform ${
                darkMode ? "hover:text-pink-300" : "hover:text-purple-700"
              }`}
              title="GitHub"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0.5C5.6 0.5 0.5 5.6 0.5 12c0 5.1 3.3 9.5 7.9 11.1.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.5-3.9-1.5-.6-1.5-1.4-1.9-1.4-1.9-1.2-.9.1-.9.1-.9 1.3.1 2 1.3 2 1.3 1.2 2 3.1 1.4 3.8 1.1.1-.9.5-1.4.9-1.7-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.3-3.3-.1-.3-.6-1.5.1-3.2 0 0 1-.3 3.4 1.3a11.9 11.9 0 0 1 6.2 0C17.5 5.2 18.5 5.5 18.5 5.5c.7 1.7.3 2.9.1 3.2.8.9 1.3 2 1.3 3.3 0 4.6-2.7 5.6-5.3 5.9.5.4 1 .9 1 2v3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.6 18.4 0.5 12 0.5z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/henish-trada-a40931208/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:scale-110 transition-transform ${
                darkMode ? "hover:text-pink-300" : "hover:text-purple-700"
              }`}
              title="LinkedIn"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 24h4V7h-4v17zM8.5 7H12v2.56h.05c.49-.93 1.7-1.9 3.5-1.9 3.74 0 4.45 2.47 4.45 5.68V24h-4v-8.41c0-2-.03-4.58-2.79-4.58-2.8 0-3.23 2.18-3.23 4.44V24h-4V7z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
