---
name: runtipi-app
description: Create, update, or audit apps in this Runtipi custom app store. Use for new app integrations, compose/config changes, logo handling, validation, and app-contract reviews.
---

# Runtipi app workflow

Use this workflow for every app change in this repository.

## Discover and verify

- Read `AGENTS.md` and inspect comparable apps before editing.
- Use `bun` for commands.
- Verify the exact image tag from the actual registry before editing or approving the app. Never assume GitHub release tags match container tags. Treat a missing or inconclusive registry response as a blocker.
- Assign new host ports only in `8800-8999` and check existing `config.json` values first.

## App contract

Create exactly:

- `apps/<id>/config.json`
- `apps/<id>/docker-compose.yml`
- `apps/<id>/metadata/description.md`
- `apps/<id>/metadata/logo.jpg`

Compose must be YAML with root `version: '3'`, root `x-runtipi.schema_version: 2`, exactly one `x-runtipi.is_main: true`, and no `ports:` block. Set `internal_port` to the container port. Keep `config.json.version` exactly equal to the main image tag and do not use `latest`.

For Docker Hub, query `https://hub.docker.com/v2/repositories/<namespace>/<repository>/tags` and require the exact tag in the response. Record and compare the exact string, including a `v` prefix. Do not treat a release page, Docker Hub summary, or `latest` alias as tag verification.

Map persistent host paths using only the final container path segment, such as `/config` to `${APP_DATA_DIR}/data/config`. Keep database credentials in compose rather than `form_fields`.

## Form fields

Use Runtipi's `random` field type for secrets that must be generated. Set `min` to at least `32` and choose an explicit encoding such as `base64` or `hex`. Do not commit fixed session secrets.

## Logo requirements

Follow this source order:

1. Search [selfh.st/icons](https://selfh.st/icons/) first. Resolve the canonical reference name and prefer its SVG, then PNG.
2. If unavailable, use the project's official website or GitHub.
3. Ask the user only when no suitable source exists.

Always produce a 512x512 JPG. For a light or transparent logo, use a uniform dark gray background; for a dark logo, use a very light gray background. Preserve the logo's source colors and geometry. Center it with approximately 15-20% margin on every side. Do not use rounded corners, borders, text, or button-like frames. Use local image tooling for deterministic resizing, compositing, color/background handling, and format conversion when available. Inspect the final image visually.

## Versioning and validation

When manually editing `docker-compose.yml`, increment `tipi_version` and update `updated_at` with the current `Date.now()` millisecond timestamp. Image-only updates should use:

```bash
bun scripts/update-config.ts apps/<app-name>/docker-compose.yml
```

Run:

```bash
bun test
```

Before finishing, verify required files, JSON/compose schemas, registry tag existence, exact image/config version equality, port availability, volume naming, logo format/dimensions/margins/background, and that no secrets or `latest` tags were introduced. Do not report completion if any check is unverified.
