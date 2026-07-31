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

Use these steps before making infrastructure changes in `my-infrastructure/`.

1. Sign in to Azure CLI (required for backend auth):

```bash
az login
```
Select the correct subscription when prompted (sub-ai-academy-26)

2. Initialize Terraform with the configured remote backend:

```bash
cd my-infrastructure && terraform init -reconfigure
```

3. Check the current plan/state:

```bash
terraform plan
```

Notes:

- Remote state is configured with the `azurerm` backend in Azure Storage (storage account/container), not Azure Container Registry.
- If you previously had local state, Terraform may prompt to migrate local state to remote during `init`. Choose migration so existing state history is preserved.

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

## Azure and Container Onboarding

Use this checklist when a new developer joins and needs to get cloud deployment and container workflow access.

### Access to set up first

1. Azure tenant access for the project.
2. Correct Azure subscription access: sub-ai-academy-26.
3. GitHub repository access with permission to view Actions.
4. Access to the shared Azure Container Registry.
5. Access to Key Vault used by backend runtime secrets.
6. Clarity on who owns CI credentials and secret rotation.

### CI secrets required

These repository secrets must exist and be valid:

1. ACR_NAME
2. AZURE_CLIENT_ID
3. AZURE_CLIENT_SECRET
4. AZURE_TENANT_ID

If these are wrong or expired, image publish and Terraform jobs will fail. These are hosted
via Github as they are needed to connect with Azure.

### How Azure pieces connect

1. GitHub Actions builds backend container image.
2. CI tags image with commit SHA.
3. CI logs into Azure and pushes image to ACR.
4. Terraform deploys Container Apps.
5. Container Apps pull from ACR using managed identity.
6. Backend reads environment secrets from Key Vault.

### Key Vault secrets backend needs

1. database-url
2. jwt-access-secret
3. access-token-ttl
4. aws-region
5. s3-bucket-name
6. aws-access-key-id
7. aws-secret-access-key

Missing any of these can cause backend revision startup failures.

### Terraform first-run for new devs

1. Login to Azure:
    
    az login

2. Select the correct subscription:
    
    az account set --subscription sub-ai-academy-26

3. Initialize Terraform in infrastructure folder:
    
    cd my-infrastructure
    terraform init -reconfigure

4. Validate and plan:
    
    terraform validate
    terraform plan -var="environment=dev"

### Local containers vs cloud containers

1. Local:
- Docker Compose runs backend and Postgres.
- Local env values come from the local env file.
- Used for development and testing.

2. Cloud:
- CI builds and pushes images to ACR.
- Terraform points Container Apps at image repository and tag.
- Runtime values come from Key Vault, not local env file.

### Day-1 verification checklist

1. Docker is running and compose works.
2. App runs locally with database and migrations.
3. Azure CLI login works.
4. Terraform init and plan work in dev.
5. ACR repositories are visible.
6. Container Apps resources are visible.
7. Key Vault has all required secret names.
8. CI pipeline is visible and understandable.

### Common failure points

1. Azure login step fails in CI:
- Service principal credentials or tenant mismatch.

2. ACR push fails:
- CI identity missing required registry permissions.

3. Container App pull fails:
- Managed identity missing AcrPull on registry scope.

4. Backend fails at startup:
- Key Vault secret missing, wrong name, or invalid value.

5. Terraform init fails:
- No permission for remote state storage backend.