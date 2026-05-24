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

1. Install dependencies from the repository root.

```bash
npm install
```

2. Create the local env files if they are missing.

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Start both apps from the repo root.

```bash
npm run dev
```

4. If you prefer separate terminals, use:

```bash
npm run dev:server
npm run dev:client
```

## API Endpoints

- `POST /api/upload/pdf`
- `POST /api/upload/url`
- `POST /api/upload/youtube`
- `POST /api/summarize`

## Notes

- The frontend works locally through the Vite proxy on `/api`, so the client can talk to the backend at `http://localhost:5000` during development.
- The backend uses the official Groq SDK and returns structured JSON for summaries.# content_summarizer
