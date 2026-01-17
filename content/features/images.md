---
title: 'Images'
description: 'Learn how to manage Docker images with Arcane'
---

<script lang="ts">
import ScreenshotFrame from '$lib/components/screenshot-frame.svelte';
</script>

## What Can You Do With Images in Arcane?

- **View Images:** See a list of all Docker images on your system, including their tags, size, and when they were created.
- **Pull Images:** Download new images from Docker Hub or another registry by entering the image name and tag (like `nginx:latest`).
- **Inspect Images:** Click on an image to see more details, such as its ID, tags, creation date, and configuration.
- **Remove Images:** Delete images you no longer need. Arcane will warn you if an image is in use by a container.
- **Prune Images:** Clean up unused images to free up disk space. You can remove dangling images (those without tags) or all images not used by any container.

## Screenshot

<ScreenshotFrame
  src="/img/screenshots/images-page.png"
  alt="Images page in Arcane"
  caption="Images page in Arcane."
  loading="lazy"
  decoding="async"
/>

## How to Use

### Viewing Images

1. Go to the **Images** section in the sidebar.
2. You'll see a table listing all your Docker images with their tags, size, and creation date.

### Pulling a New Image

1. Click the **Pull Image** button.
2. Enter the image name and tag (for example, `redis:latest`).
3. Click **Pull**. The image will be downloaded and added to your list.

### Inspecting an Image

1. Find the image you want to inspect in the list.
2. Click on its name, ID, or the **Inspect** button to see more details.

### Removing an Image

1. In the images list, find the image you want to remove.
2. Click the **Remove** button (trash icon) next to it.
3. Confirm the deletion in the dialog.

> **Note:** You cannot remove images that are currently used by running containers.

### Pruning Images

1. Click the **Prune Images** button.
2. Choose whether to remove only dangling images or all unused images.
3. Confirm the action to free up disk space.

### Checking for Image Updates

Arcane will indicate when a newer image is available, distinguishing between digest‐only updates and version jumps:

- **Update badge**  
  In the list view, an “Update” badge appears next to any image that has a newer release.

- **Digest update**  
  If the tag hasn’t changed but the image digest has (published with the same tag), you’ll see a **Digest** badge.  
  Hover the badge to view the new digest and date, then click it to pull the updated digest.

- **Automatic refresh**  
  Arcane checks for updates on page load and when you click the **Refresh** icon in the Images toolbar.

## Troubleshooting Updates

- If you don’t see an update badge, ensure Arcane can reach your registry (check your network and credentials).
- Use the **Check Updates** button to force a re‐scan of all images.

### Private Registry Authentication

Arcane will automatically use credentials you configure for private registries when pulling or checking for image updates:

- In the sidebar click **Container Registires** under the Customization section.
- Add or update credentials for your private registry (registry host, username, password or token).
- Arcane stores these securely and applies them whenever it needs to authenticate against that registry.
- When an image reference includes a private hostname, Arcane matches it against your saved credentials.
- You can manage multiple credential entries; Arcane selects the correct one based on the registry host in the image reference.
