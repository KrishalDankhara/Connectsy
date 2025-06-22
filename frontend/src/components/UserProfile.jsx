import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import { BASE_URL } from "../utils/constants";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useOutletContext();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${userId}`, {
          withCredentials: true,
        });
        const data = response.data;
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const allPhotos =
    Array.isArray(user?.photos) && user.photos.length > 0
      ? user.photos
      : [user?.photoURL];

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

  if (loading) {
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
          Fetching profile...
        </h2>
      </div>
    );
  }

  return (
    <div
      className={`w-3/4 mx-auto my-6 flex flex-col rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800 text-white"
          : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-900"
      }`}
    >
      {/* Profile Header */}
      <div className="py-4 px-6 border-b border-gray-300">
        <h1 className="text-3xl font-bold text-center tracking-wide">
          Profile
        </h1>
      </div>

      {/* Profile Image */}
      <div
        className="relative flex justify-center items-center p-5"
        {...swipeHandlers}
      >
        <img
          src={allPhotos[currentIndex]}
          alt="Profile"
          className="h-96 w-auto max-w-full rounded-xl object-cover shadow-lg"
        />
        {allPhotos.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800 p-2 rounded-full shadow-md"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {currentIndex < allPhotos.length - 1 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800 p-2 rounded-full shadow-md"
                onClick={handleNext}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Profile Details */}
      <div className="py-3 px-6 space-y-4 text-center">
        <h2 className="text-2xl flex -my-0.5  mx-4 font-semibold justify-center items-center gap-1">
          <span className="">{user.firstName} {user.lastName}</span>
          {user.isVerified && (
            <img
            src="/verify.png"
            alt="Verified Badge"
            className="w-5 h-5 object-contain -ml-0.5 -mb-2"
          />
          )}
        </h2>

        {user.age && user.gender && (
          <p className="text-sm my-1 dark:text-gray-300">
            {user.age}, {user.gender}
          </p>
        )}
        {user.about && <p className="text-sm">{user.about}</p>}

        {/* Skills */}
        {user.skills?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-2 mb-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 mb-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white shadow"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
