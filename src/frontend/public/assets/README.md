# Asset locations

Original Figma files are stored without modifying their image or SVG contents.

`auth/login/`, `auth/signup/`, `auth/forgot-password/`, `auth/reset-password/`: each authentication screen's illustration and icons.

`landing/en/`, `landing/ar/`: language-specific landing page icons.

`business-setup/information/`, `business-setup/information-error/`, `business-setup/branches/`, `business-setup/get-started/`: setup-specific icons, including rating faces. Rating SVGs are tinted in CSS to the user-requested colors; their source geometry is preserved.

Names describe their placement: `header-*`, `footer-*`, `form-*`, `story-*`, `hero-*`, `feature-*`, `language-section-*`.

`hero-dashboard-*` files are decorative charts/icons in the landing page's dashboard preview, not a functioning dashboard.

The file `src/assets.js` maps Figma source identifiers to these descriptive paths.

`brand/`: approved combined NUVIA logo, with transparent light/dark SVG variants and a blue V.

`dashboard/`: original overview, feedback list, empty state, and feedback detail assets.
