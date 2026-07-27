# MurkPyRSS

MurkPyRSS generates RSS feeds from websites that do not offer them natively. It combines native extractors, CSS selectors, and custom scripts executed in isolated containers.

## Features

- **Custom extractors**: Paste, upload, generate with OpenRouter, test, and activate Python scripts for new websites.
- **Isolated execution**: Custom scripts run without network access in temporary containers with CPU, memory, and process limits.
- **Visual selectors**: Use the inspector to define CSS selectors for manual sites.
- **FlareSolverr and FreshRSS**: Configure both through the MurkPyRSS interface.
- **Persistent data**: Feeds, settings, and scripts are stored in the app data volume.

## Security requirement

To execute isolated extractors, the app receives access to the host Docker socket. Install it only on a trusted LAN and treat anyone with dashboard access as an app administrator.
