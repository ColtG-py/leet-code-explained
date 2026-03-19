# Article Platform — Full Requirements & Task List
**Version 1.0 — For Developer Handoff**

---

## Overview

This document defines the full scope of a platform rebuild centered on a custom MDX-based article parser that supports scroll-driven 3D scenes, dynamic layout transitions, and a Magic UI design system. The project has two tracks: (1) a foundational framework and site upgrade, and (2) the parser/DSL system and article-level experience.

The reference experience for articles is [84-24.org](https://84-24.org). The first net-new article to validate the parser will cover Satellite Communication basics (globe + orbiting satellites).

---

## Part 1 — Platform Foundation

### 1.1 Dependency Upgrades

- [x] **Upgrade to Next.js 16**
  - Audit all pages/layouts for breaking changes in App Router behavior
  - Migrate any remaining Pages Router usage to App Router
  - Update `next.config` for new image handling, metadata API, and bundler changes
  - Verify dynamic import patterns for client-only modules (Three.js, R3F) still work under new build pipeline

- [x] **Upgrade to React 19** *(React 20 not yet available; React 19 chosen for ecosystem stability)*
  - Audit use of deprecated lifecycle patterns and legacy refs
  - Verify all third-party dependencies (R3F, Radix, Magic UI) are React 19 compatible
  - Upgraded all Radix, react-hook-form, lucide-react, react-icons, zod (v4) for compatibility

- [x] **Upgrade to Tailwind CSS v4**
  - Migrated from JS config to CSS-based `@theme` configuration
  - Removed autoprefixer (built into v4), updated PostCSS config
  - Typography plugin no longer needed as separate package (built into v4)

- [x] **Integrate Magic UI as the primary design system**
  - Installed via shadcn CLI (`npx shadcn@latest add "https://magicui.design/r/..."`)
  - Defined global design token layer (oklch colors, typography scale, spacing) in globals.css
  - Established dark-first theme via next-themes with `forcedTheme="dark"`
  - Magic UI components installed: BentoGrid, Meteors, Particles, AnimatedBeam
  - Monogram pixel-art font integrated via `next/font/local`

- [x] **Install and configure the 3D stack**
  - `@react-three/fiber` (R3F) — core renderer
  - `@react-three/drei` — helpers (useGLTF, ScrollControls, Text, Annotations, Environment, etc.)
  - `@react-three/rapier` — optional physics (satellite orbit simulation if needed)
  - `gsap` + `@gsap/react` — scroll orchestration
  - `leva` — dev-only debug panel for scene tuning
  - All Three.js / R3F imports must be behind `dynamic(..., { ssr: false })` — enforced via ESLint `no-restricted-imports` rule in `eslint.config.mjs`

---

### 1.2 Home Page Redesign

- [x] **Bento Box article grid (Magic UI `BentoGrid`)**
  - Replaced existing article list with BentoCard + ArticleGrid components
  - Each card renders: title, description, tag/category badges, read time, published date
  - Cover backgrounds: Meteors, Particles (Magic UI), gradient fallback, or 3D thumbnail
  - Cell sizing from frontmatter (`bento.size`): 1x1, 2x1, 1x2, 2x2
  - Responsive: 1-col mobile, 2-col tablet, 4-col desktop
  - Search bar above grid filters by title, description, tags, category

- [x] **Home page 3D hero element**
  - Full-viewport fixed R3F canvas as page background (behind bento grid)
  - Abstract scene: floating distorted icosahedrons + particle field in purple palette
  - Graceful degradation: `hardwareConcurrency < 4` or `prefers-reduced-motion` → gradient fallback
  - "Software, explained." title overlaid on hero, migrates to capsule header on scroll
  - Pixel ratio capped at 1.5x

- [x] **3D article card thumbnails**
  - ThumbnailCanvas component loads GLB models via `useGLTF` with autoRotate
  - `pointer-events: none`, 0.75x pixel ratio
  - Lazy-initialized via `IntersectionObserver` with 100px rootMargin
  - Loaded via `dynamic()` with `ssr: false`

---

## Part 2 — MDX Parser & Article DSL

### 2.1 MDX Infrastructure

- [x] **Configure MDX pipeline**
  - Using `next-mdx-remote` v6 (`/rsc` export) for server-side MDX compilation in App Router
  - Frontmatter parsed via gray-matter with backward-compatible defaults
  - All DSL components registered globally in `lib/mdx-components.tsx` — no imports needed in `.mdx` files
  - Existing `.md` articles renamed to `.mdx`; pipeline supports both extensions
  - Rehype plugins: `rehype-slug` (heading IDs), `rehype-pretty-code` (syntax highlighting via shiki), `rehype-autolink-headings`
  - Remark plugins: `remark-gfm` (GitHub-flavored markdown)

- [x] **Global MDX component map**
  - All standard Markdown elements remapped: h1-h6, p, blockquote, ul/ol/li, code/pre, table, img, a
  - Monogram pixel font used throughout; code blocks use monospace system font (Fira Code / Cascadia Code / JetBrains Mono)
  - Syntax highlighting themed to oklch dark palette via rehype-pretty-code + shiki `github-dark-default`
  - Code blocks include copy button and language label (`components/mdx/CodeBlock.tsx`)
  - Images wrapped with responsive sizing (`components/mdx/MDXImage.tsx`)

---

### 2.2 Table of Contents Component

- [x] **`<TableOfContents />` — auto-inferred sidebar**
  - Headings extracted from raw MDX source via regex (h1-h4) in `lib/mdx.ts` `extractHeadings()`
  - Fixed left-rail with horizontal dashes encoding heading level: h1=56px, h2=40px, h3=28px, h4=18px
  - Active heading highlighted (primary color, wider dash) via IntersectionObserver
  - **Hover-to-expand**: hovering the dash rail reveals a full frosted-glass TOC panel with heading text, indented by depth, clickable to smooth-scroll
  - Scene entries shown with cube icon prefix
  - Hidden on mobile (<768px). Tablet: collapsible toggle button.
  - Wired into article page via `app/posts/[postId]/page.tsx`

---

### 2.3 Layout System

The article layout system is the most architecturally complex part of this project. The core concept: as a user scrolls through an article, the overall page layout can change, and 3D scenes reposition and resize within those layout transitions — smoothly interpolated.

#### 2.3.1 Layout Primitives

- [x] **Define a CSS Grid-based layout engine**
  - All article layouts are 12-column CSS Grid at their base
  - Column regions are defined by semantic names, not raw column numbers
  - Built-in named layout presets:

    | Preset Name     | Description                                                    |
    |-----------------|----------------------------------------------------------------|
    | `hero`          | Single full-width region, 100vh                                |
    | `split`         | Two columns, default 50/50                                     |
    | `split-left`    | Two columns, 3D on left, prose on right                        |
    | `split-right`   | Two columns, prose on left, 3D on right                        |
    | `grid-2x2`      | Four quadrants, each independently assignable                  |
    | `prose-only`    | Single centered prose column, max-width constrained            |
    | `wide-prose`    | Full-width prose, no 3D                                        |

  - Column split ratios are configurable per-step: `ratio="60/40"`, `ratio="70/30"`, `ratio="80/20"`, `ratio="50/50"` (default). Ratio values are converted to CSS `fr` units.

#### 2.3.2 Layout Steps

- [x] **`<LayoutStep>` component**
  - An article is composed of a sequence of `<LayoutStep>` blocks
  - Each `<LayoutStep>` defines:
    - `layout` — which layout preset to use
    - `ratio` — column proportions (for split/grid layouts)
    - `scrollHeight` — how many `vh` this step occupies in the scroll timeline
    - `transition` — duration and easing of the layout transition into this step (default: `0.8s ease-in-out`)
    - Slot assignments: which content occupies which region

  ```mdx
  <LayoutStep layout="hero" scrollHeight="100vh">
    <Scene slot="main" id="earth-intro" ... />
  </LayoutStep>

  <LayoutStep layout="split-left" ratio="60/40" scrollHeight="200vh" transition="1s cubic-bezier(0.16,1,0.3,1)">
    <Scene slot="left" id="earth-intro" />   {/* same scene, repositioned */}
    <Prose slot="right">
      ## Low Earth Orbit
      ...
    </Prose>
  </LayoutStep>

  <LayoutStep layout="grid-2x2" ratio="50/50" scrollHeight="300vh">
    <Scene slot="top-left" id="earth-intro" />
    <Prose slot="top-right">...</Prose>
    <Prose slot="bottom-left">...</Prose>
    <Scene slot="bottom-right" id="antenna-model" />
  </LayoutStep>
  ```

- [x] **Layout transition engine**
  - When a scroll position crosses a step boundary, the layout grid transitions via CSS Grid interpolation + GSAP-driven bounding box animation (FLIP technique: record element bounds before/after, animate the delta)
  - The FLIP animation ensures that a 3D scene referenced across multiple steps appears to physically *move* from one grid region to another — not cut or pop
  - Layout transitions must be interruptible: if the user scrolls back up mid-transition, it reverses cleanly
  - Step boundaries fire a custom event (`layoutstep:enter`, `layoutstep:exit`) that other components can subscribe to

- [x] **Grid slot system**
  - Each named slot in a layout has a corresponding `<slot>` placeholder in the CSS Grid
  - A `<Scene id="earth-intro">` referenced in two different `<LayoutStep>` blocks uses the same mounted R3F canvas — it is DOM-moved between slots (not remounted) to preserve scene state
  - Prose slots are standard scrollable containers — text enters and exits using scroll-driven opacity/transform animations (similar to 84-24 text reveals)

---

### 2.4 Scene & 3D Component DSL

#### 2.4.1 `<Scene>`

Root container for any 3D section.

```mdx
<Scene
  id="earth-intro"            {/* unique identifier, used for cross-step referencing */}
  scrollHeight="200vh"        {/* scroll timeline length for this scene */}
  background="#050a1a"        {/* canvas background color or "transparent" */}
  fog={{ near: 20, far: 80, color: "#000020" }}
  environment="night"         {/* Drei preset: 'studio'|'city'|'dawn'|'night'|etc. */}
  pixelRatio={1.5}            {/* default: devicePixelRatio, capped at 2 */}
  shadows                     {/* enable shadow maps */}
  camera={{ fov: 45, position: [0, 2, 10] }}
/>
```

- The R3F `<Canvas>` is mounted once and kept alive for the article session
- The canvas is `position: sticky; top: 0` during its `scrollHeight` window, matching the 84-24 pattern
- Accepts `camera` prop for initial camera setup; camera is then driven by `<ScrollTrack>` / `<CameraRig>`

#### 2.4.2 `<Model>`

Loads and places a GLTF/GLB model.

```mdx
<Model
  src="/models/earth.glb"
  id="earth"                  {/* for cross-referencing in ScrollTrack */}
  position={[0, 0, 0]}
  rotation={[0, 0, 0]}
  scale={1.5}
  castShadow
  receiveShadow
  interactive                 {/* enables raycasting for hotspot hit detection */}
  orbit={{
    radius: 2.2,
    speed: 1.2,
    tilt: 15,                 {/* degrees; tilt of orbital plane */}
    axis: "y"                 {/* default orbital axis */}
  }}
  autoRotate={{ axis: "y", speed: 0.3 }}
>
  <Hotspot ... />
  <Label ... />
  <Annotation ... />
</Model>
```

- GLB files are loaded with `useGLTF` + `Suspense`. A `<SceneLoader>` fallback (spinner or skeleton) is shown while loading.
- `interactive` enables pointer events and cursor changes; non-interactive models skip raycasting entirely (performance)
- `orbit` drives a parametric circular orbit via `useFrame` — no physics needed for basic satellite motion
- `autoRotate` spins the model on its own axis (independent of orbit)
- Models should support named node targeting for animations: `animateNode="SolarPanel_L"` with a target rotation

#### 2.4.3 `<Group>`

Composable container for multiple models that move/rotate together.

```mdx
<Group
  id="earth-system"
  autoRotate={{ axis: "y", speed: 0.1 }}
  position={[0, 0, 0]}
>
  <Model src="/models/earth.glb" id="earth" />
  <Model src="/models/satellite.glb" id="leo-sat-1" orbit={{ radius: 2.2, speed: 1.2 }} />
  <Model src="/models/satellite.glb" id="leo-sat-2" orbit={{ radius: 2.2, speed: 1.2, phase: 180 }} />
</Group>
```

- `phase` offset (degrees) allows multiple satellites on the same orbit but staggered
- Groups can be nested
- Groups can be targeted by `<ScrollTrack>` keyframes

#### 2.4.4 `<Hotspot>`

An interactive anchor attached to a model node.

```mdx
<Hotspot
  id="leo-band"
  position={[0, 1.6, 0]}     {/* local model space */}
  label="LEO Band (160–2000 km)"
  description="Low Earth Orbit satellites operate here. Latency ~20–40ms."
  trigger="click"             {/* "click" | "hover" | "scroll" */}
  scrollAt={0.3}              {/* if trigger="scroll", activates at this scroll progress */}
/>
```

- Renders as a floating HTML overlay (DOM, not 3D) positioned via R3F `<Html>` from Drei
- Animated: pulsing ring on idle, expands on activate
- `trigger="scroll"` allows hotspots to auto-activate as the user scrolls through the scene's timeline

#### 2.4.5 `<Label>` and `<Annotation>`

```mdx
<Label
  text="LEO Satellite"
  position={[0, 0.5, 0]}
  font="display"              {/* "display" | "mono" | "body" */}
  size={0.12}
  color="#ffffff"
  billboard                   {/* always faces camera */}
/>

<Annotation
  target="leo-sat-1"          {/* model id */}
  label="Orbital Period: 90 min"
  connector                   {/* draws a line from annotation to target */}
  visibleAt={{ scrollStart: 0.4, scrollEnd: 0.9 }}
/>
```

- Labels use R3F `<Text>` from Drei (SDF-rendered, resolution-independent)
- Annotations use `<Html>` overlays with an SVG connector line
- Both support scroll-gated visibility

#### 2.4.6 `<Lighting>`

```mdx
<Lighting preset="space" />

{/* or manual */}
<Lighting>
  <AmbientLight intensity={0.2} />
  <DirectionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
  <PointLight position={[0, 0, 0]} intensity={2} color="#FDB813" /> {/* sun */}
</Lighting>
```

- Presets: `"studio"`, `"space"`, `"warm"`, `"cool"`, `"dramatic"`
- Manual mode allows arbitrary light composition

#### 2.4.7 `<Canvas>` (configuration override)

When used as a child of `<Scene>`, overrides canvas-level settings. Primarily for cases where per-scene canvas config differs from the scene default.

```mdx
<Canvas
  background="#050a1a"
  fog={{ color: "#000020", near: 20, far: 80 }}
  toneMapping="ACESFilmic"
  outputEncoding="sRGB"
/>
```

---

### 2.5 Scroll System

#### 2.5.1 `<ScrollTrack>` and `<Keyframe>`

The scroll animation system. `<ScrollTrack>` is a child of `<Scene>` and drives all time-based changes within that scene's scroll window.

```mdx
<ScrollTrack>
  {/* Camera movement */}
  <Keyframe at={0.0} camera={{ position: [0, 2, 10], lookAt: [0, 0, 0] }} />
  <Keyframe at={0.3} camera={{ position: [4, 1, 6],  lookAt: [0, 0, 0] }} />
  <Keyframe at={0.6} camera={{ position: [0, 8, 2],  lookAt: [0, 0, 0] }} easing="power2.inOut" />

  {/* Model transforms */}
  <Keyframe at={0.4} target="earth" rotation={[0, Math.PI, 0]} />
  <Keyframe at={0.7} target="leo-sat-1" scale={1.8} />

  {/* Visibility */}
  <Keyframe at={0.5} target="annotation-1" visible={true} />

  {/* Group transforms */}
  <Keyframe at={0.2} target="earth-system" rotation={[0.2, 0, 0]} />
</ScrollTrack>
```

- `at` is a normalized scroll progress value (0–1) within the Scene's `scrollHeight` window
- Values between keyframes are interpolated using GSAP's timeline scrubbing
- Default easing: `"none"` (linear). Per-keyframe `easing` accepts any GSAP ease string.
- Camera keyframes support `lookAt` for automatic target tracking
- `target` refers to any `id` defined on a `<Model>`, `<Group>`, `<Hotspot>`, or `<Annotation>` in the same scene

#### 2.5.2 `<CameraRig>`

Higher-level camera automation, used instead of raw Keyframes for common patterns.

```mdx
<CameraRig
  mode="orbit"               {/* "orbit" | "fly" | "pan" | "static" */}
  target={[0, 0, 0]}
  radius={8}
  scrollDriven                {/* orbit angle driven by scroll progress */}
  autoRotate={{ speed: 0.3 }} {/* when not scroll-driven */}
  enableDamping
/>
```

#### 2.5.3 Prose scroll behavior

- Prose content within `<LayoutStep>` blocks reveals via scroll-driven animation (not CSS transitions)
- Each paragraph/heading within a Prose slot gets a staggered `opacity` + `translateY` reveal as it enters the viewport — matching the 84-24 text treatment
- Reveal behavior is configurable per-step: `proseReveal="fade-up" | "fade" | "slide-left" | "none"`

---

### 2.6 `<Prose>` Component

```mdx
<Prose
  slot="right"               {/* grid slot assignment */}
  reveal="fade-up"           {/* scroll reveal animation */}
  maxWidth="68ch"            {/* typography line length */}
  padding="4rem"
>
  ## Heading content
  Regular prose...
</Prose>
```

- All standard MDX/Markdown is valid inside `<Prose>`
- Magic UI inline components (`<AnimatedBeam />`, `<NumberTicker />`, etc.) are valid inside `<Prose>`
- Code blocks, tables, blockquotes are all styled to the design system

---

### 2.7 Performance & Quality Requirements

- [x] **Frame rate budget**: `PerfMonitor.client.tsx` wraps `r3f-perf` for dev-only FPS monitoring. Pixel ratio capped at 2x in scenes, 1.5x in hero.
- [x] **Mobile degradation**: `Scene.client.tsx` checks `window.innerWidth < 768` and renders `mobilePoster` image or empty div instead of canvas. Layout collapses to single-column via `@media (max-width: 768px)` CSS rule.
- [x] **Low-power mode**: `prefers-reduced-motion` detected in Scene — disables ScrollTrigger, autoRotate, orbit. Global CSS rule disables all animations and transitions.
- [ ] **Asset optimization**: *(deferred to CI pipeline setup)*
  - GLBs must be run through `gltf-pipeline` with Draco compression at build time (CI step)
  - Max GLB size per model: 5MB compressed. Scenes with multiple models: 12MB total.
  - Texture atlasing recommended for multi-part models
- [x] **Loading states**: `SceneLoader.tsx` provides themeable loading indicators (spinner/bar/pulse) shown during Suspense while scene assets load.
- [x] **SSR safety**: ESLint `no-restricted-imports` rule in `eslint.config.mjs` blocks Three.js imports outside `components/3d/**` and `**/*.client.tsx` files.

---

## Part 3 — Existing Article Porting

### 3.1 Article Migration

- [x] **Audit all existing MDX articles**
  - All 6 articles migrated from `.md` to `.mdx`, frontmatter mapped to new schema
  - No custom components used in existing articles — all plain Markdown, renders cleanly via MDX pipeline

- [x] **Automated frontmatter migration script**
  - `scripts/migrate-frontmatter.ts` — adds `publishedAt`, validates `description`, `tags`, `bento.size`
  - Run via `npx tsx scripts/migrate-frontmatter.ts` (supports `--dry-run`)

- [x] **Restyle existing articles to design system**
  - Typography, code blocks (rehype-pretty-code), blockquotes, tables all styled via global MDX component map
  - All 6 articles verified rendering correctly
  - Bento covers assigned: Meteors, Particles, gradient fallback

### 3.2 New Article Pipeline

- [x] **Article scaffolding CLI**
  - `scripts/new-article.ts` — `npx tsx scripts/new-article.ts "Title" [--3d] [--layout]`
  - Generates slug, next chapter number, full frontmatter template
  - `--3d` flag adds Scene + Lighting scaffold, `--layout` adds LayoutStep + Prose scaffold

---

## Part 4 — Developer Experience

- [ ] **Scene debugger** (`NODE_ENV=development` only)
  - Floating `leva` panel auto-populated with all model positions, rotations, scales in the current scene
  - Live-edit values in the panel; copy resulting DSL props to clipboard
  - Timeline scrubber that manually controls scroll progress (for keyframe authoring without scrolling)

- [ ] **Type definitions for the full DSL**
  - Export a full TypeScript type package (`@yourproject/article-types`) covering all DSL component props
  - IDE autocompletion in `.mdx` files via VS Code MDX extension + type import

- [ ] **GLB validation tooling**
  - Build-time script that validates all `/public/models/*.glb` files:
    - Draco compression applied?
    - File size within budget?
    - Node names conform to naming convention (`PascalCase`, no spaces)?
  - Fails the build if validation errors are found

- [ ] **Storybook for all DSL components**
  - Each DSL component has a Storybook story demonstrating all prop combinations
  - Storybook is the canonical reference for article authors

---

## Part 5 — Implementation Sequence

Recommended order of implementation to derisk the hardest parts first:

### Phase 1 — Foundation (Weeks 1–2)
1. Dependency upgrades: Next.js 16, React 20, Tailwind, Magic UI
2. R3F stack install + SSR safety patterns established
3. Global MDX pipeline + frontmatter schema
4. Typography and base styled component map

### Phase 2 — Core DSL (Weeks 3–4)
5. `<Scene>` and `<Canvas>` — basic canvas mounting, sticky scroll
6. `<Model>` — GLB loading, Suspense, basic positioning
7. `<Group>` — nesting and collective transforms
8. `<Lighting>` presets
9. `<ScrollTrack>` + `<Keyframe>` — GSAP scrubbing MVP

### Phase 3 — Layout System (Weeks 5–6)
10. Layout preset definitions (CSS Grid)
11. `<LayoutStep>` — step sequencing and slot system
12. FLIP transition engine — layout-to-layout animation
13. Prose scroll reveal animations
14. `<Prose>` component with slot assignment
15. Scene DOM-move across layout steps (preserve canvas state)

### Phase 4 — Rich Components (Week 7)
16. `<Hotspot>`, `<Label>`, `<Annotation>`
17. `<CameraRig>` modes
18. `<TableOfContents>` with heading inference and dash encoding
19. Mobile degradation + `prefers-reduced-motion` support

### Phase 5 — Home Page & Polish (Week 8)
20. Bento Grid article listing
21. Home page 3D hero
22. 3D article card thumbnails
23. Scene debugger (leva integration)
24. Type package + Storybook

### Phase 6 — Article Migration (Week 9)
25. Frontmatter migration script
26. Per-article review and restyle verification
27. Satellite Communications article scene (first real DSL usage — treat as integration test)

---

## Appendix A — Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Scene `id` | kebab-case | `earth-intro` |
| Model `id` | kebab-case | `leo-sat-1` |
| GLB files | kebab-case | `satellite-v2.glb` |
| GLB node names | PascalCase | `SolarPanel_L` |
| Frontmatter keys | camelCase | `publishedAt` |
| Layout slots | kebab-case | `top-left` |

## Appendix B — GLB Node Naming Convention

For `<Hotspot>` and `<Annotation>` targeting to work predictably:

- Top-level mesh groups: `PascalCase` descriptive names (`EarthSphere`, `Atmosphere`, `CloudLayer`)
- Interactive anchor nodes: suffix `_Anchor` (`LEOBand_Anchor`, `GEOBand_Anchor`)
- Animation targets: suffix `_Anim` (`SolarPanel_L_Anim`)
- All node names: no spaces, no special characters except underscore

## Appendix C — Frontmatter Full Schema

```yaml
title: string                              # required
description: string                        # required
publishedAt: "YYYY-MM-DD"                  # required
tags: string[]                             # required
theme: "dark" | "light"                    # default: "dark"
bento:
  size: "1x1" | "2x1" | "1x2" | "2x2"    # default: "1x1"
  cover: "image" | "magic-ui" | "3d"      # default: "image"
  coverImage: "/covers/my-article.jpg"     # if cover: "image"
  coverComponent: "Meteors"               # if cover: "magic-ui" (Magic UI component name)
  thumbnail3d:                             # if cover: "3d"
    model: "/models/satellite.glb"
    camera: { position: [0, 1, 5] }
    autoRotate: true
    lighting: "space"
readTime: number                           # minutes; auto-calculated if omitted
```