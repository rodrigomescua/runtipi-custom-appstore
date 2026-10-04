# Zerobyte

Zerobyte automates encrypted backups with Restic. Schedule backup jobs, configure retention policies, monitor snapshots, and restore files through a web interface.

## Simplified installation

This app uses the official [simplified installation](https://zerobyte.app/docs/installation#simplified-installation-no-remote-mounts): local directory sources, without `SYS_ADMIN`, `/dev/fuse`, or shared mount propagation. Mounting NFS, SMB, WebDAV, or SFTP shares from inside Zerobyte is unavailable.

Backup destinations still support local repositories, S3-compatible storage, Google Cloud Storage, Azure Blob Storage, and rclone. Rclone destinations require a configured rclone remote; see the official [rclone guide](https://zerobyte.app/docs/guides/rclone).

## Initial setup

Set **Zerobyte Base URL** to the exact address you will use to open the app, including the scheme and port when applicable: `http://<server-ip>:8929` for direct access, or `https://<your-domain>` behind the Runtipi proxy. The container listens on port `4096`; Runtipi exposes it on port `8929`.

Runtipi generates `APP_SECRET` automatically. Keep this value unchanged: Zerobyte uses it to encrypt sensitive database data. Preserve the secret together with backups of the app's persistent data.

Open the app and create your administrator account on first access.

## Persistent data

Configuration, database, and local repositories are stored in `${APP_DATA_DIR}/data/zerobyte`, mounted at `/var/lib/zerobyte`. Keep this directory on local storage, not a network share. There is no need to create `/var/lib/zerobyte` on the host.

## Mount local backup sources

The Runtipi installation directory is available at `/backups/runtipi-folder` as a read-only backup source. Create a **Directory** volume using this path. Exclude Zerobyte's own persistent data directory from the backup source to avoid backing up its active database and local repositories recursively. Restoring directly into the Runtipi installation is unavailable with this read-only mount.

For additional host directories, use a [Runtipi user configuration](https://www.runtipi.io/docs/guides/customize-app-config) so your mounts survive app-store updates.

1. Create `user-config/<app-store>/zerobyte/docker-compose.yml` under your Runtipi installation, replacing `<app-store>` with this store's folder name from `apps/`.
2. Add the host directory you want to back up:

   ```yaml
   services:
     zerobyte:
       volumes:
         - /path/to/your/documents:/documents:ro
   ```

3. Stop and start Zerobyte through Runtipi to apply the mount.
4. In Zerobyte, create a **Directory** volume using `/documents`, create a backup repository, and schedule a backup job.

Read-only mounts protect source files from modification. Restoring into the original directory requires a writable mount; remove `:ro` only when you need that access. Do not include Zerobyte's own data directory in a source backup.

## Logo source

Icon from the [selfh.st catalog](https://selfh.st/icons/): https://cdn.jsdelivr.net/gh/selfhst/icons/png/zerobyte.png. Converted to a centered 512×512 JPG with a dark gray background.
