# AI Content Summarizer

A beginner-friendly AI content summarizer built with React, Node.js, Express, and the official Groq SDK.

## Features

- Paste text, upload PDFs, paste article URLs, or paste YouTube links
- Generate bullet, short, or detailed summaries
- Choose the target audience: student, beginner, or professional
- View summary, key points, and keywords in a modern responsive UI
- Dark mode toggle and animated transitions with Framer Motion

## Project Structure

```text
client/
  src/
    components/
    pages/
    services/
server/
  routes/
  controllers/
  services/
  config/
```

## Setup

1. Install backend dependencies.

```bash
cd server
npm install
```

2. Install frontend dependencies.

```bash
cd ../client
npm install
```

3. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env`.

4. Start the backend.

```bash
cd server
npm run dev
```

5. Start the frontend.

```bash
cd client
npm run dev
```

## API Endpoints

- `POST /api/upload/pdf`
- `POST /api/upload/url`
- `POST /api/upload/youtube`
- `POST /api/summarize`

## Notes

- The frontend expects the backend at `VITE_API_BASE_URL`.
- The backend uses the official Groq SDK and returns structured JSON for summaries.