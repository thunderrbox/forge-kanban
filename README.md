# Forge 2 Kanban App - Edition 2 Qualifier

A premium, responsive, zero-authentication Kanban board application built using Laravel (PHP 8.3) REST API and React + Vite (Vanilla CSS).

## 🚀 Live Deploys
- **Frontend (Vite + React):** [Vercel Deployment](https://forge-kanban-frontend.vercel.app)
- **Backend (Laravel API):** [Render Deployment](https://forge-kanban-backend.onrender.com)

## ✨ Core Features (Qualifier Requirements)
1. **Create Board:** Scaffold a blank kanban workspace.
2. **Create Lists:** Define custom columns (e.g., Todo, Doing, Done).
3. **Create Cards:** Map tasks to lists.
4. **Move Cards:** Relocate cards to other lists via dropdown.
5. **Edit Cards:** Update description, due date, assignee, and tags.
6. **Tags:** Color-code cards.
7. **Assign Member:** Assign tasks to team members.
8. **Due Date:** Configure deadlines.
9. **Overdue Highlight:** Overdue tasks glow with a soft-red animated border when they surpass the deadline.

## 🛠️ Tech Stack & Model Routing
- **Backend:** Laravel 13, SQLite
- **Frontend:** React + Vite, Axios, Vanilla CSS
- **Model Routing:**
  - **Hermes (Brain):** `Gemini 2.5 Flash` (Advanced planning, context reasoning)
  - **OpenClaw (Hands):** `Llama 3.3 70B` (Fast code editing and CLI executions)

---

## 💻 Local Setup & Run Instructions

### Prerequisites
- PHP 8.2+
- Node.js 18+

### 1. Backend Setup
1. Open the backend folder:
   ```bash
   cd backend
   ```
2. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
3. Generate application key:
   ```bash
   php artisan key:generate
   ```
4. Touch the SQLite database file:
   ```bash
   touch database/database.sqlite
   ```
5. Run migrations:
   ```bash
   php artisan migrate
   ```
6. Start the server on port 8000:
   ```bash
   php artisan serve --port=8000
   ```

### 2. Frontend Setup
1. Open the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web app locally at `http://localhost:5173`.
