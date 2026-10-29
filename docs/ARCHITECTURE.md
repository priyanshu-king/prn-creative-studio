# PRN Creative Studio — Architecture

## Status

This document describes the intended architecture. Treat each component as planned until its implementation is confirmed in source code and tests.

## High-level system

```text
Browser
  └── React application (Vite)
       ├── Public site and account routes
       ├── Workspace/dashboard
       ├── Editor UI
       │    └── Editor engine adapter (Fabric.js, if configured)
       ├── Client state and document model
       └── API client
            ├── Authentication/session API
            ├── Project and version API
            ├── Asset upload API
            ├── Export/render API (if server rendering is needed)
            ├── Billing/entitlements API
            └── AI provider gateway (optional)
                     └── External AI provider
```

The React client must not be trusted to enforce access control or paid-plan limits. Any private data, billing state, AI provider key, and authorization decision must be enforced by a server-side component.

## Suggested boundaries

### 1. Presentation

Organize routes and reusable UI into page-level components and shared components. Keep visual components focused on rendering and user interaction. Avoid placing all editor behavior inside a single large page component.

### 2. Editor engine

Use an adapter around the canvas library so UI components do not depend directly on low-level canvas internals. The adapter should expose operations such as:

- create/open document
- add/update/remove object
- select object and update transforms
- undo/redo
- serialize/deserialize document
- export through supported formats

Keep the editor engine replaceable and test it independently.

### 3. Document model

Represent a document as a versioned structure with pages, objects/layers, dimensions, and metadata. Validate data before loading. Add explicit migrations when the schema changes. Avoid storing executable content in document files.

### 4. Persistence

Start with local recovery only if that is what the product currently supports. For cloud persistence, use authenticated APIs and per-user authorization. Autosave should handle retries, conflicts, and unsaved-change indicators. Do not report a save as successful until the storage layer confirms it.

### 5. Assets

Validate file type, file size, and content. Use generated identifiers instead of trusting user-supplied paths. Store asset metadata separately from binary data when using object storage. Check licensing before shipping stock assets or fonts.

### 6. Identity and authorization

Use a reputable authentication provider or a well-maintained server-side session implementation. Enforce ownership checks on every project, asset, and share link request. Never put privileged credentials in browser environment variables.

### 7. Billing and plans

Use the payment provider's verified server-side webhook events as the source of truth for subscriptions. Store entitlement state server-side and check it on every premium operation. Use test mode until cancellation, failed payment, refunds, and webhook retries have been tested.

### 8. AI integrations

Keep provider keys on the server. Apply authentication, request validation, rate limits, timeouts, usage quotas, and cost monitoring. Give the UI a clear fallback when an AI provider is unavailable. Do not describe a mock response as AI functionality.

## Quality strategy

- Unit-test document serialization, migrations, editor commands, and entitlement rules.
- Integration-test saving/reopening, asset validation, authentication, and export flows.
- Add end-to-end tests for the core create → edit → save → reopen → export journey.
- Run the production build in CI on every pull request.
- Test keyboard navigation, mobile layouts, loading/error states, and reduced-motion preferences.
- Keep dependency updates and security reviews part of release preparation.

## Deployment outline

1. Confirm the app installs and the production build succeeds locally.
2. Push the full source, lockfile, and required public assets to GitHub.
3. Choose a static host compatible with Vite for frontend-only deployment.
4. Configure the build command (commonly `npm run build`) and output directory (`dist`).
5. Add only non-secret public configuration as frontend environment variables.
6. Deploy backend services separately if the application requires APIs, a database, storage, payments, or AI provider access.
7. Configure SPA route fallback, HTTPS, production environment variables, and domain settings.
8. Verify the deployed app on desktop and mobile before sharing it publicly.

## Key non-goals

- Do not claim authentication, cloud sync, payments, backups, AI, or collaboration until implemented and tested.
- Do not store payment-card data directly.
- Do not commit secrets or real user data to the repository.
