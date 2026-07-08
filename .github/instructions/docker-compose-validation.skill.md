---
name: docker-compose-validation
description: Validate Runtipi docker-compose files.
argument-hint: 'Validate [APP_NAME] or "check docker-compose for [APP]"'
---

# Docker Compose Validation

Validate `apps/*/docker-compose.yml` against [AGENTS.md](../../AGENTS.md).

Check:
- YAML syntax
- `version: '3'`
- root `x-runtipi.schema_version: 2`
- exactly one `x-runtipi.is_main: true`
- exact match between compose image tag and `config.json.version`
- `depends_on` object form with health conditions
- volume paths using `${APP_DATA_DIR}/data/<last-segment>`
