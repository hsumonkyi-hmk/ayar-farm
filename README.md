# AyarFarm Link MSME

A cross-platform agricultural knowledge and management system designed specifically for farmers in Myanmar. This solution connects the agricultural community with expert knowledge, real-time market information, and support networks.

The platform consists of two main components:

- **Mobile App:** A user-friendly application for farmers (end-users) to access resources, track crops, and connect with experts.
- **Web Dashboard:** A comprehensive admin panel for managing content, users, and analyzing platform data.

## Project Structure

```structure
ayar-farm/
├── api/            # Node.js REST API (Express + Prisma)
├── web/            # React web application (Vite + TypeScript)
├── mobile/         # Flutter mobile application
└── docker-compose.yml
```

## Tech Stack

### API

- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript
- **Database:** PostgreSQL (Local or Neon)
- **ORM:** Prisma
- **Real-time:** Socket.io
- **Storage:** Cloudinary
- **Authentication:** JWT
- **Services:** Twilio (SMS), Nodemailer (Email)

### Web

- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS 4
- **Routing:** TanStack Router
- **UI Components:** Radix UI, Lucide React
- **State/Data:** TanStack Table, React Hook Form
- **Visualization:** Recharts
- **Real-time:** Socket.io Client

### Mobile

- **Framework:** Flutter 3.7+
- **Language:** Dart
- **Key Packages:**
  - `http`: API communication
  - `geolocator`: Location services

## Prerequisites

- Node.js 22+
- Docker & Docker Compose
- Flutter SDK 3.7+ (for mobile development)

## Quick Start

### Using Docker

The easiest way to run the entire stack (API, Web, and Database) is using Docker Compose.

```bash
# Start all services
docker-compose up --build

# Services will be available at:
# API: http://localhost:3000
# Web: http://localhost:5173
# Database: localhost:5432
```

## Local Development

### Database Setup

If you are running the API locally without Docker, you need a PostgreSQL database. You can use the one provided by Docker or a remote one (e.g., Neon).

```bash
# Start only the database container
docker-compose up -d database
```

### API Setup

```bash
cd api
npm install
cp .env.example .env

# Update .env with your configuration
# Ensure DATABASE_URL points to your local or remote database

npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed # Optional: Seed initial data
npm run dev
```

### Web Setup

```bash
cd web
npm install
cp .env.example .env
npm run dev
```

### Mobile Setup

```bash
cd mobile
flutter pub get
flutter run
```

## Environment Variables

Check `.env.example` in `api/` and `web/` directories for required environment variables.
