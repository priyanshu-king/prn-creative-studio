<div align="center">

# PRN Creative Studio

### Make ideas visible.

**A creative workspace for turning ideas into visual content.**

[Overview](#overview) · [Getting Started](#getting-started) · [Architecture](#architecture) · [Roadmap](#roadmap) · [Contributing](#contributing)

---

</div>

## Overview

PRN Creative Studio is an independent creative-design platform in active development. Its goal is to make visual design workflows approachable for creators, students, freelancers, and businesses—while building an original identity rather than copying an existing product.

The product direction combines a canvas editor, reusable templates, asset workflows, project management, export tools, and optional premium capabilities.

> **Current status:** Early-stage project. The repository documentation is being established; individual features must be verified in the application before being considered production-ready.

## Product principles

- **Useful over decorative:** each control should have a real, tested outcome.
- **Original by design:** PRN should develop its own visual language and workflows.
- **Accessible to start:** prioritize a useful free core before advanced paid features.
- **Honest feature status:** document what is implemented, planned, or blocked by external services.
- **Privacy by default:** never commit secrets or expose users' private projects.

## Intended capabilities

The roadmap includes the following areas; this list describes product direction and is not a guarantee that every capability is implemented yet.

- Canvas editing for text, shapes, and images.
- Selection, transforms, layers, and undo/redo.
- Editable starter templates and multiple pages.
- Project saving and reopening.
- PNG/JPG/PDF export and other formats where reliable rendering is supported.
- Asset management and brand tools.
- Optional AI-assisted design workflows.
- A transparent Free/Pro plan with server-side entitlements.
- Secure project sharing and collaboration as the architecture matures.

## Technology

The existing application is based on a React/Vite frontend and uses Fabric.js for canvas editing where configured. See `package.json` for the authoritative dependency and script list.

## Getting started

### Prerequisites

- Node.js LTS
- npm
- Git

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL printed by the development server (Vite commonly uses `http://localhost:5173`).

### Build for production

```bash
npm run build
```

If the project defines a preview script, run `npm run preview` to inspect the built frontend locally.

## Architecture direction

The project should evolve toward clear boundaries between:

| Area | Responsibility |
|---|---|
| UI and routes | Marketing pages, dashboard, editor shell, accessible controls |
| Editor engine | Canvas objects, selection, transformations, document state, undo/redo |
| Document model | Versioned pages, layers, object properties, import/export representation |
| Asset services | Validated uploads, thumbnails, reusable assets, licensed content metadata |
| Persistence | Autosave, project versions, local recovery, cloud storage adapter |
| Identity and authorization | Account sessions and per-user project access, enforced server-side |
| Billing and entitlements | Plans, quotas, verified provider webhooks, premium access checks |
| AI integrations | Server-side providers, rate limits, cost controls, explicit unavailable states |
| Quality and operations | Unit/integration tests, CI builds, logs, backup and recovery procedures |

This is a target architecture, not a claim that all these services already exist.

## Roadmap

- [ ] Audit and verify the existing editor and navigation.
- [ ] Test text, shape, image, layer, transform, and undo/redo workflows.
- [ ] Verify template loading and multipage state.
- [ ] Verify reliable project save/reopen behavior.
- [ ] Verify generated PNG/JPG/PDF output.
- [ ] Document project schema and migration strategy.
- [ ] Add automated build and test checks.
- [ ] Implement secure authentication and user-owned cloud storage.
- [ ] Implement server-side Free/Pro entitlements and test-mode billing.
- [ ] Add advanced tools only with real implementations and required services.
- [ ] Complete responsive, accessibility, privacy, security, and release checks.

## Security and configuration

- Do not commit `.env`, API keys, access tokens, payment secrets, or database credentials.
- Put real secrets in the relevant deployment provider's environment settings.
- Validate file types and sizes; treat uploaded content as untrusted.
- Enforce authorization on the server for every private project and asset.
- Rotate any secret that was accidentally committed; deleting it from a later commit is not sufficient.
- Review third-party asset, icon, and font licenses before commercial distribution.

## Contributing

Focused bug reports and pull requests are welcome. Include reproduction steps, describe expected behaviour, run the available project checks, and attach screenshots for UI changes.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

No license has been selected for this repository yet. Until the owner adds one, no open-source reuse or redistribution permission is explicitly granted.

---

<div align="center">

**PRN Creative Studio** · An evolving creative technology project

</div>
