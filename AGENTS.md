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

# Update app version after changing docker-compose.json
bun scripts/update-config.ts apps/<app-name>/docker-compose.json
```

## App Structure

Each app requires exactly these files:
```
apps/<app-id>/
├── config.json           # App metadata, port, version, form fields
├── docker-compose.json   # Docker services (JSON format, never YAML)
└── metadata/
    ├── logo.jpg          # 512x512 JPG
    └── description.md    # Brief app description
```

## Critical Rules

### Port Assignment
- **Range:** 8800-8999 only
- **ALWAYS verify port availability BEFORE creating an app:**
  ```bash
  grep -rh '"port"' apps/*/config.json | grep -oP ':\s*\K\d+' | sort -n | uniq
  ```
- `port` in config.json = exposed host port (8800-8999)
- `internalPort` in docker-compose.json = container's internal port (any value)

### Version Matching (Critical)
The `version` in config.json MUST exactly match the image tag in docker-compose.json:
```json
// config.json
"version": "1.44.1"

// docker-compose.json  
"image": "sissbruecker/linkding:1.44.1"  // MUST MATCH exactly
```

**Always verify tags from the actual registry** (Docker Hub, GHCR, etc.) - never assume format:
- Some use `v1.0.0`, others use `1.0.0`
- LinuxServer.io always uses `v` prefix
- Check GitHub Actions workflows for tag transformation logic

### docker-compose.json Format
```json
{
  "$schema": "https://schemas.runtipi.io/v2/dynamic-compose.json",
  "schemaVersion": 2,
  "services": [
    {
      "name": "app-name",
      "image": "registry/image:version",
      "isMain": true,
      "internalPort": 3000,
      "environment": [...],
      "volumes": [...],
      // Use "dependsOn" with object format (never arrays):
      "dependsOn": {
        "postgres": { "condition": "service_healthy" }
      }
    }
  ]
}
```

- `services` is an **array** (not object like YAML)
- Only ONE service has `"isMain": true`

### Volume Paths
Host path uses only the **last part** of container path:
- Container `/var/lib/postgresql/data` → Host `${APP_DATA_DIR}/data/data`
- Container `/app/storage` → Host `${APP_DATA_DIR}/data/storage`

### Database Credentials
**Never** ask for database credentials via form_fields. Hardcode them in docker-compose.json with simple defaults related to app name.

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
3. docker-compose.json passes `dynamicComposeSchema` validation

Run `bun test` before committing any app changes.

## Renovate Automation

Renovate automatically updates Docker images in `apps/*/docker-compose.json`:
- Creates grouped PRs per app file
- Runs `bun scripts/update-config.ts` to sync config.json version
- Database images (redis, postgres, mariadb, etc.) are excluded from auto-updates

## Common Mistakes

1. **Port conflicts** - Always verify availability first
2. **Version mismatch** - config.json version must match docker image tag exactly
3. **Using `latest` tag** - Always use specific versions
4. **Wrong services format** - Must be array, not object
5. **Array `dependsOn`** - Use object format with `service_healthy` condition
6. **Full paths in volumes** - Use only last directory name
7. **Timestamps in seconds** - Must be milliseconds (use `Date.now()`)
