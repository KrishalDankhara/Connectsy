const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "photoURL",
      "skills",
      "photos",
      "isVerified",
    ]);
    res.json({
      message: "Data fetched succesafully",
      pendingRequests,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
userRouter.get("/user/requests/requested", userAuth, async (req, res) => {
  // console.log("INcominggg")
  const loggedInUser = req.user;
  try {
    const sentRequest = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate("toUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "photoURL",
      "skills",
      "photos",
      "isVerified",
    ]);
    res.json({ sentRequest });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.get("/user/ignored", userAuth, async (req, res) => {
  const user = req.user;
  try {
    const ignored = await ConnectionRequest.find({
      fromUserId: user._id,
      status: "ignored",
    }).populate("toUserId", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "photoURL",
      "skills",
      "photos",
      "isVerified",
    ]);
    res.json({ ignored });
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
});
userRouter.delete("/request/cancel/:id", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestId = req.params.id;

    const request = await ConnectionRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (
      request.fromUserId.toString() !== loggedInUser._id.toString() ||
      request.status !== "interested"
    ) {
      return res
        .status(403)
        .json({ message: "You can only cancel pending requests you sent." });
    }

    await ConnectionRequest.findByIdAndDelete(requestId);

    res.json({ message: "Request unsent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstName lastName age about gender photoURL skills photos isVerified"
      )
      .populate(
        "toUserId",
        "firstName lastName age about gender photoURL skills photos isVerified"
      );

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const dataFeed = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");
    const hideUsersFromFeed = new Set();
    dataFeed.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(
      "firstName lastName age gender about skills photoURL photos isVerified"
    );

    res.send(users);
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

userRouter.get("/user/:id", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "firstName lastName age gender about skills photoURL photos isVerified"
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "User not found" });
  }
});

module.exports = userRouter;
