import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useOutletContext } from "react-router-dom"; // For dark mode context

const Login = () => {
  const { darkMode } = useOutletContext(); // Get dark mode status from context

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Signup failed");
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row justify-center items-center  px-4 md:px-0 min-h-[85vh] transition-all duration-500 ease-in-out ${
        darkMode
          ? "bg-slate-800"
          : "bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100"
      }`}
    >
      {/* Illustration - shown only on md+ screens */}
      <img
        src="/leaning.png"
        alt="Login illustration"
        className="hidden md:block w-60 h-auto drop-shadow-lg "
      />

      {/* Login / Signup Card */}
      <div
        className={`card w-full max-w-md shadow-xl rounded-xl p-6 border transition-colors duration-500 ${
          darkMode
            ? "bg-slate-700 text-white border-purple-600"
            : "bg-white bg-opacity-90 backdrop-blur-md border-purple-200"
        }`}
      >
        <h2
          className={`text-center text-2xl font-bold mb-4 ${
            darkMode ? "text-purple-300" : "text-purple-700"
          }`}
        >
          {isLoginForm ? "Login" : "Sign Up"}
        </h2>

        {!isLoginForm && (
          <>
            <input
              type="text"
              placeholder="First Name"
              className={`input input-bordered w-full mb-3 ${
                darkMode ? "bg-gray-800 text-white" : ""
              }`}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className={`input input-bordered w-full mb-3 ${
                darkMode ? "bg-gray-800 text-white" : ""
              }`}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          className={`input input-bordered w-full mb-3 ${
            darkMode ? "bg-gray-800 text-white" : ""
          }`}
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={`input input-bordered w-full mb-3 ${
            darkMode ? "bg-gray-800 text-white" : ""
          }`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <button
          className={`btn btn-primary w-full transition-all hover:scale-105 ${
            darkMode ? "bg-purple-600 hover:bg-purple-500" : ""
          }`}
          onClick={isLoginForm ? handleLogin : handleSignUp}
        >
          {isLoginForm ? "Login" : "Sign Up"}
        </button>

        <p
          onClick={() => setIsLoginForm((prev) => !prev)}
          className={`mt-4 text-sm text-center cursor-pointer ${
            darkMode
              ? "text-blue-400 hover:underline"
              : "text-blue-600 hover:underline"
          }`}
        >
          {isLoginForm
            ? "New User? Sign Up here"
            : "Existing User? Login here"}
        </p>
      </div>
    </div>
  );
};

export default Login;
