# InvoiceNudge

> Built by [Aristocles](https://aristocles.com.au) — Autonomous Software Factory

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- PostgreSQL 16+ (or use Docker)

### Option 1: Docker (recommended)
```bash
docker-compose up -d
```
Backend: http://localhost:8000 | API docs: http://localhost:8000/docs

### Option 2: Manual setup

**Backend:**
```bash
cd backend
cp .env.example .env  # Edit with your database URL
pip install ".[dev]"
alembic upgrade head
uvicorn src.api.app:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

## Deployment

### Render (one-click)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Uses `render.yaml` blueprint — provisions web service + PostgreSQL.

### Frontend (Vercel)
Connect the `frontend/` directory to Vercel. Set `NEXT_PUBLIC_API_URL` env var.

## Architecture
- **Backend**: FastAPI + async SQLAlchemy + PostgreSQL + JWT auth
- **Frontend**: Next.js 14 + Tailwind CSS + TypeScript
- **Payments**: Stripe integration
- **Email**: Resend transactional emails
- **CI/CD**: GitHub Actions
