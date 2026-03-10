# Backend API

Node.js + Express + Prisma + SQLite backend for the task board project.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`.
   Set `FRONTEND_ORIGIN` to your frontend URL (default: `http://localhost:5173`).

3. Create database and Prisma client:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
```

4. Start server:

```bash
npm run dev
```

Server defaults to `http://localhost:3001`.

## Seed Data

Populate/reset the board + tasks shown in the challenge preview:

```bash
npm run seed
```

## Endpoints

- `GET /api/boards`
- `GET /api/boards/:boardId`
- `POST /api/boards`
- `PUT /api/boards/:boardId`
- `DELETE /api/boards/:boardId`
- `PUT /api/tasks/:taskId`
- `DELETE /api/tasks/:taskId`

## Payload Examples

Create board:

```json
{
  "title": "Project board",
  "description": "Optional description",
  "tasks": [
    { "title": "Design UI", "status": "todo", "position": 0 },
    { "title": "Build API", "status": "in-progress", "position": 1 }
  ]
}
```

Update task:

```json
{
  "title": "Build backend API",
  "status": "done",
  "position": 2
}
```
