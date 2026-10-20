# AILOUVRE

A Next.js App Router project for a daily public AI art gallery, using React and plain JavaScript. The homepage implements a **static frontend preview** of the AILOUVRE prototype. Server functionality remains unimplemented.

## Frontend preview

The homepage includes the cream canvas, existing collage logo, handwritten exhibition details, decorative green theme label and five-frame artwork composition. The page displays the prototype's fixed exhibition: **001 · 19 October 2026 · Botanical Dreams**. On narrow screens the exhibition details stack beneath the logo.

The static artwork composition has a larger central lavender image with a tape decoration, tilted white neighbour frames and partially cropped outer frames. It scales down on mobile while keeping glimpses of the adjacent artwork. Five presentation entries reuse three locally bundled botanical sample photos; sources are recorded in `public/artworks/SOURCES.md`. These placeholders are not model-generated gallery outputs.

Beneath the featured image, decorative hand-drawn arrows flank the **03 / 05** counter. The italic **GPT Image 2.5 Sunburst** caption uses Inter. The sample Jev row has four filled stars and one empty star; the personal-rating row has five empty stars. These are fixed presentation values, not real model judgments, a scoring policy or saved votes. The model caption is illustrative and does not identify the source of the sample photo.

The arrows, theme/rating chevrons and stars are decorative only: they are not buttons, dropdowns or keyboard tab stops. Navigation and voting are outside this static preview. Screen readers receive the artwork position and star-value descriptions; decorative SVGs are hidden. The homepage does not fetch exhibition data or call the server stubs. The dated gallery route still renders a blank shell.

Preview content lives in `src/data/demoGallery.js`, separate from the future server contracts. The featured entry supplies the model caption and sample ratings; its identifier selects the frame and determines the counter position. Component styles and global defaults live in `src/styles`. The main font is **Gloria Hallelujah**; **Inter** is bundled in upright and italic styles for the model-name caption. Both fonts are distributed with their SIL Open Font Licenses in `public/fonts`; no external font request is needed at runtime.

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

`dev` starts development mode; `build` prepares production output; `start` serves an existing production build; `lint` checks code without rewriting files. Dependency installation downloads packages. Next.js writes its normal build/development artifacts. These tooling operations are distinct from the application, which performs no network requests or data writes. Next.js telemetry can be disabled by setting `NEXT_TELEMETRY_DISABLED=1` in your shell.

## Structure

| Folder | Role |
| --- | --- |
| `src/app` | Shared document layout, static homepage preview, blank dated page and unconnected HTTP route handlers. |
| `src/components` | Gallery headers, framed artwork composition, decorative artwork details and sample star ratings; date navigation remains a placeholder. |
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

All non-rendering functions throw the same error when called with their documented parameters. They do not call each other or read credentials. Server modules use `server-only` to prevent accidental imports into client components.

Dates are reserved as `YYYY-MM-DD`, with `Europe/London` defining the future daily boundary. No parsing, timezone conversion or scheduling logic exists.

There is no database, storage vendor, deployed scheduler, authentication flow, voting, leaderboard or paid API call. Fixed frontend preview metadata is not published exhibition data. No automated feature tests are included, following `AGENTS.md`.

See [the architecture notes](docs/architecture.md) for future interfaces and API boundaries.

## Manual frontend review

Feature testing is left to developers. For the completed static preview:

- At a desktop width near 1280px, compare the centered logo, cream canvas, exhibition/date on the left and theme strip on the right with the prototype.
- At mobile widths such as 375px and 390px, confirm the logo fits, exhibition details stack and the page has no horizontal scrolling.
- Confirm the handwriting font loads locally, the logo has an accessible name and the date is readable.
- Confirm the theme label is decorative: it has no button behavior, pointer cursor or keyboard tab stop.
- Compare the large central frame, white borders, tape, neighbour rotations and outer image crops with the prototype. Sample photos are intentionally replaceable.
- On mobile, confirm the center artwork stays square, adjacent images remain partly visible and cropped frames do not cause horizontal page scrolling.
- Confirm the counter reads `03 / 05`, the model caption uses italic Inter and Jev/personal ratings show four/zero filled stars respectively.
- At widths down to 280px, confirm the caption and both rating rows fit without horizontal page scrolling.
- Confirm the arrows, rating chevron and stars have no click or keyboard behavior. A screen reader should announce the artwork position, sample Jev score and unrated personal row without reading each SVG.

`npm run lint` and `npm run build` remain available for code and production-compilation checks. The architecture notes describe the future server boundaries; their original blank-homepage description predates this preview.
