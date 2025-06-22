import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const socketRef = useRef(null);
  const { darkMode } = useOutletContext();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const user = useSelector((store) => store.user);
  const chatContainerRef = useRef(null);
  const userId = user?._id;

  // Fetch initial chat history
  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      const chatMessages = chat.data?.messages.map((msg) => {
        const { senderId, text, createdAt } = msg;
        const { firstName, lastName } = senderId;
        return {
          firstName,

          lastName,
          text,
          timestamp: new Date(createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });

      setMessages(chatMessages);
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/");
      } else {
        console.error("Failed to fetch chat:", err);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch on mount
  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/${targetUserId}`, {
          withCredentials: true,
        });
        setTargetUser(res.data);
      } catch (err) {
        console.error("Failed to fetch target user", err);
      }
    };
    fetchChatMessages();
    fetchTargetUser();
  }, []);

  // Setup socket listeners
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", {
      firstName: user.firstName,
      targetUserId,
      userId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, createdAt }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          firstName,
          lastName,
          text,
          timestamp: new Date(createdAt || Date.now()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // Send message
  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    socketRef.current?.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      targetUserId,
      userId,
      text: newMessage,
    });

    setNewMessage("");
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      className={`w-full max-w-5xl mx-auto my-4 h-[80vh] flex flex-col rounded-lg overflow-hidden shadow-md transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 border border-gray-700"
          : "bg-white/70 backdrop-blur-md border border-white/30"
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 sm:p-5 border-b flex items-center gap-3 ${
          darkMode
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-300 bg-gray-100 text-gray-900"
        }`}
      >
        {targetUser?.photoURL && (
          <img
            src={targetUser.photoURL}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            onClick={() => navigate(`/user/${targetUser._id}`)}
          />
        )}
        <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-1">
          {targetUser?.firstName} {targetUser?.lastName}
          {targetUser?.isVerified && (
            <img
            src="/verify.png"
            alt="Verified Badge"
            className="w-5 h-5 object-contain -ml-0.5 -mb-0.5"
          />
          )}
        </h1>
      </div>

      {/* Loading state */}
      {loading ? (
        <div
          className={`flex-1 flex items-center justify-center text-lg ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Loading chat...
        </div>
      ) : (
        <>
          {/* Chat messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 no-scrollbar"
          >
            {messages.length === 0 ? (
              <div
                className={`text-center mt-10 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <div className="text-xl sm:text-2xl font-semibold mb-2">
                  No conversation yet
                </div>
                <p className="text-sm">Say hello to start the conversation ✨</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat ${
                    msg.firstName === user.firstName ? "chat-end" : "chat-start"
                  }`}
                >
                  <div
                    className={`chat-bubble ${
                      darkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div
                    className={`chat-footer text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div
            className={`relative p-3 sm:p-4 border-t flex flex-col sm:flex-row items-center gap-3 sm:gap-2 ${
              darkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-300 bg-gray-100"
            }`}
          >
            <div className="relative w-full flex items-center gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className={`w-full border rounded px-3 py-2 outline-none text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                    : "bg-white text-black placeholder-gray-500 border-gray-400"
                }`}
                placeholder="Type a message..."
              />
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="text-xl sm:text-2xl"
                title="Pick emoji"
              >
                😊
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-14 right-0 sm:bottom-12 z-50">
                  <EmojiPicker
                    theme={darkMode ? "dark" : "light"}
                    onEmojiClick={handleEmojiClick}
                  />
                </div>
              )}
            </div>

            <button
              onClick={sendMessage}
              className={`w-full sm:w-auto btn text-sm sm:text-base ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              } px-5 py-2 rounded-full transition-transform duration-200 hover:scale-105`}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
