# 🛒 ShopKart — Full Stack MERN E-Commerce (Amazon/Flipkart Clone)

A production-ready e-commerce web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js), styled to look and feel like Amazon and Flipkart. Built by a fresh graduate using only **free tools and services**.

## ✨ Features

### User Side
- 🔐 JWT authentication (signup, login, logout, protected routes)
- 🏠 Amazon-style homepage with hero carousel, categories, featured products
- 🔍 Product listing with search, filters (category, price, rating), sort, pagination
- 📦 Product detail page with image gallery, reviews, ratings
- 🛒 Cart with quantity controls and price summary
- 📍 Multiple shipping addresses
- 💳 Razorpay payment integration (test mode)
- 📋 Order history with status tracking
- ⭐ Product reviews & ratings

### Admin Side
- 📊 Admin dashboard with revenue, orders, users analytics
- 📦 Product CRUD with Cloudinary image upload
- 📋 Order management (update status: placed → shipped → delivered)
- 👥 User management

## 🛠️ Tech Stack

**Frontend:** React 18, Redux Toolkit, React Router v6, Axios, TailwindCSS, React-Hot-Toast, Lucide Icons, Vite
**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, Bcrypt, Multer, Cloudinary, Razorpay, Nodemailer
**Free Services:** MongoDB Atlas (free 512MB), Cloudinary (free 25GB), Razorpay (test mode), Render (free server hosting), Vercel (free frontend hosting), Gmail SMTP (free)

## 📁 Project Structure
```
mern-ecommerce/
├── server/          # Express + MongoDB backend
│   ├── config/      # DB & Cloudinary config
│   ├── models/      # Mongoose schemas
│   ├── controllers/ # Route handlers
│   ├── routes/      # Express routes
│   ├── middleware/  # Auth, error, upload
│   └── utils/       # Helpers (email, etc.)
└── client/          # React frontend
    └── src/
        ├── app/        # Redux store
        ├── features/   # Redux slices (auth, cart, products, orders)
        ├── pages/      # Page components
        ├── components/ # Reusable UI
        └── services/   # Axios API layer
```

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd mern-ecommerce
cd server && npm install
cd ../client && npm install
```

### 2. Backend setup (`server/.env`)
Copy `server/.env.example` to `server/.env` and fill in:
```env
PORT=5000
MONGO_URI=mongodb+srv://...your-atlas-uri
JWT_SECRET=your_super_secret_random_string
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=dglkmeac2
CLOUDINARY_API_KEY=121284623221779
CLOUDINARY_API_SECRET=**********
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

### 3. Frontend setup (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

### 4. Seed sample data (20 products)
```bash
cd server
npm run seed
```
This creates 20 demo products + an admin user (`admin@shopkart.com` / `Admin@123`).

### 5. Run dev servers
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Visit `http://localhost:5173`.

## 🆓 Setting Up Free Services

### MongoDB Atlas (Database)
1. Sign up at https://mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Network Access → Allow 0.0.0.0/0
4. Database Access → Add user
5. Copy connection string into `MONGO_URI`

### Cloudinary (Image storage)
1. Sign up at https://cloudinary.com (25GB free)
2. Dashboard → copy Cloud Name, API Key, API Secret

### Razorpay (Payments — test mode, zero real money)
1. Sign up at https://razorpay.com
2. Dashboard → Settings → API Keys → Generate Test Keys
3. Use test cards from https://razorpay.com/docs/payments/payments/test-card-details/
   - Card: `4111 1111 1111 1111`, CVV: any 3 digits, Expiry: any future date

### Gmail SMTP (Order confirmation emails)
1. Enable 2-Step Verification on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use that 16-char password as `SMTP_PASS`

## 🌐 Deployment (All Free)

### Backend → Render
1. Push code to GitHub
2. https://render.com → New Web Service → Connect repo
3. Root directory: `server`
4. Build: `npm install` · Start: `npm start`
5. Add all `server/.env` vars in Render's Environment tab

### Frontend → Vercel
1. https://vercel.com → New Project → Import GitHub repo
2. Root directory: `client`
3. Framework preset: Vite
4. Add env vars:
   - `VITE_API_URL=https://your-render-app.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID=rzp_test_...`

### Update CORS
In Render, set `CLIENT_URL` to your Vercel URL.

## 🔑 Default Admin Login
After running `npm run seed`:
- Email: `admin@shopkart.com`
- Password: `Admin@123`

## 📝 License
MIT — free to use for your portfolio.

---
**Built with ❤️ by a fresh graduate. Star ⭐ if helpful!**
