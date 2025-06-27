<script lang="ts">
	import DocsLayout from '$lib/components/DocsLayout.svelte';
	import * as Code from '$lib/components/ui/code';
	import { Snippet } from '$lib/components/ui/snippet';

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
    driver: local
`;
</script>

<DocsLayout>
	<h1 class="mb-4 text-3xl font-bold">Quick Start Guide</h1>
	<p class="text-muted-foreground mb-6">Get Arcane running fast with Docker Compose.</p>

	<h2 class="mb-4 text-2xl font-semibold">Steps</h2>

	<!-- Step 1 -->
	<div class="mb-8">
		<h3 class="mb-2 text-xl font-semibold">
			1. Create <code
				class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
			>
				docker-compose.yml
			</code>:
		</h3>
		<Code.Root lang="yaml" class="w-full" code={composeFile}>
			<Code.CopyButton size="sm" variant="ghost" />
		</Code.Root>
	</div>

	<!-- Step 2 -->
	<div class="mb-8">
		<h3 class="mb-2 text-xl font-semibold">2. Review Volumes &amp; Imports:</h3>
		<p class="mb-2">
			<code
				class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
			>
				/var/run/docker.sock
			</code>: Lets Arcane manage Docker.
		</p>
		<p class="mb-4">
			<code
				class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
				>arcane-data</code
			>: Persists settings, stacks, users, etc.
		</p>
		<p class="mb-2">
			To import existing stacks, add a mount where your existing stacks are located:
		</p>
		<Snippet text="/host/path/to/stacks:/host/path/to/stacks:ro" class="mb-2 w-full" />
		<p class="text-muted-foreground">
			Use <code
				class="bg-muted text-muted-foreground relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
				>:ro</code
			> for read-only access.
		</p>
	</div>

	<!-- Step 3 -->
	<div class="mb-8">
		<h3 class="mb-2 text-xl font-semibold">3. Start Arcane:</h3>
		<Snippet text="docker compose up -d" class="w-full" />
	</div>

	<!-- Step 4 -->
	<div class="mb-8">
		<h3 class="mb-2 text-xl font-semibold">4. Access Arcane:</h3>
		<p>
			Go to <a href="http://localhost:8080" class="text-primary underline">http://localhost:8080</a>
			in your browser and follow the setup.
		</p>
	</div>
</DocsLayout>
