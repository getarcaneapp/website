<script lang="ts">
	import * as Code from '$lib/components/ui/code/index.js';

	const composeFile = `services:
  arcane:
    image: ghcr.io/ofkm/arcane:latest
    container_name: arcane
    ports:
      - '8080:8080'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - arcane-data:/app/data
    environment:
      - PUID=1000
      - PGID=1000
      - DATABASE_URL=sqlite:///app/data/arcane.db
      - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
      - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxx
    restart: unless-stopped

volumes:
  arcane-data:
    driver: local`;
</script>

<Code.Root lang="yaml" class="m-4 w-full" code={composeFile}>
	<Code.CopyButton size="sm" variant="ghost" />
</Code.Root>
