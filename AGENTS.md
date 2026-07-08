# AGENTS.md

Canonical working guide for this repository.

## Scope

This repository is a custom app store for [Runtipi](https://github.com/runtipi/runtipi). Each app lives in `apps/<app-id>/` and must follow the same file contract and validation rules.

## Primary Rules

- Use `bun` for all local commands.
- Keep app folders in this shape:
  - `config.json`
  - `docker-compose.yml`
  - `metadata/description.md`
  - `metadata/logo.jpg`
- Use `docker-compose.yml` only. Do not create `docker-compose.json` or `docker-compose.yaml`.
- Compose files must use YAML with root `version: '3'` and root `x-runtipi.schema_version: 2`.
- Exactly one service per app may have `x-runtipi.is_main: true`.
- Never add a `ports:` block to compose files. Runtipi maps the host port from `config.json` to `internal_port`.
- `config.json.version` must match the main service image tag exactly, character for character.
- Do not use `latest` image tags.
- If you edit `docker-compose.yml` manually, update `config.json` in the same change:
  - increment `tipi_version`
  - update `updated_at` with `Date.now()`
- Database credentials should be hardcoded in compose, not collected through `form_fields`.

## Ports

- New apps must use host ports in the `8800-8999` range.
- Verify availability before assigning a port:

```bash
grep -rh '"port"' apps/*/config.json | grep -oP ':\s*\K\d+' | sort -n | uniq
```

- `port` in `config.json` is the exposed host port.
- `internal_port` in compose is the container port.

## Volumes

- Map host paths using only the last segment of the container path.
- Examples:
  - `/var/lib/postgresql/data` -> `${APP_DATA_DIR}/data/data`
  - `/app/storage` -> `${APP_DATA_DIR}/data/storage`

## Logos

- Logo format: 512x512 JPG.
- Keep margins around 15-20%.
- Avoid rounded corners and button-like frames.
- Prefer the official logo source first, then the project site or GitHub, then ask the user if nothing suitable exists.
- For transparent logos, use a dark gray background for light logos and a very light gray background for dark logos.

## Validation

- Run `bun test` before finishing any app change.
- Use `bun scripts/update-config.ts apps/<app-name>/docker-compose.yml` after image-tag updates.

## config.json

Required fields include:

- `$schema`
- `name`
- `id`
- `available`
- `short_desc`
- `author`
- `port`
- `categories`
- `description`
- `tipi_version`
- `version`
- `source`
- `exposable`
- `dynamic_config`
- `supported_architectures`
- `created_at`
- `updated_at`
- `form_fields`

## Supported Categories

`featured`, `utilities`, `automation`, `network`, `media`, `development`, `social`, `security`, `photography`, `books`, `data`, `music`, `finance`, `gaming`, `ai`

## Documentation Rule

This file is the source of truth for agent-facing guidance in this repo. Other instruction files should mirror these rules or point back here instead of introducing conflicting conventions.
