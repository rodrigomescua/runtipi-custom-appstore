# Runtipi Custom App Store

## Getting Started

1. Install [Node.js](https://nodejs.org/en) if needed.
2. Install dependencies from the repository root with `bun install`.
3. Run `bun test` after changing app files.

## App Contributions

- Follow [AGENTS.md](../AGENTS.md) for the canonical repository rules.
- Keep `config.json` and `docker-compose.yml` in sync when updating an app.
- Use `bun scripts/update-config.ts apps/<app-name>/docker-compose.yml` after image-tag changes.

## Apps available (<!appsCount>)

| Name | Description | Port | Dynamic (<!dynamicConfigCount>) |
| ---- | ----------- | ---- | -------------------------------------- |
<!appsList>
