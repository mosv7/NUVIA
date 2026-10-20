# Routing and providers

`app/App.jsx` composes preview mode and AuthProvider. `routes.js` owns known hash routes; `access-policy.js` guards private routes and resumes saved onboarding; AppRouter orchestrates existing feature screens and account form state. Account markup lives in `features/auth/AuthPage.jsx`, not a duplicate router screen.

Keep the existing request generation/cancellation and token-consumption guards when extending routes. Preview routes must not perform real authentication mutations. There is no new client router or global-store dependency in this restructuring.
