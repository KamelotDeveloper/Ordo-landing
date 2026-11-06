# Proposal: GA Software company rebrand + downloads

## Intent

The site sells one ERP ("GA ERP"). It must sell **GA Software, a software development company**, with **Ordo as one showcased program**. No installer surface exists, and the Hero `DOWNLOAD` button is `href="#"`.

## Scope

### In Scope

- **Rebrand**: `GA` + `Software` mark; `Layout` title/description; `index`/`contacto`/privacy titles; Hero badge, subtitle, CTA; Footer blurb/links; 5 privacy `GA ERP` mentions.
- **Ordo as one program**: `Programs.astro` fed by the manifest; Features/ProductShowcase/Gallery copy scoped to Ordo.
- **`#descargas`**: per-app card, OS/version metadata, disabled "Próximamente" when the binary is missing.
- **`src/data/apps.ts`**: single source of truth for Programs + Downloads.
- **`public/instaladores/<slug>/`**: scaffold + README with naming convention.
- **Link fixes**: `DOWNLOAD` → `#descargas`; two absolute `/contacto` links in `ProductShowcase` → `BASE_URL + '/contacto'`.

### Out of Scope

Backend, auth, payments, analytics; binary CI upload, Releases, checksums; repo rename, `base` change, `/descargas` route; new dependencies.

## Assumptions Requiring Confirmation

| # | Assumption | If false |
|---|---|---|
| A1 | Ordo is Windows x64 only (inferred from the Microsoft badge, v1.2.0) | Manifest already models `installers[]`; add entries, no component change |
| A2 | "Certificado por Microsoft" is valid for GA Software | Scope the badge to Ordo, or remove it before publish |
| A3 | Only Ordo is seeded | Manifest loop already supports N apps |

## Capabilities

### New Capabilities

- `brand-identity`: company-level brand copy and page metadata.
- `program-catalog`: program list where Ordo is one entry.
- `downloads`: manifest-driven installer cards, availability state, base-prefixed URLs.

### Modified Capabilities

- None — no existing specs in `openspec/specs/`.

## Approach

Manifest + build-time existence check (explore Option A). `apps.ts` exports `App[]` (`slug`, `name`, `tagline`, `description`, `installers[{os,label,file,version}]`). `Downloads.astro` builds `${import.meta.env.BASE_URL}/instaladores/${slug}/${file}` and uses `fs.existsSync(join(cwd,'public','instaladores',slug,file))` to choose `<a href download>` or a disabled badge. The same check runs on Ubuntu CI, so a casing error becomes "Próximamente" instead of a 404.

## Affected Areas

| New | Modified | Unchanged |
|---|---|---|
| `src/data/apps.ts` (~35) — typed manifest, Ordo seed | `Navbar.astro` — `Software` mark, Descargas/Programas links (desktop + mobile) | `astro.config.mjs` |
| `src/components/Downloads.astro` (~100) — `#descargas`, cards, existence check | `Hero.astro` — badge, subtitle, `Descargar Ordo` → `#descargas` | `tailwind.config.mjs` |
| `src/components/Programs.astro` (~55) — Ordo as one program | `Features.astro`, `Gallery.astro` — Ordo-scoped copy | |
| `public/instaladores/README.md` + `ordo/.gitkeep` (~25) | `ProductShowcase.astro` — Ordo framing + `/contacto` fix | |
| | `Footer.astro` — company blurb, dead-link cleanup, Descargas | |
| | `Layout.astro`, `index.astro`, `contacto.astro`, `politicas-de-privacidad.astro` — titles, new sections | |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Pages limits (1 GB site, 100 MiB/file, 50 MiB warn) | Med | Latest installer per app only; README documents the Releases fallback |
| Case-sensitive filenames on Pages | High | Exact name in manifest; `fs.existsSync` on CI degrades mismatch to "Próximamente" |
| Binaries bloat git history | Med | One version per app; README states the rule |
| Nav overflow at 768 px with 2 new links | Med | Verify at `md`; drop "Producto" from desktop if crowded |
| `public/instaladores/README.md` is published | Low | Harmless, no secrets; noted as intentional |
| Thin build gate (no tests/lint) | Med | `pnpm build` + inspect `dist/instaladores` + manual 404 check |

## Rollback Plan

Delete `src/data/apps.ts`, `Downloads.astro`, `Programs.astro`, `public/instaladores/`, then file-revert the copy edits. No data, config, or deployment change is involved; `pnpm build` confirms restoration.

## Dependencies

None external. The user supplies installers as `public/instaladores/<slug>/<file>` matching manifest names; until then the section renders "Próximamente".

## Success Criteria

- [ ] `GA Software` is the brand everywhere; Ordo reads as a program, not the company.
- [ ] `pnpm build` passes and `dist/instaladores/` mirrors `public/instaladores/`.
- [ ] Without a binary, every card shows a non-clickable "Próximamente"; with one, the link resolves under `<base>`.
- [ ] One manifest entry + one folder adds a program end-to-end.

## Review Workload Forecast

| Metric | Value |
|---|---|
| Estimated changed lines | ~290 (new ~215 across 4 files; modified ~75 across 11 files) |
| `400-line budget risk` | Medium — ≈110 lines headroom; `Downloads.astro` is the only unbounded file |
| `Chained PRs recommended` | No — optional split: (1) rebrand + programs, (2) downloads + scaffold |
| `Decision needed before apply` | No — fits the budget; `auto-chain` remains available if `Downloads` grows |

Gate is `pnpm build` only; this repo has no tests, linter, or type checker.
