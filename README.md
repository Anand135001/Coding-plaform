# RootCode — DSA Coding Platform

A full-stack competitive programming platform where users can solve Data Structures & Algorithms problems, run code against test cases, watch editorial videos, and get AI-powered hints — all in one place.

---

## Features

- **User Authentication** — Register, login, logout with JWT + cookie-based sessions
- **Problem Solving** — Monaco Editor with JavaScript, Java, and C++ support
- **Code Execution** — Run code against visible test cases via Judge0
- **Code Submission** — Submit solutions evaluated against hidden test cases
- **Editorial Videos** — Admin-uploaded Cloudinary video solutions per problem
- **AI Assistant (Root AI)** — Gemini 2.5 Flash streaming chatbot with full problem context
- **Submission History** — View all past submissions with status, runtime, memory
- **Admin Panel** — Create, update, delete problems and manage editorial videos
- **Rate Limiting** — Redis-based sliding window rate limiter on run/submit endpoints
- **Token Blacklisting** — Logged-out tokens blacklisted in Redis

---

## Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 19 + Vite | UI framework |
| Redux Toolkit | Auth state management |
| React Router | Client-side routing |
| Monaco Editor | In-browser code editor |
| DaisyUI + Tailwind CSS | UI components & styling |
| Axios | HTTP client |
| React Hook Form + Zod | Form validation |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express 5 | Server framework |
| MongoDB + Mongoose | Primary database |
| Redis | Rate limiting + token blacklist |
| JWT + bcrypt | Authentication |
| Judge0 (RapidAPI) | Code execution engine |
| Cloudinary | Video storage |
| Google Gemini 2.5 Flash | AI assistant (streaming) |

---

## Project Structure

```
Coding-platform/
├── backend/
│   └── src/
│       ├── config/
│       │   ├── db.js              # MongoDB connection
│       │   ├── redis.js           # Redis client
│       │   └── cloudinary.js      # Cloudinary config
│       ├── models/
│       │   ├── userModel.js
│       │   ├── problemModel.js
│       │   ├── submissionModel.js
│       │   └── videoModel.js
│       ├── routes/
│       │   ├── userAuthRoute.js
│       │   ├── problemCreatorRoute.js
│       │   ├── submitRoute.js
│       │   ├── aiModel.js
│       │   └── videoCreate.js
│       ├── controllers/
│       │   ├── userAuthController.js
│       │   ├── problemController.js
│       │   ├── userSubmissionController.js
│       │   ├── solveQueryController.js
│       │   └── videosCreateController.js
│       ├── middleware/
│       │   ├── userAuthMiddleware.js
│       │   ├── adminMiddleware.js
│       │   └── submitRateLimiter.js
│       ├── utils/
│       │   ├── problemUtility.js    # Judge0 batch submit & poll
│       │   └── validator.js         # Input validation
│       └── index.js                 # App entry point
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Homepage.jsx
        │   ├── ProblemPage.jsx
        │   ├── ProfilePage.jsx
        │   ├── Login.jsx
        │   ├── SignUp.jsx
        │   └── admin/
        │       ├── Admin.jsx
        │       ├── AdminPanel.jsx      # Create problem
        │       ├── AdminUpdate.jsx     # Update problem list
        │       ├── UpdateProblem.jsx   # Update problem form
        │       ├── AdminDelete.jsx
        │       ├── AdminVideos.jsx
        │       └── AdminUpload.jsx
        |       └── AdminEdit.jsx 
        ├── components/
        │   ├── ProblemForm.jsx
        │   ├── SubmissionHistory.jsx
        │   ├── ChatbBot.jsx
        │   └── EditorialVideo.jsx
        ├── utils/
        │   └── axiosClient.js
        │   └── problemSchema.js
        ├── store/
        │   └── reduxStore.js
        └── authSlice.js
        └── App.js
        └── main.js

```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Redis Cloud account (or local Redis)
- RapidAPI account with Judge0 CE subscribed
- Cloudinary account
- Google AI Studio API key (Gemini)

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=3000
DB_CONNECT_STRING=your_mongodb_connection_string
JWT_KEY=your_jwt_secret_key
REDIS_PASSWORD=your_redis_password
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JUDGE0_KEY=your_rapidapi_judge0_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend:

```bash
npm start
```

Server runs at `http://localhost:3000`

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## API Reference

### Auth Routes — `/user`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/user/register` | Register new user | No |
| POST | `/user/login` | Login user, sets cookie | No |
| POST | `/user/logout` | Logout, blacklists token | User |
| GET | `/user/check` | Check auth status | User |
| GET | `/user/profile` | Get user profile + stats | User |
| POST | `/user/admin/register` | Register admin account | Admin |
| DELETE | `/user/profile` | Delete user account | User |

---

### Problem Routes — `/problem`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/problem/getAllProblem` | Get all problems | User |
| GET | `/problem/problemById/:id` | Get single problem | User |
| GET | `/problem/problemSolvedByUser` | Get problems solved by user | User |
| GET | `/problem/submittedProblem/:pid` | Get user's submissions for a problem | User |
| POST | `/problem/create` | Create new problem | Admin |
| PUT | `/problem/update/:id` | Update problem | Admin |
| DELETE | `/problem/delete/:id` | Delete problem | Admin |

---

### Submission Routes — `/submission`

| Method | Endpoint | Description | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| POST | `/submission/run/:id` | Run code (visible test cases) | User | 2 per 60s |
| POST | `/submission/submit/:id` | Submit code (all test cases) | User | 1 per 60s |

**Request body:**
```json
{
  "code": "your code here",
  "language": "javascript | java | c++"
}
```

---

### AI Routes — `/ai`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/ai/chat` | Streaming AI response (Gemini) | User |

**Request body:**
```json
{
  "messages": [...conversation history],
  "title": "problem title",
  "description": "problem description",
  "testCases": [...],
  "startCode": "..."
}
```

Response is a **streaming text stream** (`Content-Type: text/plain`).

---

### Video Routes — `/video`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/video/create/:problemId` | Get Cloudinary upload signature | Admin |
| POST | `/video/save` | Save video metadata to DB | Admin |
| DELETE | `/video/delete/:problemId` | Delete video from Cloudinary + DB | Admin |

---

## Database Schema

### User
```
firstname       String  (required, unique, 2-20 chars)
Lastname        String
emailID         String  (required, unique, lowercase)
password        String  (required, min 6 chars, bcrypt hashed)
age             Number
role            String  (enum: user | admin, default: user)
problemSolved   [ObjectId → Problem]
```

### Problem
```
title                String    (required)
description          String    (required)
difficulty           String    (enum: easy | medium | hard)
tags                 String    (enum: array | linkedList | graph | dp)
visibleTestCases     [{input, output, explanation}]
hiddenTestCases      [{input, output}]
startCode            [{language, initialCode}]
referenceSolution    [{language, completeCode}]
problemCreator       ObjectId → User
```

### Submission
```
userId           ObjectId → User
problemId        ObjectId → Problem
code             String
language         String    (enum: javascript | c++ | java)
status           String    (pending | accepted | wrong | runtime_error | ...)
runtime          Number    (milliseconds)
memory           Number    (KB)
errorMessage     String
testCasesPassed  Number
testCasesTotal   Number
timestamps       createdAt, updatedAt
```

### Video
```
problemId            ObjectId → Problem
userId               ObjectId → User
cloudinaryPublicId   String  (unique)
secureUrl            String
thumbnailUrl         String
duration             Number  (seconds)
timestamps           createdAt, updatedAt
```

---

## How Code Execution Works

```
User writes code in Monaco Editor
         ↓
POST /submission/run or /submission/submit
         ↓
Rate limiter checks Redis (sliding window)
         ↓
Judge0 API — batch submit all test cases
         ↓
Poll Judge0 every 1s until all results ready (status_id > 2)
         ↓
Return results → frontend displays pass/fail per test case
```

**Supported Languages via Judge0:**
| Language | Judge0 ID |
|----------|-----------|
| C++ | 54 |
| Java | 62 |
| JavaScript | 63 |

---

## How AI Assistant Works

```
User types message in Root AI tab
         ↓
POST /ai/chat with full conversation history + problem context
         ↓
Gemini 2.5 Flash generates response with streaming
         ↓
Server streams text chunks via res.write()
         ↓
Frontend reads ReadableStream and displays text progressively
```

---

## License

MIT
