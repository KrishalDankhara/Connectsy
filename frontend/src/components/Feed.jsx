import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { useOutletContext } from "react-router-dom";

const Feed = () => {
  const { darkMode } = useOutletContext();
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (feed !== null) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  });

  if (feed === null) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-[80vh] transition-all duration-300 ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-gradient-to-r from-purple-100 to-pink-200 text-gray-800"
        }`}
      >
        <img
          src="https://cdn.pixabay.com/animation/2022/10/11/03/16/03-16-39-160_512.gif"
          alt="Loading..."
          className="w-24 h-24 mb-6"
        />
        <h1 className="text-2xl font-semibold animate-pulse">
          Finding users for you...
        </h1>
      </div>
    );
  }

  if (feed.length <= 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-[80vh] text-center px-4 transition-all duration-300 ${
          darkMode
            ? "bg-gradient-to-br from-slate-800 to-slate-900 text-white"
            : "bg-gradient-to-br from-purple-100 to-pink-200 text-gray-800"
        }`}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png"
          alt="All done"
          className="w-52 h-52 mb-6 animate-bounce"
        />
        <h1 className="text-3xl font-bold mb-3">
          You’ve Interacted With Everyone!
        </h1>
        <p className="text-base max-w-md mb-6">
          Great job! You've reviewed all the users in your feed. Check back
          later to discover more awesome people.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center px-4 sm:px-0 py-4 mt-5">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
