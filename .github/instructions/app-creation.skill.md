---
description: Automatically create a new app for the Runtipi Custom App Store following all repository rules and schemas.
---

# Workflow: Create a New App

This workflow automates the creation of a new app from scratch.

Ensure the user has provided the app name and a link to the app's official documentation/repository. Once provided, use the `read_url_content` tool to examine the link and follow these steps exactly:

1. **Verify App Information**
   - Scrape the provided URL for app details, description, and to locate the URL of an official logo image.
   - Identify the official Docker registry used by the app (Docker Hub, GHCR, etc.).
   - Find the EXACT image tag (never assume `v` prefixes, never use `latest`).

// turbo
2. **Find an Available Port**
   - Run the command below to list all occupied ports and choose an available port in the 8800-8999 range:
     `grep -rh '"port"' apps/*/config.json | grep -oP ':\s*\K\d+' | sort -n | uniq`
   - Only proceed when you confirm your chosen port is NOT in this list.

// turbo
3. **Initialize Directory Structure**
   - Create the necessary folders for the new app. Replace `<app-name>` with the app's slug:
     `mkdir -p apps/<app-name>/metadata`

4. **Generate App Configuration & Descriptions**
   - Use your `write_to_file` tool to create `apps/<app-name>/config.json`. Ensure it strictly adheres to `AGENTS.md` (e.g. `tipi_version: 1`, timestamps in ms).
   - Use your `write_to_file` tool to create `apps/<app-name>/docker-compose.yml`. Remember: YAML format, exactly one `x-runtipi.is_main: true`, valid `depends_on` object with `condition: service_healthy`. Let database secrets be hardcoded. **IMPORTANT: Do NOT include a `ports:` block in the service definition, as Runtipi manages this via `internal_port`.**
   - Use your `write_to_file` tool to create `apps/<app-name>/metadata/description.md`. 

// turbo
5. **Fetch and Process Logo**
   - Attempt to download the app's logo from the provided URL or its repository.
   - You must convert the image to `.jpg` format and resize it to exactly 512x512 pixels via a Python script (using `Pillow`).
   - **Crucial Rule for Transparent PNGs:** If the image has a transparent background, you must calculate the average brightness of the logo's non-transparent pixels. If the logo is light/bright, flatten it onto a dark gray (e.g., `#1a1a1a`) background. If the logo is dark, flatten it onto a light gray (e.g., `#f0f0f0`) background.
   - Save the processed image directly to `apps/<app-name>/metadata/logo.jpg`.
   - **FALLBACK**: If you are unable to find the logo or process it correctly after trying, copy a placeholder logo instead: `cp apps/linkding/metadata/logo.jpg apps/<app-name>/metadata/logo.jpg`

// turbo
6. **Validate Implementation**
   - Run the testing suite to ensure the configurations pass Runtipi's schema validation:
     `bun test`

7. **Final Summary**
   - Provide the user with a summary of the files created. Call out explicitly if the logo was successfully downloaded and converted automatically or if the user needs to handle it manually (because it triggered the fallback). Instruct the user to review the database hardcoded settings.
