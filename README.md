# team4-backend

Team4 Backend

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from the committed template:

```bash
cp .env.example .env
```

3. Start the database:

```bash
docker compose up -d
```

4. Apply migrations:

```bash
npx prisma migrate dev
```

5. Seed the database:

```bash
npm run db:seed
```

6. Start the API:

```bash
npm run dev
```

Health check:

```text
http://localhost:3000/health
```

## Prerequisites

1. Node.js 22+ (required by this project)
2. Docker Desktop installed and running
3. npm available in your shell

Optional check:

```bash
docker compose version
```

If `docker compose` is not found, fix your PATH or reinstall Docker Desktop.

## Setup

1. Install project dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env
```

3. Start PostgreSQL via Docker:

```bash
docker compose up -d
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Seed sample data:

```bash
npm run db:seed
```

6. Optional: run the full database setup in one command:

```bash
npm run db:setup
```

## Run The API

Development mode:

```bash
npm run dev
```

Build and run production output:

```bash
npm run build
npm start
```

## Quality Checks

Run tests with coverage:

```bash
npm run test:coverage
```

Run lint checks:

```bash
npm run lint
```

Auto-fix lint issues where possible:

```bash
npm run lint:fix
```

## Git Hooks

This repository uses Husky to run lint checks before each commit.

After installing dependencies, hooks are installed automatically via the `prepare` script.

## Notes

- Prisma is already initialized in this repository, so you do not need to run `prisma init`.
- This repository already contains migrations, so you normally run `migrate dev` instead of creating a new `init` migration.
- `npm run db:seed` is safe to rerun because the seed uses Prisma `upsert` operations.
- If you want to verify the seeded data manually, run `docker exec academy-postgres psql -U academy_user -d job_roles_db -c 'select count(*) from "JobRole";'`.
