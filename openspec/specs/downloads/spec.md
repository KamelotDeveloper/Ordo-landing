# Delta for downloads

## ADDED Requirements

### Requirement: Manifest-Driven Download Cards

The `#descargas` section MUST render one card per app in `src/data/apps.ts`, with app name, tagline, and one download option per installer entry. Each option MUST display its platform label and version. App, platform, and file data MUST NOT be hardcoded in component markup.

#### Scenario: One card per manifest app

- GIVEN the manifest exports two apps
- WHEN the downloads section renders
- THEN exactly two cards are rendered, one per app
- AND each card shows the app name and tagline from the manifest

#### Scenario: Multiple installers per app

- GIVEN an app defines Windows, macOS, and Linux installers
- WHEN its card renders
- THEN it exposes three labeled download options under the same card
- AND each option shows its own platform label and version

### Requirement: Base-Aware Installer URLs

Every enabled download link MUST resolve to `${import.meta.env.BASE_URL}/instaladores/{slug}/{file}`. Links MUST NOT hardcode root-absolute `/instaladores/...` paths and MUST NOT produce a double slash when `BASE_URL` has no trailing slash. The link MUST be same-origin and MUST NOT use `target="_blank"`.

#### Scenario: BASE_URL without trailing slash

- GIVEN `BASE_URL` is `/Ordo-landing`
- WHEN a download href is built
- THEN the result contains exactly one slash between the base and `instaladores`
- AND the href does not start with a second leading slash

#### Scenario: Deployed Pages URL resolves

- GIVEN the built site is served under `/Ordo-landing`
- WHEN an enabled download link is followed
- THEN the installer is served with a success response
- AND the response is not a 404

#### Scenario: Root base stays clean

- GIVEN `BASE_URL` is `/`
- WHEN a download href is built
- THEN the result contains no duplicated slash after the domain

### Requirement: Build-Time Installer Availability

At build time, each installer file MUST be checked for existence at `public/instaladores/{slug}/{file}`. When present, the card MUST render an enabled anchor with the `download` attribute. When absent, the card MUST render a non-interactive disabled state labeled "Próximamente" with no `href`.

#### Scenario: Missing installer file

- GIVEN a manifest installer whose file is not in `public/instaladores/{slug}/`
- WHEN the site is built
- THEN the card shows a disabled "Próximamente" state
- AND no anchor or `href` is rendered for that installer

#### Scenario: Present installer file

- GIVEN the installer file exists at the declared path
- WHEN the site is built
- THEN the card renders an anchor with the base-prefixed href
- AND the anchor carries the `download` attribute

#### Scenario: Case mismatch on Linux Pages

- GIVEN the manifest declares `OrdoSetup.exe` but the committed file is `ordosetup.exe`
- WHEN the build runs on a case-sensitive Linux runner
- THEN the installer is treated as missing and shows "Próximamente"
- AND no broken link is published

### Requirement: Installer Metadata Display

Cards SHOULD display a human-readable file size derived at build time alongside platform and version. A failed size lookup MUST NOT fail the build or remove the download option.

#### Scenario: Size is shown when available

- GIVEN an existing installer file
- WHEN its card renders
- THEN a human-readable size is displayed with the platform and version

#### Scenario: Size lookup failure is tolerated

- GIVEN the size cannot be read for an existing file
- WHEN the site is built
- THEN the build succeeds and the download link still renders

### Requirement: Installer Folder Convention

Installers MUST live under `public/instaladores/{app-slug}/{file}`. A README in that folder MUST document the exact-name rule (ASCII, space-free, casing-exact), that only the latest version per app is published, the GitHub Pages size limits, and the Releases fallback. Binaries outside `public/` MUST NOT be treated as published.

#### Scenario: Convention is documented

- GIVEN `public/instaladores/README.md`
- WHEN it is read
- THEN it documents the folder layout, naming rules, one-version rule, and Pages limits

#### Scenario: Binary outside public is not published

- GIVEN an installer placed at repo-root `instaladores/` instead of `public/instaladores/`
- WHEN the site is built
- THEN the file is absent from `dist/`
- AND its card renders "Próximamente"

### Requirement: Empty or Unknown Manifest Entry

Apps with an empty installer list or missing required fields MUST NOT break the downloads section. Such an app SHOULD render its card with a "Próximamente" state or be skipped.

#### Scenario: App without installers

- GIVEN an app entry with an empty `installers` array
- WHEN the downloads section renders
- THEN the build succeeds
- AND the card shows no broken link (disabled state or skipped)
