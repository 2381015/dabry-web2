# Library Management System

A full-stack application for library management built with React (frontend), NestJS (backend), and Neon PostgreSQL database.

## Project Structure

- `frontend/`: React application
- `backend/`: NestJS API server

## Features

- User Authentication (Register/Login)
- Book Management
- Author Management
- Loan Management
- User Management
- Role-based access control

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL database (Neon)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Make sure your `.env` file is configured with:

   ```
   DATABASE_URL=your_neon_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3001
   ```

4. Start the backend server:

   ```bash
   npm run start:dev
   ```

5. (Optional) Seed the database with initial data:
   ```bash
   npx ts-node src/seed.ts
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the `.env` file:

   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. Start the frontend development server:

   ```bash
   npm start
   ```

5. Access the application at [http://localhost:3000](http://localhost:3000)

## Default Admin Account

After running the seed script, you can login with these credentials:

- Email: admin@library.com
- Password: admin123

## API Endpoints

- **Auth**

  - `POST /api/auth/register`: Register a new user
  - `POST /api/auth/login`: Login
  - `GET /api/auth/me`: Get current user info

- **Books**

  - `GET /api/books`: Get all books
  - `GET /api/books/:id`: Get a specific book
  - `POST /api/books`: Create a new book (Admin only)
  - `PUT /api/books/:id`: Update a book (Admin only)
  - `DELETE /api/books/:id`: Delete a book (Admin only)

- **Authors**

  - `GET /api/authors`: Get all authors
  - `GET /api/authors/:id`: Get a specific author
  - `POST /api/authors`: Create a new author (Admin only)
  - `PUT /api/authors/:id`: Update an author (Admin only)
  - `DELETE /api/authors/:id`: Delete an author (Admin only)

- **Loans**

  - `GET /api/loans`: Get all loans (Admin only)
  - `GET /api/loans/user/:userId`: Get loans for a specific user
  - `POST /api/loans`: Create a new loan
  - `PUT /api/loans/:id`: Update a loan (Admin only)
  - `PATCH /api/loans/:id/status`: Update loan status
  - `DELETE /api/loans/:id`: Delete a loan (Admin only)

- **Users**
  - `GET /api/users`: Get all users (Admin only)
  - `GET /api/users/:id`: Get a specific user (Admin only)
  - `POST /api/users`: Create a new user (Admin only)
  - `PUT /api/users/:id`: Update a user (Admin only)
  - `DELETE /api/users/:id`: Delete a user (Admin only)

## License

MIT
