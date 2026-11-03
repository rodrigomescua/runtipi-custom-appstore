# weserv/images

weserv/images is a self-hosted image proxy for resizing, cropping, converting, and optimizing images on demand. It is compatible with the weserv/images HTTP API.

The app persists the Nginx image cache in `${APP_DATA_DIR}/data/proxy_cache` and caches eligible responses on the first request. The cache inactivity period is 3 days and its maximum size is 5 GB; items may be evicted sooner if the cache fills before the 3-day inactivity period.

The service uses `192.168.0.20` for DNS, disables IPv6 DNS lookups, and permits fetching images from private IPv4 networks. Anyone with access can request resources on those networks. Keep it on a trusted network and avoid exposing it publicly without an access-control layer.

- **Project:** [weserv/images](https://github.com/weserv/images)
- **Container:** [ghcr.io/weserv/images](https://github.com/weserv/images/pkgs/container/images)
- **Image tag:** `5.x`
- **Icon source:** [weserv logo](https://wsrv.nl/logo-dark.svg), on a dark gray background.
