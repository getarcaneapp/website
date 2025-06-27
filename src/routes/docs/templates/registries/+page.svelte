<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import * as Code from '$lib/components/ui/code';
	import * as TreeView from '$lib/components/ui/tree-view';
</script>

<ContentWrapper>
	<h1 class="mb-4 text-3xl font-bold">Creating a Custom Template Registry</h1>

	<p class="mb-6">
		Want to share templates with your team or the community? Create your own template registry!
	</p>

	<h2 class="mb-3 text-2xl font-semibold">Overview</h2>
	<p class="mb-6">
		A template registry is simply a JSON file hosted online that describes available templates and
		where to find them.
	</p>

	<h2 class="mb-3 text-2xl font-semibold">Quick Setup</h2>
	<h3 class="mt-8 mb-2 text-xl font-semibold">1. Create Registry Structure</h3>
	<p class="mb-4">Create a JSON manifest file that lists your templates:</p>
	<div class="w-full p-6">
		<Code.Root
			lang="json"
			class="w-full"
			code={`{
    "$schema": "https://templates.arcane.ofkm.dev/schema.json",
    "name": "My Company Templates",
    "description": "Docker templates for internal applications",
    "version": "1.0.0",
    "author": "Your Team",
    "url": "https://github.com/yourcompany/docker-templates",
    "templates": [
        {
            "id": "internal-app",
            "name": "Internal Application",
            "description": "Company application stack with database",
            "version": "1.0.0",
            "author": "DevOps Team",
            "compose_url": "https://raw.githubusercontent.com/yourcompany/docker-templates/main/internal-app/docker-compose.yml",
            "env_url": "https://raw.githubusercontent.com/yourcompany/docker-templates/main/internal-app/.env.example",
            "documentation_url": "https://github.com/yourcompany/docker-templates/tree/main/internal-app",
            "tags": ["internal", "webapp", "postgres"],
            "updated_at": "2024-12-01T10:00:00Z"
        }
    ]
}`}><Code.CopyButton variant="ghost" size="sm" /></Code.Root
		>
	</div>

	<h3 class="mt-8 mb-2 text-xl font-semibold">2. Host Your Files</h3>
	<ul class="mb-6 list-inside list-disc space-y-2">
		<li>
			<strong>Option A: GitHub (Recommended)</strong>
			<ol class="mt-2 list-decimal space-y-1 pl-6">
				<li>Create a GitHub repository</li>
				<li>Add your <code class="bg-muted rounded px-1 py-0.5">registry.json</code> file</li>
				<li>
					Add template directories with <code class="bg-muted rounded px-1 py-0.5"
						>docker-compose.yml</code
					> files
				</li>
				<li>Use raw GitHub URLs for file access</li>
			</ol>
		</li>
		<li>
			<strong>Option B: Web Server</strong>
			<ul class="mt-2 list-disc pl-6">
				<li>
					Host <code class="bg-muted rounded px-1 py-0.5">registry.json</code> on any web server
				</li>
				<li>Ensure HTTPS access</li>
				<li>Enable CORS if needed</li>
			</ul>
		</li>
	</ul>

	<h3 class="mt-8 mb-2 text-xl font-semibold">3. Template File Structure</h3>
	<p class="mb-4">For each template, create a directory with:</p>
	<div class="mb-6 h-40 w-72">
		<TreeView.Root>
			<TreeView.Folder name="your-template">
				<TreeView.File name="docker-compose.yml" />
				<TreeView.File name=".env.example" />
				<TreeView.File name="README.md" />
			</TreeView.Folder>
		</TreeView.Root>
	</div>

	<h2 class="mb-3 text-2xl font-semibold">Registry JSON Reference</h2>
	<h3 class="mt-8 mb-2 text-xl font-semibold">Required Fields</h3>
	<ul class="mb-6 list-inside list-disc space-y-1">
		<li><code class="bg-muted rounded px-1 py-0.5">name</code>: Registry display name</li>
		<li><code class="bg-muted rounded px-1 py-0.5">description</code>: Brief description</li>
		<li><code class="bg-muted rounded px-1 py-0.5">version</code>: Registry version</li>
		<li><code class="bg-muted rounded px-1 py-0.5">templates</code>: Array of template objects</li>
	</ul>

	<h3 class="mt-8 mb-2 text-xl font-semibold">Template Object Fields</h3>
	<p class="mb-2 font-semibold">Required:</p>
	<ul class="mb-4 list-inside list-disc space-y-1">
		<li>
			<code class="bg-muted rounded px-1 py-0.5">id</code>: Unique identifier (alphanumeric,
			hyphens, underscores)
		</li>
		<li><code class="bg-muted rounded px-1 py-0.5">name</code>: Display name</li>
		<li><code class="bg-muted rounded px-1 py-0.5">description</code>: What the template does</li>
		<li>
			<code class="bg-muted rounded px-1 py-0.5">compose_url</code>: Direct URL to
			docker-compose.yml file
		</li>
		<li><code class="bg-muted rounded px-1 py-0.5">version</code>: Template version</li>
		<li><code class="bg-muted rounded px-1 py-0.5">updated_at</code>: ISO 8601 timestamp</li>
	</ul>
	<p class="mb-2 font-semibold">Optional:</p>
	<ul class="mb-6 list-inside list-disc space-y-1">
		<li><code class="bg-muted rounded px-1 py-0.5">author</code>: Template creator</li>
		<li><code class="bg-muted rounded px-1 py-0.5">tags</code>: Array of keywords</li>
		<li><code class="bg-muted rounded px-1 py-0.5">env_url</code>: URL to .env example file</li>
		<li><code class="bg-muted rounded px-1 py-0.5">documentation_url</code>: Link to docs</li>
		<li><code class="bg-muted rounded px-1 py-0.5">icon_url</code>: Template icon</li>
	</ul>

	<h2 class="mb-3 text-2xl font-semibold">Example Repository Structure</h2>
	<div class="bg-muted mb-6 w-full max-w-md overflow-x-auto rounded p-4">
		<TreeView.Root>
			<TreeView.Folder name="docker-templates">
				<TreeView.File name="registry.json" />
				<TreeView.Folder name="wordpress">
					<TreeView.File name="docker-compose.yml" />
					<TreeView.File name=".env.example" />
					<TreeView.File name="README.md" />
				</TreeView.Folder>
				<TreeView.Folder name="nextcloud">
					<TreeView.File name="docker-compose.yml" />
					<TreeView.File name=".env.example" />
					<TreeView.File name="README.md" />
				</TreeView.Folder>
				<TreeView.Folder name="nginx-proxy">
					<TreeView.File name="docker-compose.yml" />
					<TreeView.File name="README.md" />
				</TreeView.Folder>
			</TreeView.Folder>
		</TreeView.Root>
	</div>

	<h2 class="mb-3 text-2xl font-semibold">Testing Your Registry</h2>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li><strong>Validate JSON:</strong> Use a JSON validator to check syntax</li>
		<li><strong>Test URLs:</strong> Ensure all file URLs are accessible</li>
		<li><strong>Add to Arcane:</strong> Settings → Templates → Add Registry</li>
		<li><strong>Verify:</strong> Check that templates appear and can be downloaded</li>
	</ol>

	<h2 class="mb-3 text-2xl font-semibold">Best Practices</h2>
	<h3 class="mt-8 mb-2 text-xl font-semibold">Template Quality</h3>
	<ul class="mb-6 list-inside list-disc space-y-1">
		<li>Use specific image tags (not <code class="bg-muted rounded px-1 py-0.5">latest</code>)</li>
		<li>Include health checks</li>
		<li>Add restart policies</li>
		<li>Document required environment variables</li>
		<li>Test templates before publishing</li>
	</ul>
	<h3 class="mt-8 mb-2 text-xl font-semibold">Registry Management</h3>
	<ul class="mb-6 list-inside list-disc space-y-1">
		<li>Version your templates and registry</li>
		<li>Keep documentation current</li>
		<li>Use semantic versioning</li>
		<li>Regular updates and maintenance</li>
		<li>Monitor for security updates</li>
	</ul>
	<h3 class="mt-8 mb-2 text-xl font-semibold">Security</h3>
	<ul class="mb-6 list-inside list-disc space-y-1">
		<li>Use HTTPS for all URLs</li>
		<li>Validate environment variable examples</li>
		<li>Don't include sensitive data in examples</li>
		<li>Consider image security scanning</li>
	</ul>

	<h2 class="mb-3 text-2xl font-semibold">GitHub Example</h2>
	<p class="mb-4">Here's a minimal GitHub setup:</p>
	<ol class="mb-6 list-decimal space-y-2 pl-6">
		<li>
			<strong>Create repository:</strong>
			<code class="bg-muted rounded px-1 py-0.5">my-docker-templates</code>
		</li>
		<li>
			<strong>Add registry.json:</strong>
			<div class="mt-2 w-full p-6">
				<Code.Root
					lang="json"
					class="w-full"
					code={`{
    "$schema": "https://templates.arcane.ofkm.dev/schema.json",
    "name": "My Templates",
    "description": "Custom Docker templates",
    "version": "1.0.0",
    "templates": [...]
}`}><Code.CopyButton variant="ghost" size="sm" /></Code.Root
				>
			</div>
		</li>
		<li>
			<strong>Registry URL:</strong>
			<code class="bg-muted rounded px-1 py-0.5"
				>https://raw.githubusercontent.com/username/my-docker-templates/main/registry.json</code
			>
		</li>
	</ol>

	<h2 class="mb-3 text-2xl font-semibold">Community Registry</h2>
	<p class="mb-6">
		Don't want to maintain your own? Contribute to our community registry:<br />
		<strong>GitHub:</strong>
		<a
			class="text-primary underline"
			href="https://github.com/ofkm/arcane-templates"
			target="_blank"
			rel="noopener">https://github.com/ofkm/arcane-templates</a
		><br />
		Submit pull requests to add your templates to the community collection!
	</p>

	<h2 class="mb-3 text-2xl font-semibold">Troubleshooting</h2>
	<p class="mb-2 font-semibold">Registry not loading?</p>
	<ul class="mb-4 list-inside list-disc space-y-1">
		<li>Check JSON syntax</li>
		<li>Verify URL accessibility</li>
		<li>Ensure HTTPS protocol</li>
		<li>Check CORS headers if using custom domain</li>
	</ul>
	<p class="mb-2 font-semibold">Templates not downloading?</p>
	<ul class="mb-8 list-inside list-disc space-y-1">
		<li>Verify file URLs are direct download links</li>
		<li>Check that files exist at specified URLs</li>
		<li>Ensure proper file permissions are set</li>
		<li>Look for errors in the browser console</li>
	</ul>
</ContentWrapper>
