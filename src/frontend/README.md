# NUVIA frontend

The supplied bilingual React/JSX prototype lives here. Install dependencies and run commands from the repository root, not this directory:

```sh
npm ci
npm run dev
```

Use `npm run dev:network` for a phone on the same Wi-Fi, `npm run build` for a production bundle, and `npm run preview` to serve that bundle. Run `npm run build` and `npm run previews` to generate standalone HTML demos under the repository's ignored `previews/` directory.

See [Frontend development and review](../../docs/frontend.md) for routes, source locations, tests, and integration boundaries. Authentication and business setup are demonstrations; no account, reset email, session, booking, or workspace is created on a server. Only language preference is saved locally.
