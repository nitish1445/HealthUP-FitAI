# HealthUP

HealthUP is a full-stack fitness and wellness application for creating personalized workout and diet plans, tracking progress, building habits, and getting data-informed coaching.

## Features

- User registration, login, onboarding, and protected routes
- Personalized fitness profiles and dashboards
- Workout and diet plans
- Progress, measurements, habits, recovery, analytics, and roadmap views
- Coach and intelligence features for forecasts and plan adjustments
- Admin dashboard for users and templates
- Weekly plan evaluation through a scheduled backend job

## Tech Stack

- Frontend: React, React Router, Vite, Tailwind CSS, Recharts, Axios
- Backend: Node.js, Express, Mongoose, MongoDB
- Authentication: JWT with bcrypt password hashing

## Requirements

- Node.js 18 or newer
- npm
- A running MongoDB instance or MongoDB Atlas database

## Setup

Clone the repository, then install dependencies in both applications:

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

### Backend environment

Create `Backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/healthup
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

`MONGO_URI` and `JWT_SECRET` are required. Do not commit `.env` files or real secrets.

### Frontend environment

The frontend defaults to `http://localhost:5000/api`. To use another API URL, create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running locally

Start the backend in one terminal:

```bash
cd Backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd Frontend
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

Check the backend with `http://localhost:5000/api/health`.

## Database seed

With MongoDB running and `Backend/.env` configured, create the development seed user:

```bash
cd Backend
npm run seed
```

The seed script creates an admin-capable development account only when it does not already exist. Change or remove the seeded credentials before using a shared or production database.

## Production build

Build the frontend:

```bash
cd Frontend
npm run build
```

Run the backend without file watching:

```bash
cd Backend
npm start
```

## Available scripts

### Backend

- `npm run dev` - start the API with Nodemon
- `npm start` - start the API with Node
- `npm run seed` - create the development seed user

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build locally

## Main API areas

- `/api/auth` - authentication
- `/api/profile` - fitness profiles
- `/api/workouts` - workout plans and logs
- `/api/diet` - diet plans and meals
- `/api/progress` - progress tracking
- `/api` - intelligence, analytics, roadmap, and dashboard endpoints
- `/api/admin` - administrator operations