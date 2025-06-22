const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email address not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    photoURL: {
      type: String,
      default: "",
    },
    photos: {
      type: [String], // This is where multiple uploaded images will go (filenames or Cloudinary URLs)
      default: [],
    },
    about: {
      type: String,
      default: "Hello this is default",
    },
    skills: {
      type: [String],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Set a fallback image using robohash if no image is provided
userSchema.pre("save", function (next) {
  if (!this.photoURL && this.firstName && this.lastName) {
    this.photoURL = `https://robohash.org/${this.firstName}-${this.lastName}.png`;
  }
  next();
});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordByInput) {
  const user = this;
  return await bcrypt.compare(passwordByInput, user.password);
};

module.exports = mongoose.model("User", userSchema);
