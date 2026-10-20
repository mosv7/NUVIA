# Web application

React/Vite with JavaScript/JSX. From the repository root, install with `pnpm install --frozen-lockfile`, then run `pnpm dev:web` for UI/preview work or `pnpm dev` for the connected web/API/mail group after MongoDB configuration. Package-local `pnpm --filter @nuvia/web dev` works too.

The entry point is `src/main.jsx`; `app/App.jsx` composes providers and preview mode, `app/router` owns navigation/access decisions, and `features` owns auth, workspaces, dashboard, feedback and landing screens. `users`, survey preview source and AI assistant preview code are extension/reference boundaries, not completed product services. Shared controls/layout, responsive hooks and transport/localization utilities have their own folders.

Tests belong in `tests/` and run with `pnpm --filter @nuvia/web test`. Build with `pnpm build` into `apps/web/dist`; `pnpm previews` creates root standalone HTML after building. `pnpm screenshots` regenerates the complete approved EN/AR gallery; use it deliberately and preserve reference provenance.

The shared public contract package is `@nuvia/shared-types`. Never import Node models or private configuration into web code. See [DESIGN.md](../../DESIGN.md), [module boundaries](../../docs/development/module-boundaries.md) and [current setup](../../README.md).
