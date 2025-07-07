const socket = require("socket.io");
const crypto = require("crypto");
const Chat = require("../models/chat");

const initializeSocket = (server) => {
  const getSecretRoomId = (userId, targetUserId) => {
    return crypto
      .createHash("sha256")  // Creates a SHA-256 hash object (a secure hash algorithm).
      .update([targetUserId, userId].sort().join("$"))  // Sorts the user IDs and joins them with a dollar sign to create a unique room ID.
      .digest("hex");  // Outputs the hash as a hexadecimal string (the room ID).
  };

  const io = socket(server, {
    cors: {
      origin: "https://connectsy-frontend-onhh.onrender.com",
      credentials: true
    },
  });

  // Store online users
  const onlineUsers = {};

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      onlineUsers[userId] = socket.id;

      // Notify all clients that this user is online
      io.emit("userStatus", { userId, status: "online" });  // emit : Send events/data between server and clients in real time
    }

    // Join private room
    socket.on("joinChat", ({ targetUserId, userId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    // Handle sending messages
    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
      try {
        const roomId = getSecretRoomId(userId, targetUserId);

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserId] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text,
        });

        await chat.save();

        io.to(roomId).emit("messageReceived", { firstName, lastName, text, createdAt: new Date() });
      } catch (error) {
        console.log("Send Message Error:", error.message);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      if (userId && onlineUsers[userId]) {
        delete onlineUsers[userId];

        // Notify all clients that this user is offline
        io.emit("userStatus", { userId, status: "offline" });
      }
    });
  });
};

module.exports = initializeSocket;
