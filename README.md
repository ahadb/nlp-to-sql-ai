# DataMind AI

AI-powered analytics workspace that translates natural language questions into SQL, executes them against your data, and returns explainable responses with dashboard insights.

## What This App Does

DataMind AI combines a React frontend and a FastAPI backend to help teams:

- upload SQL schemas or CSV files,
- explore tables and sample records,
- ask questions in plain English through an AI chat assistant,
- generate SQL and execute it against connected data,
- view dashboard insights and reports,
- manage auth and data-source connections.

## Core Features

- **Natural language to SQL**: turns user prompts into SQL queries and returns results.
- **AI chat assistant**: conversational analysis with SQL transparency and response formatting.
- **Schema and file ingestion**: supports SQL and CSV uploads with schema metadata tracking.
- **Insights generation**: dashboard cards and table-level insights powered by AI + sample data.
- **Reporting workflow**: report listing, retrieval, and generation endpoints.
- **Auth support**: sign-up, sign-in, profile, token refresh, and sign-out flows.

## Screens

### Dashboard

![QuantumSQL Dashboard](screens/dashboard)

### Documents

![QuantumSQL Documents](screens/documents)

### Responsive Layout

![QuantumSQL Responsive Layout](screens/responsive)

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Recharts
- **Backend**: FastAPI, Pydantic, Uvicorn
- **Data layer**: Supabase + PostgreSQL (hybrid/local compatibility paths exist)
- **AI**: OpenAI API

## Repository Structure

```text
.
├── client/                  # React + Vite application
│   └── src/
│       ├── components/      # UI components, pages, chat UI
│       ├── config/          # API URL and endpoint config
│       ├── contexts/        # Auth and app context providers
│       └── services/        # API and auth service layer
├── server/                  # FastAPI application
│   ├── app/
│   │   ├── routers/         # API route modules
│   │   ├── services/        # Business logic (chat, insights, schema, etc.)
│   │   ├── auth/            # Auth dependencies
│   │   ├── models/          # Request/response schemas
│   │   └── main.py          # FastAPI app entrypoint
│   └── pyproject.toml
├── CHAT_FLOW.md             # Chat request/response flow notes
├── INSIGHTS_FLOW.md         # Dashboard insights flow notes
└── PERFORMANCE-COST.md      # Cost/performance optimization notes
```

## API Surface (Backend)

Base URL (local): `http://localhost:8000`

- `POST /auth/signup`, `POST /auth/signin`, `GET /auth/me`, `POST /auth/refresh`
- `POST /upload`, `GET /upload/schemas`, `DELETE /upload/schemas/{schema_id}`
- `GET /tables/`, `GET /tables/{table_name}/data`
- `POST /chat/message`, `GET /chat/history/{user_id}`, `GET /chat/context/{schema_id}`
- `GET /insights/dashboard/all`, `GET /insights/dashboard/{schema_id}`
- `GET /dashboard/`, `GET /reports/`, `POST /reports/generate`
- `GET /connections/`, `GET /data/insights/{table_name}`

Interactive docs are available at `/docs` when the server is running.

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.12+
- npm
- Supabase project credentials
- OpenAI API key

### 1) Clone and install dependencies

```bash
git clone <your-repo-url>
cd full-stack-nlp-sql
```

Frontend:

```bash
cd client
npm install
cd ..
```

Backend:

```bash
cd server
python -m venv .venv
source .venv/bin/activate
pip install -e .
cd ..
```

### 2) Configure environment variables

Create `server/.env.dev` (or export variables directly in your shell):

```env
ENVIRONMENT=dev
DEBUG=true
HOST=0.0.0.0
PORT=8000

OPENAI_API_KEY=your_openai_api_key

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

DB_NAME=quantumsql
DB_USER=dev_user
DB_PASS=dev123
DB_HOST=localhost
DB_PORT=5432

JWT_SECRET=replace_with_secure_secret
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000

# Optional AWS endpoints used by SQL generation/query helpers
VITE_AWS_GENERATE_URL=
VITE_AWS_QUERY_URL=
```

### 3) Run the app

Backend:

```bash
cd server
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd client
npm run dev
```

Open the frontend at the Vite URL shown in your terminal (typically `http://localhost:5173`).

## Development Commands

Frontend:

```bash
cd client
npm run dev
npm run build
npm run lint
```

Backend:

```bash
cd server
source .venv/bin/activate
uvicorn app.main:app --reload
```

## Notes

- The chat and insights flows are documented in `CHAT_FLOW.md` and `INSIGHTS_FLOW.md`.
- The backend includes health/status endpoints such as `/`, `/health`, and `/env-status`.
- Keep `.env*` files out of version control if they contain real credentials.

## License

Add your project license here (for example, MIT).
