const express = require("express");
const multer = require("multer");
const photoRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { storage, cloudinary } = require("../utils/cloundinary"); // Make sure cloudinary object is exported

const upload = multer({ storage });

// Upload Photos
photoRouter.post(
  "/profile/upload-photos",
  userAuth,
  upload.array("photos", 6),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      const photoURLs = req.files.map((file) => file.path); // Cloudinary URLs

      user.photos.push(...photoURLs);
      await user.save();

      res.status(200).json({ message: "Photos uploaded", photos: user.photos });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// Delete a Photo
photoRouter.delete("/profile/delete-photo", userAuth, async (req, res) => {
  try {
    const { photoURL } = req.body; // Single URL

    if (!photoURL || typeof photoURL !== "string") {
      return res.status(400).json({ message: "photoURL must be a string" });
    }

    const user = await User.findById(req.user._id);

    // Remove the specific photo URL
    user.photos = user.photos.filter((url) => url !== photoURL);
    await user.save();

    res.status(200).json({ message: "Photo deleted", photos: user.photos });
  } catch (err) {
    console.error("Delete photo error:", err);
    res.status(500).json({ message: "Could not delete photo" });
  }
});

// Get all Photos
photoRouter.get("/profile/getPhotos", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ photos: user.photos });
  } catch (err) {
    console.error("Get photos error:", err);
    res.status(500).json({ message: "Could not retrieve photos" });
  }
});

module.exports = photoRouter;
