---
title: 'Podman'
description: 'Use Arcane with rootless Podman through Compose or a systemd Quadlet.'
---

> [!NOTE]
> Arcane can manage Podman instead of Docker by talking to Podman's Docker-compatible API socket. When that socket belongs to a rootless Podman user, Arcane and every container it creates stay rootless.

## 1. Enable the rootless Podman socket

```bash
systemctl --user enable --now podman.socket
loginctl enable-linger "$USER"
```

Lingering starts your user's systemd manager at boot, so your user services run without an interactive login.

The socket is at `/run/user/<UID>/podman/podman.sock`. In a user systemd unit you can write this as `%t/podman/podman.sock`, where `%t` expands to the user's runtime directory (`/run/user/<UID>`).

## 2. Choose how to run Arcane

### Option A: Podman Compose

Follow the [Installation](/docs/get-started/installation) guide, then replace the Docker socket mount with your rootless Podman socket:

```diff
services:
  arcane:
    volumes:
-     - /var/run/docker.sock:/var/run/docker.sock
+     - /run/user/<UID>/podman/podman.sock:/var/run/docker.sock
```

Replace `<UID>` with your numeric user ID (`id -u`).

On Windows 11 with Podman Desktop, the socket is exposed inside the Podman VM and this mount is known to work:

```yaml
services:
  arcane:
    volumes:
      - /run/podman/podman.sock:/var/run/docker.sock
      - arcane-data:/app/data
```

### Option B: Rootless Quadlet

A Quadlet is a `.container` file that Podman turns into a systemd service. Running Arcane as a Quadlet lets your user's systemd manager start it after reboot and restart it if it exits. Arcane can't update itself in this setup; see [Update Arcane in a Quadlet](#update-arcane-in-a-quadlet).

The Quadlet below translates the Docker Compose setup:

| Docker Compose            | Quadlet                      |
| ------------------------- | ---------------------------- |
| `image`                   | `Image`                      |
| `container_name`          | `ContainerName`              |
| `ports`                   | `PublishPort`                |
| `volumes`                 | `Volume`                     |
| `environment`             | `Environment` and `Secret`   |
| `cgroup: host`            | `PodmanArgs=--cgroupns=host` |
| `restart: unless-stopped` | systemd `Restart=always`     |

1. Generate the encryption key and store it as a Podman secret:

   ```bash
   openssl rand -hex 32 | podman secret create arcane-encryption-key -
   ```

2. Print the secret and save a copy somewhere outside this host:

   ```bash
   podman secret inspect --showsecret --format '{{.SecretData}}' arcane-encryption-key
   ```

   > [!IMPORTANT]
   > If both the Podman secret and your copy are lost, Arcane can't decrypt the encrypted values in its database.

3. Create `~/.config/containers/systemd/arcane.container` (create the directory if it doesn't exist):

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
   Secret=arcane-encryption-key,type=mount,target=/run/secrets/arcane-key,mode=0444

   Environment=APP_URL=http://localhost:3552
   Environment=PUID=1000
   Environment=PGID=1000
   Environment=ENCRYPTION_KEY_FILE=/run/secrets/arcane-key

   # Use exec form: the Arcane image has no /bin/sh.
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

   Change `APP_URL` to the URL your browser uses. To keep Arcane private behind a local reverse proxy, change `PublishPort` to `127.0.0.1:3552:3552`.

   To manage projects from a host folder, add a matching mount and path, as described in [Installation](/docs/get-started/installation):

   ```ini
   Volume=/opt/docker:/opt/docker
   Environment=PROJECTS_DIRECTORY=/opt/docker
   ```

4. Load and start the Quadlet, and enable Podman's auto-update timer:

   ```bash
   systemctl --user daemon-reload
   systemctl --user start arcane.service
   systemctl --user enable --now podman-auto-update.timer
   systemctl --user status arcane.service
   ```

   The `[Install]` section already adds the service to `default.target`, so there's nothing to `enable`.

> [!WARNING]
> `SecurityLabelDisable=true` turns off SELinux label separation for the Arcane container so it can use the Podman socket. That socket gives Arcane control of every container owned by this Linux user, so run Arcane under a dedicated unprivileged user with no unrelated workloads or files.

### Update Arcane in a Quadlet

Update a Quadlet-managed Arcane with Podman auto-update, not Arcane's own update action. Arcane's update action recreates the container outside systemd.

`AutoUpdate=registry` makes Podman check the `Image` tag once a day (at midnight) and restart `arcane.service` when the image digest (the content hash of the image) changes. If the restarted service doesn't become healthy, Podman rolls back to the previous image. To check for an update without applying it, or to update now:

```bash
podman auto-update --dry-run
systemctl --user start podman-auto-update.service
```

If you pin `Image` to a specific version tag, change the tag in the Quadlet and restart the service yourself.

### Allow rootless containers to use ports 80 and 443

Linux only lets root bind ports below 1024. To let rootless containers publish HTTP or HTTPS directly, lower the threshold:

```bash
echo 'net.ipv4.ip_unprivileged_port_start=80' |
  sudo tee /etc/sysctl.d/99-rootless-ports.conf

sudo sysctl --system
```

Check that it applied:

```bash
sysctl net.ipv4.ip_unprivileged_port_start
```

It should print `net.ipv4.ip_unprivileged_port_start = 80`.

This applies host-wide to every unprivileged user, and isn't needed for ports such as Arcane's `3552`.

## 3. Restore managed containers after reboot

The Quadlet restarts Arcane itself. To also restart Arcane-managed containers that use `restart: always` or `restart: unless-stopped`, enable Podman's user restart service:

```bash
systemctl --user enable --now podman-restart.service
```

Arcane doesn't deploy stopped Compose projects when it starts, so set a restart policy in each project's Compose file.

## 4. Verify rootless operation

```bash
podman info --format '{{.Host.Security.Rootless}}'
systemctl --user is-active podman.socket arcane.service podman-auto-update.timer
podman inspect arcane --format '{{.State.Health.Status}}'
```

The first command must print `true`, every unit must be `active`, and the Arcane container must report `healthy`.

## Limitations

Arcane manages Podman through its Docker-compatible API. Podman-only features such as pods and Quadlets aren't part of that API, so Arcane can't create or edit them. Running Arcane itself as a Quadlet doesn't change that.
