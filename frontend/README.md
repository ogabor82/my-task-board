# Frontend

React + Zustand + Tailwind implementation of the task board default screen.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
cp .env.example .env
```

3. Run dev server:

```bash
npm run dev
```

The frontend fetches from:

- `GET ${VITE_API_BASE_URL}/api/boards`

Default base URL is `http://localhost:3001`.
