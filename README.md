# AILOUVRE

A Next.js App Router scaffold for a daily public AI art gallery, using React and plain JavaScript. **This project contains function stubs only.** Both page routes intentionally render a blank document shell.

## Run locally

Use Node.js 24 LTS and npm (recommended and used for verification). Supported alternatives are Node.js 20.19+ within version 20, or 22.13+ within version 22, matching the installed lint tools. From this directory:

```sh
npm ci
npm run dev
```

Open [the homepage](http://localhost:3000) or [a dated page](http://localhost:3000/gallery/2026-10-18). A blank page is the expected result. No API keys or environment file are needed. Stop the server with Ctrl+C.

```sh
npm run lint
npm run build
npm run start
```

`dev` starts development mode; `build` prepares production output; `start` serves an existing production build; `lint` checks code without rewriting files. Dependency installation downloads packages. Next.js writes its normal build/development artifacts. These tooling operations are distinct from the application, which performs no network requests or data writes. Next.js telemetry can be disabled by setting `NEXT_TELEMETRY_DISABLED=1` in your shell.

## Structure

| Folder | Role |
| --- | --- |
| `src/app` | Required document layout, blank daily and dated pages, and unconnected HTTP route handlers. |
| `src/components` | Null-rendering placeholders for the future gallery interface. |
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

There is no database, storage vendor, deployed scheduler, authentication flow, voting, leaderboard, image asset, mock dataset or paid API call. Installing dependencies and running the framework are the only working development operations. No automated feature tests are included for this stub-only deliverable.

See [the architecture notes](docs/architecture.md) for future interfaces and API boundaries.

## Scaffold verification

Verified without API keys: reproducible installation from the lockfile, lint, production build and production start. Both page routes returned HTTP 200 with AILOUVRE metadata and no visible application markup; both API routes returned HTTP 500 as documented. Opening role comments were checked in all 28 authored code files, and all 25 placeholder function bodies were checked to contain only their specified null return or unimplemented error. Source inspection found no application network requests, credential reads, timers or data writes. Browser automation could not launch reliably in the verification environment, so blank-page checks used the server-rendered HTML and source inspection rather than visual browser confirmation.
