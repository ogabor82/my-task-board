# My Task Board

A simple full-stack task management application built as part of a DevChallenges full-stack challenge. The application allows users to create and manage task boards with editable tasks using standard REST API operations.

## Demo

Live demo:
<https://your-demo-url.com>

Repository:
<https://github.com/yourname/my-task-board>

---

## Features

* Create a task board with a unique ID
* View board by URL (`/board/:board-id`)
* Edit board name and description
* Add new tasks
* Edit task:

  * name
  * description
  * icon
  * status
* Delete tasks
* Default board with starter tasks
* Persistent storage using a database

---

## Tech Stack

### Frontend

* React
* Zustand (state management)
* CSS / Tailwind / styled-components

### Backend

* Node.js
* Express.js

### Database

* SQLite

### Deployment

* Frontend: Vercel / Netlify
* Backend: Render / Vercel

---

## API Endpoints

### Board

GET `/api/boards/:board-id`
Retrieve a board by its ID.

POST `/api/boards`
Create a new board and return the generated ID.

PUT `/api/boards/:board-id`
Update board name or description.

DELETE `/api/boards/:board-id`
Delete a board.

### Tasks

PUT `/api/tasks/:task-id`
Update a task.

DELETE `/api/tasks/:task-id`
Delete a task.

---

## Running Locally

### Clone repository

```
git clone https://github.com/yourname/my-task-board.git
cd my-task-board
```

### Backend

```
cd backend
npm install
npm run dev
```

Server runs on:

```
http://localhost:3000
```

### Frontend

```
cd frontend
npm install
npm run dev
```

App runs on:

```
http://localhost:5173
```

---

## Environment Variables

Frontend `.env`

```
VITE_API_URL=http://localhost:3000
```

---

## Learning Goals

This project demonstrates:

* Full-stack application development
* REST API design
* CRUD operations
* React state management
* Backend integration with Express
* Deploying a full-stack web application

---

## Author

Gábor Ocskó
