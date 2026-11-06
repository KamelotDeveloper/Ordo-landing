# Exploration: GA Software company rebrand + downloads section

**Decision up front:** position GA Software as the software development company, keep Ordo as the flagship showcased program, and ship downloads as a static, manifest-driven section (`src/data/apps.ts` + `Downloads.astro`) that checks for installer files at build time and renders a disabled "Próximamente" state when a binary is missing. Installers must live under `public/instaladores/<app>/` and must be committed for GitHub Pages to serve them. `import.meta.glob` over `src/` is rejected for binaries.

## 1. Current state inventory

### Pages and shell

| File | Role | Product vs company framing |
|---|---|---|
| `src/layouts/Layout.astro` | HTML shell, meta title/description defaults, Google Fonts, ambient background, scroll animation observer | Defaults are product-specific: `GA ERP — El ERP que tu empresa realmente necesita` |
| `src/pages/index.astro` | Composes Navbar, Hero, Features, ProductShowcase, Gallery, Footer | Product-specific title |
| `src/pages/contacto.astro` | Mailto contact form + Navbar/Footer | `Contacto — GA ERP` |
| `src/pages/politicas-de-privacidad.astro` | Standalone legal page with its own nav (duplicated GA ERP logo) | Body references GA ERP five times |

### Sections, anchors, copy themes

| Section / component | Anchor | Copy theme | Notes |
|---|---|---|---|
| `Navbar.astro` | — | Brand mark `GA` + `ERP`, links `Módulos`, `Producto`, `Contacto`, CTA `Probalo ahora →` | Desktop links hidden below `md`; mobile menu mirrors them; script handles open/close |
| `Hero.astro` | — (`.hero-wrapper`) | Badge `Versión 1.2.0 · Certificado por Microsoft`, H1 `El Software que tu empresa realmente necesita.`, subtitle describes GA Software as an ERP platform, buttons `DOWNLOAD` and `Ver módulos` | `DOWNLOAD` is `href="#"` — dead link. Heavy custom `<style>` + canvas particles + hologram logo |
| `Features.astro` | `#modulos` | `MÓDULOS` / `Toda tu empresa, en un solo lugar.` + 6 ERP module cards (Finanzas, Inventario, CRM, Cargos y Proveedores, Facturación Electrónica, Plataforma Unificada) | Entirely Ordo/ERP-specific |
| `ProductShowcase.astro` | `#producto` | `NUESTRO PRODUCTO` / `Conocé ORDO ERP.` + checklist + ORDO ERP mockup `POWERED BY GA SOFTWARE` | Product-level. CTAs use absolute `/contacto` instead of `BASE_URL + '/contacto'` (breaks on Pages) |
| `Gallery.astro` | `#galeria` | `GALERÍA` / `Velo con tus propios ojos.` + `Capturas reales de cada módulo de GA ERP` | 8 Ordo screenshots from `public/`; carousel with inline script |
| `Footer.astro` | `#contacto` | Brand blurb says GA Software unifies ERP areas; links `Módulos`, `Precios` (`#`), `Demo`, `FAQ` (`#`), email, `Soporte`, `LinkedIn` (`#`); copyright GA Software | Footer `id="contacto"` collides semantically with the `/contacto` route |

### Where each brand term appears

| Term | Locations |
|---|---|
| `GA ERP` (product as company identity) | `Layout.astro:7` title/description defaults; `index.astro:11`; `contacto.astro:7`; `politicas-de-privacidad.astro:5,26,27,40,76,89`; `Gallery.astro:30`; split logo in `Navbar.astro:5-6`, `Footer.astro:7-8`, `politicas-de-privacidad.astro:11-12` |
| `GA Software` | `Hero.astro:32,42`; `Footer.astro:11,38`; `ProductShowcase.astro:79`; `politicas-de-privacidad.astro:26,109`; `Layout.astro:7` |
| `Ordo` / `ORDO` | `ProductShowcase.astro:7,76-77` only |
| Download affordance | `Hero.astro:36` (`href="#"` dead) |

### Build and hosting facts

- `astro.config.mjs`: `site: 'https://KamelotDeveloper.github.io'`, `base: '/Ordo-landing'`. No `trailingSlash` set, so `import.meta.env.BASE_URL === '/Ordo-landing'` (no trailing slash).
- `deploy.yml`: GitHub Actions, Node 22, pnpm, `pnpm build`, uploads `dist` with `actions/upload-pages-artifact@v3`.
- No test runner, linter, formatter, or type checker. `pnpm build` is the only automated gate.
- `public/` currently holds 8 screenshots plus `GA logo.png` (2.1 MB). No `instaladores/` folder exists anywhere.

## 2. Gap analysis for the rebrand

| Section | Current level | Action required |
|---|---|---|
| Brand mark (Navbar, Footer, privacy nav) | `GA` + `ERP` | Replace second word with `Software`; keep the two-tone treatment |
| Hero H1 | Already company-neutral ("El Software…") | Keep or sharpen toward software development; no ERP claim |
| Hero subtitle | Product-specific (unifies finance, inventory, sales) | Rewrite at company level (custom software, web, integrations); move ERP specifics into the Ordo showcase |
| Hero CTA `DOWNLOAD` | Dead link | Point to `#descargas`; rename to Spanish (`Descargar Ordo`) |
| Hero badge `Certificado por Microsoft` | Implies company-wide certification | Either scope it to Ordo or verify before keeping |
| Features `#modulos` | Pure Ordo modules | Reframe as Ordo capabilities. Add a separate company-level section (services/what we build) only if the change should explain the company, not just list Ordo modules |
| ProductShowcase `#producto` | Ordo-specific | Keep, but frame as "one of our programs"; fix absolute `/contacto` links |
| Gallery `#galeria` | Ordo screenshots, says "GA ERP" | Rename to Ordo gallery copy |
| Downloads | Missing | New `#descargas` section + manifest + nav entries |
| Footer | Company name correct, blurb product-specific | Rewrite blurb at company level, add Descargas link, remove or park dead `Precios`/`FAQ`/`LinkedIn` links |
| Titles/meta | `GA ERP` everywhere | Update Layout defaults, all three page titles, description; add OG tags if desired |
| Privacy policy | Says GA ERP throughout | Terminology pass only (GA Software as controller, Ordo as product) — not a legal rewrite |
| Programs/portfolio | Missing | Minimum: the Ordo card. Recommended: a small program list that the downloads section can share, so "Ordo is one program" is visible, not implied |

## 3. Downloads architecture options

### Option A — Manifest + build-time existence check (recommended)

`src/data/apps.ts` describes each app and its platform artifacts; `Downloads.astro` maps over it and calls `fs.existsSync` in frontmatter to decide between a live link and a "Próximamente" badge.

```ts
// src/data/apps.ts
export interface Installer {
  os: 'windows' | 'macos' | 'linux';
  label: string;       // "Windows 10/11 (64-bit)"
  file: string;        // exact file name under public/instaladores/<slug>/
  version: string;
}
export interface App {
  slug: string;        // folder name under public/instaladores/
  name: string;
  tagline: string;
  description: string;
  installers: Installer[];
}
export const apps: App[] = [
  {
    slug: 'ordo',
    name: 'Ordo',
    tagline: 'ERP para gestionar tu empresa de punta a punta',
    description: 'Finanzas, inventario, ventas y operaciones en una sola plataforma.',
    installers: [
      { os: 'windows', label: 'Windows 10/11 (64-bit)', file: 'OrdoSetup-1.2.0.exe', version: '1.2.0' },
    ],
  },
];
```

```astro
---
import fs from 'node:fs';
import path from 'node:path';
import { apps } from '../data/apps';

const base = import.meta.env.BASE_URL;
const exists = (slug: string, file: string) =>
  fs.existsSync(path.join(process.cwd(), 'public', 'instaladores', slug, file));
const sizeOf = (slug: string, file: string) => {
  try { return fs.statSync(path.join(process.cwd(), 'public', 'instaladores', slug, file)).size; }
  catch { return null; }
};
---
```

- Pros: one source of truth; typed and easy to extend; graceful missing-file UX today (no binaries in repo); no runtime JS; stable URLs; CI (Linux) exercises the same existence check that production needs, catching case-sensitivity mistakes; file size/version can be derived or validated at build.
- Cons: adding a release means editing the manifest; manifest and disk can drift (mitigated by the check); requires `node:fs` in frontmatter (build-time only, fine for static output).
- Effort: Medium.

### Option B — Pure static markup with hardcoded links

- Pros: zero abstraction, lowest effort.
- Cons: dead links until binaries exist, no "Próximamente" state, duplicated markup per app/OS, no case-sensitivity guard. Fails the current reality (no installers yet).
- Effort: Low.

### Option C — `import.meta.glob` over a src-based assets folder

```ts
const files = import.meta.glob('/src/assets/instaladores/**/*', { eager: true, query: '?url', import: 'default' });
```

- Pros: automatic discovery, no manifest drift, Vite-managed URLs.
- Cons: `public/` is outside the Vite module graph ("copied directly to the final build untouched without being bundled"), so the planned `instaladores/` layout does not work; binaries would be pulled through the asset pipeline with hashed names (unstable download URLs) and extra build cost; Astro's asset pipeline targets images/fonts, not installers; glob path must be `src/`, which contradicts the user's folder plan.
- Effort: Medium (and wrong shape).

### Recommendation

**Option A.** This repo is a static GitHub Pages site with no backend and no binaries yet. A manifest plus build-time `fs` check is the only option that (1) ships a correct "Próximamente" state on day one, (2) keeps download URLs stable and base-prefixed, and (3) fails safe on Pages' case-sensitive filesystem because the same check runs on the Ubuntu CI runner. Option C is disqualified by the `public/` constraint; Option B is disqualified by the missing-binary UX.

## 4. Public URL strategy

Put binaries under `public/instaladores/<app-slug>/<file>`. Astro copies `public/` verbatim into `dist/`, and the Pages project site serves `dist` at `/Ordo-landing`.

```text
public/instaladores/ordo/OrdoSetup-1.2.0.exe
→ dist/instaladores/ordo/OrdoSetup-1.2.0.exe
→ https://KamelotDeveloper.github.io/Ordo-landing/instaladores/ordo/OrdoSetup-1.2.0.exe
```

In components, always build the URL with the base prefix:

```ts
const url = `${import.meta.env.BASE_URL}/instaladores/${app.slug}/${installer.file}`;
```

Rules:

- Never hardcode `/instaladores/...`; that resolves to the domain root and 404s on Pages.
- `import.meta.env.BASE_URL` is `/Ordo-landing` with no trailing slash in this config; do not add a second slash.
- File names must be ASCII, space-free, and casing-exact (Pages runs Linux). Prefer `OrdoSetup-1.2.0.exe` or `ordo-setup-1.2.0.exe`.
- Render `<a href={url} download>` (same-origin, so `download` is honored) and do not use `target="_blank"` for binaries.
- The root-level `instaladores/` folder the user plans to create must be created **inside `public/`**. A repo-root `instaladores/` is never published.
- Build-time existence checks read from `public/`, so a binary that is gitignored locally will render as "Próximamente" in production. Binaries must be committed (or fetched during CI) to go live.

## 5. Risks

| Risk | Evidence / impact | Mitigation |
|---|---|---|
| GitHub Pages size limits | Published site max 1 GB; repo recommended <1 GB; Git warns >50 MiB and blocks >100 MiB per file; 100 GB/month soft bandwidth | Keep only latest installers; prefer GitHub Releases for binaries and store only a URL in the manifest; never commit multiple versions |
| Case-sensitive file names | Windows dev is case-insensitive, Pages/Linux is not; `OrdoSetup.exe` vs `ordosetup.exe` becomes a production 404 | Manifest holds the exact name; build-time `fs.existsSync` runs on Ubuntu CI and turns a mismatch into "Próximamente" |
| Binaries not published | `public/` is the only folder copied to `dist`; a root `instaladores/` would be ignored | Document and enforce `public/instaladores/<app>/` |
| Missing-file UX / dead links | Current Hero `DOWNLOAD` already points to `#` | Existence check + visible disabled state; repoint Hero CTA to `#descargas` |
| CI vs local drift | Installers gitignored locally look fine in dev but missing in deploy | Commit binaries or fetch them in the workflow; the check makes the failure explicit |
| SEO/meta drift | Layout, index, contacto, privacy titles all say `GA ERP`; no OG/Twitter tags exist | Update titles/descriptions in the same change; add OG tags as optional deferral |
| Nav overflow | Desktop nav already has 3 links + CTA at `md`; adding `Programas` and `Descargas` risks crowding | Cap desktop links, verify at 768 px, keep CTA; mobile menu already stacks |
| Broken internal links | `ProductShowcase.astro` uses absolute `/contacto` twice, which breaks under `base` | Fix to `BASE_URL + '/contacto'` while touching the section |
| Installer legitimacy / trademark | `Certificado por Microsoft` badge and Microsoft logo imply certification | Verify claim or scope to Ordo; review before publishing installers |
| Brand/legal copy | Privacy policy names GA ERP as the service | Terminology pass only; do not silently rewrite legal commitments |
| Build gate is thin | No tests/lint; only `pnpm build` | Verification must include `pnpm build`, `dist/instaladores` inspection, and manual 404/missing-file checks |
| Repo hygiene | `package-lock.json` coexists with `pnpm-lock.yaml` despite pnpm-only rule | Out of scope; flag for a cleanup change |

## 6. Proposed scope boundary

### In scope

- Company-level rebrand: Navbar brand mark, Layout title/description defaults, `index.astro`, `contacto.astro` and `politicas-de-privacidad.astro` titles, Footer blurb and links, Hero copy.
- New `src/data/apps.ts` manifest and `src/components/Downloads.astro` section with `id="descargas"`.
- Navbar desktop/mobile entry for Descargas; Hero `DOWNLOAD` repointed to `#descargas`.
- Reframe Features/ProductShowcase/Gallery copy so Ordo is explicitly one showcased program (heading/eyebrow/copy changes only; keep the module cards and screenshots).
- Fix absolute `/contacto` links in `ProductShowcase.astro`.
- Document the `public/instaladores/<app>/` convention and the manifest fields; ship with zero binaries so the section renders "Próximamente".
- `pnpm build` verification and manual link/asset checks.

### Out of scope / deferred

- Actual installer binaries (user supplies them; not part of this change).
- Moving binaries to GitHub Releases, checksums, or CI download steps (design leaves a `url` override path open).
- Full company services page, About/team, portfolio detail pages, pricing, FAQ, LinkedIn, backend contact form.
- New routes such as `/descargas` — keep a single-page section for now.
- Legal rewrite of the privacy policy beyond brand terminology.
- Logo optimization (`GA logo.png` is 2.1 MB), OG image creation, i18n, and removal of the stale `package-lock.json`.

## 7. Open questions for the proposal (non-blocking)

1. Aside from Ordo, which programs should the downloads section list (even as "Próximamente")?
2. Which OS targets per app (Windows only, or Windows + macOS + Linux)?
3. Installer naming/versioning convention, and whether to publish file size and checksum.
4. Should the company-level section be a new "Servicios" block, or is the rebrand limited to Hero/Navbar/Footer plus an Ordo-framed showcase?
5. Are the existing `Certificado por Microsoft` claim and Microsoft logo accurate for the new company positioning?

## Ready for proposal

**Yes.** The approach is settled: company-level rebrand + manifest-driven downloads with build-time existence checks. Proposal/spec should lock the copy decisions in the open questions above and the `public/instaladores/<app>/` convention.
