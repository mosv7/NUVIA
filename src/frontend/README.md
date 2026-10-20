# NUVIA frontend

The supplied bilingual React/JSX prototype lives here. Install dependencies and run commands from the repository root, not this directory:

```sh
npm ci
npm run dev
```

Use `npm run dev:network` for a phone on the same Wi-Fi, `npm run build` for a production bundle, and `npm run preview` to serve that bundle. Run `npm run build` and `npm run previews` to generate standalone HTML demos under the repository's ignored `previews/` directory.

Account and business-setup routes now use the [Node/MongoDB backend](../../docs/development/backend.md); run its API and mail worker as documented. Development verification/reset mail is private local JSON unless SMTP is configured. Account/workspace data persists on the server; passwords and session tokens are never saved in browser storage. Use `/preview/#/<route>` for isolated design demos without a backend. The landing booking form remains a local demo. See [frontend review](../../docs/development/frontend.md) for layouts and preview boundaries.
