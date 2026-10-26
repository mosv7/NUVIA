# Approved frontend integration

The source in `apps/web` replaces the old frontend presentation while preserving the existing API, database, mail and AI-service sources. The original desktop Frontend was updated in place with the same modules; its standalone transport uses the public `/api/v1` prefix instead of the monorepo shared-package import.

## File groups

| Files                                                            | Change                                                                                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `apps/web/src/features/workspace/*`, `WorkspacePages.jsx`        | Focused business, account, notification, security, empty-state and dialog modules; existing backend adapters. |
| `apps/web/src/app/*`, `features/auth/*`, `features/workspaces/*` | Approved presentation with real session/access control; lazy routing and preserved cancellation.              |
| `apps/web/src/lib/storage*`, `config/links.js`                   | Guarded versioned storage and configurable survey URL.                                                        |
| `apps/web/src/components/*`, `styles/*`, feature styles          | Native actions, accessible names/focus, approved colours/arrows and responsive layouts.                       |
| `apps/web/tests/*`, `tests/e2e/*`                                | Validation, translations, hash routes, storage, transport and real proxy regression coverage.                 |
| `eslint.config.js`, `.gitattributes`, `.editorconfig`            | Unused-variable warnings, direct-storage guard and LF formatting.                                             |
| `apps/web/scripts/*`, `.github/workflows/*`                      | Reproducible previews/screenshots and proxy integration check.                                                |
| `docs/ui/frontend/*`                                             | Refreshed gallery, manifest and verification notes.                                                           |

See the PR file list for the complete diff, and [verification notes](../ui/frontend/review-notes.md) for measured results and limitations. No private environment, database, mailbox or generated dependency directory is included.
