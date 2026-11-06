# Delta for program-catalog

## ADDED Requirements

### Requirement: Manifest-Driven Program Catalog

The program showcase MUST render exclusively from the app manifest at `src/data/apps.ts`. Ordo MUST appear as one entry in that catalog, not as the company identity. Adding a program MUST require exactly one new manifest entry plus one installer folder, with no edit to layout or component code.

#### Scenario: Ordo is one program among the catalog

- GIVEN the manifest contains Ordo
- WHEN the program showcase renders
- THEN Ordo is displayed as one catalog entry with its name and tagline
- AND the section presents the catalog as a company portfolio, not as a single product page

#### Scenario: Adding a program requires no component change

- GIVEN a second app entry is appended to the manifest
- WHEN the site is built
- THEN the new program is rendered by the existing showcase
- AND no `.astro` component is modified

#### Scenario: Empty catalog degrades safely

- GIVEN the manifest exports an empty array
- WHEN the site is built
- THEN the build succeeds and the showcase renders an empty state or is omitted
- AND no exception is thrown

### Requirement: Catalog Section Anchors and Navigation

The programs and downloads sections MUST expose stable anchors `#programas` and `#descargas` respectively, each offset so the sticky header does not cover the heading. Desktop and mobile navigation MUST link to both anchors.

#### Scenario: Nav links reach their sections

- GIVEN the Navbar desktop links
- WHEN a user activates "Programas" or "Descargas"
- THEN the viewport scrolls to the matching section heading
- AND the sticky header does not obscure it

#### Scenario: Mobile menu exposes both links

- GIVEN a 375 px viewport
- WHEN the mobile menu is opened
- THEN both "Programas" and "Descargas" links are visible and tappable
- AND activating either closes the menu and scrolls to its section

#### Scenario: Desktop nav does not overflow at 768 px

- GIVEN a 768 px viewport
- WHEN the desktop navigation renders with the added links and CTA
- THEN all items fit on one line without wrapping or overlap
- AND a lower-priority link (for example "Producto") is dropped if space is insufficient

### Requirement: Ordo-Scoped Product Copy

Feature, product-showcase, and gallery copy MUST describe Ordo as a program built by GA Software. Those sections MUST NOT present Ordo or ERP as the company, and the gallery MUST name Ordo instead of "GA ERP".

#### Scenario: Showcase frames Ordo as a program

- GIVEN the product showcase section
- WHEN its eyebrow and heading are read
- THEN they present Ordo as one of GA Software's programs
- AND GA Software remains the company voice

#### Scenario: Gallery names the product

- GIVEN the gallery section
- WHEN its description is read
- THEN it references Ordo as the product
- AND "GA ERP" does not appear as the product or company name

### Requirement: Malformed Manifest Entry Resilience

The showcase MUST skip or safely render manifest entries that are missing required fields (`slug`, `name`) without breaking the build. A build-time warning SHOULD be emitted for each malformed entry.

#### Scenario: Unknown manifest entry does not break the build

- GIVEN a manifest entry with an empty or missing `slug` or `name`
- WHEN the site is built
- THEN the build completes successfully
- AND the malformed entry is skipped or rendered with a safe placeholder
