# AyarFarm Link MSME - Web Application

Frontend web application for AyarFarm Link MSME platform.

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

## Development

Run development server:
```bash
npm run dev
```

Application will be available at `http://localhost:5173`

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Lint

Run ESLint:
```bash
npm run lint
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Route-level page components
├── services/       # API and socket services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Features

- Authentication (Register, Login, Verify, Profile)
- Real-time updates via WebSocket
- File upload (Profile pictures)
- Responsive design with Tailwind CSS
