# Husky Setup for Backend

## Overview

This project uses Husky to enforce code quality checks before commits. Husky is a Git hooks manager that allows us to run scripts before committing code, ensuring that only quality code gets committed to the repository.

## What's Configured

### Pre-commit Hook

The pre-commit hook runs the following checks on staged files:

- **ESLint**: Checks TypeScript files for code quality issues and enforces coding standards
- **Prettier**: Formats code according to project standards

## How It Works

1. When you attempt to commit code, Husky intercepts the commit process
2. It runs the configured lint-staged tasks on the files you're trying to commit
3. If any issues are found, the commit is blocked until you fix them
4. Once all checks pass, your commit proceeds normally

## Configuration Files

- `.husky/pre-commit`: The Git hook script that runs before each commit
- `.lintstagedrc`: Configuration for lint-staged that defines which commands to run on which files

## Troubleshooting

If you encounter issues with Husky:

1. Make sure Git is properly initialized in the project
2. Ensure Husky is installed (`npm install husky --save-dev`)
3. Check that the pre-commit hook is executable
4. Verify that the lint-staged configuration is correct

## Bypassing Hooks

In rare cases where you need to bypass the pre-commit hooks (not recommended), you can use:

```bash
git commit -m "Your message" --no-verify
```

However, this should be used sparingly and only in exceptional circumstances.
