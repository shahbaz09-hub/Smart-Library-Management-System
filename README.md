# Smart Library Management System (LMS)

A full-stack Smart Library Management System for colleges and universities.

## Tech Stack
- Frontend: React + TypeScript + Vite
- Backend: Java 17 + Spring Boot + Spring Security + JWT
- Database: MySQL (primary), H2 (development support)

## Repository Structure
- `frontend/` - Web UI and client application
- `backend/` - REST API and business logic
- `scripts/` - Utility scripts

## Features
- Role-based access (Admin, Librarian, Student)
- Book catalog and inventory management
- Issue/return/renew workflows
- Fine calculation and payment tracking
- Notifications and analytics dashboards

## Quick Start

### 1) Clone
```bash
git clone https://github.com/shahbaz09-hub/Smart-Library-Management-System.git
cd Smart-Library-Management-System
```

### 2) Run backend
```bash
cd backend
mvn spring-boot:run
```
Backend default URL: `http://localhost:8080`

### 3) Run frontend
```bash
cd frontend
npm install
npm run dev -- --host --port 3000
```
Frontend URL: `http://localhost:3000`

## Environment Variables
Backend supports environment-based secrets. Common values:
- `DB_USERNAME` (default: `root`)
- `DB_PASSWORD` (default: `password`)
- `JWT_SECRET`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`

## API Docs
When backend is running:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI: `http://localhost:8080/api-docs`

## Notes
- Keep credentials in environment variables, not in tracked files.
- Build artifacts are excluded via `.gitignore`.

## License
MIT
