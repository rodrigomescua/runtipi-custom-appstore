Dockhand is a modern, efficient Docker management application that provides an intuitive web interface for managing Docker containers, images, volumes, networks, and Compose stacks.

## Key Features

- **Real-time Container Management**: Start, stop, restart, and monitor containers with live metrics
- **Compose Stack Orchestration**: Visual editor and Git integration for Docker Compose deployments
- **Multi-Environment Support**: Manage local and remote Docker hosts from a single interface
- **Interactive Terminal**: Full shell access inside running containers
- **Log Streaming**: Real-time log viewer with ANSI color support
- **File Browser**: Browse, upload, and download files from containers
- **Vulnerability Scanning**: Integration with Trivy and Grype scanners
- **Authentication**: SSO via OIDC, local users, and optional RBAC (Enterprise)
- **Auto-Updates**: Schedule automatic container image updates with vulnerability checks

## Docker Socket Access

Dockhand requires access to the Docker socket (`/var/run/docker.sock`) to manage containers. The container runs as root (user 0:0) to ensure proper socket permissions.

## First-Time Setup

On first launch, authentication is disabled. Access the UI and go to Settings > Authentication to enable authentication and create your first admin user.
