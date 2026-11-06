# Archive Report: GA Software company rebrand + downloads

**Change**: `ga-software-company-rebrand-downloads`
**Project**: `ordo-landing`
**Archived**: 2026-11-04
**Archive path**: `openspec/changes/archive/2026-11-04-ga-software-company-rebrand-downloads/`
**Artifact store**: `openspec` (filesystem) + Engram archive report (`sdd/ga-software-company-rebrand-downloads/archive-report`)

## Verdict

**PASS — archived.** Verification closed at 15/15 requirements and 34/34 scenarios, with 0 blockers and 0 critical findings. No implementation task remains unchecked. This report describes the change at close, not at any earlier snapshot.

## Final-State Facts

These facts are authoritative for this archive. They outrank any intermediate `apply-progress` / `verify-report` snapshot.

- **Verification verdict**: PASS — 15/15 requirements, 34/34 scenarios, 0 blockers, 0 critical findings.
- **Tasks**: 18/18 complete; 0 unchecked.
- **Corrective fix 1 (post-apply) — `Downloads.astro` `resolve()`**: now performs one `fs.statSync` inside `try`, checks `isFile()`, and returns `{ available: false, size: null }` on any error. A read failure can no longer publish a dead installer `href`.
- **Corrective fix 2 (post-apply) — `Hero.astro` mobile media query**: the `max-width: 768px` block now sets `.hero-content { padding: 0 1.5rem; max-width: 100%; }`, fixing the 375 px badge wrapping.
- **Responsive evidence**: real 375 px and 768 px screenshots were captured via CDP. The mobile menu open state was verified (`aria-expanded=true`, menu height 261 px).
- **Enabled-installer path proven over HTTP**: a dummy 2 KB file at `public/instaladores/ordo/OrdoSetup-1.2.0.exe` was built and served at `http://localhost:4321/Ordo-landing/instaladores/ordo/OrdoSetup-1.2.0.exe` → **HTTP 200, 2048 bytes**. The dummy was then deleted and the final build restored (0 installer hrefs, exactly 1 disabled "Próximamente").
- **No new dependencies**: `package.json` dependencies remain `@astrojs/tailwind`, `astro`, `tailwindcss`.
- **No git commands were run** during apply/verify/archive content work (project `AGENTS.md` constraint). The archive move was a filesystem operation because `openspec/` is untracked.

## Delta Spec Sync

The canonical specs did not exist before this archive (only `openspec/specs/.gitkeep`), so each delta was treated as a full spec and copied mechanically with the shell (no Read → Write). Every target is byte-identical to its delta source; the `git diff --no-index` readback was empty (exit 0) and SHA256 hashes matched.

| Domain | Canonical path | Action | Requirements |
|---|---|---|---|
| `brand-identity` | `openspec/specs/brand-identity/spec.md` | Created (mechanical copy) | 5 added |
| `program-catalog` | `openspec/specs/program-catalog/spec.md` | Created (mechanical copy) | 4 added |
| `downloads` | `openspec/specs/downloads/spec.md` | Created (mechanical copy) | 6 added |

No existing requirement was modified, removed, or renamed, and no requirement was duplicated.

## Mechanical Readback (archive move)

A recursive snapshot of the change folder was taken before the move, then compared to the archived tree. The archived tree was byte-identical to the snapshot: `git diff --no-index` produced no file differences (exit 0), and every file SHA256 matched (`design.md`, `explore.md`, `proposal.md`, `tasks.md`, `verify-report.md`, and the three `specs/*/spec.md`). This report is additive and was written after that readback, so it is intentionally excluded from the comparison.

## Archive Contents

- `proposal.md` — present
- `design.md` — present
- `tasks.md` — present (18/18 complete)
- `verify-report.md` — present (verdict PASS)
- `explore.md` — present
- `specs/brand-identity/spec.md` — present
- `specs/program-catalog/spec.md` — present
- `specs/downloads/spec.md` — present
- `archive-report.md` — this file

## Installer Folder Convention (owner action)

To publish a real installer, place the binary at:

```
public/instaladores/<app-slug>/<file>
```

Rules that must be followed exactly (also documented in `public/instaladores/README.md`):

- `<app-slug>` must match the app's `slug` in `src/data/apps.ts` (currently `ordo`).
- `<file>` must exactly match the installer `file` value in the manifest (currently `OrdoSetup-1.2.0.exe`).
- Filenames must be ASCII, space-free, and casing-exact — GitHub Pages on Linux is case-sensitive.
- Publish only the latest version per app (Pages limits: 1 GB site, 100 MiB per file, 50 MiB warning; use Releases as the fallback for larger binaries).
- Binaries outside `public/` are not published. Until a matching file exists, the card renders the disabled "Próximamente" state.

## Residual Risks (human-owned, non-blocking)

1. **Production GitHub Pages deployment not performed.** The built output is proven to serve the installer path under `/Ordo-landing` locally (HTTP 200, 2048 bytes), but an actual Pages publish was outside this phase's authority (no git). This is an operational follow-up, not a code defect.
2. **"Certificado por Microsoft" claim validity (design Open Question A2).** The Hero badge correctly scopes the claim to Ordo 1.2.0 as the spec requires; whether the certification is real for Ordo 1.2.0 is pre-existing content owned by the product owner and requires confirmation before publishing.
3. **No automated regression gate beyond `pnpm build`.** No test runner, linter, or type checker is configured. Accepted project risk (W2); future manifest edits rely on the build plus manual checks.

## Notes for Future Readers

- `#programas` and `#descargas` are index-only anchors, consistent with the pre-existing `#modulos` behavior.
- `Downloads.astro` intentionally couples existence and size in one `statSync`: a failed stat degrades the option to the safe disabled state rather than publishing a broken link (availability outranks metadata best-effort).
- Suggestion S3 from verification (Footer column heading still reads "Producto") and other SUGGESTION-level items were accepted as-is and are not defects.
