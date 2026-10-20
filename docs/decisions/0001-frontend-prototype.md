# Frontend prototype integration

Status: implementation choice for this pull request; backend and AI choices remain proposed.

## Context

The supplied frontend is an existing React and Vite prototype with approved Arabic/English landing, authentication, and business-onboarding layouts. The repository contains planning documents but no application code. The team workflow proposes `apps/web/`, shared `tests/`, and `assets/`.

## Decision

- Keep the supplied JavaScript/JSX implementation for this import. React/TypeScript in the architecture is a proposed baseline; a TypeScript migration is separate work and is not implied by importing this prototype.
- Place the app at `apps/web/` with dependencies and commands in the repository-root npm manifest and lockfile. This keeps one clean install without requiring workspace symlinks on Windows. Framework entry points and configuration live in the app directory, and React modules remain under its framework-standard `src/` directory. Tests live in the repository's `apps/web/tests/`.
- Keep screen assets in `apps/web/public/assets/`, Vite's public asset directory. This framework-driven deviation from a root `assets/` directory preserves the existing asset paths and descriptive Figma filenames.
- Configure ESLint, Prettier, Vitest, and a frontend CI workflow with the first application code. Keep generated bundles, standalone previews, dependencies, and private configuration out of Git.
- Preserve the existing planning documents and `AGENTS.md`. Update README with runnable commands and the actual delivered scope.

## Boundaries

This PR delivers the UI prototype, not the foundation or analytics acceptance stages described in requirements. Authentication, Google sign-in, password recovery, workspace persistence, questionnaires, analytics, and AI services are not integrated. Dashboard content in the hero remains illustrative. Dedicated Overview and Feedback routes are now present with synthetic sample data and local interactions; they are not authenticated analytics services.

The demo adapter never sends credentials or stores passwords. It intentionally returns demo/error notices. Business details remain in React memory, and only the language preference is saved locally. Future identity and workspace integration must follow agreed API contracts; this import does not invent authentication endpoints.

The team can run `npm run build` followed by `npm run previews` to generate self-contained HTML files for quick review. These generated files do not replace React source and do not update until regenerated.
