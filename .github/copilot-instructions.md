# Copilot Instructions for Runtipi Custom App Store

This is the definitive, consolidated guide for all development on this repository. All requirements from COPILOT.md have been merged here.

## Project Overview

This is a custom app store for [Runtipi](https://github.com/runtipi/runtipi), a self-hosted app platform. Each app in the `apps/` directory is a containerized application with standardized configuration and Docker Compose files.

**Architecture:** Each app directory contains three required components:
1. `config.json` - App metadata and form fields for user configuration
2. `docker-compose.json` - Dynamic container configuration (always JSON, never YAML)
3. `metadata/` folder with `logo.jpg` and `description.md`

**Note:** This repository is no longer accepting new apps (see warning in README.md); contributions are limited to bug fixes for existing apps.

## App Structure Examples

### Simple App (Single Service)
**Example: Linkding** (`apps/linkding/`)
```
linkding/
├── config.json                 # 51 lines: metadata + 3 form fields
├── docker-compose.json         # 1 service (linkding)
└── metadata/
    ├── description.md
    └── logo.jpg
```

### Complex App (Multiple Services)
**Example: Dawarich** (`apps/dawarich/`)
```
dawarich/
├── config.json                 # 61 lines: metadata + 2 form fields
├── docker-compose.json         # 3 services: dawarich_redis, dawarich_db, dawarich
└── metadata/
    ├── description.md
    └── logo.jpg
```

## Critical Conventions

### Port Assignment (8800-8999 range)
- New apps MUST use ports in the range 8800-8999
- Never reuse existing app ports (check README.md table of 19 current apps)
- The `port` field in `config.json` is the **exposed host port**, not the internal container port
- Internal container port goes in `docker-compose.json` under `internalPort`

**Concrete example (Linkding):**
```json
// config.json
"port": 8830

// docker-compose.json
"internalPort": 9090  // Container runs on 9090, exposed to host on 8830
```

### Version Management
**CRITICAL - DO NOT SKIP:** The `version` field in `config.json` MUST exactly match the image tag in `docker-compose.json`.

- Always check **GitHub Releases** (`https://github.com/{owner}/{repo}/releases`) or **Docker Hub** for the latest stable version
- Never use `latest` tag in production (only for development/testing)
- Format examples: `v1.0.40`, `1.25.3`, `20250928-055530` (check what the project actually uses)
- `tipi_version` increments with each config change (starts at 1 for new apps)
- Timestamps (`created_at`, `updated_at`) are in milliseconds; use `Date.now()`

**CRITICAL: Verifying Docker Image Tags**

You MUST verify the exact tag format from the Docker registry, not assume or guess:

1. **For GHCR (GitHub Container Registry) images:**
   - Visit: `https://github.com/orgs/{owner}/packages/container/{image}/versions`
   - Example: `https://github.com/orgs/getmydia/packages/container/mydia/versions`
   - Click on the specific version tag to view the exact installation command
   - The command will show: `docker pull ghcr.io/{owner}/{image}:{EXACT_TAG}`
   - Copy the tag exactly as shown (e.g., `0.7.2` not `v0.7.2`, or vice versa)

2. **For Docker Hub images:**
   - Visit: `https://hub.docker.com/r/{owner}/{image}/tags`
   - Example: `https://hub.docker.com/r/sissbruecker/linkding/tags`
   - Verify the exact tag format from the tags list
   - If the web interface doesn't load, check the GitHub Actions workflow to see how tags are generated

3. **For Docker Hub images with unclear tags (when web interface fails):**
   - Check the GitHub Actions workflow file (usually `.github/workflows/docker-publish.yml`)
   - Look for Docker build/push configuration
   - **Key insight:** Some projects strip the 'v' prefix when publishing to Docker Hub
   - Example: GitHub release `v2.2.8` → Docker tag `2.2.8` (without 'v')
   - Check for tag transformation logic like `${GITHUB_REF_NAME#v}` (removes 'v' prefix)
   - Also check the project's documentation for installation commands

4. **Common tag format variations:**
   - Some projects use `v1.0.0` (with 'v' prefix)
   - Others use `1.0.0` (without 'v' prefix)
   - Some use semantic versions like `20250928-055530` (timestamps)
   - **ALWAYS verify the exact format in the registry** - don't assume

5. **After setting the tag:**
   - `config.json` version: `"version": "{EXACT_TAG}"`
   - `docker-compose.json` image: `"image": "registry/owner/name:{EXACT_TAG}"`
   - Both MUST match exactly character-for-character

**Real examples from mistakes made:**
- ❌ Used `v0.7.2` when registry only had `0.7.2`
- ❌ Used `v0.8.0` when registry only had `0.8.0`
- ❌ Used `v2.2.8` when GitHub Actions strips 'v' and publishes as `2.2.8`
- ✅ Always check the registry page or GitHub Actions workflow directly before committing

**Concrete example (Linkding):**
```json
// config.json
"version": "1.44.1"

// docker-compose.json
"image": "sissbruecker/linkding:1.44.1"  // MUST MATCH exactly
```

**Concrete example (Blazor RSS with custom timestamp):**
```json
// config.json
"version": "20250928-055530",
"tipi_version": 1,
"created_at": 1731806736001,
"updated_at": 1731806736001

// docker-compose.json
"image": "ghcr.io/rodrigomescua/blazorrssdocker:20250928-055530"  // Matches version
```

### Form Fields Pattern
The `form_fields` array defines user input during installation. Can be empty `[]` for apps with no user config.

**Common field types and usage:**
- `text`: General text input (usernames, URLs, paths)
- `password`: Sensitive input (passwords, API keys) - min 8 chars recommended
- `email`: Email validation
- `number`: Numeric values
- `fqdn`: Fully Qualified Domain Name
- `ip`: IPv4 address
- `random`: Auto-generated secrets (API keys, tokens)
- `boolean`: Toggle/checkbox

**Concrete example (Linkding with 3 required fields):**
```json
"form_fields": [
  {
    "type": "text",
    "label": "Initial Admin Username",
    "required": true,
    "env_variable": "LD_SUPERUSER_NAME",
    "hint": "Username for the initial admin user",
    "min": 3,
    "max": 150
  },
  {
    "type": "email",
    "label": "Initial Admin Email",
    "required": true,
    "env_variable": "LD_SUPERUSER_EMAIL",
    "hint": "Email address for the initial admin user"
  },
  {
    "type": "password",
    "label": "Initial Admin Password",
    "required": true,
    "env_variable": "LD_SUPERUSER_PASSWORD",
    "hint": "Password for the initial admin user",
    "min": 8
  }
]
```

**Concrete example (Simple optional field with default):**
```json
{
  "type": "text",
  "label": "Allow User Registration",
  "max": 10,
  "min": 3,
  "required": false,
  "env_variable": "ALLOW_USER_REGISTRATION",
  "default": "true"
}
```

**Concrete example (Random secret - 32 chars hex):**
```json
{
  "type": "random",
  "label": "Database Secret Key",
  "required": true,
  "env_variable": "DATABASE_SECRET",
  "min": 32,
  "encoding": "hex"
}
```

### Docker Compose (`docker-compose.json`) Rules

**Required top-level structure:**
```json
{
  "$schema": "https://schemas.runtipi.io/v2/dynamic-compose.json",
  "schemaVersion": 2,
  "services": [
    // Array of service objects (NOT object keys like YAML)
  ]
}
```

**Required fields per service:**
- `name`: Service identifier (e.g., "linkding", "dawarich_db")
- `image`: Must use specific version tag with registry if needed (never `latest`)
- `internalPort`: Port inside container (only for main service, but recommended for all)
- `isMain`: Only set to `true` on the user-facing service (the one Traefik routes to)

**Important patterns:**
- `schemaVersion: 2` (always, never 1 or 3)
- `services` is an array `[{ }, { }]` (not object like YAML)
- Only the main service should have `"isMain": true`
- Multiple services allowed (db, cache, queue, etc.); only mark the web service as main
- Extra services (Redis, PostgreSQL) should NOT have `isMain` or set it to `false`

**Concrete example (Single service - Linkding):**
```json
{
  "$schema": "https://schemas.runtipi.io/v2/dynamic-compose.json",
  "schemaVersion": 2,
  "services": [
    {
      "name": "linkding",
      "image": "sissbruecker/linkding:1.44.1",
      "isMain": true,
      "internalPort": 9090,
      "environment": [
        {
          "key": "LD_SUPERUSER_NAME",
          "value": "${LD_SUPERUSER_NAME}"
        },
        {
          "key": "LD_SUPERUSER_EMAIL",
          "value": "${LD_SUPERUSER_EMAIL}"
        },
        {
          "key": "LD_SUPERUSER_PASSWORD",
          "value": "${LD_SUPERUSER_PASSWORD}"
        },
        {
          "key": "LD_CSRF_TRUSTED_ORIGINS",
          "value": "http://${APP_DOMAIN}:${APP_PORT},https://${APP_DOMAIN}"
        }
      ],
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/data/data",
          "containerPath": "/etc/linkding/data"
        }
      ]
    }
  ]
}
```

**Concrete example (Multiple services - Dawarich with Redis + PostgreSQL):**
```json
{
  "$schema": "https://schemas.runtipi.io/v2/dynamic-compose.json",
  "schemaVersion": 2,
  "services": [
    {
      "name": "dawarich_redis",
      "image": "redis:7.4-alpine",
      "command": "redis-server",
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/data/dawarich_shared",
          "containerPath": "/data"
        }
      ]
    },
    {
      "name": "dawarich_db",
      "image": "postgis/postgis:17-3.5-alpine",
      "environment": [
        {
          "key": "POSTGRES_USER",
          "value": "postgres"
        },
        {
          "key": "POSTGRES_PASSWORD",
          "value": "password"
        },
        {
          "key": "POSTGRES_DB",
          "value": "dawarich_development"
        }
      ],
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/data/dawarich_db_data",
          "containerPath": "/var/lib/postgresql/data"
        }
      ],
      "healthCheck": {
        "test": "pg_isready -U postgres -d dawarich_development",
        "interval": "10s",
        "timeout": "10s",
        "retries": 5
      },
      "shmSize": "1G"
    },
    {
      "name": "dawarich",
      "image": "freikin/dawarich:0.36.1",
      "isMain": true,
      "internalPort": 3000,
      "command": [
        "bin/rails",
        "server",
        "-p",
        "3000",
        "-b",
        "::"
      ],
      "environment": [
        {
          "key": "REDIS_URL",
          "value": "redis://dawarich_redis:6379"
        },
        {
          "key": "DATABASE_HOST",
          "value": "dawarich_db"
        },
        {
          "key": "DATABASE_USERNAME",
          "value": "postgres"
        },
        {
          "key": "DATABASE_PASSWORD",
          "value": "password"
        },
        {
          "key": "DATABASE_NAME",
          "value": "dawarich_development"
        }
      ],
      "volumes": [
        {
          "hostPath": "${APP_DATA_DIR}/data/dawarich_storage",
          "containerPath": "/app/storage"
        }
      ]
    }
  ]
}
```

### Volume Mounting Standard
**CRITICAL RULE:** Host path MUST follow `${APP_DATA_DIR}/data/{last-part-of-containerPath}`

The **last part** is ONLY the final directory/file name, not the entire path:

**Correct examples:**
- Container `/etc/linkding/data` → Host `${APP_DATA_DIR}/data/data` (last part = "data")
- Container `/var/lib/postgresql/data` → Host `${APP_DATA_DIR}/data/data` (last part = "data")
- Container `/config/app.yml` → Host `${APP_DATA_DIR}/data/app.yml` (last part = "app.yml")
- Container `/app/storage` → Host `${APP_DATA_DIR}/data/storage` (last part = "storage")
- Container `/app/db` → Host `${APP_DATA_DIR}/data/db` (last part = "db")

**DO NOT do this:**
- ❌ Container `/etc/linkding/data` → Host `${APP_DATA_DIR}/data/etc/linkding/data` (entire path)
- ❌ Container `/var/lib/postgresql/data` → Host `${APP_DATA_DIR}/data/var/lib/postgresql/data` (entire path)

**Special variables:**
- `${APP_DATA_DIR}`: App's persistent data directory
- `${TZ}`: System timezone (use in environment)
- `${APP_DOMAIN}`: Domain when app is exposed
- `${APP_PORT}`: Port number (use in URLs)
- `${RUNTIPI_MEDIA_DIR}`: Shared media directory (if needed)
- User form fields: `${ENV_VARIABLE_NAME}` (e.g., `${LD_SUPERUSER_NAME}`)

### Configuration Schema Validation

Both `config.json` and `docker-compose.json` use schemas:
- `$schema` in config.json should be: `https://schemas.runtipi.io/v2/app-info.json`
- `$schema` in docker-compose.json should be: `https://schemas.runtipi.io/v2/dynamic-compose.json`

Validation schemas from `@runtipi/common/schemas`:
- `appInfoSchema` for config.json
- `dynamicComposeSchema` for docker-compose.json

### Complete config.json Example (Linkding)
```json
{
  "$schema": "https://schemas.runtipi.io/v2/app-info.json",
  "name": "Linkding",
  "id": "linkding",
  "available": true,
  "short_desc": "Self-hosted bookmark manager",
  "author": "sissbruecker",
  "port": 8830,
  "categories": ["utilities"],
  "description": "Linkding is a self-hosted bookmark manager that helps you save, organize and share your bookmarks. It features a clean and simple UI, browser extensions for quick bookmarking, full-text search, and tagging capabilities.",
  "tipi_version": 1,
  "version": "1.44.1",
  "source": "https://github.com/sissbruecker/linkding",
  "exposable": true,
  "dynamic_config": true,
  "supported_architectures": ["amd64", "arm64"],
  "created_at": 1732627200000,
  "updated_at": 1732627200000,
  "form_fields": [
    {
      "type": "text",
      "label": "Initial Admin Username",
      "required": true,
      "env_variable": "LD_SUPERUSER_NAME",
      "hint": "Username for the initial admin user",
      "min": 3,
      "max": 150
    },
    {
      "type": "email",
      "label": "Initial Admin Email",
      "required": true,
      "env_variable": "LD_SUPERUSER_EMAIL",
      "hint": "Email address for the initial admin user"
    },
    {
      "type": "password",
      "label": "Initial Admin Password",
      "required": true,
      "env_variable": "LD_SUPERUSER_PASSWORD",
      "hint": "Password for the initial admin user",
      "min": 8
    }
  ]
}
```

### Available Categories
Use these in the `categories` array (can use 1 or multiple):
```
featured, utilities, automation, network, media, development, social, security, 
photography, books, data, music, finance, gaming, ai
```

**Note:** These are the ONLY categories accepted by the schema. Invalid categories will cause schema validation to fail.

### Optional config.json Fields
- `website`: URL of official website (e.g., "https://www.nginx.com/")
- `force_expose`: If true, requires domain exposure (user can't choose port-only)
- `https`: If true, app only works via HTTPS
- `no_gui`: If true, app has no web interface (no "Open" button in UI)
- `uid`/`gid`: User/group IDs for data folder permissions (both required if used, e.g., `"uid": 1000, "gid": 1000`)
- `deprecated`: If true, app won't appear in store
- `min_tipi_version`: Minimum Runtipi version required (e.g., "v3.0.0")
- `dynamic_config`: Must be `true` for all apps in this repository
- `generate_vapid_keys`: If true, generates VAPID keys for web push notifications

## Automatic App Creation Workflow

**IMPORTANT:** When creating new apps, ALWAYS:
1. **Fetch and analyze the GitHub repository** to extract accurate information about the app
2. **Verify Docker image tags from the actual registry** (GHCR, Docker Hub, or the project's documentation) - never assume or guess
3. **Generate all configuration automatically** following all guidelines in this document
4. **Never create apps without analyzing the source repository first** - this ensures accuracy
5. **Always validate with `bun test`** before completion and mark task as complete

**Why this matters:**
- Ensures `version` in config.json matches the Docker image tag exactly
- Catches port conflicts early
- Extracts accurate metadata, descriptions, and app structure
- Prevents manual errors in form fields and environment variables
- Validates configurations match schema requirements

## Development Workflow

### Testing Apps
Run the test suite to validate all apps:
```bash
bun test
```

The tests in `__tests__/apps.test.ts` verify:
1. Required files exist (config.json, docker-compose.json, logo.jpg, description.md)
2. config.json passes schema validation
3. docker-compose.json passes schema validation

**What the tests check for each app:**
- ✅ `apps/{app-id}/config.json` exists and is valid JSON
- ✅ `apps/{app-id}/docker-compose.json` exists and is valid JSON
- ✅ `apps/{app-id}/metadata/logo.jpg` exists
- ✅ `apps/{app-id}/metadata/description.md` exists
- ✅ config.json passes `appInfoSchema` validation
- ✅ docker-compose.json passes `dynamicComposeSchema` validation

**Test output example:**
```
✓ app linkding should have config.json
✓ app linkding should have docker-compose.json
✓ app linkding should have metadata/logo.jpg
✓ app linkding should have metadata/description.md
✓ app linkding should have a valid config.json
✓ app linkding should have a valid docker-compose.json
```

If tests fail, check for:
- Missing required fields in config.json (name, id, port, version, etc.)
- Version mismatch between `config.json` version and `docker-compose.json` image tag
- Missing `"isMain": true` on the main service in multi-service apps
- Invalid port ranges or volume path patterns
- Services array issues (must be array, not object)
- Schema URL mismatches

### Updating App Versions
Use the version update script:
```bash
bun scripts/update-config.ts <path-to-docker-compose.json>
```

**Parameter:**
- `<path-to-docker-compose.json>`: Full path to the docker-compose.json file

**Example:**
```bash
bun scripts/update-config.ts apps/linkding/docker-compose.json
```

This script automatically:
- Detects the main service (marked with `isMain: true`)
- Extracts the image version from the main service
- Updates `version` in config.json to match
- Increments `tipi_version` by 1
- Updates `updated_at` timestamp to current milliseconds
- Works with both JSON and YAML compose files

**How Renovate Integration Works:**
- Renovate detects all Docker image updates in a single `docker-compose.json` file
- Instead of creating multiple PRs, it creates **one grouped PR** with all updates
- Uses `executionMode: "branch"` to collect all changes before running the script
- Script runs **once per app file** after all image updates are staged
- This prevents `tipi_version` conflicts when multiple images in the same file are updated

**Important notes:**
- Script only reads from `docker-compose.json`, doesn't need parameters for individual images
- Always verify the new versions exist on Docker Hub or GitHub Releases before merging

### Package Management
- Package manager: **bun** (not npm/pnpm) - this overrides the README.md which mentions pnpm
- Lock file: `bun.lockb`
- Main dependencies: `@runtipi/common`, `zod`, `zod-validation-error`
- TypeScript configuration: `tsconfig.json` (strict mode enabled)
- Commands: `bun test` (run validation), `bun scripts/update-config.ts` (update versions)

### Renovate Automation & Grouped PRs
Renovate automatically detects Docker image updates in all `apps/*/docker-compose.json` files:

**Key Design:**
- Multiple image updates in the same file are **grouped into one PR**
- Renovate creates the branch, stages all image updates, then runs `update-config.ts` once
- This prevents `tipi_version` conflicts when multiple services are updated together
- Example: If redis, postgres, and dawarich all have updates available:
  - **Before:** 3 separate PRs, 3 separate script executions, possible `tipi_version` inconsistency
  - **After:** 1 PR with all 3 images updated, 1 script execution, consistent metadata

**Excluded Packages:**
The following database/cache images are never auto-updated (managed manually):
- `redis`, `postgres`, `postgis/postgis`, `mariadb`, `mysql`, `mongodb`, `rabbitmq`

**Workflow:**
1. Renovate detects updates via regex: `/^apps\/.+\/docker-compose\.json$/`
2. Groups updates by app/file using `executionMode: "branch"`
3. Stages all image changes in docker-compose.json
4. Runs: `bun install && bun run test`
5. Runs: `bun ./scripts/update-config.ts apps/{app}/docker-compose.json`
6. Script extracts main service version and updates config.json
7. Creates single PR with all changes
8. Manual review required (`automerge: false`)

### File Structure Rules
**DO NOT INCLUDE:**
- `docker-compose.yml` or `docker-compose.yaml` (always `.json`)
- `docker-compose.json` AND `docker-compose.yml` in same app
- `.yml` files anywhere in the app folder

**MUST INCLUDE:**
- `config.json` with `$schema` field
- `docker-compose.json` with `$schema` field and `schemaVersion: 2`
- `metadata/logo.jpg` (512x512 JPG)
- `metadata/description.md` (brief description of the app)

## Key Files to Know

- **`COPILOT.md`** (1235 lines) - Comprehensive Portuguese-language guide for all configuration patterns
- **`scripts/update-config.ts`** - Automates version and metadata updates
- **`__tests__/apps.test.ts`** - Validation tests for all apps using Bun test runner
- **`config.js`** - Root configuration (not explored, likely build/export config)
- **`renovate.json`** - Dependency update automation (see `0_renovate.txt` for tracking)

## Common Mistakes to Avoid

1. ❌ **Using `docker-compose.yml` instead of `docker-compose.json`**
   - Always use `.json` format only
   - Never have both `.yml` and `.json` in same app

2. ❌ **`version` field not matching image tag**
   - config.json `"version": "1.44.1"` MUST match
   - docker-compose.json `"image": "sissbruecker/linkding:1.44.1"`
   - This is the #1 validation failure cause
   - **Common mistake:** Assuming `v0.7.2` when registry has `0.7.2` (or vice versa)
   - **Solution:** Always visit the Docker registry package page directly to verify the exact tag format
   - **Example:** Check `https://github.com/orgs/getmydia/packages/container/mydia/versions` for the exact install command

3. ❌ **Using `latest` image tag in production**
   - Example: `"image": "nginx:latest"` ❌
   - Instead: `"image": "nginx:1.25.3"` ✅
   - Always use specific version numbers

4. ❌ **Ports outside 8800-8999 range**
   - `"port": 8080` ❌ (outside range)
   - `"port": 8850` ✅ (inside range)
   - Special case: Old apps may have different ports (don't change them)

5. ❌ **Using container port in `port` field**
   - config.json `"port": 8830` (exposed host port)
   - docker-compose.json `"internalPort": 9090` (container port)
   - These are DIFFERENT - don't confuse them

6. ❌ **Invalid volume paths**
   - WRONG: `"hostPath": "${APP_DATA_DIR}/data/var/lib/postgresql/data"` (full path)
   - RIGHT: `"hostPath": "${APP_DATA_DIR}/data/data"` (last part only)
   - Use only the final directory/file name from containerPath

7. ❌ **Multiple services without `isMain`**
   - If app has Redis + Database + Web service:
   - Only the web service gets `"isMain": true`
   - Database and cache services should NOT have this field

8. ❌ **Omitting `form_fields` array**
   - WRONG: `{ "name": "app", ... }` (missing form_fields)
   - RIGHT: `{ "name": "app", "form_fields": [], ... }` (empty array is OK)
   - Always include the field, even if empty

9. ❌ **Timestamps in seconds instead of milliseconds**
   - WRONG: `"created_at": 1732627200` (in seconds)
   - RIGHT: `"created_at": 1732627200000` (in milliseconds)
   - Use `Date.now()` to generate correct timestamp

10. ❌ **Missing `schemaVersion: 2` in docker-compose.json**
    - Always include: `"schemaVersion": 2`
    - Never use 1 or 3

11. ❌ **Services as object instead of array**
    - WRONG: `"services": { "nginx": { ... } }` (YAML style)
    - RIGHT: `"services": [ { "name": "nginx", ... } ]` (JSON array)

12. ❌ **Using array format for `dependsOn` (CRITICAL!)**
    - **WRONG:** `"dependsOn": ["postgres", "redis"]` ❌ - This causes "connection refused" errors!
    - **RIGHT:** Use object format with conditions:
    ```json
    "dependsOn": {
      "postgres": { "condition": "service_healthy" },
      "redis": { "condition": "service_healthy" }
    }
    ```
    - Array format only waits for container startup, not readiness
    - Always use `"service_healthy"` condition to ensure dependencies are fully operational
    - Without proper conditions, dependent services will fail trying to connect to services that aren't ready yet

13. ❌ **LinuxServer images without 'v' prefix**
    - **CRITICAL**: LinuxServer.io images (lscr.io/linuxserver/*) ALWAYS use 'v' prefix in tags
    - Example: GitHub release `v1.10.6-ls99` → GHCR tag `v1.10.6-ls99` (WITH 'v')
    - This is different from other registries that may strip the 'v' prefix
    - **WRONG**: `"image": "lscr.io/linuxserver/obsidian:1.10.6-ls99"` ❌
    - **RIGHT**: `"image": "lscr.io/linuxserver/obsidian:v1.10.6-ls99"` ✅
    - **How to verify**: Visit `https://github.com/orgs/linuxserver/packages/container/{image}/versions`
    - Look at the tag list directly - LinuxServer always shows the 'v' prefix clearly

14. ❌ **Assuming tag format without registry verification**
    - Different registries have different tag conventions:
    - **GHCR (GitHub Container Registry)**: Check `https://github.com/orgs/{owner}/packages/container/{image}/versions`
    - **Docker Hub**: Check `https://hub.docker.com/r/{owner}/{image}/tags`
    - **LinuxServer.io**: Always visit GHCR package page to see the exact tag format
    - **Generic registries**: Always check the official documentation or package page
    - **Never assume or guess** - registry pages are the source of truth
    - Take 30 seconds to verify rather than creating incorrect configurations

## Architecture Note: App Discovery & Validation

Apps are discovered by reading the `apps/` directory:
- Each subdirectory is treated as an app (if it's a directory)
- Validation happens in parallel for all apps via test suite
- No build step needed; configs are validated as-is
- Schemas are imported from `@runtipi/common/schemas` package (external dependency)

## Practical Checklist for Creating New Apps

Use this checklist when creating a new app:

1. **Port Selection**
   - [ ] Pick unused port in 8800-8999 range
   - [ ] Verify it's not in README.md apps table

2. **config.json**
   - [ ] Add `$schema` URL
   - [ ] Set `id` = folder name
   - [ ] Set `port` to exposed port (8800-8999 range)
   - [ ] Set `version` to match docker image tag exactly
   - [ ] Include all `form_fields` (or empty array `[]`)
   - [ ] Set `tipi_version: 1`
   - [ ] Set timestamps with `Date.now()` (milliseconds!)
   - [ ] Set `dynamic_config: true`
   - [ ] Include `created_at` and `updated_at`

3. **docker-compose.json**
   - [ ] Add `$schema` and `schemaVersion: 2`
   - [ ] Make `services` an array
   - [ ] Set `image` tag to exact version (no `latest`)
   - [ ] **CRITICAL:** Image tag MUST match config.json `version` exactly, character-for-character
   - [ ] Verify dependency versions match the official app's docker-compose.json (PostgreSQL, Redis, etc.)
   - [ ] Set `internalPort` for each service
   - [ ] Only ONE service has `"isMain": true`
   - [ ] Volume `hostPath` uses `${APP_DATA_DIR}/data/{last-part}`
   - [ ] Reference form fields as `${ENV_VARIABLE_NAME}`
   - [ ] **CRITICAL: Configure `dependsOn` with `service_healthy` conditions (NEVER use arrays!)**
     - Each service with dependencies must use object format with conditions
     - Example: `"dependsOn": { "postgres": { "condition": "service_healthy" } }`
     - Without conditions, services fail with "connection refused" or "host not found" errors

4. **metadata/**
   - [ ] logo.jpg (512x512, JPG format)
   - [ ] description.md (brief description)

5. **Validation**
   - [ ] Run `bun test` - all tests must pass
   - [ ] Check no validation errors from schema

## Existing Codebase Issues (as of Dec 2025)

**KNOWN VIOLATION - Needs Fixing:**
- **`apps/razor-pricehistory/`** - Contains BOTH `docker-compose.json` AND `docker-compose.yml`
  - This violates rule #1 in "Common Mistakes to Avoid"
  - Solution: Delete the `.yml` file, keep only `.json`
  - This will likely cause test failures until resolved

## Important Notes

- This consolidated file replaces the separate COPILOT.md
- All development guidelines are consolidated here for centralized reference
- Maintain English for new documentation and code comments
- Always validate configurations with `bun test` before committing
