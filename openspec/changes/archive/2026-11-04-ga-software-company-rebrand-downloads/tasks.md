# Tasks: GA Software company rebrand + downloads

**Change:** `ga-software-company-rebrand-downloads`
**Context:** [proposal](proposal.md) · [design](design.md) · specs [brand-identity](specs/brand-identity/spec.md), [program-catalog](specs/program-catalog/spec.md), [downloads](specs/downloads/spec.md). Gate: `pnpm build` only; no tests/lint/types; zero installers must work.

Format: `N.N` action → files · **A:** acceptance · **D:** dependency.

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 285–350 (new ~215; modified ~75–110) |
| 400-line budget risk | Medium — 50–115 headroom; `Downloads.astro` is the only unbounded file |
| Chained PRs recommended | No — the 3 units already isolate rebrand, catalog, downloads |
| Suggested split | Single review; chain WU1 → WU2 → WU3 if `Downloads.astro` exceeds ~130 lines |
| Delivery strategy | auto-chain |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Medium

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|---|---|---|---|---|---|
| WU1 | Rebrand and copy | PR 1 | `pnpm build` | `pnpm preview`; 375/768 px | Revert 7 copy files |
| WU2 | Manifest + catalog | PR 2 | `pnpm build`; grep `id="programas"` | preview at `#programas` | Delete `apps.ts`, `Programs.astro`; revert 4 files |
| WU3 | Downloads | PR 3 | `pnpm build`; 3.4 checks | temp dummy installer → href, then delete | Delete `Downloads.astro`, `public/instaladores/`; revert `Footer`, `index` |

## WU1 — Rebrand (PR 1)

- [x] **1.1** Company frame defaults: title, description, OG/Twitter tags, canonical from `Astro.site` → `src/layouts/Layout.astro` · **A:** design copy-map tags present; no "GA ERP" · **D:** —
- [x] **1.2** Mark `GA` + `Software`; desktop `Programas`, `Descargas`, `Módulos`, `Contacto` + CTA (drop `Producto`, `md:gap-4 lg:gap-8`); mirror mobile → `src/components/Navbar.astro` · **A:** 4 links + CTA; both anchors in mobile menu · **D:** —
- [x] **1.3** Hero: badge `Ordo 1.2.0 · Certificado por Microsoft`, company subtitle, CTAs `Descargar Ordo → #descargas` / `Ver programas → #programas`, delete `DOWNLOAD` → `src/components/Hero.astro` · **A:** no `href="#"`, no `target="_blank"`, no `DOWNLOAD` · **D:** —
- [x] **1.4** Footer: mark `GA` + `Software`, company blurb ending `Ordo es uno de nuestros programas.`, remove `Precios`, `FAQ`, `LinkedIn` → `src/components/Footer.astro` · **A:** zero `href="#"` · **D:** —
- [x] **1.5** Titles per design copy map; privacy nav mark `Software`; GA Software as controller incl. Ordo; `GA ERP` → `Ordo` at L27/40/76/89 → `src/pages/index.astro`, `src/pages/contacto.astro`, `src/pages/politicas-de-privacidad.astro` · **A:** no "GA ERP" in these files · **D:** —
- [x] **1.6** Build gate → `dist/` · **A:** `pnpm build` exits 0; `dist/index.html` title starts `GA Software` · **D:** 1.1–1.5

## WU2 — Program catalog (PR 2)

- [x] **2.1** Create `Platform`, `AppStatus`, `Installer`, `AppEntry`, `apps`; Ordo seed (`OrdoSetup-1.2.0.exe`, `available`, `featured`) → `src/data/apps.ts` · **A:** exactly design shape; one entry · **D:** —
- [x] **2.2** Create `#programas` (`py-20 scroll-mt-20`) from `apps`: filter missing `slug`/`name` with `console.warn`, empty state, grid 1/2/3, card name + category chip + tagline (no installer rows) → `src/components/Programs.astro` · **A:** no props; malformed/empty safe · **D:** 2.1
- [x] **2.3** Render `<Programs />` after `<Hero />` → `src/pages/index.astro` · **A:** one section, correct order · **D:** 2.2
- [x] **2.4** Ordo-scope copy: Features `MÓDULOS DE ORDO`; Showcase `UN PROGRAMA DE GA SOFTWARE`, h2 `Conocé Ordo, nuestro ERP.`, `/contacto` → `BASE_URL`; Gallery names Ordo → `src/components/Features.astro`, `src/components/ProductShowcase.astro`, `src/components/Gallery.astro` · **A:** no root-absolute `/contacto`; no "GA ERP" · **D:** —
- [x] **2.5** Build gate → `dist/` · **A:** exit 0; `id="programas"` and Ordo card present · **D:** 2.1–2.4

## WU3 — Downloads (PR 3)

- [x] **3.1** Scaffold README (layout, ASCII/casing-exact names, one version, Pages limits, Releases fallback) + `ordo/.gitkeep` → `public/instaladores/README.md`, `public/instaladores/ordo/.gitkeep` · **A:** rules documented; no binary · **D:** —
- [x] **3.2** Create `#descargas` (`py-20 scroll-mt-20`): frontmatter `base`/`href`/`resolve`/`sizeText`; filter malformed; empty state; rows show label and `v{version} · {size}`; `<a download>` when app `status` is available and the file exists, else `<button type="button" disabled>Próximamente</button>` → `src/components/Downloads.astro` · **A:** no hardcoded data; no `href` when missing; no double slash · **D:** 2.1
- [x] **3.3** Add `Descargas` → `#descargas`; render `<Downloads />` after `<Gallery />` → `src/components/Footer.astro`, `src/pages/index.astro` · **A:** link present; final order Hero, Programs, Features, Showcase, Gallery, Downloads, Footer · **D:** 3.2, 2.3
- [x] **3.4** Build gate → `dist/` · **A:** exit 0; `id="descargas"`; disabled `Próximamente`; no `/instaladores/` href; `dist/instaladores/README.md` and `ordo/` exist · **D:** 3.1–3.3

## Phase 4 — Verification

- [x] **4.1** Temp 2 KB dummy at `public/instaladores/ordo/OrdoSetup-1.2.0.exe`; build; assert `href="/Ordo-landing/instaladores/ordo/OrdoSetup-1.2.0.exe"`, `download`, `2 KB`, no `//`; delete dummy and rebuild → `public/instaladores/ordo/`, `dist/` · **A:** exact href; no dummy left · **D:** 3.4
- [x] **4.2** Final checks: no `/instaladores/` href and only disabled state; `GA ERP` absent from `src/` and `dist/`; no `target="_blank"` in Hero; `package.json` deps still `@astrojs/tailwind`, `astro`, `tailwindcss` → `dist/`, `package.json` · **A:** all pass · **D:** 4.1
- [x] **4.3** Nav markup: `hidden md:flex`, 4 desktop links + CTA, mobile `#programas`/`#descargas` → `dist/index.html` · **A:** present; 768 px fit is manual · **D:** 3.4

## Manual checks required

- **768 px:** four links + CTA on one line, no wrap/overlap; drop desktop `Módulos` if crowded.
- **375 px:** no horizontal scroll; menu opens, both links work, selecting one closes it; headings clear the sticky header.
- **Anchor scope:** `#descargas` only resolves on the home page (index-only anchors, accepted).
- **Hierarchy:** Programs reads as portfolio, Downloads as delivery; Ordo never reads as the company.
- **Claim (A2):** confirm Microsoft certification applies to Ordo 1.2.0; else remove the badge span.
- **Real installer (optional):** deployed `/Ordo-landing` download returns success, not 404, with size shown.
