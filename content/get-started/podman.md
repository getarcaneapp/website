---
title: 'Podman'
description: 'Use Arcane with rootless Podman through Compose or a systemd Quadlet.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
</script>

> [!NOTE]
> Arcane manages Podman through its Docker-compatible API. The Manager and every
> container it creates remain rootless when the socket belongs to a rootless
> Podman user.

## 1. Enable the rootless Podman socket

```bash
systemctl --user enable --now podman.socket
loginctl enable-linger "$USER"
```

Lingering starts your user systemd manager at boot without requiring an
interactive login.

The socket is available at `%t/podman/podman.sock` in a user systemd unit, which
normally resolves to `/run/user/<UID>/podman/podman.sock`.

## 2. Choose how to run Arcane

### Option A: Podman Compose

Follow the <Link href="/docs/get-started/installation">Installation</Link> guide,
then replace the Docker socket mount with your rootless Podman socket:

```diff
services:
  arcane:
    volumes:
-     - /var/run/docker.sock:/var/run/docker.sock
+     - /run/user/USER/podman/podman.sock:/var/run/docker.sock
```

Replace `USER` with your numeric user ID.

If you are on Windows 11 with Podman Desktop, the socket is exposed inside the
VM and this mount has been used successfully:

```yaml
services:
  arcane:
    volumes:
      - /run/podman/podman.sock:/var/run/docker.sock
      - arcane-data:/app/data
```

### Option B: Rootless Quadlet (mind the arcane self-update limitation below)

A Quadlet lets the user systemd manager own Arcane's lifecycle. This starts
Arcane automatically after reboot and restarts it if the Manager exits. The
example below is a direct translation of the recommended Docker Compose setup:

| Docker Compose            | Quadlet                      |
| ------------------------- | ---------------------------- |
| `image`                   | `Image`                      |
| `container_name`          | `ContainerName`              |
| `ports`                   | `PublishPort`                |
| `volumes`                 | `Volume`                     |
| `environment`             | `Environment` and `Secret`   |
| `cgroup: host`            | `PodmanArgs=--cgroupns=host` |
| `restart: unless-stopped` | systemd `Restart=always`     |

First, generate the encryption key, keep a protected recovery copy, and import
it as a Podman secret:

```bash
openssl rand -hex 32 | podman secret create arcane-encryption-key -
# Read the created secret. Make sure you saved it somewhere externally
podman secret inspect --showsecret --format '{{.SecretData}}' arcane-encryption-key
```

> [!IMPORTANT]
> Back up the encryption key securely. Arcane cannot recover encrypted database
> values if both the Podman secret and your recovery copy are lost.

Create the Quadlet directory and
`~/.config/containers/systemd/arcane.container`:

```ini
[Unit]
Description=Arcane Manager (rootless Podman)
Documentation=https://getarcane.app/docs/get-started/podman
Requires=podman.socket
After=podman.socket

[Container]
Image=ghcr.io/getarcaneapp/manager:latest
ContainerName=arcane
Pull=missing
AutoUpdate=registry

# Required for a direct Podman socket mount on SELinux hosts.
SecurityLabelDisable=true

# Helps Arcane identify its own container.
PodmanArgs=--cgroupns=host

PublishPort=3552:3552
Volume=%t/podman/podman.sock:/var/run/docker.sock
Volume=arcane-data:/app/data
# Optional host project mount, matching the Compose example:
# Volume=/path/to/projects:/app/data/projects
Secret=arcane-encryption-key,type=mount,target=/run/secrets/arcane-key,mode=0444

Environment=APP_URL=http://localhost:3552
Environment=PUID=1000
Environment=PGID=1000
Environment=ENCRYPTION_KEY_FILE=/run/secrets/arcane-key

# Use exec form: the Arcane image intentionally has no /bin/sh.
HealthCmd=["./arcane","health","--timeout","2s"]
HealthInterval=10s
HealthTimeout=3s
HealthRetries=5
HealthStartPeriod=15s
Notify=healthy

[Service]
Restart=always
TimeoutStartSec=900
TimeoutStopSec=70

[Install]
WantedBy=default.target
```

Change `APP_URL` to the URL used by your browser. To keep Arcane private behind
a local reverse proxy, change `PublishPort` to `127.0.0.1:3552:3552`.

> [!WARNING]
> `SecurityLabelDisable=true` disables SELinux label separation for the Manager
> so it can use the rootless Podman socket. The socket grants Arcane control of
> every container owned by this Linux user. Use a dedicated unprivileged user
> and do not give that user unrelated workloads or files.

Load and start the Quadlet, then enable Podman's user auto-update timer:

```bash
systemctl --user daemon-reload
systemctl --user start arcane.service
systemctl --user enable --now podman-auto-update.timer
systemctl --user status arcane.service
```

The `[Install]` section makes the generated service part of the user
`default.target`; `systemctl --user is-enabled arcane.service` reports
`generated`.

`AutoUpdate=registry` makes Podman check the declared `latest` tag and restart
`arcane.service` through systemd when its registry digest changes. The timer
runs daily at midnight. Podman rolls back to the previous image by default if
the health-gated service restart fails.

Check for an update without applying it, or trigger an immediate update:

```bash
podman auto-update --dry-run
systemctl --user start podman-auto-update.service
```

Manage the Arcane Manager with `systemctl --user` and Podman auto-update, not
with Arcane's own container actions. Do not use Arcane's self-upgrade action for
a Quadlet-managed Manager because it recreates the container outside systemd.

Auto-update follows the tag declared by `Image`. If you replace `latest` with an
immutable version tag, update that tag in the Quadlet and restart the service
manually.

### Optional: Allow rootless containers to publish ports 80 and 443

Linux normally restricts ports below 1024 to root. Lower the unprivileged-port threshold if rootless containers must publish HTTP or HTTPS directly:

```bash
echo 'net.ipv4.ip_unprivileged_port_start=80' |
  sudo tee /etc/sysctl.d/99-rootless-ports.conf

sudo sysctl --system
```

Verify:

```bash
sysctl net.ipv4.ip_unprivileged_port_start
```

Expected:

```text
net.ipv4.ip_unprivileged_port_start = 80
```

> This is host-wide: every unprivileged user can bind ports 80 and above. It is unnecessary when using only ports such as Arcane’s `3552`.

## 3. Restore managed containers after reboot

The Quadlet restores the Arcane Manager itself. To also restore Arcane-managed
containers that use `restart: always` or `restart: unless-stopped`, enable
Podman's user restart service:

```bash
systemctl --user enable --now podman-restart.service
```

Arcane does not automatically deploy stopped Compose projects when it starts.
Set an appropriate restart policy in each project's Compose file.

## 4. Verify rootless operation

```bash
podman info --format '{{.Host.Security.Rootless}}'
systemctl --user is-active podman.socket arcane.service podman-auto-update.timer
podman inspect arcane --format '{{.State.Health.Status}}'
```

The first command must print `true`, all listed units must be active, and the
Manager container must report `healthy`.

## 5. Limitations

Arcane manages Podman containers through the socket's Docker-compatible API.
Podman-specific features such as Pods and Quadlets are not exposed through that
API, so Arcane cannot create or edit them. Running the Arcane Manager itself as
a Quadlet does not change that limitation.
