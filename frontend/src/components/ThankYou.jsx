// src/pages/ThankYou.jsx
import React from "react";

const ThankYou = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100 dark:bg-gray-900 text-center">
      <div>
        <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
          🎉 Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Thank you for subscribing to our premium membership.
        </p>
      </div>
    </div>
  );
};
export default ThankYou;
