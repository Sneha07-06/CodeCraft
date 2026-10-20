# CodeCraft

**Author:** Sneha Prajapati  
**Platform:** Full-stack Online Code Execution, Live Web Sandbox & Multimodal IDE Environment

---

## Overview

CodeCraft is an advanced, full-stack developer platform featuring:
- **4-in-1 IDE Workspace:** Compile and execute **Python 3** and **Dart SDK** code via sandboxed backend processes, and preview **HTML5** and **JavaScript** instantaneously with a live browser sandboxed `<iframe>` (`sandbox="allow-scripts"`).
- **Voice-to-Text (Speech-to-Code):** Native Web Speech API integration that listens to continuous voice dictation, formats programming commands (new lines, braces, tabs, colons, arrows), and inserts them directly into the active cursor buffer in the Monaco Editor.
- **Client-Side OCR (Image-to-Text):** Tesseract.js neural pipeline to extract source code from screenshots and photos and launch directly into the editor.
- **Robust Dart Environment Check:** Graceful error handling (`Dart SDK is not installed or not added to system PATH. Please install Dart or run Python/JS/HTML.`) and automated ephemeral file cleanup in `backend/codes/` inside `finally` blocks.
- **Security & Authentication:** Mongoose and JWT auth with bcrypt password hashing and user profiles.

---

## Directory Structure

```text
CodeCraft/
├── .gitignore
├── README.md
├── backend/
│   ├── app.js                     # Express application entry point & routes
│   ├── config.env                 # Environment configuration template
│   ├── package.json               # Backend dependencies & scripts
│   ├── codes/                     # Ephemeral code scripts directory (.gitkeep)
│   ├── outputs/                   # Captured execution results directory (.gitkeep)
│   ├── db/
│   │   └── conn.js                # MongoDB connection handler (with in-memory fallback)
│   ├── model/
│   │   └── userSchema.js          # Mongoose user schema & password hashing
│   └── router/
│       ├── auth.js                # Registration, signin, and profile routes
│       ├── generatePy.js          # Python file generation utility
│       ├── executepy.js           # Python execution engine
│       ├── generateDart.js        # Dart file generation utility
│       └── executeDart.js         # Dart execution engine with SDK verification & cleanup
└── frontend/
    ├── index.html                 # HTML5 template with Google Fonts
    ├── package.json               # Frontend dependencies & scripts
    ├── vite.config.js             # Vite configuration with backend proxy
    └── src/
        ├── main.jsx               # React entry point with BrowserRouter
        ├── App.jsx                # Layout, routes & auth state management
        ├── index.css              # Custom design system (dark glassmorphism & live preview)
        ├── components/
        │   ├── Navbar.jsx         # Navigation bar with brand logo & links
        │   ├── Footer.jsx         # Footer authored by Sneha Prajapati
        │   └── VoiceInput.jsx     # Web Speech API Voice-to-Code component
        └── pages/
            ├── Home.jsx           # Landing page with hero & feature cards
            ├── Editor.jsx         # 4-in-1 Monaco in-browser code editor & runner
            ├── ImageToText.jsx    # Tesseract.js client-side OCR extractor
            ├── Auth.jsx           # Sign in & user registration forms
            └── Profile.jsx        # User profile & session dashboard
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or via MongoDB Atlas / automatic in-memory fallback)
- [Python](https://www.python.org/) (for Python execution engine)
- [Dart SDK](https://dart.dev/get-dart) (optional; if not installed, the platform returns a descriptive error message without crashing)

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure `backend/config.env`:
```env
PORT=5000
DATABASE=your_mongodb_connection_uri
SECRET_KEY=your_jwt_secret_key
```

Start the backend:
```bash
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the CodeCraft web application.

---

## API Endpoints

### System & Health

| Method | Endpoint | Description | Sample Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Default status route | `{ "project": "CodeCraft", "status": "Active", "author": "Sneha Prajapati" }` |
| `GET` | `/about` | About service info | `{ "project": "CodeCraft", "version": "1.0.0", "author": "Sneha Prajapati", "status": "Operational" }` |

### Authentication & Users

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` (or `/signup`) | Register a new user | `{ "name", "email", "phone", "work", "password", "cpassword" }` |
| `POST` | `/signin` (or `/login`) | Authenticate user & set JWT cookie | `{ "email", "password" }` |
| `GET` | `/profile/:id` | Fetch user profile by ID or email | None |

### Code Execution

| Method | Endpoint | Description | Payload / Response |
| :--- | :--- | :--- | :--- |
| `POST` | `/run/python` | Execute Python source code | `{ "language": "python", "code": "print(123)" }` &rarr; `{ "output": "123\n" }` |
| `POST` | `/run/dart` | Execute Dart source code (with environment check) | `{ "language": "dart", "code": "void main() { print(123); }" }` &rarr; `{ "output": "123\n" }` |
| `POST` | `/run` | Universal execution endpoint | `{ "language": "python" \| "dart" \| "html" \| "javascript", "code": "..." }` |
