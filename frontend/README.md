# Library Management System - Frontend

This is the frontend application for the Library Management System, built with React.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn

## Setup

1. Install dependencies:

```bash
npm install
# or
yarn
```

2. Create a `.env` file in the frontend root directory with the following content:

```
REACT_APP_API_URL=http://localhost:3001/api
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deploying to Vercel

1. Install the Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

Follow the prompts to complete the deployment.

## Environment Variables

- `REACT_APP_API_URL`: URL of the API server
