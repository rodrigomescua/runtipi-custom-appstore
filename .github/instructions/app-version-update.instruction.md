---
description: "Use when updating app versions, bumping image tags, or modifying config.json/docker-compose.yml for any app in the apps/ directory."
---

# App Version Update Guidelines

For each commit that changes an app, update its version metadata once, regardless of how many edits were made to that app before committing. Do not bump `tipi_version` again for additional pre-commit edits. When updating an app version, do all of the following together:

1. Update `version` in `config.json` to match the new image tag exactly
2. Update the image tag in `docker-compose.yml` to match
3. Increment `tipi_version` by 1 in `config.json`
4. Update `updated_at` to current timestamp in milliseconds (`Date.now()`)

The `version` in `config.json` and the image tag in `docker-compose.yml` must be character-for-character identical.

Always verify the exact tag format from the actual registry before committing.
Run `bun scripts/update-config.ts` at most once per app per commit, after all image-tag edits are complete.
Follow [AGENTS.md](../../AGENTS.md) for the canonical repository rules.
