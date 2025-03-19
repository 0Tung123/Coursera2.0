# Personal Coursera Project

A full-stack application built with TypeScript, Next.js, NestJS, PostgreSQL, and Docker.

## Project Structure

- `frontend/`: Next.js application
- `backend/`: NestJS application
- `docker/`: Docker configuration files

## Prerequisites

- Node.js (v16+)
- Docker and Docker Compose
- Git

## Getting Started

### Development

1. Clone the repository
2. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```
3. Install dependencies and start the backend:
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
4. Install dependencies and start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Features

- TypeScript for type safety
- Next.js for frontend
- NestJS for backend API
- PostgreSQL for database
- Docker for containerization
