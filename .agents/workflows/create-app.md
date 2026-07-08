---
description: Compatibility workflow for creating a new Runtipi app.
---

# Create App Workflow

Compatibility workflow only. Follow [AGENTS.md](../../AGENTS.md).

Steps:
1. verify the official app docs and exact registry tag
2. choose an unused port in `8800-8999`
3. create `config.json`, `docker-compose.yml`, `metadata/description.md`, and `metadata/logo.jpg`
4. run `bun test`
