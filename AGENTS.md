# GA ERP Landing Page — Agent Instructions

## Stack & convenciones

- **Astro** + **Tailwind CSS v3** (`@astrojs/tailwind`)
- **SVG inline** para íconos — NO instalar heroicons ni ningún paquete de íconos
- **Inter** vía Google Fonts `@import` en `Layout.astro` — NO por npm
- NO usar librerías de componentes UI (shadcn, daisyUI, flowbite, etc.)
- NO usar CSS custom (`<style>`) salvo que Tailwind no pueda resolver el caso
- NO correr comandos git
- mobile-first con Tailwind siempre

## Brand tokens

Definidos en `tailwind.config.mjs` como `colors.brand.*`:

| Clase | Valor |
|---|---|
| `bg-brand-base` / `text-brand-base` | `#0a0a0a` |
| `bg-brand-card` / `text-brand-card` | `#111827` |
| `border-brand-border` | `#2d2d2d` |
| `text-brand-accent` / `bg-brand-accent` | `#3b82f6` |

## Arquitectura

```
src/
├── layouts/Layout.astro        — shell HTML, meta tags, Google Fonts import, slot
├── components/
│   ├── Navbar.astro            — sticky, backdrop-blur, logo+links+CTA
│   ├── Hero.astro              — badge, h1, subtitle, dos botones
│   ├── Features.astro          — grid 3x2 de cards con módulos
│   └── ProductShowcase.astro   — dos columnas: checklist + mockup div
├── pages/index.astro           — orquesta Layout + componentes
tailwind.config.mjs
astro.config.mjs
```

Cada `.astro` component tiene su spec exacta inline en el issue. No hay desvío permitido.

## SDD workflow (Spec-Driven Development)

Este proyecto sigue SDD. Los pasos son:

1. `sdd-design` — validar que el diseño técnico refleje la spec exacta
2. `sdd-tasks` — desglosar en tareas atómicas
3. `sdd-apply` — implementar tarea por tarea, sin saltearse
4. `sdd-verify` — verificar que cada componente cumple la spec
5. `sdd-archive` — al finalizar, archivar el cambio

No implementar nada sin pasar por SDD primero.

## Reporte final obligatorio

Al terminar cualquier cambio, escribir:

```text
Archivos modificados
src/layouts/Layout.astro — [qué se hizo]
src/components/Navbar.astro — [qué se hizo]
...
tailwind.config.mjs — [qué se hizo]
astro.config.mjs — [qué se hizo]
```
