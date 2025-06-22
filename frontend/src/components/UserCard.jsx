import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { darkMode } = useOutletContext();
  const {
    _id,
    firstName,
    lastName,
    about,
    age,
    gender,
    photoURL,
    photos,
    isVerified,
    skills = [],
  } = user;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allPhotos =
    Array.isArray(photos) && photos.length > 0 ? photos : [photoURL];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [_id]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const getShortAbout = (text, wordLimit = 20) => {
    const words = text?.split(" ");
    if (!words || words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const sendStatus = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error in Feed : " + err.message);
    }
  };

  return (
    <div
      className={`w-full max-w-[22rem] sm:w-96 border rounded-xl transition-all duration-500 transform hover:scale-[1.02] mx-auto ${
        darkMode
          ? "bg-slate-700 border-gray-600 text-white shadow-md"
          : "bg-pink-100 text-black"
      }`}
    >
      <div className="relative" {...swipeHandlers}>
        <img
          src={allPhotos[currentIndex]}
          alt="Profile"
          className="rounded-xl w-full h-[300px] sm:h-[400px] object-cover object-center"
        />
        {allPhotos.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-[-1rem] transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800 shadow-md p-2 rounded-full hover:scale-110 transition"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-5 h-5 text-black dark:text-white" />
            </button>
            <button
              className="absolute top-1/2 right-[-1rem] transform -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-800 shadow-md p-2 rounded-full hover:scale-110 transition"
              onClick={handleNext}
            >
              <ChevronRight className="w-5 h-5 text-black dark:text-white" />
            </button>
          </>
        )}
      </div>

      <div className="p-4 text-center">
        <h2 className="text-lg font-semibold flex items-center justify-center gap-1">
          {firstName + " " + lastName}
          {isVerified && (
            <img
              src="verify.png"
              alt="Verified Badge"
              className="w-5 h-5 object-contain -ml-0.5 -mb-0.5"
            />
          )}
        </h2>

        {age && gender && <p className="text-sm">{age + ", " + gender}</p>}

        <div className="text-sm mt-2">
          <p>
            {getShortAbout(about)}
            {about?.split(" ").length > 20 && (
              <button
                className={`ml-2 underline hover:text-blue-700 ${
                  darkMode
                    ? "text-blue-300 hover:text-blue-100"
                    : "text-blue-500"
                }`}
                onClick={() => navigate(`/user/${_id}`)}
              >
                Know more
              </button>
            )}
          </p>
        </div>

        {skills.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap justify-center gap-2">
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
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className={`btn ${darkMode ? "btn-info" : "btn-primary"}`}
            onClick={() => sendStatus("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className={`btn ${darkMode ? "btn-success" : "btn-secondary"}`}
            onClick={() => sendStatus("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
