# ⚡ Forge Kanban — Edition 2 Qualifier

> A premium, high-fidelity, zero-authentication Kanban application built for speed and visual excellence. Powered by a Laravel 13 REST API backend and a Vite + React SPA frontend styled with Vanilla CSS.

---

## 🚀 Live Deployments
| Layer | Service | Live URL |
|---|---|---|
| **Frontend** | Vercel | [https://forge-kanban-frontend.vercel.app](https://forge-kanban-frontend.vercel.app) |
| **Backend** | Render | [https://forge-kanban-backend.onrender.com](https://forge-kanban-backend.onrender.com) |

---

## ✨ Core Features
- 📋 **Boards Management:** Easily create, view list of boards, and delete boards.
- 🗂️ **Dynamic Lists:** Add and delete columns dynamically inside your active board.
- 📝 **Card CRUD:** Add cards inside lists, edit card titles, descriptions, assignees, due dates, and attach tags.
- 🎯 **API-driven Card Movement:** Move cards between lists instantly using a dedicated movement API endpoint.
- 🏷️ **Custom Tags:** Add color-coded tags to cards with name and custom colors using an integrated color picker.
- 👤 **Team Assignments:** Manage team members globally and assign them to specific cards.
- 📅 **Due Dates:** Keep track of deadlines.
- 🚨 **Overdue Highlight:** Tasks that are past their due date glow with an elegant, soft-red pulsating visual flag.

---

## 🎨 Technology Stack
- **Backend:** Laravel 13 (PHP 8.3), REST API, SQLite (zero-setup database)
- **Frontend:** React + Vite, Axios, Vanilla CSS (Plus Jakarta Sans typography, sleek dark slate layout, glassmorphism UI)
- **Agent Orchestrator:** Multi-agent design (Hermes Planning Brain + OpenClaw Execution Coder)

---

## 💻 Local Quickstart

### Prerequisites
- **PHP** 8.2+ with `pdo_sqlite` and `openssl` extensions enabled.
- **Node.js** 18+

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Configure environment settings
cp .env.example .env

# Generate security key
php artisan key:generate

# Initialize the SQLite database
touch database/database.sqlite
php artisan migrate

# Start the server on port 8000
php artisan serve --port=8000
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install package dependencies
npm install

# Run the Vite development server
npm run dev
```
Open your browser to `http://localhost:5173`.

---

## 🛸 Production Deployment Steps

### 1. Deploying the Laravel API to Render
1. Click **New > Web Service** on Render and link this repository.
2. Configure settings:
   - **Root Directory:** `backend`
   - **Build Command:** `composer install --no-dev --optimize-autoloader`
   - **Start Command:** `php artisan serve --host=0.0.0.0 --port=$PORT`
3. Add the following environment variables:
   - `APP_ENV` = `production`
   - `APP_DEBUG` = `false`
   - `APP_KEY` = `base64:7B8+jW8zN7y/G05lq3FuhJjU/9c8L5N2O1D0X4Y/7kQ=` (or your generated key)
   - `DB_CONNECTION` = `sqlite`
4. Deploy the service and copy the live URL (e.g., `https://forge-kanban-backend.onrender.com`).

### 2. Deploying the React App to Vercel
1. Select **Add New > Project** on Vercel and import this repository.
2. Configure settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
3. Add the following environment variable:
   - `VITE_API_BASE_URL` = `https://your-render-backend-url.onrender.com/api` (Remember to append `/api`)
4. Click **Deploy**.
