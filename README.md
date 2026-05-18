# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack. Designed for sales teams to manage their pipeline of potential customers efficiently.

## Features

- JWT-based Authentication with Role-Based Access Control (Admin / Sales)
- Full Lead CRUD (Create, Read, Update, Delete)
- Advanced Filtering by Status and Source
- Debounced Search by Name or Email
- Sort by Latest or Oldest
- Backend Pagination (10 records per page)
- CSV Export (Admin only)
- Responsive Design (Mobile + Desktop)
- Dark Mode Support
- Centralized Error Handling
- Docker Support

---

## Tech Stack

### Frontend
- React.js + TypeScript
- TailwindCSS
- Axios
- React Router DOM

### Backend
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- json2csv

---

## Project Structure

```
Lead_management_dashboard/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, Role, Error middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   ├── types/          # TypeScript interfaces
│   │   └── index.ts        # Entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth and Theme context
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript interfaces
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB
- Docker (optional)

---

### Option 1 — Run Locally

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/lead-management-dashboard.git
cd lead-management-dashboard
```

#### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in your `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/leads_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

#### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in your `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

#### 4. Open in browser

```
http://localhost:5173
```

---

### Option 2 — Run with Docker

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/lead-management-dashboard.git
cd lead-management-dashboard
```

#### 2. Setup backend env

```bash
cd backend
cp .env.example .env
```

Fill in your `.env`:

```
PORT=5000
MONGO_URI=mongodb://mongo:27017/leads_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

#### 3. Run Docker

```bash
docker-compose up --build
```

#### 4. Open in browser

```
http://localhost:3000
```

---

## Environment Variables

### Backend `.env.example`

```
PORT=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
CORS_ORIGIN=
```

### Frontend `.env.example`

```
VITE_API_URL=
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require the following header:
```
Authorization: <token>
```

---

### Auth Endpoints

#### Register
```
POST /auth/register
```

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "admin"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "64f1a2b3...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

#### Login
```
POST /auth/login
```

Request body:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "64f1a2b3...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

---

### Lead Endpoints

All lead endpoints require Authorization header.

#### Get All Leads
```
GET /leads
```

Query Parameters:
| Parameter | Type   | Description                        |
|-----------|--------|------------------------------------|
| status    | string | Filter by status (New, Contacted, Qualified, Lost) |
| source    | string | Filter by source (Website, Instagram, Referral) |
| search    | string | Search by name or email            |
| sort      | string | Sort order (latest, oldest)        |
| page      | number | Page number (default: 1)           |
| limit     | number | Records per page (default: 10)     |

Response:
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

#### Get Single Lead
```
GET /leads/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3...",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "status": "New",
    "source": "Website",
    "createdAt": "2026-05-18T00:00:00.000Z"
  }
}
```

---

#### Create Lead
```
POST /leads
```

Request body:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Website"
}
```

Response:
```json
{
  "success": true,
  "data": { ... }
}
```

---

#### Update Lead
```
PUT /leads/:id
```

Request body (any field):
```json
{
  "status": "Contacted",
  "source": "Referral"
}
```

Response:
```json
{
  "success": true,
  "data": { ... }
}
```

---

#### Delete Lead (Admin only)
```
DELETE /leads/:id
```

Response:
```json
{
  "success": true,
  "message": "Lead deleted"
}
```

---

#### Export CSV (Admin only)
```
GET /leads/export
```

Response: CSV file download

---

## Role-Based Access Control

| Feature        | Admin | Sales |
|----------------|-------|-------|
| View Leads     | ✅    | ✅    |
| Create Lead    | ✅    | ✅    |
| Edit Lead      | ✅    | ✅    |
| Delete Lead    | ✅    | ❌    |
| Export CSV     | ✅    | ❌    |

---

## Git Commit Convention

```
feat: add JWT authentication
fix: resolve CORS issue for Docker
chore: setup Docker configuration
style: add dark mode support
refactor: centralize error handling
```

---

## Author

Shreyansh Singh — sshreyansh604@gmail.com

GitHub: https://github.com/Shreyansh604
