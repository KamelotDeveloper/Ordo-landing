# Installers

Public folder for GA Software program installers. Everything here is served as-is, so it must be safe to publish.

## Layout

```
public/instaladores/
└── <app-slug>/
    └── <file>
```

- `<app-slug>` must match the `slug` field in `src/data/apps.ts`.
- `<file>` must match the `file` field of an installer in that manifest entry.
- The build checks each declared file with `fs.existsSync`. If it is missing, the download card shows a disabled "Próximamente" state instead of a broken link.

## Naming rules

- ASCII only, no spaces.
- Casing must match exactly. GitHub Pages serves from a case-sensitive Linux host, so `OrdoSetup.exe` and `ordosetup.exe` are different files.
- Include the version in the file name, for example `OrdoSetup-1.2.0.exe`.

## One version per app

Publish only the latest installer for each program. Replacing the file is fine; keeping old versions bloats git history and the generated site.

## GitHub Pages limits

| Limit | Value |
|---|---|
| Site size | 1 GB |
| Maximum file size | 100 MiB |
| Warning threshold | 50 MiB |

Large installers exceed these limits. When an installer is too big, publish it as a GitHub Release asset instead and point users there; keep only the small, current installer here.

## Checklist

- [ ] Folder name equals the manifest `slug`.
- [ ] File name equals the manifest `file` exactly.
- [ ] No old versions remain.
- [ ] File is under the Pages size limits.
