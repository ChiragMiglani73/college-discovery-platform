# EduSearch 🎓

EduSearch is a full-stack college discovery platform built using Next.js, TypeScript, Node.js, and PostgreSQL.  
It helps students search, compare, predict, and save engineering colleges across India.

---

## 🚀 Features

- 🔍 Search & filter colleges
- ⚖️ Compare multiple colleges
- 🎯 Rank-based college predictor
- ❤️ Save colleges & comparisons
- 🔐 JWT Authentication
- ⭐ Reviews & Q&A system
- 📱 Fully responsive UI

---

## 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- TailwindCSS

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- PostgreSQL (Neon DB)

---

## 📂 Project Structure

```bash
college-platform/
│
├── frontend/
├── backend/
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd college-platform
```

---

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000

DATABASE_URL=your_database_url

JWT_SECRET=your_secret_key

NODE_ENV=development
```

Run backend:

```bash
npm run dev
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

## 🗄️ Database Seeding

```bash
npm run seed
```

This creates:
- colleges
- users
- reviews
- saved colleges
- saved comparisons

---

## 🎯 Predictor Logic

- JEE Advanced → IITs only
- JEE Mains → NITs & State Colleges
- BITSAT → BITS Colleges
- Rank-based filtering

---

## 🔑 Authentication

- Register/Login
- JWT-based auth
- Persistent login using localStorage
- Protected saved routes

---

## 📱 Responsive Design

- Mobile responsive navbar
- Adaptive layouts
- Responsive comparison tables
- Optimized for desktop & mobile

---

## 🌐 Deployment

### Frontend
- Vercel

### Backend
- Render

### Database
- Neon PostgreSQL
