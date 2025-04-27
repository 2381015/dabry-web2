# Library Management System - Backend

This is the backend API for the Library Management System, built with NestJS.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- PostgreSQL database (or a Neon database account)

## Setup

1. Install dependencies:

```bash
npm install
# or
yarn
```

2. Create a `.env` file in the backend root directory with the following content:

```
DATABASE_URL=postgresql://user:password@db.example.neon.tech/library_db
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

Replace `postgresql://user:password@db.example.neon.tech/library_db` with your actual database connection string.

3. Start the development server:

```bash
npm run start:dev
# or
yarn start:dev
```

The API will be available at `http://localhost:3001`.

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deploying to Vercel

1. Create a `vercel.json` file:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

2. Install the Vercel CLI:

```bash
npm install -g vercel
```

3. Deploy:

```bash
vercel
```

Follow the prompts to complete the deployment.

## Database Migrations

To create a new migration:

```bash
npm run migration:create -- -n MigrationName
```

To run migrations:

```bash
npm run migration:run
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Port on which the server should run
