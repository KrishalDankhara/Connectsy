import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addRequested, removeRequested } from "../utils/requestedSlice";

const SentRequests = () => {
  const dispatch = useDispatch();
  const { darkMode } = useOutletContext();
  const requested = useSelector((store) => store.requested);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 New: Search term state
  const navigate = useNavigate();

  const fetchRequestedConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/requested", {
        withCredentials: true,
      });
      dispatch(addRequested(res.data.sentRequest));
    } catch (err) {
      console.log("Error in fetchRequestedConnections " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsendRequest = async (requestId) => {
    try {
      await axios.delete(`${BASE_URL}/request/cancel/${requestId}`, {
        withCredentials: true,
      });
      dispatch(removeRequested(requestId));
    } catch (err) {
      console.error("Error unsending request: " + err.message);
    }
  };

  useEffect(() => {
    fetchRequestedConnections();
  }, []);

  const filteredRequests = requested.filter((request) => {
    const fullName =
      `${request.toUserId.firstName} ${request.toUserId.lastName}`.toLowerCase();
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
          alt="Loading requests..."
          className="w-24 h-24 mb-6"
        />
        <h2 className="text-2xl font-semibold animate-pulse">
          Loading sent requests...
        </h2>
      </div>
    );
  }

  if (!requested || requested.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-[75vh] text-center px-4 transition-colors duration-300 ${
          darkMode ? "bg-slate-800 text-white" : ""
        }`}
      >
        <img
          src="https://cdn.pixabay.com/photo/2023/01/05/22/17/ai-generated-7699943_1280.png"
          alt="No requests"
          className="w-64 h-64 mb-6"
        />
        <h1 className="text-3xl font-bold mb-2">No Requests Sent Yet</h1>
        <p
          className={`max-w-md mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Looks like you haven't sent any connection requests yet. Start
          exploring users to connect with.
        </p>
        <a
          href="/"
          className="btn btn-primary px-6 py-2 rounded-full text-white shadow-md transition hover:scale-105"
        >
          🔍 Explore Users
        </a>
      </div>
    );
  }

  return (
    <div
      className={`text-center my-10 transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className={`font-bold text-2xl mb-4 ${darkMode ? "text-white" : ""}`}>
        Sent Connection Requests
      </h1>

      {/* 🔍 Search input */}
      <div className="mb-8 flex justify-center ">
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
            placeholder="Search by name..."
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

      {filteredRequests.map((request) => {
        const {
          firstName,
          lastName,
          age,
          gender,
          about,
          photoURL,
          isVerified,
          skills = [],
          _id,
        } = request.toUserId;

        return (
          <div
            key={_id}
            className={`flex flex-col md:flex-row items-center justify-between m-4 p-4 rounded-lg w-full md:w-2/3 mx-auto shadow-lg transition-colors duration-300 ${
              darkMode ? "bg-slate-700 text-white" : "bg-base-300 text-black"
            }`}
          >
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left sm:items-start w-full md:w-3/4 gap-4">
              <img
                src={photoURL || "https://via.placeholder.com/100"}
                alt="profile"
                onClick={() => {
                  navigate("/user/" + _id);
                  window.scrollTo(0, 0);
                }}
                className="w-20 h-20 rounded-full object-cover border border-gray-300 cursor-pointer"
              />
              <div className="space-y-1">
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
                  <p className="text-gray-500 text-sm">{age + ", " + gender}</p>
                )}
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
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
                  <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
              </div>
            </div>

            {/* Button Section */}
            <div className="flex justify-center md:justify-end mt-4 md:mt-0 w-full md:w-auto">
              <button
                className={`px-4 py-2 text-sm rounded-md shadow transition hover:scale-105 ${
                  darkMode ? "btn btn-primary" : "btn btn-secondary"
                }`}
                onClick={() => handleUnsendRequest(request._id)}
              >
                Unsend
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SentRequests;
