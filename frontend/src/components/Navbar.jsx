import axios from "axios";
import { Moon, Sun } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { clearFeed } from "../utils/feedSlice";
import { removeUser } from "../utils/userSlice";
import logo from "../assets/logo.png";

const Navbar = ({ darkMode, setDarkMode }) => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(clearFeed());
      return navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav
      className={`w-full transition-all duration-500 shadow-lg px-4 py-2 flex items-center justify-between ${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-gray-100"
          : "bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 text-white"
      }`}
    >
      {/* Left side: Logo and title */}
      <div
        onClick={() => navigate(user ? "/" : "/login")}
        className="flex items-center gap-3 text-2xl font-bold tracking-wide cursor-pointer"
      >
        <img
          src={logo}
          alt="Connectsy Logo"
          className="w-10 h-10 rounded-md object-cover shadow-sm"
        />
        <span className="hidden sm:inline">Connectsy</span>
      </div>

      {/* Right side: Theme toggle + User */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className={`btn btn-sm btn-outline rounded-full border-2 ${
            darkMode
              ? "text-gray-100 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
              : "text-white border-white hover:bg-white hover:text-black"
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {user && (
          <div className="dropdown dropdown-end relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              tabIndex={0}
            >
              <p className="mx-2 text-sm font-semibold hidden sm:block animate-pulse">
                Welcome, {user.firstName}
              </p>
              <div className="avatar">
                <div className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-white transition-transform hover:scale-105">
                  <img alt="user avatar" src={user.photoURL} />
                </div>
              </div>
            </div>

            <ul
              tabIndex={0}
              className={`menu menu-sm dropdown-content mt-3 p-3 shadow-lg rounded-lg w-52 z-[1] ${
                darkMode
                  ? "bg-gray-900 text-gray-100 border border-gray-700"
                  : "bg-white text-black border border-gray-200"
              }`}
            >
              <li>
                <Link
                  to={"/profile"}
                  className={`justify-between ${
                    darkMode ? "hover:text-pink-300" : "hover:text-purple-600"
                  }`}
                >
                  Profile <span className="badge">New</span>
                </Link>
              </li>
              <li>
                <Link
                  to={"/connections"}
                  className={
                    darkMode ? "hover:text-pink-300" : "hover:text-purple-600"
                  }
                >
                  My Connections
                </Link>
              </li>
              <li>
                <Link
                  to={"/requests"}
                  className={
                    darkMode ? "hover:text-pink-300" : "hover:text-purple-600"
                  }
                >
                  Connection Requests
                </Link>
              </li>
              <li>
                <Link
                  to={"/requested"}
                  className={
                    darkMode ? "hover:text-pink-300" : "hover:text-purple-600"
                  }
                >
                  Requested
                </Link>
              </li>
              <li>
                <Link
                  to={"/ignored"}
                  className={
                    darkMode ? "hover:text-pink-300" : "hover:text-purple-600"
                  }
                >
                  Ignored
                </Link>
              </li>
              <li>
                <Link
                  to={"/premium"}
                  className={
                    darkMode ? "hover:text-yellow-400" : "hover:text-yellow-600"
                  }
                >
                  Premium
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className={`text-left ${
                    darkMode ? "hover:text-red-400" : "hover:text-red-500"
                  }`}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
