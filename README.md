# 🏢 ComplaintHub - Modern Full-Stack Complaint Management System

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, production-ready **Full-Stack Complaint Management System** designed for communities, institutions, and municipal services. It provides an intuitive, high-performance web interface paired with a robust REST API for tracking, prioritizing, and resolving civic and infrastructure issues.

---

## 📸 Key Features

- **📊 Comprehensive Executive Dashboard**: Live KPI cards for Total Complaints, Pending, In Progress, and Resolved issues with trend comparison metrics.
- **📋 End-to-End Complaint Lifecycle (Full CRUD)**:
  - Register new complaints with auto-generated formatted tracking IDs (`#C-1025`).
  - Search across issue titles, categories, reporter names, locations, and descriptions.
  - Multi-criteria filtering by **Status** (*Pending*, *In Progress*, *Resolved*) and **Priority** (*High*, *Medium*, *Low*).
  - Detailed complaint view with stage-by-stage status update buttons and permanent record deletion.
- **📈 Interactive Analytics & Insights**:
  - Daily 7-day complaint trends (received vs. resolved) powered by SVG charts.
  - Donut distribution of complaint statuses.
  - Horizontal bar breakdown of priority levels.
- **🔔 Live Notifications & Audit Trail**:
  - Automated alerts when new issues are filed or updated.
  - Quick action to mark notifications as read.
- **⚙️ Profile & Workspace Preferences**:
  - Administrator personal information updates.
  - Instant Light/Dark appearance theme switching.
  - Notification preference toggles.
- **💾 Thread-Safe Atomic Persistence**:
  - File-based JSON database engine with zero-dependency setup (no external SQL or MongoDB server daemon required).
  - Automatic database self-initialization and seeding.
- **🛡️ Clean & Security Compliant**:
  - Fully decoupled environment configurations (`.env.example`).
  - Strict input validation and global error handling.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS | Modular component architecture with fast HMR |
| **Icons & Charts** | Lucide React, Recharts | Crisp icons and responsive data visualizations |
| **Backend** | Node.js (v24+ / 18+), Express 4 (ES Modules) | RESTful API with structured controllers, routes, and middleware |
| **Database** | Atomic JSON Storage (`backend/data/database.json`) | Persistent, thread-safe data engine with zero setup requirements |
| **API Proxy** | Vite Dev Proxy (`/api` ➔ `http://localhost:5000`) | Clean same-origin requests during local development |

---

## 📁 Repository Structure

```text
complaint-management/
├── backend/                      # Node.js + Express REST API Server
│   ├── data/
│   │   └── database.json         # Persistent database storage (auto-seeded)
│   ├── src/
│   │   ├── config/               # App configuration
│   │   ├── controllers/          # Business logic handlers
│   │   │   ├── analyticsController.js
│   │   │   ├── complaintController.js
│   │   │   ├── notificationController.js
│   │   │   └── settingsController.js
│   │   ├── db/
│   │   │   └── storage.js        # Atomic file-safe storage engine
│   │   ├── middleware/
│   │   │   └── errorHandler.js   # Global error & 404 middlewares
│   │   ├── routes/               # Modular Express routers
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── complaintRoutes.js
│   │   │   ├── index.js
│   │   │   ├── notificationRoutes.js
│   │   │   └── settingsRoutes.js
│   │   ├── app.js                # Express app configuration
│   │   └── server.js             # HTTP server entry point (Port 5000)
│   ├── .env.example              # Sample environment template
│   ├── .gitignore                # Backend-specific ignore rules
│   ├── package.json              # Backend dependencies and scripts
│   └── test-api.js               # Automated integration test suite
│
├── frontend/                     # React + TypeScript + Vite Client
│   ├── src/
│   │   ├── assets/               # Static images and brand marks
│   │   ├── services/
│   │   │   └── api.ts            # Type-safe API client service
│   │   ├── App.tsx               # Primary UI application and routing
│   │   ├── index.css             # Theme styles and Tailwind directives
│   │   └── main.tsx              # React DOM entry point
│   ├── .env.example              # Frontend environment template
│   ├── .gitignore                # Frontend-specific ignore rules
│   ├── index.html                # HTML entry point
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── tsconfig.json             # TypeScript compiler settings
│   └── vite.config.ts            # Vite build and proxy configuration
│
├── .gitignore                    # Root repository ignore rules
├── LICENSE                       # MIT License
├── package.json                  # Root orchestration scripts
├── README.md                     # Project documentation
├── start.bat                     # 1-Click Windows development launcher
└── start.js                      # Cross-platform concurrent runner
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (Tested on Node.js v24)
- **NPM**: v9.0.0 or higher
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/complaint-management.git
cd complaint-management
```

### 2. Install Dependencies

You can install all dependencies for both root, backend, and frontend with a single command:

```bash
npm run install:all
```

*Or manually in each folder:*
```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Environment Configuration

Copy the example environment templates:

```bash
# In backend
cp backend/.env.example backend/.env

# In frontend (optional)
cp frontend/.env.example frontend/.env
```

Default `backend/.env` contents:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 💻 Running the Application

### Option A: One-Click Windows Launcher (Easiest)
Double-click **`start.bat`** in the root folder. Both Backend and Frontend will automatically boot up in separate terminal windows.

### Option B: Unified Single-Command Runner
From the root project directory:
```bash
npm start
```
*Or:*
```bash
npm run dev
```

### Option C: Run Services Individually

**Terminal 1 — Backend API Server:**
```bash
cd backend
npm run dev
# Server running at: http://localhost:5000
# REST API Base:     http://localhost:5000/api
```

**Terminal 2 — Frontend Client:**
```bash
cd frontend
npm run dev
# Web application live at: http://localhost:5173
```

---

## 📡 REST API Reference

Base URL: `http://localhost:5000/api`

### 1. Health Check
- **`GET /api/health`**
  - Response: `{ "status": "ok", "timestamp": "...", "service": "ComplaintHub Backend API" }`

### 2. Complaints Management (`/api/complaints`)

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/complaints` | Retrieve all complaints | `search`, `status`, `priority`, `category`, `sortBy`, `order`, `page`, `limit` |
| `GET` | `/api/complaints/:id` | Get single complaint by ID | — |
| `POST` | `/api/complaints` | Create a new complaint | — |
| `PATCH` | `/api/complaints/:id/status` | Update complaint status | — |
| `PUT` | `/api/complaints/:id` | Update complaint details | — |
| `DELETE` | `/api/complaints/:id` | Delete a complaint record | — |

#### Create Complaint Request (`POST /api/complaints`):
```json
{
  "issue": "Elevator malfunction in Block B",
  "category": "Maintenance",
  "description": "The lift is making unusual sounds and stopping between 2nd and 3rd floor.",
  "location": "Block B, Elevator 1",
  "priority": "High",
  "reporter": "Rohit Verma",
  "email": "rohit.v@example.com"
}
```

#### Update Status Request (`PATCH /api/complaints/:id/status`):
```json
{
  "status": "In Progress"
}
```

### 3. Analytics (`/api/analytics`)
- **`GET /api/analytics/summary`**: Returns total counts, status breakdown, priority distribution, 7-day daily trends, resolution rates, and recent audit activity.

### 4. Settings (`/api/settings`)
- **`GET /api/settings`**: Get administrator profile and notification preferences.
- **`PUT /api/settings`**: Update profile details, notification preferences, and dark mode state.
- **`POST /api/settings/password`**: Update administrator security password.

### 5. Notifications (`/api/notifications`)
- **`GET /api/notifications`**: Get list of system notifications and unread count.
- **`PATCH /api/notifications/read-all`**: Mark all unread notifications as read.
- **`PATCH /api/notifications/:id/read`**: Mark an individual notification as read.
- **`GET /api/notifications/activities`**: Retrieve recent activity audit trail.

---

## 🧪 Testing

The backend includes an automated API integration test suite verifying health checks, CRUD operations, status transitions, and data persistence:

```bash
# From root directory:
npm test

# Or directly from backend/:
cd backend && npm test
```

---

## 📦 Production Build

To build the frontend for production deployment:

```bash
npm run build
```
The optimized static bundle will be generated in `frontend/dist/`.

---

## 🔒 Security & Privacy

- **No Secrets in Source**: No sensitive passwords, private tokens, or production credentials are saved in the codebase.
- **Environment Isolation**: All environment files (`.env`, `.env.local`) are ignored by `.gitignore`.
- **Safe Fallback**: If backend is temporarily offline, the frontend safely falls back to local state management without crashing.

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).
