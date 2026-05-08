# MERN Music Player

Production-ready full-stack music player built with MongoDB, Express, React, and Node.js.

## Features

- JWT authentication with signup/login/profile update
- Forgot/reset password flow with email delivery
- Streaming songs from Jamendo API
- Genre playlists, search, and favourites persistence
- Responsive audio player (play/pause, seek, loop, shuffle, speed, volume)

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, Axios
- Backend: Node.js, Express, Mongoose, JWT, Nodemailer
- Services: MongoDB Atlas, ImageKit, Jamendo API

## Project Structure

```text
Music-player-app/
  Backend/    # Express API + MongoDB models/controllers/routes
  Frontend/   # React + Vite client app
```

## Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended
- MongoDB local instance or MongoDB Atlas

## Installation

1. Clone the repository:

```bash
git clone https://github.com/StrawhatPrag/Music-player-app.git
cd Music-player-app
```

2. Install backend dependencies:

```bash
cd Backend
npm install
```

3. Install frontend dependencies:

```bash
cd ../Frontend
npm install
```

## Environment Variables

Create files from examples and fill real values:

- `Backend/.env` from `Backend/.env.example`
- `Frontend/.env` from `Frontend/.env.example`

### Backend (`Backend/.env`)

- `PORT`
- `MONGODB_URI`
- `IMAGEKIT_PUBLIC_KEY`
- `IMAGEKIT_PRIVATE_KEY`
- `IMAGEKIT_URL_ENDPOINT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `MAILTRAP_HOST`
- `MAILTRAP_PORT`
- `MAILTRAP_USER`
- `MAILTRAP_PASS`
- `FRONTEND_URL`
- `FRONTEND_URLS` (optional, comma-separated origins)
- `JAMENDO_CLIENT_ID`

### Frontend (`Frontend/.env`)

- `VITE_BASE_URL` (backend URL, no trailing slash)

Never commit `.env` files.

## Running Locally

Run backend:

```bash
cd Backend
npm run dev
```

Run frontend:

```bash
cd Frontend
npm run dev
```

## Production Commands

Backend start:

```bash
cd Backend
npm start
```

Frontend build:

```bash
cd Frontend
npm run build
```

## API Overview

- Auth:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password/:token`
  - `PUT /api/auth/profile`
- Songs:
  - `GET /api/songs`
  - `GET /api/songs/playlistByTag/:tag`
  - `POST /api/songs/favourite`
  - `GET /api/songs/favourites`
- Health:
  - `GET /api/health`

## Deployment Steps

### Frontend (Vercel/Netlify)

- Root directory: `Frontend`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variable:
  - `VITE_BASE_URL=https://<your-backend-domain>`

### Backend (Render/Railway/Vercel Node)

- Root directory: `Backend`
- Build command: `npm install`
- Start command: `npm start`
- Health endpoint: `/api/health`
- Set all variables from `Backend/.env.example` in hosting dashboard

### Database (MongoDB Atlas)

- Create cluster and DB user
- Add IP/network access for your hosting provider
- Use Atlas connection string for `MONGODB_URI`

## Security Notes

- `.env` files are ignored by git
- Secrets should be provided via environment variables only
- Do not commit API keys, JWT secrets, or credentials

## License

ISC
