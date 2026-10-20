# AILOUVRE

A Next.js App Router project for a daily public AI art gallery, using React and plain JavaScript. The homepage is being implemented as a **static frontend preview** of the AILOUVRE prototype, in reviewable steps. Server functionality remains unimplemented.

## Frontend preview

The first review checkpoint implements the cream canvas, existing collage logo, handwritten exhibition details and decorative green theme label. It displays the prototype's fixed exhibition: **001 · 19 October 2026 · Botanical Dreams**. On narrow screens the exhibition details stack beneath the logo.

Artwork composition and ratings will follow after this checkpoint is reviewed. The planned arrows, theme chevron and stars are decorative only; navigation, dropdowns and voting are outside this static preview. The homepage does not fetch exhibition data or call the server stubs. The dated gallery route still renders a blank shell.

Preview content lives in `src/data/demoGallery.js`, separate from the future server contracts. Component styles and global defaults live in `src/styles`. The main font is **Gloria Hallelujah**; **Inter** is bundled in upright and italic styles for the forthcoming model-name caption. Both fonts are distributed with their SIL Open Font Licenses in `public/fonts`; no external font request is needed at runtime.

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
| `src/components` | Implemented site/exhibition headers and placeholders for the remaining gallery interface. |
| `src/data` | Fixed frontend preview content, separate from server data contracts. |
| `src/styles` | Shared canvas/font defaults and component CSS modules. |
| `public` | Existing logo and locally bundled handwriting font with its license. |
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

Feature testing is left to developers. For the first checkpoint:

- At a desktop width near 1280px, compare the centered logo, cream canvas, exhibition/date on the left and theme strip on the right with the prototype.
- At mobile widths such as 375px and 390px, confirm the logo fits, exhibition details stack and the page has no horizontal scrolling.
- Confirm the handwriting font loads locally, the logo has an accessible name and the date is readable.
- Confirm the theme label is decorative: it has no button behavior, pointer cursor or keyboard tab stop.

`npm run lint` and `npm run build` remain available for code and production-compilation checks. The architecture notes describe the future server boundaries; their original blank-homepage description predates this preview.
