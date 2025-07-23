---
title: Contributing to Arcane
description: Thank you for your interest in contributing to Arcane! We welcome contributions from the community to help make Arcane better. Whether it's reporting a bug, suggesting a feature, or writing code, your help is appreciated.
blueprint: default
---

<script lang="ts">
    import { GitCommand } from '$lib/components/ui/git-command';
    import { Snippet } from '$lib/components/ui/snippet/index.js';
    import { Link } from '$lib/components/ui/link/index.js';
</script>

## Ways to Contribute

- **Reporting Bugs:** If you encounter a bug, please help us by submitting a detailed bug report. <br />
  Use the <Link href="https://github.com/ofkm/arcane/issues/new?template=bug.yml">Bug Report</Link> template on GitHub.

- **Suggesting Features:** Have an idea for a new feature or an enhancement? We'd love to hear it! <br />
  Use the <Link href="https://github.com/ofkm/arcane/issues/new?template=feature.yml">Feature Request</Link> template on GitHub.

- **Code Contributions:** If you'd like to contribute code, please follow the process outlined below.

- **Documentation:** Improvements to the documentation are always welcome.

## Code Contribution Process

1. **Fork the Repository:** Start by forking the main Arcane repository on GitHub.

2. **Clone Your Fork:** Clone your forked repository to your local machine:

   <GitCommand class="mt-2 mb-2 w-full" />

3. **Create a Branch:** Create a new branch for your feature or bug fix. Use a descriptive name:

   <Snippet text="git branch -m feat/my-new-feature" class="mt-2 mb-2 w-full" />

   ### Backend

   For the backend you can use `air` for hot reloading:

   <Snippet text="go install github.com/air-verse/air@latest" class="mt-2 mb-2 w-full" />

   Then just run `air` in `arcane/backend` folder.

   ### Frontend

   The frontend uses vite for development:

   <Snippet text={['cd frontend', 'npm run dev']} class="mt-2 mb-2 w-full" />

4. **Make Changes:** Implement your feature or bug fix. Write clear, concise code.

5. **Lint and Format:** Ensure your code adheres to the project's style guidelines by running the linters and formatters:

   <Snippet text={['cd frontend', 'npm run lint', 'npm run format']} class="mt-2 mb-2 w-full" />

6. **Test Your Changes:** Test your changes thoroughly to ensure they work as expected and don't break existing functionality.

7. **Commit Changes:** Commit your changes with a clear and descriptive commit message. <br />
   We use <Link href="https://www.conventionalcommits.org/">Conventional Commits</Link>

   <Snippet text={['git add .', 'git commit -a -m "feat: add feature X"', '#or', 'git commit -m "fix: resolve issue Y"']} class="mt-2 mb-2 w-full" />

8. **Keep Your Branch Updated:** Periodically update your branch with the latest changes from the upstream repository:

   <Snippet text={['git fetch upstream', 'git rebase upstream/main']} class="mt-2 mb-2 w-full" />

9. **Push Your Branch:** Push your changes to your forked repository:

   <Snippet text={['git push origin feature/my-new-feature']} class="mt-2 mb-2 w-full" />

10. **Open a Pull Request:** Go to the original Arcane repository on GitHub and open a Pull Request (PR) from your branch to the main branch of the upstream repository.
    - Provide a clear title and description for your PR.
    - Reference any related issues (e.g., "Closes #123").
    - Be prepared to discuss your changes and make adjustments based on feedback.

## Code Style

Arcane uses <Link href="https://eslint.org/">ESLint</Link> and <Link href="https://prettier.io/">Prettier</Link> to enforce code style and consistency. Please run `npm run lint` and `npm run format` in the frontend directory before committing your changes. Configuration files are included in the repository.

## Development Tips

- Use Svelte 5 syntax for all frontend files
- Follow the existing code patterns and conventions
- Keep commits focused and atomic
- Write meaningful commit messages
- Test your changes in both development and production builds

Thank you for contributing to Arcane! We look forward to your pull requests and appreciate your help in making Arcane better. If you have any questions or need further clarification, feel free to reach out to the maintainers or the community.
