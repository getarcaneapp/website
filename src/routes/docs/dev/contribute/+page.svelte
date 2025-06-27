<script lang="ts">
	import ContentWrapper from '$lib/components/content-wrapper.svelte';
	import { GitCommand } from '$lib/components/ui/git-command';
	import { Snippet } from '$lib/components/ui/snippet';
</script>

<ContentWrapper>
	<h1 class="mb-4 text-3xl font-bold">Contributing to Arcane</h1>

	<p class="mb-6">
		Thank you for your interest in contributing to Arcane! We welcome contributions from the
		community to help make Arcane better. Whether it's reporting a bug, suggesting a feature, or
		writing code, your help is appreciated.
	</p>

	<h2 class="mt-8 mb-3 text-2xl font-semibold">Ways to Contribute</h2>
	<ul class="mb-6 list-inside list-disc space-y-2">
		<li>
			<strong>Reporting Bugs:</strong> If you encounter a bug, please help us by submitting a
			detailed bug report. Use the
			<a
				class="text-primary underline"
				href="https://github.com/ofkm/arcane/issues/new?template=bug.yml"
				target="_blank"
				rel="noopener">Bug Report</a
			>
			template on GitHub.
		</li>
		<li>
			<strong>Suggesting Features:</strong> Have an idea for a new feature or an enhancement? We'd
			love to hear it! Use the
			<a
				class="text-primary underline"
				href="https://github.com/ofkm/arcane/issues/new?template=feature.yml"
				target="_blank"
				rel="noopener">Feature Request</a
			>
			template on GitHub.
		</li>
		<li>
			<strong>Code Contributions:</strong> If you'd like to contribute code, please follow the process
			outlined below.
		</li>
		<li>
			<strong>Documentation:</strong> Improvements to the documentation are always welcome.
		</li>
	</ul>

	<h2 class="mt-8 mb-3 text-2xl font-semibold">Code Contribution Process</h2>
	<ol class="mb-8 list-decimal space-y-4 pl-6">
		<li>
			<strong>Fork the Repository:</strong> Start by forking the main Arcane repository on GitHub.
		</li>
		<li>
			<strong>Clone Your Fork:</strong> Clone your forked repository to your local machine:

			<GitCommand class="mt-2 mb-2 w-full" />
		</li>
		<li>
			<strong>Create a Branch:</strong> Create a new branch for your feature or bug fix. Use a
			descriptive name:
			<Snippet text="git branch -m feat/my-new-feature" class="mt-2 mb-2 w-full" />
		</li>
		<li>
			<strong>Set Up Development Environment:</strong> Follow the instructions in the
			<a class="text-primary underline" href="./building" target="_blank" rel="noopener"
				>Building from Source</a
			>
			guide to set up your development environment.
			<div class="mt-4">
				<h4 class="mb-2 text-lg font-semibold">Backend</h4>
				<p class="mb-2">
					For the backend you can use <code class="bg-muted rounded px-1 py-0.5">air</code> for hot reloading:
				</p>
				<Snippet text="go install github.com/air-verse/air@latest" class="mt-2 mb-2 w-full" />
				<p class="mb-2">
					Then just run <code class="bg-muted rounded px-1 py-0.5">air</code> in
					<code class="bg-muted rounded px-1 py-0.5">arcane/backend</code> folder.
				</p>
				<h4 class="mt-4 mb-2 text-lg font-semibold">Frontend</h4>
				<p class="mb-2">The frontend uses vite for development:</p>
				<Snippet text={['cd frontend', 'npm run dev']} class="mt-2 mb-2 w-full" />
			</div>
		</li>
		<li>
			<strong>Make Changes:</strong> Implement your feature or bug fix. Write clear, concise code.
		</li>
		<li>
			<strong>Lint and Format:</strong> Ensure your code adheres to the project's style guidelines
			by running the linters and formatters:
			<Snippet text={['cd frontend', 'npm run lint', 'npm run format']} class="mt-2 mb-2 w-full" />
		</li>
		<li>
			<strong>Test Your Changes:</strong> Test your changes thoroughly to ensure they work as expected
			and don't break existing functionality.
		</li>
		<li>
			<strong>Commit Changes:</strong> Commit your changes with a clear and descriptive commit
			message. We use
			<a
				class="text-primary underline"
				href="https://www.conventionalcommits.org/"
				target="_blank"
				rel="noopener">Conventional Commits</a
			>:
			<Snippet
				text={[
					'git add .',
					'git commit -a -m "feat: add feature X"',
					'#or',
					'git commit -m "fix: resolve issue Y"'
				]}
				class="mt-2 mb-2 w-full"
			/>
		</li>
		<li>
			<strong>Keep Your Branch Updated:</strong> Periodically update your branch with the latest
			changes from the upstream repository:
			<Snippet text={['git fetch upstream', 'git rebase upstream/main']} class="mt-2 mb-2 w-full" />
		</li>
		<li>
			<strong>Push Your Branch:</strong> Push your changes to your forked repository:
			<Snippet text={['git push origin feature/my-new-feature']} class="mt-2 mb-2 w-full" />
		</li>
		<li>
			<strong>Open a Pull Request:</strong> Go to the original Arcane repository on GitHub and open
			a Pull Request (PR) from your branch to the main branch of the upstream repository.
			<ul class="mt-2 list-inside list-disc space-y-1">
				<li>Provide a clear title and description for your PR.</li>
				<li>Reference any related issues (e.g., "Closes #123").</li>
				<li>Be prepared to discuss your changes and make adjustments based on feedback.</li>
			</ul>
		</li>
	</ol>

	<h2 class="mt-8 mb-3 text-2xl font-semibold">Code Style</h2>
	<p class="mb-6">
		Arcane uses <a
			class="text-primary underline"
			href="https://eslint.org/"
			target="_blank"
			rel="noopener">ESLint</a
		>
		and
		<a class="text-primary underline" href="https://prettier.io/" target="_blank" rel="noopener"
			>Prettier</a
		>
		to enforce code style and consistency. Please run
		<code class="bg-muted rounded px-1 py-0.5">npm run lint</code>
		and <code class="bg-muted rounded px-1 py-0.5">npm run format</code> in the frontend directory before
		committing your changes. Configuration files are included in the repository.
	</p>

	<h2 class="mt-8 mb-3 text-2xl font-semibold">Development Tips</h2>
	<ul class="mb-8 list-inside list-disc space-y-2">
		<li>Use Svelte 5 syntax for all frontend files</li>
		<li>Follow the existing code patterns and conventions</li>
		<li>Keep commits focused and atomic</li>
		<li>Write meaningful commit messages</li>
		<li>Test your changes in both development and production builds</li>
	</ul>

	<p class="mb-8">
		Thank you for contributing to Arcane! We look forward to your pull requests and appreciate your
		help in making Arcane better. If you have any questions or need further clarification, feel free
		to reach out to the maintainers or the community.
	</p>
</ContentWrapper>
