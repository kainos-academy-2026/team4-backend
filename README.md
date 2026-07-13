# team4-backend

Team4 Backend

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start the database:

```bash
docker compose up -d
```

3. Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://academy_user:academy_password@localhost:5432/job_roles_db?schema=public"
PORT=3000
JWT_ACCESS_SECRET="replace_with_128_hex_chars"
JWT_REFRESH_SECRET="replace_with_128_hex_chars"
ENABLE_DEV_TEST_USER="false"
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="Password123!"
```

4. Apply migrations:

```bash
npx prisma migrate dev
```

5. Start the API:

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

2. Start PostgreSQL via Docker:

```bash
docker compose up -d
```

3. Create a `.env` file in the project root with:

```env
DATABASE_URL="postgresql://academy_user:academy_password@localhost:5432/job_roles_db?schema=public"
PORT=3000
JWT_ACCESS_SECRET="replace_with_128_hex_chars"
JWT_REFRESH_SECRET="replace_with_128_hex_chars"
ENABLE_DEV_TEST_USER="false"
TEST_USER_EMAIL="test@example.com"
TEST_USER_PASSWORD="Password123!"
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Optional: seed sample data:

```bash
npm run db:seed
```

To seed a local auth test user, set `ENABLE_DEV_TEST_USER="true"` in your local `.env`.
Then `npm run db:seed` will upsert that user with an Argon2 password hash using
`TEST_USER_EMAIL` and `TEST_USER_PASSWORD`.

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
