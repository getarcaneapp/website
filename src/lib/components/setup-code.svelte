<script lang="ts">
	import * as Code from '$lib/components/ui/code/index.js';

	const composeFile = `services:
  arcane:
    image: ghcr.io/getarcaneapp/manager:latest
    container_name: arcane
    ports:
      - '3552:3552'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
    environment:
      - ENCRYPTION_KEY=your-32-char-encryption-key
      - JWT_SECRET=your-jwt-secret
      - TZ=UTC
    cgroup: host
    restart: unless-stopped

volumes:
  arcane-data:`;
</script>

<Code.Root lang="yaml" class="m-4 w-full" code={composeFile}>
	<Code.CopyButton size="sm" variant="ghost" />
</Code.Root>
