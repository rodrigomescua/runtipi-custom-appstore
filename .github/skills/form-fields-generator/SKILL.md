---
name: form-fields-generator
description: Generate app form fields for Runtipi config.json files.
argument-hint: 'App name and feature list or "generate fields for [APP_NAME]"'
---

# Form Fields Generator

Generate the smallest valid `form_fields` set for an app.

Rules:
- Follow [AGENTS.md](../../../AGENTS.md)
- Use only supported field types
- Match env vars used in compose
- Keep database credentials out of `form_fields`
