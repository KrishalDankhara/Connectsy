import axios from "axios";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

const Premium = () => {
  const { darkMode } = useOutletContext();
  const user = useSelector((store) => store.user);
  const isVerified = user?.isVerified;

  const handleBuyClick = async (type) => {
    try {
      const order = await axios.post(
        BASE_URL + "/payment/create",
        { membershipType: type },
        { withCredentials: true }
      );

      const { amount, currency, notes, keyId, orderId } = order.data;
      const options = {
        key: keyId,
        amount,
        currency,
        name: "Connectsy",
        description: "Connecting with users",
        order_id: orderId,
        handler: async function (response) {
          try {
            await axios.post(
              BASE_URL + "/payment/verify",
              {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );
            alert("Payment successful!! Please refresh the page");
            window.location.reload();
          } catch (error) {
            console.error("Verification failed", error);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: "manav@1234gmail.com",
          contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log("Error in handleBuyClick: " + err.message);
    }
  };

  return (
    <div
      className={`min-h-screen py-10 px-4 flex flex-col items-center transition-all duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "text-gray-900"
      }`}
    >
      <h1
        className={`text-3xl font-bold mb-8 text-center leading-snug px-4 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {isVerified ? "You're Verified ✨" : "Become a Verified User"}
      </h1>

      {isVerified ? (
        <div
          className={`w-full max-w-[90%] sm:max-w-md rounded-2xl px-6 py-8 shadow-xl text-center transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-br from-indigo-900 to-gray-800 border border-indigo-600"
              : "bg-gradient-to-br from-indigo-100 to-purple-200 border border-purple-300"
          }`}
        >
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-semibold mb-2">
            You're already verified!
          </h2>
          <p className="text-base font-medium opacity-90 mb-4">
            You’ve unlocked the blue tick, extra visibility, and premium status.
          </p>
          <p className="text-sm italic text-gray-400">
            Keep shining, legend 😎
          </p>
        </div>
      ) : (
        <div
          className={`w-full max-w-[90%] sm:max-w-md rounded-2xl shadow-lg p-6 backdrop-blur-md bg-opacity-80 transition-transform transform hover:scale-105 ${
            darkMode
              ? "bg-gray-700 text-white border border-gray-600"
              : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-900 border border-purple-200"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Verified Membership
          </h2>
          <p className="text-sm font-medium mb-4 text-center">
            Lifetime Access
          </p>
          <ul className="mb-4 space-y-2 list-disc list-inside text-base">
            <li>Verified Blue Tick on your profile</li>
            <li>Stand out in search results</li>
            <li>Increased trust and visibility</li>
          </ul>
          <div className="text-xl font-bold mb-4 text-center">$9.99</div>
          <div className="flex justify-center">
            <button
              onClick={() => handleBuyClick("silver")}
              className={`w-full sm:w-auto px-6 py-2 rounded-full text-white font-semibold shadow-md text-center ${
                darkMode
                  ? "bg-pink-600 hover:bg-pink-500"
                  : "bg-purple-600 hover:bg-purple-500"
              }`}
            >
              Get Verified
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;
