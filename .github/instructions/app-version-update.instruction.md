---
description: "Use when updating app versions, bumping image tags, or modifying config.json/docker-compose.yml for any app in the apps/ directory."
---

# App Version Update Guidelines

When updating an app version, ALL of the following must be done together:

1. Update `version` in `config.json` to match the new image tag exactly
2. Update the image tag in `docker-compose.yml` to match
3. Increment `tipi_version` by 1 in `config.json`
4. Update `updated_at` to current timestamp in milliseconds (`Date.now()`)

**The `version` in config.json and the image tag in docker-compose.yml MUST be character-for-character identical.**

Always verify the exact tag format from the actual registry before committing.
See `.github/copilot-instructions.md` for complete guidelines.
