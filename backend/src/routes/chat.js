const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");
const  ConnectionRequest  = require("../models/connectionRequest");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;
  try {
    const isConnected = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
      ],
    })

    if (!isConnected) {
      return res
        .status(403)
        .json({ message: "Not allowed to chat with this user" });
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (error) {
    console.log("Error in chat: " + error.message);
  }
});

module.exports = chatRouter;


