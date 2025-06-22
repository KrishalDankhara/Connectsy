# 🌐 Connectsy Backend

The backend API for **Connectsy**, a social connection platform built with **Node.js**, **Express**, and **MongoDB**. This server handles user authentication, profile editing, photo uploads, and real-time messaging using **Socket.IO**.

---

## 🚀 Features

- 🔐 User Authentication (Login / Signup)
- 📝 Profile Management (Edit Bio, Skills, Gender, Age, etc.)
- 📷 Upload & Manage Photos (with cloud storage support)
- 💬 Real-time Chat using Socket.IO
- 🔎 Explore Users, Send Requests, Accept / Reject Requests
- 🌐 RESTful API with secure cookie-based sessions

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** bcrypt, JWT (Cookies)
- **Real-time Communication:** Socket.IO
- **File Uploads:** multer + cloud storage (Cloudinary / AWS)
- **Environment Management:** dotenv

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/connectsy-backend.git
cd connectsy-backend

# Install dependencies
npm install

# Create a .env file based on .env.example
cp .env.example .env

# Start the server
npm run dev
