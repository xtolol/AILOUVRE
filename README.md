# AILOUVRE

A Next.js App Router project for a daily public AI art gallery, using React and plain JavaScript. The homepage implements a **frontend preview with a looping artwork carousel** based on the AILOUVRE prototype. Server functionality remains unimplemented.

## Frontend preview

The homepage includes the cream canvas, existing collage logo, handwritten exhibition details, decorative green theme label and five-frame artwork composition. The page displays the prototype's fixed exhibition: **001 · 19 October 2026 · Botanical Dreams**. On narrow screens the exhibition details stack beneath the logo.

The artwork composition starts with a larger central lavender image with a tape decoration, tilted white neighbour frames and partially cropped outer frames. It scales down on mobile while keeping glimpses of the adjacent artwork. Five presentation entries reuse three locally bundled botanical sample photos; sources are recorded in `public/artworks/SOURCES.md`. These placeholders are not model-generated gallery outputs.

Beneath the featured image, hand-drawn arrows are native **Previous artwork** and **Next artwork** buttons. The carousel starts at **03 / 05** with the italic Inter **GPT Image 2.5 Sunburst** caption. Each step updates the counter, model caption and sample rating values together. Foliage entries use **Grok Imagine Image 2.0**; flower entries use **Nano Banana 2.1**. Each sample Jev row has four filled stars and one empty star; each personal-rating row has five empty stars. These are fixed presentation values, not real model judgments, a scoring policy or saved votes. Model captions are illustrative and do not identify the sources of the sample photos.

Frames slide, scale and rotate over **450ms**, and the tape fades onto the new selection. Traversal loops smoothly in both directions between the first and last entries. Five visible positions and two hidden buffer positions keep frame keys stable across each step; the gallery height stays fixed. Extra navigation during a transition is ignored without moving keyboard focus. The timer is cleared when the carousel unmounts. With `prefers-reduced-motion: reduce`, selection changes immediately without animation or the transition delay.

Tab reaches the two arrow buttons; Enter/Space activates them. Left/Right keys also move through the artwork while focus is within the carousel. A polite status message announces the selected position and model caption. Nonselected previews and duplicate buffers are hidden from assistive technology; the selected image and star-value descriptions remain available. An empty artwork list displays a message without navigation or details; a single image displays once with both arrows disabled.

Theme/rating chevrons and stars remain decorative rather than dropdowns or voting controls. Autoplay, swipe/drag gestures, date navigation and saved votes are outside this preview. The homepage does not fetch exhibition data or call the server stubs. The dated gallery route still renders a blank shell.

Preview content lives in `src/data/demoGallery.js`, separate from the future server contracts. Every entry supplies its model caption and sample ratings; `demoFeaturedArtworkId` selects the starting frame. `GalleryCarousel` is the client component that owns selection, navigation and the animation lock. The homepage and exhibition headers remain server components. Component styles and global defaults live in `src/styles`. The main font is **Gloria Hallelujah**; **Inter** is bundled in upright and italic styles for the model-name caption. Both fonts are distributed with their SIL Open Font Licenses in `public/fonts`; no external font request is needed at runtime.

## Run locally

Use Node.js 24 LTS and npm (recommended and used for verification). Supported alternatives are Node.js 20.19+ within version 20, or 22.13+ within version 22, matching the installed lint tools. From this directory:

```sh
npm ci
npm run dev
```

Open [the homepage](http://localhost:3000) to review the static frontend, or [a dated page](http://localhost:3000/gallery/2026-10-18) to see the reserved blank shell. No API keys or environment file are needed. Stop the server with Ctrl+C.

```sh
npm run lint
npm run build
npm run start
```

`dev` starts development mode; `build` prepares production output; `start` serves an existing production build; `lint` checks code without rewriting files. Dependency installation downloads packages. Next.js writes its normal build/development artifacts. The frontend loads local image/font assets and performs no provider requests or persistent data writes. Next.js telemetry can be disabled by setting `NEXT_TELEMETRY_DISABLED=1` in your shell.

## Structure

| Folder | Role |
| --- | --- |
| `src/app` | Shared document layout, homepage shell, blank dated page and unconnected HTTP route handlers. |
| `src/components` | Gallery headers, interactive artwork carousel, synchronized details and sample star ratings; date navigation remains a placeholder. |
| `src/data` | Fixed frontend preview content, separate from server data contracts. |
| `src/styles` | Shared canvas/font defaults and component CSS modules. |
| `public` | Existing logo, local sample artwork with sources and local fonts with licenses. |
| `src/config` | Selected model identifiers and the names of judging dimensions. |
| `src/contracts` | JSDoc-only descriptions of briefs, artwork, judgments, exhibitions and usage. |
| `src/server/openrouter` | Server-only stubs for shared requests, image generation, Jev decisions and text generation. |
| `src/server/services` | Future theme selection, candidate generation, judging, publication and daily orchestration. |
| `src/server/storage` | Vendor-independent exhibition and image storage stubs. |
| `docs` | Architecture, interfaces and implementation boundaries. |

Every authored JavaScript, JSX and configuration module starts with a short block comment explaining its place in AILOUVRE. CSS also has a role comment. JSON and ignore files use valid native syntax instead of JavaScript comments:

- `package.json`: project metadata, npm scripts, runtime requirements and exact direct dependency versions.
- `package-lock.json`: npm-generated, reproducible dependency resolution; commit this alongside the manifest.
- `.gitignore`: excludes dependencies, build output, logs and real environment files while preserving `.env.example`.
- `.env.example`: commented placeholders for future server-only `OPENROUTER_API_KEY` and `CRON_SECRET` values. Never prefix secrets with `NEXT_PUBLIC_` or commit a populated environment file.
- `next.config.mjs`: empty framework configuration.
- `eslint.config.mjs`: Next.js lint rules; unused function parameters are permitted for the documented stubs, while unused local variables remain errors.

ESLint is pinned to 9.39.5 because the installed Next.js React, accessibility and import plugins declare ESLint 9 peer support. npm reports that ESLint 9 is no longer supported; upgrade the lint stack together when those plugins declare compatibility with ESLint 10. Next.js and React use the current stable releases verified when this scaffold was created.

## Reserved functionality

The future daily process is documented as: resolve theme → generate candidates → save images → judge candidates → save exhibition → publish. None of these steps is connected or implemented.

Image models: GPT Image 2.5 Sunburst, Nano Banana 2.1, Grok Imagine Image 2.0 and Muse Image. Jev identifier: `typesafe/jev-1.14`. Judging dimensions: adherence, technical integrity, aesthetics and perceived creative interpretation. No weights, rubric prompts, aggregate scores or ranking rules exist.

The reserved page routes are `/` and `/gallery/[date]`. The reserved HTTP routes are `GET /api/exhibitions/[date]` and `GET /api/cron/daily`. API routes throw `Error("Not implemented")` and produce an HTTP 500, not a success-shaped placeholder response. Do not connect a scheduler or expose these routes as working endpoints.

Server stub functions throw the same error when called with their documented parameters. They do not call each other or read credentials. Server modules use `server-only` to prevent accidental imports into client components.

Dates are reserved as `YYYY-MM-DD`, with `Europe/London` defining the future daily boundary. No parsing, timezone conversion or scheduling logic exists.

There is no database, storage vendor, deployed scheduler, authentication flow, voting, leaderboard or paid API call. Fixed frontend preview metadata is not published exhibition data. No automated feature tests are included, following `AGENTS.md`.

See [the architecture notes](docs/architecture.md) for future interfaces and API boundaries.

## Manual frontend review

Feature testing is left to developers. For the frontend preview:

- At a desktop width near 1280px, compare the centered logo, cream canvas, exhibition/date on the left and theme strip on the right with the prototype.
- At mobile widths such as 375px and 390px, confirm the logo fits, exhibition details stack and the page has no horizontal scrolling.
- Confirm the handwriting font loads locally, the logo has an accessible name and the date is readable.
- Confirm the theme label is decorative: it has no button behavior, pointer cursor or keyboard tab stop.
- Compare the large central frame, white borders, tape, neighbour rotations and outer image crops with the prototype. Sample photos are intentionally replaceable.
- On mobile, confirm the center artwork stays square, adjacent images remain partly visible and cropped frames do not cause horizontal page scrolling.
- Confirm the initial counter reads `03 / 05`, the model caption uses italic Inter and Jev/personal ratings show four/zero filled stars respectively.
- At widths down to 280px, confirm the caption and both rating rows fit without horizontal page scrolling.
- Move both directions and verify each picture reaches the center, the caption/counter follow it and the tape fades onto it. Check that gallery height stays stable.
- Move next from `05 / 05` to `01 / 05`, then previous back to `05 / 05`; repeat until traversal has passed through negative virtual positions. Check for jumps or reversed motion.
- Click repeatedly within one transition; verify only one step is taken, focus stays on the button and another step is available after 450ms.
- Tab to each arrow button and activate it with Enter/Space. Use Left/Right while focused there, then confirm those keys do not control the carousel when focus is outside it.
- Enable the operating system or browser's reduced-motion preference and verify navigation has no movement or delay. Disable the preference and verify transitions return.
- With a screen reader, verify a single selected-position announcement, the active image description and sample star values. Duplicate buffers should not be announced.
- For the empty/single-entry cases, temporarily pass `[]` or one complete demo entry to `GalleryCarousel`; verify no details/buttons for the empty case and disabled arrows for the single image. Restore the five demo entries afterward.
- Confirm the theme/rating chevrons and stars retain their decorative behavior.

`npm run lint` and `npm run build` remain available for code and production-compilation checks. The architecture notes describe the future server boundaries; their original blank-homepage description predates this preview.
