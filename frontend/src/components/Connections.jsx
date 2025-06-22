import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useOutletContext();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error in connection " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const filteredConnections = connections.filter((conn) => {
    const fullName = `${conn.firstName} ${conn.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-[80vh] text-center px-4 transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : ""
        }`}
      >
        <img
          src="https://cdn.pixabay.com/animation/2022/10/11/03/16/03-16-39-160_512.gif"
          alt="Loading connections..."
          className="w-24 h-24 mb-6"
        />
        <h2 className="text-2xl font-semibold animate-pulse">
          Fetching your connections...
        </h2>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-[75vh] text-center px-4 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-white" : ""
        }`}
      >
        <img
          src="https://cdn.pixabay.com/photo/2016/06/15/16/16/man-1459246_1280.png"
          alt="No activity"
          className="w-64 h-64 mb-6 drop-shadow-xl transition-transform duration-500 hover:scale-105"
        />
        <h1 className="text-3xl font-bold mb-3">Nothing Here Yet!!</h1>
        <p
          className={`text-gray-500 max-w-md mb-6 ${
            darkMode ? "text-gray-300" : ""
          }`}
        >
          You haven’t made any connections yet. Go find like-minded people and
          start building your circle!
        </p>
        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-transform duration-300 hover:scale-105"
        >
          🚀 Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className={`text-center my-10 px-4 transition-colors duration-300`}>
      <h1 className={`font-bold text-2xl mb-6 ${darkMode ? "text-white" : ""}`}>
        Connections
      </h1>

      {/* Search input */}
      <div className="mb-10 flex justify-center">
        <div
          className={`relative w-full max-w-md rounded-full shadow-lg transition duration-300 ${
            darkMode ? "bg-slate-700" : "bg-base-300"
          }`}
        >
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search connections by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-2.5 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
              darkMode
                ? "bg-slate-700 text-white placeholder-gray-400"
                : "bg-base-300 text-black placeholder-gray-500 border border-gray-300"
            }`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 items-center">
        {filteredConnections.map((connection) => {
          const {
            _id,
            firstName,
            lastName,
            age,
            gender,
            about,
            photoURL,
            isVerified,
            skills = [],
          } = connection;
          return (
            <div
              key={_id}
              className={`flex flex-col sm:flex-row items-center sm:items-start p-4 rounded-lg w-full sm:w-[80%] max-w-4xl shadow-md transition-colors duration-300 ${
                darkMode ? "bg-slate-700 text-white" : "bg-base-300 text-black"
              }`}
            >
              <img
                src={photoURL}
                onClick={() => {
                  navigate("/user/" + _id);
                  window.scrollTo(0, 0);
                }}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover shadow-md cursor-pointer"
              />
              <div className="relative sm:ml-4 mt-4 sm:mt-0 text-center sm:text-left w-full">
                <h2 className="font-bold text-xl flex items-center justify-center sm:justify-start gap-1">
                  {firstName + " " + lastName}
                  {isVerified && (
                    <img
                      src="verify.png"
                      alt="Verified Badge"
                      className="w-5 h-5 object-contain -ml-0.5 -mb-1"
                    />
                  )}
                </h2>
                {age && gender && (
                  <p className="text-gray-500">{age + ", " + gender}</p>
                )}
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {about?.split(" ").length > 15
                    ? `${about.split(" ").slice(0, 15).join(" ")}... `
                    : about}
                  {about?.split(" ").length > 15 && (
                    <span
                      className="text-blue-500 cursor-pointer hover:underline ml-1"
                      onClick={() => {
                        navigate("/user/" + _id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      know more
                    </span>
                  )}
                </p>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          darkMode
                            ? "bg-blue-600 text-white"
                            : "bg-white text-blue-600 border border-blue-300"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => navigate(`/chat/${_id}`)}
                  className={`sm:absolute sm:right-4 btn sm:top-4 mt-3 sm:mt-0 ${
                    darkMode ? "btn-primary" : "btn-secondary"
                  } text-white px-4 py-2 rounded-full transition-transform duration-200 hover:scale-105`}
                >
                  💬 Chat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
