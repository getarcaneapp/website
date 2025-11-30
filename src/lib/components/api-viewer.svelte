<script lang="ts">
	import { onMount } from 'svelte';
	import yaml from 'js-yaml';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { indexOpenApi, filterIndexed } from '$lib/utils/api-util.js';

	interface Props {
		src?: string;
	}

	let { src = '/apiref/swagger.yaml' }: Props = $props();

	interface OpenAPISpec {
		info?: {
			title?: string;
			version?: string;
			description?: string;
		};
		paths?: Record<string, Record<string, any>>;
		definitions?: Record<string, any>;
		tags?: Array<{ name: string; description?: string }>;
	}

	let spec: OpenAPISpec | null = $state(null);
	let loading = $state(true);
	let error: string | null = $state(null);
	let index = $state<ReturnType<typeof indexOpenApi> | null>(null);
	let search = $state('');
	let selectedTags = $state<Set<string>>(new Set());
	let filtered = $derived(index ? filterIndexed(index, search, selectedTags) : null);
	let copiedPath: string | null = $state(null);

	onMount(async () => {
		try {
			const response = await fetch(src);
			const specText = await response.text();
			spec = yaml.load(specText) as OpenAPISpec;
			index = indexOpenApi(spec);
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load OpenAPI spec';
			loading = false;
		}
	});

	function getMethodStyles(method: string): { bg: string; text: string; border: string } {
		const styles: Record<string, { bg: string; text: string; border: string }> = {
			get: {
				bg: 'bg-blue-500/10 dark:bg-blue-500/20',
				text: 'text-blue-700 dark:text-blue-400',
				border: 'border-blue-500/30',
			},
			post: {
				bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
				text: 'text-emerald-700 dark:text-emerald-400',
				border: 'border-emerald-500/30',
			},
			put: {
				bg: 'bg-amber-500/10 dark:bg-amber-500/20',
				text: 'text-amber-700 dark:text-amber-400',
				border: 'border-amber-500/30',
			},
			patch: {
				bg: 'bg-violet-500/10 dark:bg-violet-500/20',
				text: 'text-violet-700 dark:text-violet-400',
				border: 'border-violet-500/30',
			},
			delete: {
				bg: 'bg-red-500/10 dark:bg-red-500/20',
				text: 'text-red-700 dark:text-red-400',
				border: 'border-red-500/30',
			},
		};
		return styles[method.toLowerCase()] || { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
	}

	function formatPropertyType(property: any): string {
		if (property.type) {
			if (property.type === 'array' && property.items) {
				return `${property.type}<${formatPropertyType(property.items)}>`;
			}
			return property.type;
		}
		if (property.$ref) {
			return property.$ref.split('/').pop() || 'object';
		}
		return 'unknown';
	}

	// Resolve $ref references in schemas
	function resolveRef(ref: string): any {
		if (!spec?.definitions || !ref.startsWith('#/definitions/')) return null;
		const defName = ref.replace('#/definitions/', '');
		return spec.definitions[defName] || null;
	}

	// Recursively resolve all $ref in a schema object
	function resolveSchema(schema: any, depth = 0): any {
		if (!schema || depth > 5) return schema; // Limit depth to prevent infinite loops

		if (schema.$ref) {
			const resolved = resolveRef(schema.$ref);
			if (resolved) {
				return resolveSchema(resolved, depth + 1);
			}
			return schema;
		}

		if (schema.type === 'array' && schema.items) {
			return {
				...schema,
				items: resolveSchema(schema.items, depth + 1),
			};
		}

		if (schema.properties) {
			const resolvedProps: Record<string, any> = {};
			for (const [key, value] of Object.entries(schema.properties)) {
				resolvedProps[key] = resolveSchema(value as any, depth + 1);
			}
			return {
				...schema,
				properties: resolvedProps,
			};
		}

		if (schema.additionalProperties) {
			return {
				...schema,
				additionalProperties: resolveSchema(schema.additionalProperties, depth + 1),
			};
		}

		return schema;
	}

	// Get a friendly display name from a $ref
	function getRefName(ref: string): string {
		const name = ref.split('/').pop() || 'object';
		// Clean up long names like "github_com_getarcaneapp_arcane_backend_internal_dto.Paginated-dto_ProjectDetailsDto"
		if (name.includes('.')) {
			return name.split('.').pop() || name;
		}
		return name;
	}

	// Format schema for display - shows properties in a readable way
	function formatSchemaForDisplay(schema: any): string {
		const resolved = resolveSchema(schema);
		if (!resolved) return JSON.stringify(schema, null, 2);

		// For objects with properties, show a cleaner format
		if (resolved.properties) {
			const simplified: Record<string, string> = {};
			for (const [key, value] of Object.entries(resolved.properties)) {
				simplified[key] = getPropertyTypeString(value as any);
			}
			return JSON.stringify(simplified, null, 2);
		}

		return JSON.stringify(resolved, null, 2);
	}

	// Get a simple type string for a property
	function getPropertyTypeString(prop: any): string {
		if (prop.type === 'array' && prop.items) {
			return `array<${getPropertyTypeString(prop.items)}>`;
		}
		if (prop.type) return prop.type;
		if (prop.$ref) return getRefName(prop.$ref);
		return 'unknown';
	}

	// Get the full definition name from a $ref for creating element IDs
	function getFullRefName(ref: string): string {
		return ref.replace('#/definitions/', '');
	}

	// Create a URL-safe ID from a model name
	function getModelId(modelName: string): string {
		return `model-${modelName.replace(/[^a-zA-Z0-9]/g, '-')}`;
	}

	// Track which model accordion is open
	let openModelId = $state<string | undefined>(undefined);

	// Scroll to a specific data model and open its accordion
	function scrollToModel(ref: string) {
		const modelName = getFullRefName(ref);
		const modelId = getModelId(modelName);
		const element = document.getElementById(modelId);
		
		if (element) {
			// Set the accordion to open
			openModelId = modelId;
			
			// Scroll to the element with some offset for the sticky header
			setTimeout(() => {
				element.scrollIntoView({ behavior: 'smooth', block: 'start' });
				// Add a highlight effect
				element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
				setTimeout(() => {
					element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
				}, 2000);
			}, 100);
		}
	}

	function toggleTag(tag: string) {
		if (selectedTags.has(tag)) selectedTags.delete(tag);
		else selectedTags.add(tag);
		selectedTags = new Set(selectedTags);
	}

	function clearFilters() {
		search = '';
		selectedTags = new Set();
	}

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		copiedPath = text;
		setTimeout(() => {
			copiedPath = null;
		}, 2000);
	}

	function getStatusColor(code: string): 'default' | 'destructive' | 'secondary' | 'outline' {
		if (code.startsWith('2')) return 'default';
		if (code.startsWith('4')) return 'destructive';
		return 'secondary';
	}
</script>

{#if loading}
	<div class="flex flex-col items-center justify-center py-16 gap-4">
		<div class="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
		<p class="text-muted-foreground text-sm">Loading API documentation...</p>
	</div>
{:else if error}
	<Card.Root class="border-destructive/50 bg-destructive/5">
		<Card.Header>
			<Card.Title class="text-destructive">Error loading API spec</Card.Title>
			<Card.Description>{error}</Card.Description>
		</Card.Header>
	</Card.Root>
{:else if spec}
	<div class="space-y-8">
		<!-- Search and Filter Bar -->
		<div class="sticky top-16 z-40 -mx-4 px-4 py-4 backdrop-blur-xl bg-background/80 border-b">
			<div class="flex flex-col gap-4">
				<div class="relative flex-1">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<input
						class="w-full h-10 rounded-lg border bg-background pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-shadow"
						placeholder="Search endpoints by path, summary, or parameter..."
						bind:value={search}
					/>
					{#if search}
						<button
							class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
							onclick={() => (search = '')}
						>
							<X class="size-4" />
						</button>
					{/if}
				</div>

				{#if index}
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-xs font-medium text-muted-foreground uppercase tracking-wider">Filter by tag:</span>
						{#each index.tagOrder as tagName}
							<button
								type="button"
								class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 {selectedTags.has(
									tagName
								)
									? 'bg-primary text-primary-foreground border-primary shadow-sm'
									: 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground'}"
								onclick={() => toggleTag(tagName)}
							>
								{tagName === '_Untagged' ? 'Untagged' : tagName}
							</button>
						{/each}
						{#if selectedTags.size > 0}
							<Button variant="ghost" size="sm" class="h-7 text-xs" onclick={clearFilters}>
								Clear all
							</Button>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<!-- Endpoints by Tag -->
		{#if filtered}
			{#each index!.tagOrder as tagName}
				{#if filtered[tagName]}
					<section class="space-y-4">
						<div class="flex items-center gap-3">
							<h2 class="text-2xl font-bold tracking-tight">
								{tagName === '_Untagged' ? 'Untagged' : tagName}
							</h2>
							<Badge variant="secondary" class="font-mono text-xs">
								{filtered[tagName].length} endpoint{filtered[tagName].length !== 1 ? 's' : ''}
							</Badge>
						</div>

						{#if spec.tags}
							{@const tagInfo = spec.tags.find((t) => t.name === tagName)}
							{#if tagInfo?.description}
								<p class="text-muted-foreground">{tagInfo.description}</p>
							{/if}
						{/if}

						<div class="space-y-3">
							{#each filtered[tagName] as ep, idx}
								{@const methodStyles = getMethodStyles(ep.method)}
							<Accordion.Root type="single" class="w-full">
									<Accordion.Item
										value="endpoint-{tagName}-{idx}"
										class="border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow"
									>
										<Accordion.Trigger class="px-4 py-3 hover:no-underline hover:bg-muted/30 transition-colors group w-full">
											<div class="flex items-center gap-3 w-full">
												<span
													class="inline-flex items-center justify-center min-w-18 px-2.5 py-1 rounded-md font-mono text-xs font-bold uppercase border {methodStyles.bg} {methodStyles.text} {methodStyles.border}"
												>
													{ep.method.toUpperCase()}
												</span>
												<code class="text-sm font-mono text-foreground/90 flex-1 text-left truncate">
													{ep.path}
												</code>
												{#if ep.operation.summary}
													<span class="text-sm text-muted-foreground hidden md:block truncate max-w-xs text-right">
														{ep.operation.summary}
													</span>
												{/if}
											</div>
										</Accordion.Trigger>
										<Accordion.Content class="border-t bg-muted/20">
											<div class="p-5 space-y-6">
												<!-- Header with Copy Button -->
												<div class="flex items-start justify-between gap-4">
													<div class="space-y-1">
														{#if ep.operation.summary}
															<h3 class="text-lg font-semibold">{ep.operation.summary}</h3>
														{/if}
														{#if ep.operation.description}
															<p class="text-muted-foreground text-sm">{ep.operation.description}</p>
														{/if}
													</div>
													<Button
														variant="outline"
														size="sm"
														class="shrink-0 gap-2"
														onclick={() => copyToClipboard(ep.path)}
													>
														{#if copiedPath === ep.path}
															<Check class="size-3.5" />
															Copied
														{:else}
															<Copy class="size-3.5" />
															Copy path
														{/if}
													</Button>
												</div>

												<!-- Parameters -->
												{#if ep.operation.parameters && ep.operation.parameters.length > 0}
													{@const pathParams = ep.operation.parameters.filter((p: any) => p.in !== 'body')}
													{@const bodyParams = ep.operation.parameters.filter((p: any) => p.in === 'body')}
													
													{#if pathParams.length > 0}
														<div class="space-y-3">
															<h4 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Parameters</h4>
															<div class="rounded-lg border overflow-hidden">
																<table class="w-full text-sm">
																	<thead>
																		<tr class="bg-muted/50">
																			<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
																			<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
																			<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Location</th>
																			<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Required</th>
																			<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Description</th>
																		</tr>
																	</thead>
																	<tbody class="divide-y">
																		{#each pathParams as param}
																			<tr class="hover:bg-muted/30 transition-colors">
																				<td class="px-4 py-2.5">
																					<code class="text-xs font-medium bg-muted px-1.5 py-0.5 rounded">{param.name}</code>
																				</td>
																				<td class="px-4 py-2.5">
																					<span class="text-xs font-mono text-muted-foreground">{param.type || param.schema?.type || 'string'}</span>
																				</td>
																				<td class="px-4 py-2.5">
																					<Badge variant="outline" class="text-xs capitalize">{param.in}</Badge>
																				</td>
																				<td class="px-4 py-2.5">
																					{#if param.required}
																						<span class="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
																							<span class="size-1.5 rounded-full bg-current"></span>
																							Required
																						</span>
																					{:else}
																						<span class="text-xs text-muted-foreground">Optional</span>
																					{/if}
																				</td>
																				<td class="px-4 py-2.5 text-muted-foreground text-xs max-w-xs truncate">
																					{param.description || '—'}
																				</td>
																			</tr>
																		{/each}
																	</tbody>
																</table>
															</div>
														</div>
													{/if}

													{#if bodyParams.length > 0}
														{#each bodyParams as bodyParam}
															{@const bodySchema = bodyParam.schema}
															{@const resolvedBody = bodySchema ? resolveSchema(bodySchema) : null}
															<div class="space-y-3">
																<h4 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Request Body</h4>
																{#if bodyParam.description}
																	<p class="text-sm text-muted-foreground">{bodyParam.description}</p>
																{/if}
																<div class="space-y-2">
																	{#if bodySchema?.$ref}
																		<button
																			type="button"
																			onclick={() => scrollToModel(bodySchema.$ref)}
																			class="inline-flex"
																		>
																			<Badge variant="secondary" class="font-mono text-xs cursor-pointer hover:bg-secondary/80 transition-colors">{getRefName(bodySchema.$ref)}</Badge>
																		</button>
																	{/if}
																	{#if resolvedBody?.properties}
																		<div class="rounded-lg border overflow-hidden">
																			<table class="w-full text-sm">
																				<thead>
																					<tr class="bg-muted/50">
																						<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Property</th>
																						<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Type</th>
																						<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Required</th>
																						<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Description</th>
																					</tr>
																				</thead>
																				<tbody class="divide-y">
																					{#each Object.entries(resolvedBody.properties) as [propName, propValue]}
																						{@const prop = propValue as any}
																						<tr class="hover:bg-muted/30 transition-colors">
																							<td class="px-3 py-2">
																								<code class="text-xs font-medium bg-muted px-1.5 py-0.5 rounded">{propName}</code>
																							</td>
																							<td class="px-3 py-2">
																								<span class="text-xs font-mono text-muted-foreground">{getPropertyTypeString(prop)}</span>
																							</td>
																							<td class="px-3 py-2">
																								{#if resolvedBody.required?.includes(propName)}
																									<span class="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
																										<span class="size-1.5 rounded-full bg-current"></span>
																										Required
																									</span>
																								{:else}
																									<span class="text-xs text-muted-foreground">Optional</span>
																								{/if}
																							</td>
																							<td class="px-3 py-2 text-muted-foreground text-xs">
																								{prop.description || '—'}
																							</td>
																						</tr>
																					{/each}
																				</tbody>
																			</table>
																		</div>
																	{:else if bodySchema}
																		<pre class="bg-muted/50 border rounded-lg p-4 text-xs overflow-x-auto font-mono"><code>{formatSchemaForDisplay(bodySchema)}</code></pre>
																	{/if}
																</div>
															</div>
														{/each}
													{/if}
												{/if}

												<!-- Request Body -->
												{#if ep.operation.requestBody}
													<div class="space-y-3">
														<h4 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Request Body</h4>
														{#if ep.operation.requestBody.description}
															<p class="text-sm text-muted-foreground">{ep.operation.requestBody.description}</p>
														{/if}
														{#if ep.operation.requestBody.content}
															{#each Object.entries(ep.operation.requestBody.content) as [contentType, content]}
																{@const contentSchema = (content as any).schema}
																{@const resolvedSchema = contentSchema ? resolveSchema(contentSchema) : null}
																<div class="space-y-2">
																	<div class="flex items-center gap-2">
																		<Badge variant="outline" class="font-mono text-xs">{contentType}</Badge>
																		{#if contentSchema?.$ref}
																			<button
																				type="button"
																				onclick={() => scrollToModel(contentSchema.$ref)}
																				class="inline-flex"
																			>
																				<Badge variant="secondary" class="font-mono text-xs cursor-pointer hover:bg-secondary/80 transition-colors">{getRefName(contentSchema.$ref)}</Badge>
																			</button>
																		{/if}
																	</div>
																	{#if resolvedSchema?.properties}
																		<div class="rounded-lg border overflow-hidden">
																			<table class="w-full text-sm">
																				<thead>
																					<tr class="bg-muted/50">
																						<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Property</th>
																						<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Type</th>
																						<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Required</th>
																						<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Description</th>
																					</tr>
																				</thead>
																				<tbody class="divide-y">
																					{#each Object.entries(resolvedSchema.properties) as [propName, propValue]}
																						{@const prop = propValue as any}
																						<tr class="hover:bg-muted/30 transition-colors">
																							<td class="px-3 py-2">
																								<code class="text-xs font-medium bg-muted px-1.5 py-0.5 rounded">{propName}</code>
																							</td>
																							<td class="px-3 py-2">
																								<span class="text-xs font-mono text-muted-foreground">{getPropertyTypeString(prop)}</span>
																							</td>
																							<td class="px-3 py-2">
																								{#if resolvedSchema.required?.includes(propName)}
																									<span class="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
																										<span class="size-1.5 rounded-full bg-current"></span>
																										Required
																									</span>
																								{:else}
																									<span class="text-xs text-muted-foreground">Optional</span>
																								{/if}
																							</td>
																							<td class="px-3 py-2 text-muted-foreground text-xs">
																								{prop.description || '—'}
																							</td>
																						</tr>
																					{/each}
																				</tbody>
																			</table>
																		</div>
																	{:else if contentSchema}
																		<pre class="bg-muted/50 border rounded-lg p-4 text-xs overflow-x-auto font-mono"><code>{formatSchemaForDisplay(contentSchema)}</code></pre>
																	{/if}
																</div>
															{/each}
														{/if}
													</div>
												{/if}

												<!-- Responses -->
												{#if ep.operation.responses}
													<div class="space-y-3">
														<h4 class="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Responses</h4>
														<div class="grid gap-3">
															{#each Object.entries(ep.operation.responses) as [statusCode, responseObj]}
																{@const response = responseObj as any}
																{@const resolvedSchema = response.schema ? resolveSchema(response.schema) : null}
																<div class="rounded-lg border p-4 space-y-3 bg-background">
																	<div class="flex items-center gap-2">
																		<Badge variant={getStatusColor(statusCode)} class="font-mono">
																			{statusCode}
																		</Badge>
																		{#if response.description}
																			<span class="text-sm text-muted-foreground">{response.description}</span>
																		{/if}
																	</div>
																	{#if resolvedSchema}
																		<div class="space-y-2">
																			{#if response.schema.$ref}
																				<div class="flex items-center gap-2">
																					<span class="text-xs font-medium text-muted-foreground">Schema:</span>
																					<button
																						type="button"
																						onclick={() => scrollToModel(response.schema.$ref)}
																						class="inline-flex"
																					>
																						<Badge variant="outline" class="font-mono text-xs cursor-pointer hover:bg-muted transition-colors">{getRefName(response.schema.$ref)}</Badge>
																					</button>
																				</div>
																			{/if}
																			{#if resolvedSchema.properties}
																				<div class="rounded-lg border overflow-hidden">
																					<table class="w-full text-sm">
																						<thead>
																							<tr class="bg-muted/50">
																								<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Property</th>
																								<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Type</th>
																								<th class="px-3 py-2 text-left font-medium text-muted-foreground text-xs">Description</th>
																							</tr>
																						</thead>
																						<tbody class="divide-y">
																							{#each Object.entries(resolvedSchema.properties) as [propName, propValue]}
																								{@const prop = propValue as any}
																								<tr class="hover:bg-muted/30 transition-colors">
																									<td class="px-3 py-2">
																										<code class="text-xs font-medium bg-muted px-1.5 py-0.5 rounded">{propName}</code>
																									</td>
																									<td class="px-3 py-2">
																										<span class="text-xs font-mono text-muted-foreground">{getPropertyTypeString(prop)}</span>
																									</td>
																									<td class="px-3 py-2 text-muted-foreground text-xs">
																										{prop.description || '—'}
																									</td>
																								</tr>
																							{/each}
																						</tbody>
																					</table>
																				</div>
																			{:else}
																				<pre class="bg-muted/50 border rounded-lg p-3 text-xs overflow-x-auto font-mono"><code>{formatSchemaForDisplay(response.schema)}</code></pre>
																			{/if}
																		</div>
																	{/if}
																</div>
															{/each}
														</div>
													</div>
												{/if}
											</div>
										</Accordion.Content>
									</Accordion.Item>
								</Accordion.Root>
							{/each}
						</div>
					</section>
				{/if}
			{/each}

			{#if Object.keys(filtered).length === 0}
				<div class="flex flex-col items-center justify-center py-16 gap-4 text-center">
					<div class="size-16 rounded-full bg-muted flex items-center justify-center">
						<Search class="size-8 text-muted-foreground" />
					</div>
					<div class="space-y-1">
						<p class="font-medium">No endpoints found</p>
						<p class="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
					</div>
					<Button variant="outline" size="sm" onclick={clearFilters}>Clear filters</Button>
				</div>
			{/if}
		{/if}

		<!-- Data Models -->
		{#if spec.definitions && Object.keys(spec.definitions).length > 0}
			<section class="space-y-4 pt-8 border-t">
				<div class="flex items-center gap-3">
					<h2 class="text-2xl font-bold tracking-tight">Data Models</h2>
					<Badge variant="secondary" class="font-mono text-xs">
						{Object.keys(spec.definitions).length} model{Object.keys(spec.definitions).length !== 1 ? 's' : ''}
					</Badge>
				</div>

				<div class="space-y-3">
					{#each Object.entries(spec.definitions) as [modelName, model], idx}
					{@const modelId = getModelId(modelName)}
					<Accordion.Root type="single" class="w-full" bind:value={openModelId}>
							<Accordion.Item
								value={modelId}
								id={modelId}
								class="border rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-300"
							>
								<Accordion.Trigger class="px-4 py-3 hover:no-underline hover:bg-muted/30 transition-colors group w-full">
									<div class="flex items-center gap-3 w-full">
										<code class="text-sm font-mono font-semibold text-foreground">{modelName}</code>
										{#if model.description}
											<span class="text-sm text-muted-foreground truncate flex-1 text-left">{model.description}</span>
										{/if}
									</div>
								</Accordion.Trigger>
								<Accordion.Content class="border-t bg-muted/20">
									<div class="p-5">
										{#if model.properties}
											<div class="rounded-lg border overflow-hidden">
												<table class="w-full text-sm">
													<thead>
														<tr class="bg-muted/50">
															<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Property</th>
															<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
															<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Required</th>
															<th class="px-4 py-2.5 text-left font-medium text-muted-foreground">Description</th>
														</tr>
													</thead>
													<tbody class="divide-y">
														{#each Object.entries(model.properties) as [propName, propSchema]}
															{@const schema = propSchema as { description?: string }}
															<tr class="hover:bg-muted/30 transition-colors">
																<td class="px-4 py-2.5">
																	<code class="text-xs font-medium bg-muted px-1.5 py-0.5 rounded">{propName}</code>
																</td>
																<td class="px-4 py-2.5">
																	<span class="text-xs font-mono text-muted-foreground">{formatPropertyType(schema)}</span>
																</td>
																<td class="px-4 py-2.5">
																	{#if model.required && model.required.includes(propName)}
																		<span class="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
																			<span class="size-1.5 rounded-full bg-current"></span>
																			Required
																		</span>
																	{:else}
																		<span class="text-xs text-muted-foreground">Optional</span>
																	{/if}
																</td>
																<td class="px-4 py-2.5 text-muted-foreground text-xs">
																	{schema.description || '—'}
																</td>
															</tr>
														{/each}
													</tbody>
												</table>
											</div>
										{/if}
									</div>
								</Accordion.Content>
							</Accordion.Item>
						</Accordion.Root>
					{/each}
				</div>
			</section>
		{/if}
	</div>
{/if}