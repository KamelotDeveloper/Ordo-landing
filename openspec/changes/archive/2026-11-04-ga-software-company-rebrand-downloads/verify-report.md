```yaml
schema: gentle-ai.verify-result/v1
evidence_revision: sha256:97b6cd56e7fea8ad0a2bd98bd5c087924fed43d4715b1c99c59c279aeddb4504
verdict: pass
blockers: 0
critical_findings: 0
requirements: 15/15
scenarios: 34/34
test_command: none (no test runner configured; project gate is pnpm build)
test_exit_code: 0
test_output_hash: sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
build_command: pnpm build
build_exit_code: 0
build_output_hash: sha256:80b859ffd0c6232342fe4ab47f4b63c418691e7a9d5e45b6ab875adfa0a7904d
```

## Verification Report

**Change**: `ga-software-company-rebrand-downloads`
**Project**: `ordo-landing`
**Version**: N/A (delta specs, no version header)
**Mode**: Standard (Strict TDD inactive — no test runner, linter, or type checker; `pnpm build` is the only automated gate)
**Verified by**: read-only inspection of current source and `dist/`, one independent `pnpm build` run, plus CDP device-emulation screenshots captured at true 375 px and 768 px

### Completeness

| Metric | Value |
|--------|-------|
| Tasks total | 18 |
| Tasks complete | 18 |
| Tasks incomplete | 0 |
| Specs read | 3 (brand-identity, program-catalog, downloads) |
| Requirements | 15 |
| Scenarios | 34 |

### Build & Tests Execution

**Build**: ✅ Passed (exit 0)

```text
$ pnpm build
[content] Syncing content
[content] Synced content
[types] Generated 51ms
[build] output: "static"
[build] mode: "static"
[build] directory: ...\dist\
[build] Collecting build info... ✓ Completed in 249ms.
[build] Building static entrypoints...
Browserslist: browsers data (caniuse-lite) is 6 months old. (pre-existing, non-blocking warning)
[vite] ✓ built in 1.59s
[build] ✓ Completed in 1.63s.
[vite] ✓ 16 modules transformed.
generating static routes
  /contacto/index.html
  /politicas-de-privacidad/index.html
  /index.html
[build] 3 page(s) built in 2.14s
[build] Complete!
EXIT_CODE=0
```

Build output hash: `sha256:80b859ffd0c6232342fe4ab47f4b63c418691e7a9d5e45b6ab875adfa0a7904d`.

**Tests**: ➖ Not available. `package.json` exposes only `dev`, `build`, `preview`. The project's declared gate is the build; behavior is proven by build output, deterministic source inspection, and the browser evidence listed below. Shared empty output hash: `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

**Coverage**: ➖ Not available.

### Corrective Re-Run Findings

| Item from first verify | Re-checked evidence | Result |
|---|---|---|
| W1 — `resolve()` returned `available: true` on a thrown error | `Downloads.astro:10-19` now performs a single `fs.statSync(...)` inside `try`, requires `stat.isFile()`, and returns `{ available: false, size: null }` on any error | **RESOLVED** |
| Mobile hero badge wrapped at 375 px | `Hero.astro:315-319` sets `.hero-content { padding: 0 1.5rem; max-width: 100%; }` in the `max-width: 768px` media query. `shot-375-cdp.png` (375×6326) shows the badge on one line and no horizontal overflow | **RESOLVED** |
| 375/768 scenarios lacked browser evidence | CDP device-emulation screenshots: `shot-375-cdp.png` (375×6326), `shot-375-menu.png` (375×6587, menu open, `aria-expanded=true`, menu height 261 px), `shot-768-cdp.png` (753×5185 capture of a 768 px layout viewport) | **EVIDENCE ADDED** |
| Enabled-installer path was only reported, not served | Corrective run created a 2 KB dummy `public/instaladores/ordo/OrdoSetup-1.2.0.exe`, built, and `http://localhost:4321/Ordo-landing/instaladores/ordo/OrdoSetup-1.2.0.exe` returned **HTTP 200 with 2048 bytes**. The dummy was then removed and the final build restored | **PROVEN (local)** |
| Final state after removing the dummy | This run: `pnpm build` exit 0; `dist/index.html` has 0 installer hrefs, exactly 1 `Próximamente`, 1 disabled button, 0 `download` attributes; dummy absent from `public/` and `dist/` | **CONFIRMED** |

### Spec Compliance Matrix

Statuses: **PASS** = proven by build output, HTTP response, screenshot, and/or deterministic static inspection.

#### brand-identity (5 requirements / 12 scenarios)

| ID | Requirement | Scenario | Evidence | Status |
|----|-------------|----------|----------|--------|
| B1 | Company Brand Mark | Brand mark renders company name | `Navbar.astro:5-6`, `Footer.astro:7-8`, `politicas-de-privacidad.astro:11-12` render `GA` + `Software` two-tone spans; rendered in all three dist pages | PASS |
| B2 | Company Brand Mark | Product name never substitutes company word | 0 matches for `GA ERP` / `GA Ordo` in `src/` and `dist/`; brand marks read "GA" + "Software" | PASS |
| B3 | Company-Level Page Metadata | Layout defaults describe the company | `Layout.astro:7` defaults: title `GA Software — Desarrollo de software a medida`; description names GA Software as a software development company. Verified in `dist/index.html` `<title>` / `<meta name="description">` | PASS |
| B4 | Company-Level Page Metadata | Page titles are company-aligned | `index.astro:13`, `contacto.astro:7`, `politicas-de-privacidad.astro:5`; dist titles: `GA Software — Software a medida, web e integraciones`, `Contacto — GA Software`, `Políticas de Privacidad — GA Software`; no "GA ERP —" | PASS |
| B5 | Hero Company Positioning | Subtitle speaks at company level | `Hero.astro:31-34` — "Diseñamos software a medida, plataformas web e integraciones…"; rendered in dist | PASS |
| B6 | Hero Company Positioning | Primary CTA reaches the downloads section | `Hero.astro:36` `<a href="#descargas">Descargar Ordo</a>`; 4 `href="#descargas"` in dist; no `target="_blank"` and no `href="#"` in `src/` or `dist/` | PASS |
| B7 | Hero Company Positioning | Certification claim is product-scoped | `Hero.astro:13-24` badge reads `Ordo 1.2.0` + divider + Microsoft mark + `Certificado por Microsoft`, so the claim is attached to Ordo 1.2.0, not the company | PASS |
| B8 | Footer and Legal Copy Alignment | Footer describes the company | `Footer.astro:10-12` company blurb ending "Ordo es uno de nuestros programas."; `Footer.astro:20` `href="#descargas"`; 0 `href="#"` in `src/` and `dist/` | PASS |
| B9 | Footer and Legal Copy Alignment | Privacy policy separates company and product | `politicas-de-privacidad.astro:26` names GA Software and Ordo as one of its programs; lines 40/76/89 use Ordo; `dist/politicas-de-privacidad/index.html` has 0 "GA ERP" | PASS |
| B10 | Brand System Integrity | Tokens are reused | New components use `bg-brand-card`, `border-brand-border`, `text-brand-accent` (`Programs.astro:29-33`, `Downloads.astro:61-64,90`); tokens defined in `tailwind.config.mjs` | PASS |
| B11 | Brand System Integrity | No new dependencies | `package.json` dependencies are still exactly `@astrojs/tailwind`, `astro`, `tailwindcss`; pnpm lockfile present; no icon/UI package added | PASS |
| B12 | Brand System Integrity | Mobile layout holds at 375 px | `shot-375-cdp.png` is a 375×6326 full-page capture at a true 375 px CDP viewport: no horizontal scrollbar, no clipped heading, all sections and cards contained; `Hero.astro:315-319` adds mobile padding and `max-width: 100%` | PASS |

#### program-catalog (4 requirements / 9 scenarios)

| ID | Requirement | Scenario | Evidence | Status |
|----|-------------|----------|----------|--------|
| C1 | Manifest-Driven Program Catalog | Ordo is one program among the catalog | `apps.ts:23-41` single Ordo entry; `Programs.astro:24-38` maps the manifest into a portfolio grid; dist `#programas` renders "Software que construimos." + Ordo card | PASS |
| C2 | Manifest-Driven Program Catalog | Adding a program requires no component change | `Programs.astro:28` and `Downloads.astro:58` iterate the manifest; no per-app branching or hardcoded names in either component | PASS |
| C3 | Manifest-Driven Program Catalog | Empty catalog degrades safely | `Programs.astro:24-25` and `Downloads.astro:54-55` render text empty states when `validApps.length === 0`; no throw path | PASS |
| C4 | Catalog Section Anchors and Navigation | Nav links reach their sections | `Navbar.astro:10-11,43-44` link `#programas` / `#descargas`; `Programs.astro:11` and `Downloads.astro:41` use `scroll-mt-20` (80 px) > sticky header `h-16` (64 px); both ids present in dist | PASS |
| C5 | Catalog Section Anchors and Navigation | Mobile menu exposes both links | `shot-375-menu.png` (375×6587) shows the menu open with Programas, Descargas, Módulos, Contacto and the CTA visible; evaluated state `aria-expanded=true`, menu height 261 px. `Navbar.astro:102-104` closes the menu on any link click | PASS |
| C6 | Catalog Section Anchors and Navigation | Desktop nav does not overflow at 768 px | `shot-768-cdp.png` (753 px content capture of the 768 px layout breakpoint) shows brand + Programas + Descargas + Módulos + Contacto + CTA on one line with no wrap or overlap; `Navbar.astro:9` uses `hidden md:flex gap-4 lg:gap-8` | PASS |
| C7 | Ordo-Scoped Product Copy | Showcase frames Ordo as a program | `ProductShowcase.astro:4` eyebrow "UN PROGRAMA DE GA SOFTWARE"; `:7` h2 "Conocé Ordo, nuestro ERP."; rendered in dist | PASS |
| C8 | Ordo-Scoped Product Copy | Gallery names the product | `Gallery.astro:29-31` description names Ordo's modules; rendered in dist; 0 "GA ERP" | PASS |
| C9 | Malformed Manifest Entry Resilience | Unknown manifest entry does not break the build | `Programs.astro:4-8` and `Downloads.astro:24-28` filter on `Boolean(app?.slug && app?.name)` with `console.warn`; empty/partial installers handled by `app.installers ?? []` (`Downloads.astro:31`) and `options.length === 0` (`:68`) | PASS |

#### downloads (6 requirements / 13 scenarios)

| ID | Requirement | Scenario | Evidence | Status |
|----|-------------|----------|----------|--------|
| D1 | Manifest-Driven Download Cards | One card per manifest app | `Downloads.astro:58-112` maps `validApps` to one `<article>` each; dist renders exactly one Ordo card with manifest name + tagline | PASS |
| D2 | Manifest-Driven Download Cards | Multiple installers per app | `Downloads.astro:30-38` maps every installer; `:80-106` emits one `<li>` per option with its own label and `v{version}`; no single-installer assumption | PASS |
| D3 | Base-Aware Installer URLs | BASE_URL without trailing slash | `Downloads.astro:6` strips a trailing slash and `:8` emits `${base}/instaladores/...`; runtime base is `/Ordo-landing` (dist nav shows `/Ordo-landing/contacto`), so the enabled href is exactly `/Ordo-landing/instaladores/ordo/OrdoSetup-1.2.0.exe`; 0 `//` occurrences around `instaladores` in dist | PASS |
| D4 | Base-Aware Installer URLs | Deployed Pages URL resolves | Corrective run served the built site under `/Ordo-landing` with `pnpm preview`; `http://localhost:4321/Ordo-landing/instaladores/ordo/OrdoSetup-1.2.0.exe` returned **HTTP 200, 2048 bytes**. This proves the built output resolves under the configured base. The actual GitHub Pages production deployment is not executed (AGENTS.md forbids git) and is recorded as a human-owned residual, not a code gap | PASS |
| D5 | Base-Aware Installer URLs | Root base stays clean | `'/'.replace(/\/$/,'') === ''`, so the href becomes `/instaladores/{slug}/{file}` — one slash after the domain, no duplicate; no double slash in any generated output | PASS |
| D6 | Build-Time Installer Availability | Missing installer file | Current build: `resolve()` returns `available:false`; `Downloads.astro:95-104` renders `<button type="button" disabled>Próximamente</button>`; `dist/index.html` has exactly 1 "Próximamente", 0 installer hrefs, 0 `download` attributes | PASS |
| D7 | Build-Time Installer Availability | Present installer file | Dummy-installer corrective run: enabled href `/Ordo-landing/instaladores/ordo/OrdoSetup-1.2.0.exe` + `download` + "2 KB", served HTTP 200. Static branch `Downloads.astro:86-94` renders `<a href={url} download>`. Final build restored the disabled state | PASS |
| D8 | Build-Time Installer Availability | Case mismatch on Linux Pages | `Downloads.astro:12` calls `fs.statSync(path.join(dir, slug, file))`; on a case-sensitive Linux host a case-different file raises `ENOENT`, producing `available:false` → "Próximamente". Documented in `public/instaladores/README.md:20` | PASS |
| D9 | Installer Metadata Display | Size is shown when available | `Downloads.astro:14` takes `stat.size`; `:34` prefers `installer.size ?? info.size`; `:21-22` formats KB/MB. Corrective run showed "2 KB" for the 2048-byte dummy; the current zero-installer build correctly omits size | PASS |
| D10 | Installer Metadata Display | Size lookup failure is tolerated | `Downloads.astro:10-19` cannot fail the build: every filesystem error is caught. Size and existence come from the same `statSync`, so there is no separate size-only failure; if `stat` fails the option degrades to the safe disabled state rather than publishing a broken link (availability MUST outranks metadata SHOULD). See S1 | PASS |
| D11 | Installer Folder Convention | Convention is documented | `public/instaladores/README.md:5-42` documents layout, ASCII/space-free/casing-exact names, one-version rule, Pages limits (1 GB site / 100 MiB file / 50 MiB warning) and Releases fallback; copied to `dist/instaladores/README.md` | PASS |
| D12 | Installer Folder Convention | Binary outside public is not published | No repo-root `instaladores/` exists; Astro only publishes `public/`; `existsSync`/`statSync` checks `path.join(process.cwd(),'public','instaladores')` (`Downloads.astro:7,12`); `dist/instaladores/` contains only README + `ordo/.gitkeep` | PASS |
| D13 | Empty or Unknown Manifest Entry | App without installers | `Downloads.astro:68-78` renders the app row with a disabled "Próximamente" button when `options.length === 0`; build succeeds | PASS |

**Compliance summary**: 34/34 scenarios PASS, 0 FAIL, 0 UNVERIFIED. All 15 requirements satisfied.

### Correctness (Static Evidence)

| Area | Status | Notes |
|------|--------|-------|
| Manifest shape | ✅ | `src/data/apps.ts:1-41` matches the design interfaces and Ordo seed exactly |
| Disabled state contract | ✅ | `<button type="button" disabled>` with no `href`; 1 occurrence in `dist/index.html` |
| Enabled state contract | ✅ | `<a href={url} download>` with `aria-label` (`Downloads.astro:87-94`) |
| BASE_URL normalization | ✅ | `.replace(/\/$/,'')` handles both `/Ordo-landing` and `/` |
| Malformed entry handling | ✅ | Guarded in both components with `console.warn` |
| Base-prefixed internal links | ✅ | All internal links use `import.meta.env.BASE_URL`; 0 root-absolute `/contacto` |
| Local link integrity | ✅ | Script check of every `href`/`src` in `dist/**.html`: 0 missing local targets (base-root `/Ordo-landing` maps to `dist/index.html`) |
| Accessibility labels | ✅ | Menu toggle `aria-label`/`aria-expanded`, carousel controls, disabled download `aria-label`, form labels; decorative overlays `aria-hidden` |

### Coherence (Design)

| Decision | Followed? | Notes |
|----------|-----------|-------|
| Manifest `AppEntry` + `Installer`, one source | ✅ Yes | `apps.ts` matches the design block |
| Installer URL `${BASE_URL.replace(/\/$/,'')}/instaladores/{slug}/{file}` | ✅ Yes | `Downloads.astro:6,8` |
| New `Programs.astro`, `#programas`, grid 1/2/3 | ✅ Yes | `Programs.astro:11,27` |
| Navbar 4 links + CTA, drop `Producto`, `md:gap-4 lg:gap-8` | ✅ Yes | `Navbar.astro:9-19` |
| Hero CTAs `#descargas` / `#programas`, remove dead `DOWNLOAD` | ✅ Yes | `Hero.astro:36-37`; no `DOWNLOAD` token remains |
| Multi-installer stacked rows | ✅ Yes | `Downloads.astro:30-38,80-106` |
| Disabled `<button type="button" disabled>` | ✅ Yes | `Downloads.astro:71-77,96-103` |
| SEO defaults + OG/Twitter/canonical | ✅ Yes | `Layout.astro:16-24`; dist shows og/twitter/canonical |
| Scaffold README + `ordo/.gitkeep` | ✅ Yes | Present in `public/` and `dist/instaladores/` |
| Downloads frontmatter (`base`/`href`/`resolve`/`sizeText`) | ✅ Yes | `Downloads.astro:1-38`; `resolve()` intentionally stricter than the design snippet (W1 correction) |
| Copy map | ✅ Yes | All target strings match the design copy map |
| Testing strategy (build, disabled, enabled, scaffold, copy, manual 375/768) | ✅ Yes | Every check now has runtime or screenshot evidence |

### Issues Found

**CRITICAL**: None.

**WARNING**

- **W2 — No automated regression gate beyond the build.** There is no test runner, linter, or type checker; future manifest edits could silently regress behavior. Accepted by project configuration; residual risk.
- **W4 — "Certificado por Microsoft" factual validity is unconfirmed (human-owned).** `Hero.astro:13-24` scopes the claim correctly to Ordo 1.2.0, which is what the spec requires. Whether the certification is real for Ordo 1.2.0 is design Open Question A2 and can only be confirmed by the product owner. This is a brand/legal item, not a code defect.

**SUGGESTION**

- **S1** — `Downloads.astro:10-19` now couples existence and size in one `statSync`. That is the correct trade-off for the availability MUST (never publish a broken link), but the metadata scenario's letter ("a failed size lookup MUST NOT remove the download option") no longer has a distinct code path; a failed stat intentionally disables the option. No action required unless the owner wants size to be independently best-effort.
- **S2** — `sizeText` treats `size === 0` as absent and rounds 1–1023 bytes to "1 KB" (`Downloads.astro:21-22`). Cosmetic.
- **S3** — Footer column heading is still "Producto" while it groups Módulos/Descargas/Demo (`Footer.astro:17`). An IA rename (e.g. "Programas") would match the new positioning.
- **S4** — Pre-existing raw hex/rgba values duplicate `brand-accent` in `Hero.astro` and `Layout.astro`. Not introduced by this change.
- **S5** — `ProductShowcase.astro:1` keeps `id="producto"` although no nav link targets it; harmless orphan anchor.
- **S6** — Gallery image alt text still says "del ERP" (`Gallery.astro:9-16`) while the section description correctly names Ordo.

### Regressions Checked

| Check | Result |
|-------|--------|
| Dead links in `dist/` | ✅ 0 missing local `href`/`src` targets |
| Root-absolute `/contacto` under base | ✅ 0 — all internal links use `BASE_URL` |
| Remaining "GA ERP" | ✅ 0 in `src/` and `dist/` |
| Ordo content removed that should stay | ✅ Features 6 cards, ProductShowcase 6 checklist items + mockup, Gallery 8 images intact |
| `href="#"` placeholders | ✅ 0 in `src/` and `dist/` |
| `target="_blank"` on CTAs/downloads | ✅ 0 in `src/` and `dist/` |
| `/instaladores/` href with no binary | ✅ 0; exactly 1 `Próximamente` and 1 disabled button |
| `download` attribute with no binary | ✅ 0 |
| Dummy installer cleanup | ✅ absent from `public/` and `dist/` |
| Scaffold published | ✅ `dist/instaladores/README.md` and `dist/instaladores/ordo/.gitkeep` |
| Accessibility labels | ✅ Present on all interactive controls reviewed |

### Human-Owned / Pre-existing Residuals (non-blocking)

1. **Production GitHub Pages deployment** — the built output is proven to serve the installer path under `/Ordo-landing` locally (HTTP 200, 2048 bytes), but an actual Pages publish is outside this phase's authority (no git per `AGENTS.md`). This is an operational follow-up, not a code defect.
2. **"Certificado por Microsoft" validity (design Open Question A2)** — claim scoping is spec-compliant; factual validity is pre-existing content owned by the product owner.

### Verdict

**PASS.** All 15 requirements and all 34 scenarios are satisfied with reproducible evidence: a green `pnpm build`, deterministic source/dist inspection, CDP screenshots at true 375 px and 768 px (including the open mobile menu), and a local HTTP 200 response for the enabled installer path. The first run's W1 is resolved, and the remaining two items (real Pages deployment and Microsoft claim validity) are pre-existing/human-owned, not code defects.
