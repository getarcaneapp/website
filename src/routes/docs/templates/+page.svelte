<script lang="ts">
	import DocsLayout from '$lib/components/DocsLayout.svelte';
	import * as Code from '$lib/components/ui/code';
</script>

<DocsLayout>
	<h1 class="mb-4 text-3xl font-bold">Using Templates</h1>

	<p class="mb-6">
		Templates help you quickly deploy common applications and services with Docker Compose. Arcane
		supports both local templates and remote registries.
	</p>

	<h2 class="mb-3 text-2xl font-semibold">Quick Start</h2>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li><strong>Create a new stack</strong> → Click <strong>New Stack</strong></li>
		<li><strong>Choose a template</strong> → Click <strong>Choose Template</strong> button</li>
		<li><strong>Select your template</strong> → Browse local or remote templates</li>
		<li><strong>Configure and deploy</strong> → Customize settings and create your stack</li>
	</ol>

	<h2 class="mb-3 text-2xl font-semibold">Template Types</h2>
	<h3 class="mt-8 mb-2 text-xl font-semibold">Local Templates</h3>
	<ul class="mb-6 list-inside list-disc space-y-1">
		<li>
			Stored on your system in <code class="bg-muted rounded px-1 py-0.5"
				>data/templates/compose/</code
			>
		</li>
		<li>Always available, even offline</li>
		<li>Perfect for custom or frequently used configurations</li>
	</ul>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Remote Templates</h3>
	<ul class="mb-6 list-inside list-disc space-y-1">
		<li>Downloaded from online registries</li>
		<li>Community-maintained and regularly updated</li>
		<li>Can be used immediately or downloaded for offline use</li>
	</ul>

	<h2 class="mb-3 text-2xl font-semibold">Using the Template Dialog</h2>
	<p class="mb-4">
		When you click <strong>Choose Template</strong>, you'll see:
	</p>
	<ul class="mb-6 list-inside list-disc space-y-1">
		<li><strong>Local Templates:</strong> Ready to use immediately</li>
		<li>
			<strong>Remote Templates:</strong> Two options for each:
			<ul class="mt-1 list-disc space-y-1 pl-6">
				<li><strong>Use Now:</strong> Load template content directly into your stack</li>
				<li><strong>Download:</strong> Save template locally for future offline use</li>
			</ul>
		</li>
		<li>
			Templates with environment files will show an <strong>ENV</strong> badge and include pre-configured
			variables.
		</li>
	</ul>

	<h2 class="mb-3 text-2xl font-semibold">Adding Local Templates</h2>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>
			Navigate to <code class="bg-muted rounded px-1 py-0.5">data/templates/compose/</code> in your Arcane
			directory
		</li>
		<li>
			Add your Docker Compose files (<code class="bg-muted rounded px-1 py-0.5">.yaml</code> or
			<code class="bg-muted rounded px-1 py-0.5">.yml</code>)
		</li>
		<li>
			Optionally add matching <code class="bg-muted rounded px-1 py-0.5">.env</code> files for environment
			variables
		</li>
		<li>Templates appear automatically in the template dialog</li>
	</ol>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Example Structure</h3>
	<div class="w-full p-6">
		<Code.Root
			lang="diff"
			class="w-full"
			code={`data/templates/compose/
├── wordpress.yaml
├── wordpress.env
├── nextcloud.yaml
└── postgres.yaml`}
		>
			<Code.CopyButton variant="ghost" size="sm" />
		</Code.Root>
	</div>

	<h2 class="mb-3 text-2xl font-semibold">Community Registry</h2>
	<p class="mb-4">
		Don't want to create your own? Use our community registry with pre-built templates:
	</p>
	<p class="mb-4">
		<strong>Registry URL:</strong>
		<code class="bg-muted rounded px-1 py-0.5">https://templates.arcane.ofkm.dev</code>
	</p>
	<p class="mb-6">
		Add this in <strong>Settings → Templates → Add Registry</strong> to get started instantly with popular
		applications.
	</p>

	<h2 class="mb-3 text-2xl font-semibold">Template Format</h2>
	<p class="mb-4">Templates use standard Docker Compose format:</p>
	<div class="w-full p-6">
		<Code.Root
			lang="yaml"
			class="w-full"
			code={`# WordPress with MySQL
version: '3.8'

services:
  wordpress:
    image: wordpress:latest
    ports:
      - '\${WP_PORT:-8080}:80'
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: \${DB_USER}
      WORDPRESS_DB_PASSWORD: \${DB_PASSWORD}

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: \${DB_USER}
      MYSQL_PASSWORD: \${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}
`}
		>
			<Code.CopyButton variant="ghost" size="sm" />
		</Code.Root>
	</div>

	<h2 class="mb-3 text-2xl font-semibold">Environment Variables</h2>
	<p class="mb-4">
		Create matching <code class="bg-muted rounded px-1 py-0.5">.env</code> files for default values:
	</p>
	<div class="w-full p-6">
		<Code.Root
			lang="bash"
			class="w-full"
			code={`# wordpress.env
DB_USER=wordpress
DB_PASSWORD=secure_password_here
DB_ROOT_PASSWORD=root_password_here
WP_PORT=8080`}
		>
			<Code.CopyButton variant="ghost" size="sm" />
		</Code.Root>
	</div>

	<h2 class="mb-3 text-2xl font-semibold">Tips</h2>
	<ul class="mb-8 list-inside list-disc space-y-1">
		<li>Use environment variables for configurable values</li>
		<li>Add comments to describe what the template does</li>
		<li>Include health checks for production services</li>
		<li>
			Use specific image tags instead of <code class="bg-muted rounded px-1 py-0.5">latest</code> for
			stability
		</li>
		<li>Test templates before sharing with others</li>
	</ul>

	<p class="mb-8">
		Need help? Check out our
		<a
			class="text-primary underline"
			href="https://github.com/ofkm/arcane-templates"
			target="_blank"
			rel="noopener">community registry examples</a
		>
		for inspiration!
	</p>
</DocsLayout>
