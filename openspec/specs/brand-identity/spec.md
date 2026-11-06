# Delta for brand-identity

## ADDED Requirements

### Requirement: Company Brand Mark

Every user-facing brand mark MUST render "GA" immediately followed by "Software", using the existing two-tone treatment (white + `brand-accent`). The mark MUST appear in the Navbar, the Footer, and the privacy-page navigation. "ERP", "Ordo", or any product name MUST NOT stand in for the company word in a brand mark.

#### Scenario: Brand mark renders company name

- GIVEN any page in the site
- WHEN the brand mark is inspected
- THEN it renders "GA" and "Software" as two styled spans
- AND the second span uses `text-brand-accent`

#### Scenario: Product name never substitutes the company word

- GIVEN the Navbar, Footer, or privacy nav
- WHEN the brand mark text is read
- THEN it never renders "GA ERP" or "GA Ordo" as the company mark

### Requirement: Company-Level Page Metadata

Default `<title>` and meta description in the layout, plus the titles of the home, contact, and privacy pages, MUST identify GA Software as a software development company. No page MUST be titled as if "GA ERP" were the company. The home description SHOULD describe company capabilities (custom software, web, integrations) rather than ERP modules.

#### Scenario: Layout defaults describe the company

- GIVEN a page rendered without an explicit title prop
- WHEN the document head is inspected
- THEN `<title>` and `<meta name="description">` name GA Software as a software company
- AND neither identifies GA ERP as the company

#### Scenario: Page titles are company-aligned

- GIVEN the home, contact, and privacy pages
- WHEN each rendered title is read
- THEN each names GA Software and none uses "GA ERP —" as the company identity

### Requirement: Hero Company Positioning

The Hero badge, subtitle, and primary CTA MUST position GA Software as a software development company. The subtitle MUST NOT present ERP modules as the company's identity. The primary CTA MUST read as a Spanish download action, MUST target `#descargas`, and MUST NOT use `href="#"` or `target="_blank"`. Any Microsoft certification claim in the badge MUST be scoped to Ordo, not to the company.

#### Scenario: Subtitle speaks at company level

- GIVEN the homepage Hero
- WHEN the subtitle is read
- THEN it describes software development services or products in general terms
- AND Ordo is not described as the company

#### Scenario: Primary CTA reaches the downloads section

- GIVEN the Hero primary CTA
- WHEN it is activated
- THEN the browser scrolls to the `#descargas` section
- AND the anchor is relative, has no `target="_blank"`, and is not `#`

#### Scenario: Certification claim is product-scoped

- GIVEN the Hero badge shows a Microsoft certification claim
- WHEN the badge text is read
- THEN the claim is attributable to Ordo rather than to GA Software as a whole

### Requirement: Footer and Legal Copy Alignment

The Footer blurb MUST describe GA Software at company level. The privacy policy MUST name GA Software as the data controller and Ordo as a product. All user-facing occurrences of "GA ERP" used as company identity MUST be replaced by "GA Software" (product references to Ordo remain).

#### Scenario: Footer describes the company

- GIVEN the Footer
- WHEN its blurb and links are read
- THEN the blurb is company-level and a working "Descargas" link is present
- AND placeholder links (`href="#"`) are removed or explicitly parked

#### Scenario: Privacy policy separates company and product

- GIVEN the privacy policy page
- WHEN its body text is read
- THEN GA Software is identified as the controller
- AND Ordo is named as the product, with no "GA ERP" company identity remaining

### Requirement: Brand System Integrity

All brand styling MUST use the existing `brand.*` tokens from `tailwind.config.mjs` and the Inter font. No new dependency, icon package, UI library, or raw hex value that duplicates an existing token MUST be introduced. Layout MUST remain mobile-first with no horizontal overflow at 375 px.

#### Scenario: Tokens are reused

- GIVEN any restyled brand element
- WHEN its classes are inspected
- THEN `brand-base`, `brand-card`, `brand-border`, or `brand-accent` is used instead of a duplicate raw hex

#### Scenario: No new dependencies

- GIVEN `package.json` after the change
- WHEN it is compared with the previous version
- THEN no new runtime or icon/UI dependency has been added

#### Scenario: Mobile layout holds

- GIVEN a 375 px viewport
- WHEN every rebranded section is rendered
- THEN no horizontal scrolling or clipped heading occurs
