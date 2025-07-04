# 🔐 MERN Authentication System

A full-featured authentication system built using the **MERN stack**, including:

✅ User Registration  
✅ Login  
✅ Email Verification via OTP  
✅ Password Reset with OTP  
✅ JWT Authentication using HttpOnly Cookies  

All features are deployed and live on **Render** 🚀

---

## 🌐 Live Demo

- 🎨 **Frontend (React Client)**: [View Live](https://authentication-system-frontend-yw7l.onrender.com)
- ⚙️ **Backend (Express Server)**: [API Endpoint](https://authentication-system-h74i.onrender.com)

---

## ✨ Features

- 🔐 **JWT Auth** with secure HttpOnly cookies
- 📩 **Email OTP Verification** (post-registration)
- 🔁 **Password Reset Flow** with OTP
- 🔒 **Protected Routes** using middleware
- 💼 **User Profile** with login status
- 🌈 **Responsive UI** built with Tailwind CSS
- 📬 **Email Service** using Nodemailer

---

## 📦 Tech Stack

### Frontend (`/client`)
- **React.js**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **React Toastify**

### Backend (`/server`)
- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **JWT + Bcrypt.js**
- **Nodemailer**

### Deployment
- Frontend & Backend: [Render](https://render.com)
- Database: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## 🗂️ Folder Structure
```bash
authentication-system/
├── client/   # React frontend
├── server/   # Express backend
└── README.md


## Run Locally

Clone the project

```bash
  git clone https://github.com/nirwaniadhau/Authentication-system.git
```

Go to the project directory

```bash
  cd Authentication-system
```

Setup Server (Backend)
```bash
  cd server
  npm install
  npm run dev
```

 Setup Client (Frontend)
```bash
  cd ../client
  npm install
  npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in server folder

`MONGO_URI=your_mongodb_uri`
`NODE_ENV=development`
`JWT_SECRET=your_jwt_secret`
`SMTP_USER`
`SMTP_HOST`
`SMTP_PASS`
` SENDER_EMAIL=your_email@example.com`
` SENDER_PASS=your_email_app_password`
`PORT`

In client folder, create .env file

`VITE_BACKEND_URL=YOUR_BACKEND_URL`
