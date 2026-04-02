# Oscar Arena

Predict Oscar winners and compete with friends. A full-stack web app built with Next.js, NestJS, PostgreSQL and Prisma.

## Stack

| Layer    | Tech                                                             |
| -------- | ---------------------------------------------------------------- |
| Frontend | Next.js 16 (App Router), Tailwind CSS v4, next-intl, next-themes |
| Backend  | NestJS 10, Prisma 5, PostgreSQL 16                               |
| Auth     | JWT (passport-jwt), bcryptjs                                     |
| Tooling  | TypeScript, ESLint, Prettier, Husky, Commitlint, lint-staged     |
| Deploy   | Docker Compose, GitHub Actions CI                                |

## Features

- Register / login with JWT authentication
- Browse Oscar editions and nominated films
- Pick your predicted winner per category (create, update, delete predictions)
- See how your picks scored once winners are revealed
- Global ranking with correct predictions and accuracy %
- Automatic poster fetching: TMDB → OMDB → Wikipedia fallback
- Portuguese 🇧🇷 / English 🇺🇸 i18n
- Light / dark mode

## Project structure

```
oscar-arena/
├── backend/          # NestJS API (port 3001)
│   ├── prisma/       # Schema, migrations, seed
│   └── src/
│       ├── auth/
│       ├── categories/
│       ├── editions/
│       ├── films/
│       ├── nominations/
│       ├── poster/
│       ├── predictions/
│       ├── score/
│       └── users/
└── frontend/         # Next.js app (port 3000)
    └── src/
        ├── app/[locale]/
        │   ├── (auth)/     # login, register
        │   └── (app)/      # dashboard, editions, predictions, ranking
        ├── components/
        ├── contexts/
        ├── lib/
        └── types/
```

## Local development

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or use Docker)

### 1. Clone and install

```bash
git clone https://github.com/ViniciusRobero/oscar-arena.git
cd oscar-arena
npm install          # installs root + both workspaces
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/oscar_arena"
JWT_SECRET="your-secret-here"
TMDB_API_KEY=""   # optional – get one at https://www.themoviedb.org/settings/api
OMDB_API_KEY=""   # optional – get one at https://www.omdbapi.com/apikey.aspx
```

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Database setup

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed      # seeds 97th Academy Awards data
```

### 4. Start dev servers

In two terminals:

```bash
# Terminal 1 – backend
cd backend && npm run start:dev

# Terminal 2 – frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger docs: http://localhost:3001/api/docs

## Docker

Run the full stack (PostgreSQL + backend + frontend) with a single command:

```bash
docker compose up --build
```

The backend automatically runs `prisma migrate deploy` on startup.

To also seed data:

```bash
docker compose exec backend npx prisma db seed
```

Environment variables can be overridden in a `.env` file at the project root or passed directly:

```bash
JWT_SECRET=mysecret TMDB_API_KEY=abc123 docker compose up
```

## API reference

Full Swagger UI is available at `/api/docs` when the backend is running.

| Method | Path                      | Auth | Description                |
| ------ | ------------------------- | ---- | -------------------------- |
| POST   | `/auth/register`          | —    | Register new user          |
| POST   | `/auth/login`             | —    | Login, returns JWT         |
| GET    | `/auth/me`                | ✓    | Current user profile       |
| GET    | `/editions`               | —    | List all editions          |
| GET    | `/editions/:id`           | —    | Edition by ID              |
| GET    | `/nominations?editionId=` | —    | Nominations for an edition |
| GET    | `/films`                  | —    | List all films             |
| GET    | `/categories`             | —    | List all categories        |
| GET    | `/predictions`            | ✓    | My predictions             |
| POST   | `/predictions`            | ✓    | Create prediction          |
| PUT    | `/predictions/:id`        | ✓    | Update prediction          |
| DELETE | `/predictions/:id`        | ✓    | Delete prediction          |
| GET    | `/score?editionId=`       | ✓    | Ranking for an edition     |

## Deploy (Railway)

Each service is deployed as a separate Railway service pointing to its subdirectory.

### 1. Create a project

Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo → select `oscar-arena`.

### 2. Add services

Create three services in the same project:

| Service    | Root directory | Notes                                   |
| ---------- | -------------- | --------------------------------------- |
| `db`       | —              | Add from Railway templates → PostgreSQL |
| `backend`  | `backend/`     | Uses `backend/Dockerfile`               |
| `frontend` | `frontend/`    | Uses `frontend/Dockerfile`              |

### 3. Configure backend environment variables

In the **backend** service → Variables:

```
DATABASE_URL        = (link the PostgreSQL service — Railway auto-fills this)
JWT_SECRET          = your-strong-secret
FRONTEND_URL        = https://<your-frontend>.railway.app
TMDB_API_KEY        = (optional)
OMDB_API_KEY        = (optional)
```

### 4. Configure frontend environment variables

In the **frontend** service → Variables → Build Variables:

```
NEXT_PUBLIC_API_URL = https://<your-backend>.railway.app
```

> `NEXT_PUBLIC_*` vars are inlined at build time — set them as **Build** variables, not runtime variables.

### 5. Deploy

Railway builds each service from its `railway.toml`. The backend automatically runs `prisma migrate deploy` on startup.

To seed initial data after first deploy:

```bash
railway run --service backend npx prisma db seed
```

## CI

GitHub Actions runs on every push and pull request to `master`:

1. **Backend** – `tsc --noEmit`
2. **Frontend** – `tsc --noEmit`
3. **Docker build** – builds both images (layer cache via GHA)

## Commit conventions

This repo uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by commitlint:

```
feat: add new feature
fix: fix a bug
chore: tooling / maintenance
docs: documentation only
refactor: code change without feature/fix
```

## License

MIT
