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

To seed local auth users, set both `NODE_ENV="development"` and
`ENABLE_DEV_TEST_USER="true"` in your local `.env`.
Then `npm run db:seed` will upsert one `user` and one `admin` account with Argon2
password hashes using the `TEST_*` variables.

6. Optional: run the full database setup in one command:

```bash
npm run db:setup
```

## Infrastructure (Terraform)

Use these steps before making infrastructure changes in `infrastructure/`. Shared,
reusable resources (e.g. the resource group) live in `modules/`, so a future
`prod` environment can reuse them just by pointing at a different `tfvars`
file and state key — no module changes needed.

### Local usage

1. Sign in to Azure CLI and tell Terraform to authenticate with it (required
   for both the `azurerm` backend and provider — no client secret needed):

```bash
az login
export ARM_USE_CLI=true
```
Select the correct subscription when prompted (sub-ai-academy-26)

2. Initialize Terraform with the configured remote backend:

```bash
cd infrastructure && terraform init -reconfigure
```

3. Check the current plan/state (uses `environments/dev.tfvars`):

```bash
terraform plan -var-file=environments/dev.tfvars
```

Notes:

- Remote state is configured with the `azurerm` backend in Azure Storage (storage account/container), not Azure Container Registry.
- The state `key` is prefixed per environment (`dev.terraform.tfstate`) so a `prod.terraform.tfstate` can be added later in the same storage account without disturbing `dev`.
- If you previously had local state, Terraform may prompt to migrate local state to remote during `init`. Choose migration so existing state history is preserved.

### CI/CD usage

The `terraform` job in `.github/workflows/ci.yml` runs non-interactively on every push/PR:

- **`terraform plan`** always runs (on every branch/PR) so infrastructure changes are reviewed before merge.
- **`terraform apply`** only runs on pushes to `main`, after the Docker image has been pushed to ACR.
- Authentication uses a Service Principal with Azure AD Workload Identity Federation (OIDC) — the pipeline exchanges a short-lived GitHub Actions OIDC token for Azure access, so **no Azure secret/password is ever stored in GitHub**. This requires the following repository secrets to be configured (values, not passwords): `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`.
- Dynamic naming (dev/prod) is driven entirely by `TF_VAR_*` environment variables set in the workflow, so adding a `prod` environment later is just a matter of adding a second job/matrix entry with `TF_VAR_environment=prod` and a `prod.terraform.tfstate` backend key — the `.tf` files themselves don't need to change.

## Run The API

Development mode:

```bash
npm run dev
```

Run API + PostgreSQL in Docker Compose:

```bash
docker compose up --build -d
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

## Local SSL Certificate For Docker Builds

If your machine/network uses a local or corporate CA (for example, TLS interception),
export that CA certificate and place it in [certs/README.md](certs/README.md) as a `.crt` file.

Example macOS flow:

1. Open Keychain Access and export your CA certificate.
2. Convert to PEM `.crt` format if needed:

```bash
openssl x509 -inform DER -in exported.cer -out certs/local-ca.crt
```

3. Rebuild containers:

```bash
docker compose up --build -d
```
