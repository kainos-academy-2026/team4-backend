# team4-backend

Team4 Backend API built with Express and TypeScript.

## Prerequisites

- Node.js `>=22`
- npm

## Install Dependencies

```bash
npm install
```

## Run The API

### Development Mode

Starts the API with file watching enabled.

```bash
npm run dev
```

### Production Mode

Build first, then start the compiled output.

```bash
npm run build
npm start
```

### Optional Environment Variable

The API reads `PORT` from the environment. If not provided, it defaults to `3000`.

```bash
PORT=4000 npm run dev
```

## Build

Compile TypeScript into `dist/`.

```bash
npm run build
```

## Test

Run all unit tests:

```bash
npm run test
```

Run tests with coverage output:

```bash
npm run test:coverage
```

Run tests with the Vitest UI:

```bash
npm run test:ui
```

## Lint

Check formatting and lint rules:

```bash
npm run lint
```

Auto-fix lint and formatting issues:

```bash
npm run lint:fix
```

Run CI lint checks:

```bash
npm run lint:ci
```

## Quick Health Check

After starting the API, verify it is running:

```bash
curl http://localhost:3000/health
```

Expected response includes:

```json
{
	"status": "UP",
	"time": "<ISO timestamp>"
}
```

## Recommended Pre-Commit Checks

Run these before creating a commit:

1. `npm run build`
2. `npm run lint:ci`
3. `npm run test`
4. `npm run test:coverage` (recommended)