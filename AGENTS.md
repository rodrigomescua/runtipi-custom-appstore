# AGENTS.md

This file provides guidance to the AI Agent (Antigravity) responsible for maintaining this repository.

## Project Overview

A custom app store for [Runtipi](https://github.com/runtipi/runtipi), a self-hosted app platform. Each app in `apps/` is a containerized application with standardized configuration files.

**Package Manager:** bun (use this instead of pnpm mentioned in README.md)

## Commands

```bash
# Install dependencies
bun install

# Run validation tests (validates all apps)
bun test

# Update app version after changing docker-compose.yml
bun scripts/update-config.ts apps/<app-name>/docker-compose.yml
```

## App Structure

Each app requires exactly these files:
```
apps/<app-id>/
├── config.json           # App metadata, port, version, form fields
├── docker-compose.yml    # Docker services (YAML format with x-runtipi, NOT JSON)
└── metadata/
    ├── logo.jpg          # 512x512 JPG (Use placeholder from another app. USER will update with real logo.)
    └── description.md    # Brief app description
```

### Logo Guidelines
- **Format**: 512x512 JPG.
- **No rounded corners**: Never use rounded corners for logos. They should have sharp, square edges.
- **No button-like backgrounds**: The logo graphic should fill the canvas and act as the icon itself. It should not look like an icon placed inside a smaller button or box within the image.
- **Sources (Search Order)**: 
  1. Primary source: [selfh.st/icons/](https://selfh.st/icons/). Download as PNG.
  2. Secondary sources: GitHub repository or the official project website.
  3. Final fallback: Ask the USER to create/provide one manually only if not found in the above sources.
- **Processing**: Convert the downloaded image to a 512x512 JPG.
- **Backgrounds for Transparency**:
  - **Light Logo**: If the logo is predominantly light-colored with a transparent background, use a **dark gray** background.
  - **Dark Logo**: If the logo is predominantly dark-colored with a transparent background, use a **very light gray** background.
- **Margins**: Always include a safety margin (padding) of approximately 15-20% between the logo graphic and the edges of the 512x512 canvas. This ensures the content is not cut off when the UI applies rounded corners or button frames.

## Critical Rules

### Port Assignment
- **Range:** 8800-8999 only (defined in `config.json` only)
- **ALWAYS verify port availability BEFORE creating an app:**
  ```bash
  grep -rh '"port"' apps/*/config.json | grep -oP ':\s*\K\d+' | sort -n | uniq
  ```
- `port` in config.json = exposed host port (8800-8999)
- `internal_port` in docker-compose.yml under `x-runtipi` = container's internal port (any value)
- **IMPORTANT:** Never add a `ports:` section to `docker-compose.yml`. Runtipi maps the host port from `config.json` to the `internal_port` automatically.

### Version Matching (Critical)
The `version` in config.json MUST exactly match the image tag in docker-compose.yml:
```yaml
# config.json
"version": "1.44.1"

# docker-compose.yml
image: sissbruecker/linkding:1.44.1  # MUST MATCH exactly
```

**Always verify tags from the actual registry** (Docker Hub, GHCR, etc.) - never assume format:
- Some use `v1.0.0`, others use `1.0.0`
- LinuxServer.io always uses `v` prefix
- **CRITICAL:** GitHub Releases often use a `v` prefix (e.g., `v0.7.1`) while the Docker Image in GHCR may NOT (e.g., `0.7.1`). ALWAYS check the Packages/Registry tab to confirm the exact string.
- Check GitHub Actions workflows for tag transformation logic

**CRITICAL - Manual compose edits require config bump:**
- If `apps/*/docker-compose.yml` is manually changed, also update `apps/*/config.json`
- Increment `tipi_version` by 1
- Update `updated_at` with current timestamp in milliseconds
- Keep docker-compose and config changes in the same commit
- Exception: image-only updates done via `bun scripts/update-config.ts`

### docker-compose.yml Format (YAML with x-runtipi)
```yaml
services:
  app-name:
    image: registry/image:version
    environment:
      - KEY=value
      - ANOTHER=${ENV_VAR}
    volumes:
      - ${APP_DATA_DIR}/data:/app/data
    depends_on:
      postgres:
        condition: service_healthy  # ✅ Always use condition!
    x-runtipi:
      is_main: true
      internal_port: 3000

x-runtipi:
  schema_version: 2
```

**Key Rules:**
- Use `docker-compose.yml` (YAML), NOT `.json`
- Include `version: '3'` at root
- Services are YAML objects (keys = service names), not arrays
- **EXACTLY ONE** service with `x-runtipi.is_main: true`
- `depends_on` always includes `condition: service_healthy` or `service_started`
- Environment variables are simple list (`- KEY=value`), NOT array of objects

### Volume Paths
Host path uses only the **last part** of container path:
- Container `/var/lib/postgresql/data` → Host `${APP_DATA_DIR}/data/data`
- Container `/app/storage` → Host `${APP_DATA_DIR}/data/storage`

### Database Credentials
**Never** ask for database credentials via form_fields. Hardcode them in docker-compose.yml with simple defaults related to app name.

### config.json Required Fields
```json
{
  "$schema": "https://schemas.runtipi.io/v2/app-info.json",
  "name": "App Name",
  "id": "folder-name",
  "available": true,
  "short_desc": "...",
  "author": "...",
  "port": 8830,
  "categories": ["utilities"],
  "description": "...",
  "tipi_version": 1,
  "version": "1.0.0",
  "source": "https://github.com/...",
  "exposable": true,
  "dynamic_config": true,
  "supported_architectures": ["amd64", "arm64"],
  "created_at": 1732627200000,
  "updated_at": 1732627200000,
  "form_fields": []
}
```

**Valid categories:** featured, utilities, automation, network, media, development, social, security, photography, books, data, music, finance, gaming, ai

## Schema Validation

Tests in `__tests__/apps.test.ts` verify:
1. Required files exist
2. config.json passes `appInfoSchema` validation
3. docker-compose.yml passes `dynamicComposeSchema` validation

Run `bun test` before committing any app changes.

## Renovate Automation

Renovate automatically updates Docker images in `apps/*/docker-compose.yml`:
- Creates grouped PRs per app file
- Runs `bun scripts/update-config.ts` to sync config.json version
- Database images (redis, postgres, mariadb, etc.) are excluded from auto-updates

## Common Mistakes

1. **Port conflicts** - Always verify availability first
2. **Version mismatch** - config.json version must match docker image tag exactly
3. **Using `latest` tag** - Always use specific versions
4. **Wrong services format** - Must be a YAML object, not a JSON array
5. **Array `depends_on`** - Usually objects with `condition: service_healthy` in newer compose
6. **Full paths in volumes** - Use only last directory name
7. **Timestamps in seconds** - Must be milliseconds (use `Date.now()`)
