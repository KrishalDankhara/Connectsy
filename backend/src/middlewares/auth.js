const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res,next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).send("No Credentials Found")
    }
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user=user;
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};
module.exports = {
  userAuth,
};
