# FileFlows

FileFlows is a file processing automation server that watches directories and applies processing flows (pipelines) to media files.

It supports transcoding video and audio via FFmpeg, renaming and moving files, running scripts, and integrating with tools like Sonarr and Radarr. Primarily used for automated media optimization and format conversion in self-hosted setups.

## Features

- Visual flow editor for building processing pipelines
- Hardware-accelerated transcoding (Intel QSV, NVIDIA NVENC, AMD AMF)
- Watches directories for new files and processes automatically
- Docker-based worker execution for isolated processing
- Integrations with Sonarr, Radarr, and other media managers
- Plugin system for extending functionality
- Web-based dashboard with processing statistics
