import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { Outlet, useNavigate } from 'react-router-dom';  // Outlet: Renders the child routes of the current route, allowing for nested routing.
import { Footer } from './Footer';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import axios from 'axios';

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    // Apply dark mode class to HTML element and save preference
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const fetchUser = async () => {
    if (userData) return;

    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  });

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : ''}`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className={`flex-grow transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100'}`}>
        <Outlet context={{ darkMode }} />
      </main>
      
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default Body;