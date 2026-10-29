# Contributing to PRN Creative Studio

Thanks for helping improve PRN Creative Studio.

## Before opening a pull request

1. Describe the issue or user problem being solved.
2. Keep changes focused and avoid unrelated formatting changes.
3. Follow the existing project conventions.
4. Run the checks available in `package.json` (for example, lint, tests, and production build where configured).
5. Include reproduction steps for bug fixes and screenshots for visual changes.
6. Update documentation when behavior, configuration, or architecture changes.

## Local development

The project is expected to use a React/Vite frontend. From the project root:

```bash
npm install
npm run dev
npm run build
```

Use the scripts actually defined in `package.json`; not every script may exist yet.

## Security

Never include API keys, access tokens, private environment files, credentials, customer information, or production database dumps in a pull request. Report suspected vulnerabilities privately to the repository owner rather than publishing exploit details.

## Pull request checklist

- [ ] The change solves a clear problem.
- [ ] Existing behavior has not regressed.
- [ ] Relevant checks pass, or failures are explained.
- [ ] Documentation is updated where needed.
- [ ] No secrets or unlicensed assets are included.
