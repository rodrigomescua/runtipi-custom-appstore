## Cedalo Management Center

[Cedalo Management Center](https://github.com/cedalo/management-center) allows to easily manage, monitor and inspect instances of Eclipse Mosquitto. There are some pro features that can only be activated by getting a license from cedalo.

![cedalo_mgm_center.png](https://github.com/runtipi/runtipi-appstore/blob/master/apps/eclipse-mosquitto/metadata/cedalo_mgm_center.png)

By default the following features are provided:

- A system dashboard to view key figures, showing broker traffic, license and client infos.
- Table of clients, which have connected to the broker, for inspection purposes.
- A topic tree, displaying those topics that have been addressed, while the MMC is running.
- Management of broker security allowing to modify clients, group and roles.
- A terminal to execute commands related to the dynamic security API
- Management Center infos and settings

The access to the broker is handled by the [dynamic-security plugin](https://mosquitto.org/documentation/dynamic-security/) in the mosquitto broker. The configuration is stored in the file `/runtipi/app-date/eclipse-mosquitto/data/config/dynamic-security.json`. This file is generated during the first launch of the the mosquitto image.

## Links

### More information about the management center is available at the following locations:

- Main homepage: [https://cedalo.com/mqtt-broker-pro-mosquitto/](https://cedalo.com/mqtt-broker-pro-mosquitto/)
- Documentation: [https://docs.cedalo.com/mosquitto/management-center/introduction](https://docs.cedalo.com/mosquitto/management-center/introduction)
- Source code repository: [https://github.com/cedalo/management-center](https://github.com/cedalo/management-center)
