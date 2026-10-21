# weserv/images

weserv/images is a self-hosted image proxy for resizing, cropping, converting, and optimizing images on demand. It is compatible with the weserv/images HTTP API.

The app persists the Nginx image cache in `${APP_DATA_DIR}/data/proxy_cache` and changes the cache inactivity period to 3 days at startup. The cache has a 1 GB maximum size; items may be evicted sooner if the cache fills before the 3-day inactivity period.

The service fetches source images from URLs supplied in requests. Keep it on a trusted network and avoid exposing it publicly without an access-control layer.

- **Project:** [weserv/images](https://github.com/weserv/images)
- **Container:** [ghcr.io/weserv/images](https://github.com/weserv/images/pkgs/container/images)
- **Image tag:** `5.x`
- **Icon source:** [weserv logo](https://wsrv.nl/logo-dark.svg), on a dark gray background.
