require("dotenv").config();

const express = require("express");
const axios = require("axios"); // Make sure axios is installed for HTTP requests
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const http=require("http")


app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,               // allow cookies
  })
);

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies from incoming requests

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket=require("./utils/socket");
const chatRouter = require("./routes/chat");
const photoRouter = require("./routes/photos");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/",paymentRouter);
app.use("/",chatRouter);
app.use("/",photoRouter);
app.use("/uploads", express.static("uploads"));


const server=http.createServer(app);

initializeSocket(server);
// Connect to Database and Start Server
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ message: "Something went wrong!" });
});
