# Design: GA Software company rebrand + downloads

## Technical Approach

Both new sections render from `src/data/apps.ts`. Build-time `node:fs` checks degrade a missing binary to a disabled "Próximamente" card, so the site ships correct with zero installers.

## Architecture Decisions

| Decision | Choice | Why (rejected) |
|---|---|---|
| Manifest | `AppEntry` + `Installer` (below) | One source, no fetch (vs hardcoded) |
| Installer URL | `${BASE_URL.replace(/\/$/,'')}/instaladores/${slug}/${file}` | Correct under `/Ordo-landing` and `/`, one slash (vs root-absolute) |
| Programs | New `Programs.astro`, `#programas`, grid 1/2/3 | Keeps Ordo's checklist; refactoring `ProductShowcase` would delete it |
| Navbar | Desktop `Programas`, `Descargas`, `Módulos`, `Contacto` + CTA; drop `Producto`; `md:gap-4 lg:gap-8`; mobile mirrors | 4 links + CTA ≈674 px fits 768; 5 ≈798 overflows. Existing script handles the menu |
| Hero CTAs | Primary `#descargas` "Descargar Ordo"; secondary `#programas` "Ver programas"; delete dead `DOWNLOAD` | Spec forbids `#` and `_blank`; catalog is the company entry |
| Multi-installer | Stacked rows | Windows-only (A1), no JS (vs tabs) |
| Disabled state | `<button type="button" disabled>Próximamente</button>` | No `href`; native disabled skips focus |
| SEO | Defaults + `og:title/description/type/site_name/locale`, `twitter:card`, canonical from `Astro.site` | Dep-free; OG image deferred |
| Scaffold | `public/instaladores/README.md` (naming, one version, Pages limits) + `ordo/.gitkeep` | Keeps folders in git, no fake binary |

`file` is the exact name under `public/instaladores/<slug>/`; `size` (bytes) overrides the stat. Seeded entry:

```ts
export type Platform = 'windows' | 'macos' | 'linux';
export type AppStatus = 'available' | 'coming-soon';

export interface Installer {
  platform: Platform; label: string; file: string; version: string; size?: number;
}

export interface AppEntry {
  slug: string; name: string; tagline: string; description: string;
  category: string; status: AppStatus; featured?: boolean; installers: Installer[];
}

export const apps: AppEntry[] = [{
  slug: 'ordo', name: 'Ordo',
  tagline: 'ERP para gestionar tu empresa de punta a punta',
  description: 'Finanzas, inventario, ventas y operaciones en una sola plataforma.',
  category: 'ERP', status: 'available', featured: true,
  installers: [{ platform: 'windows', label: 'Windows 10/11 (64-bit)', file: 'OrdoSetup-1.2.0.exe', version: '1.2.0' }],
}];
```

### Downloads frontmatter

```astro
---
import fs from 'node:fs'; import path from 'node:path'; import { apps } from '../data/apps';
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const dir = path.join(process.cwd(), 'public', 'instaladores');
const href = (slug: string, file: string) => `${base}/instaladores/${slug}/${file}`;
function resolve(slug: string, file: string) {
  try {
    const abs = path.join(dir, slug, file);
    return fs.existsSync(abs) ? { available: true, size: fs.statSync(abs).size } : { available: false, size: null };
  } catch { return { available: true, size: null }; }
}
const sizeText = (n: number | null) => n ? (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.ceil(n / 1024)} KB`) : null;
---
```

Enabled = `status === 'available' && available`. A `statSync` failure keeps the link. Entries missing `slug`/`name` are filtered with `console.warn`; an empty manifest renders one empty-state paragraph.

### DOM contract

Both sections are `<section id="…" class="py-20 scroll-mt-20">`. Per app: one `<article class="bg-brand-card border border-brand-border rounded-2xl p-6">` with `<h3>` name, accent category chip, `<p>` tagline, `<ul>` rows. A row is the white platform label, `v{version} · {size}` in `text-gray-500 text-xs`, then one action. Neither component takes props.

### Copy map

- `Layout`: title `GA Software — Desarrollo de software a medida`; description `GA Software es una empresa de desarrollo de software: aplicaciones a medida, plataformas web e integraciones. Conocé Ordo, nuestro ERP.`; add OG + canonical.
- `index`: title `GA Software — Software a medida, web e integraciones`; render `<Programs />`, `<Downloads />` after `<Hero />`.
- `contacto` / `politicas-de-privacidad`: titles `Contacto — GA Software` / `Políticas de Privacidad — GA Software`; L26 names GA Software as controller incl. Ordo; L27, L40, L76, L89 `GA ERP` → `Ordo`; nav mark → `Software`.
- `Navbar`, `Footer`, privacy nav: mark `GA` + `Software`.
- `Hero`: badge `Ordo 1.2.0 · Certificado por Microsoft`; subtitle `Diseñamos software a medida, plataformas web e integraciones para empresas que quieren crecer con tecnología propia.`; CTAs per table.
- `Features`: eyebrow `MÓDULOS DE ORDO`; paragraph names Ordo.
- `ProductShowcase`: eyebrow `UN PROGRAMA DE GA SOFTWARE`; h2 `Conocé Ordo, nuestro ERP.`; both `/contacto` → `BASE_URL + '/contacto'`.
- `Gallery`: description `Capturas reales de cada módulo de Ordo…`.
- `Footer`: company blurb ending `Ordo es uno de nuestros programas.`; remove `Precios`/`FAQ`/`LinkedIn`; add `Descargas` → `#descargas`.

## Data Flow

```
apps.ts ──▶ Programs.astro ──▶ #programas cards
        └─▶ Downloads.astro ──▶ existsSync(public/instaladores/<slug>/<file>)
                                  ├─ true  ──▶ <a href={base}/… download>
                                  └─ false ──▶ <button type="button" disabled>Próximamente</button>
```

## File Changes

| Unit | Files | Lines |
|---|---|---|
| WU1 Rebrand | modify `Layout`, `Navbar`, `Hero`, `Footer`, `index`, `contacto`, `politicas-de-privacidad` | 65 |
| WU2 Catalog | create `src/data/apps.ts`, `Programs.astro`; modify `index`, `Features`, `ProductShowcase`, `Gallery` | 105 |
| WU3 Downloads | create `Downloads.astro`, `public/instaladores/README.md`, `ordo/.gitkeep`; modify `Footer` | 150 |

## Testing Strategy

| Layer | Check |
|---|---|
| Build | `pnpm build` exits 0 |
| Disabled | no binary → `dist/index.html` shows `Próximamente` and zero `href` containing `/instaladores/` |
| Enabled | dummy `public/instaladores/ordo/OrdoSetup-1.2.0.exe` → href `/Ordo-landing/instaladores/ordo/OrdoSetup-1.2.0.exe` with `download`, no `//` |
| Scaffold | `dist/instaladores/README.md` exists |
| Copy | `Select-String 'GA ERP'` under `src/` returns nothing |
| Manual | 375/768 px and anchor offset via `pnpm preview` |

No unit, integration, or e2e layer exists here.

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable classification, or process integration. `existsSync` only tests a declared path; nothing is opened or executed.

## Migration / Rollout

No migration or flag. The first deploy shows "Próximamente" until binaries land. Rollback: delete the three new source files plus `public/instaladores/`, revert copy, rebuild. Known limitation: the new anchors are index-only, like existing `#modulos`.

## Implementation Order

WU1 → WU2 → WU3, each ending in `pnpm build`. ≈320 authored lines (285–350), ~20% under the 400 budget. `Downloads.astro` is the only unbounded file: above ~130 lines, split WU3 into its own PR slice.

## Open Questions

- [ ] Confirm `Certificado por Microsoft` applies to Ordo 1.2.0 (A2); if false, drop the badge span.
