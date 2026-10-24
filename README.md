# AILOUVRE

A Next.js App Router project for a daily public AI art gallery, using React and plain JavaScript. The homepage implements a **frontend preview with a looping artwork carousel** based on the AILOUVRE prototype. Development mode shows a manually triggered four-model image generation experiment; production retains the botanical demo. Daily gallery services remain unimplemented.

## Frontend preview

The homepage includes the cream canvas, existing collage logo, handwritten exhibition details, decorative green theme label and five-frame artwork composition. Both modes retain the prototype's illustrative exhibition header: **001 · 19 October 2026 · Botanical Dreams**. The development ballerina experiment is not a published exhibition. On narrow screens the exhibition details stack beneath the logo. The following botanical artwork and sample-rating descriptions apply to production (`npm run build` then `npm run start`).

The artwork composition starts with a larger central lavender image with a tape decoration, tilted white neighbour frames and partially cropped outer frames. It scales down on mobile while keeping glimpses of the adjacent artwork. Five presentation entries reuse three locally bundled botanical sample photos; sources are recorded in `public/artworks/SOURCES.md`. These placeholders are not model-generated gallery outputs.

Beneath the featured image, hand-drawn arrows are native **Previous artwork** and **Next artwork** buttons. The carousel starts at **03 / 05** with the italic Inter **GPT Image 2.5 Sunburst** caption. Each step updates the counter, model caption and sample rating values together. Foliage entries use **Grok Imagine Image 2.0**; flower entries use **Nano Banana 2.1**. Each sample Jev row has four filled stars and one empty star; each personal-rating row has five empty stars. These are fixed presentation values, not real model judgments, a scoring policy or saved votes. Model captions are illustrative and do not identify the sources of the sample photos.

Frames slide, scale and rotate over **450ms**, and the tape fades onto the new selection. Traversal loops smoothly in both directions between the first and last entries. Five visible positions and two hidden buffer positions keep frame keys stable across each step; the gallery height stays fixed. Extra navigation during a transition is ignored without moving keyboard focus. The timer is cleared when the carousel unmounts. With `prefers-reduced-motion: reduce`, selection changes immediately without animation or the transition delay.

Tab reaches the two arrow buttons; Enter/Space activates them. Left/Right keys also move through the artwork while focus is within the carousel. A polite status message announces the selected position and model caption. Nonselected previews and duplicate buffers are hidden from assistive technology; the selected image and star-value descriptions remain available. An empty artwork list displays a message without navigation or details; a single image displays once with both arrows disabled.

Theme/rating chevrons and stars remain decorative rather than dropdowns or voting controls. Autoplay, swipe/drag gestures, date navigation and saved votes are outside this preview. The homepage does not fetch exhibition data or call the server stubs. The dated gallery route still renders a blank shell.

Preview content lives in `src/data/demoGallery.js`, separate from the future server contracts. Every entry supplies its model caption and sample ratings; `demoFeaturedArtworkId` selects the starting frame. `GalleryCarousel` is the client component that owns selection, navigation and the animation lock. The homepage and exhibition headers remain server components. Component styles and global defaults live in `src/styles`. The main font is **Gloria Hallelujah**; **Inter** is bundled in upright and italic styles for the model-name caption. Both fonts are distributed with their SIL Open Font Licenses in `public/fonts`; no external font request is needed at runtime.

## Generation experiment

With `npm run dev`, the homepage displays four stable model slots and a **Generate four images** button. It starts at Sunburst, **01 / 04**, with idle placeholders and **Not yet judged** instead of illustrative ratings. Generation begins only on a button click. Rendering, refreshing and navigating the carousel never start requests.

- `src/config/models.js` lists five model identifiers. The `imageApiEnabled` flag selects Sunburst, Seedream 4.5, Grok and Klein in that order; Muse is retained with the flag set to `false`. Seedream replaces Nano Banana 2.1 in the development experiment to investigate the latter's repeated rate-limit errors.
- `src/config/generation.js` contains the supplied ballerina prompt verbatim and the common settings: `aspect_ratio: "1:1"`, `n: 1`, `stream: false`. Resolution, quality, seed and reference images are left unset; native defaults and actual pixel dimensions can still differ.
- `src/contracts/generation.js` describes the model configuration, the `{ modelId }` browser request, the normalized image result and the browser slot state. These preview types are separate from published `Artwork` and `Exhibition` records.

`POST /api/generation-preview` accepts an `application/json` body containing only `{ "modelId": "<enabled model ID>" }`. The server validates eligibility and constructs `{ model, prompt, ...settings }` from configuration. Each POST sends one authenticated request to `https://openrouter.ai/api/v1/images`, with a 180-second timeout and no server retries, fallbacks or settings substitutions. The endpoint returns 404 outside development, before reading credentials or calling OpenRouter.

The response includes base64 image bytes, a validated PNG/JPEG/WebP media type, the exact prompt and sent settings, an optional provider request ID and nullable usage. Sharp decodes the image pixels to reject corrupt data and unsupported formats without resizing or re-encoding the original image. Missing usage and identifiers remain `null`; errors return `{ error: { code, message } }` with sanitized messages rather than raw provider details. A 429 additionally includes selected diagnostics in `error.metadata`: `retryAfter`, `errorType`, `providerName`, `providerCode`, `limitSource`, `reason`, `rateLimitLimit`, `rateLimitRemaining` and `rateLimitReset`. Unknown values remain `null`; only bounded plain identifiers/header values are retained, not raw provider messages or prompt content. The endpoint also forwards `Retry-After` as a response header when available. These diagnostics can be inspected on each 429 in the browser's Network panel; no error history is persisted. Responses are not cached and nothing is stored durably.

To enable development generation, copy `.env.example` to `.env.local`, set `OPENROUTER_API_KEY` and restart `npm run dev`. Never expose the key with a `NEXT_PUBLIC_` prefix. Clicking the button with a configured key can incur generation charges. A batch sends four requests when none are rate limited, or up to twelve if every model uses all three attempts. Linting and building do not trigger generation. No paid generation calls were made during implementation verification.

`GenerationGallery.handleGenerateAll()` queues all four slots, then calls `requestPreviewImage()` for each model in configuration order. Only one request is active at a time. For this development experiment, an HTTP **429** waits for the forwarded **Retry-After**, with a **30-second minimum**, before retrying the same model. The hint may be seconds or an HTTP date; a missing, invalid or expired hint falls back to 30 seconds. The browser can also read the hint from `error.metadata.retryAfter` if the header is absent. Each 429 determines its next wait independently. There are **three attempts total** (the original request plus at most two retries). Progress announces the actual wait and attempt number. Long waits are split within browser timer limits so they cannot overflow into an immediate retry. The per-request server timeout remains 180 seconds. Other errors, network failures, timeouts and invalid images are not retried. A slot remains `generating` during its retry wait; after success or a terminal failure it becomes `ready` or `error`, and the sequence continues to the next model. The button stays disabled throughout requests and retry waits, with an immediate batch guard against repeated clicks before React renders the disabled state.

For each response, `decodePreviewImage()` converts the bytes into a Blob URL and reads the browser-decoded width and height. The matching model slot receives its image and metadata, and React re-renders `GalleryCarousel` → `GalleryGrid` → `ArtworkCard`. The selected model's caption and status stay synchronized. Generated images fit inside the square frame without cropping, even if their native dimensions differ. `GalleryCarousel` retains ownership of selection, so navigation works during generation and arriving results never reset the cursor. Four logical entries repeat circularly through the existing five visible positions and two hidden buffers; duplicate content remains hidden from assistive technology.

Results exist only in React memory and reset on refresh. Starting another batch clears previous results and revokes their Blob URLs without changing selection. Unmounting aborts the browser request, cancels any retry timer, stops the remaining queue, ignores late responses and revokes image URLs, including pending image decodes. Aborting the browser request cannot guarantee cancellation or refund of generation already accepted by the provider. Slot metadata retains the exact prompt, requested settings and reported usage without retaining a second copy of the encoded image. Ratings stay `null`; no Jev judgment or vote is requested.

The experiment has no saved history, downloads, daily scheduling, storage or judging integration. `generateCandidates` and the daily service stubs remain unconnected. Production displays the original five-entry demo with its fixed sample scores; it has no generation button.

Manual server review, when intentionally exercising the endpoint:

- Confirm production returns 404, including with a valid model ID and configured key.
- In development, confirm malformed JSON, extra fields, unknown IDs and Muse return 400 before any provider call; a non-JSON content type returns 415.
- With the key unset, confirm an enabled model returns 503 without contacting OpenRouter.
- When explicitly choosing to generate, inspect the outbound request for the exact shared prompt/settings, one image and no retry. Confirm missing optional metadata stays `null`.
- Check provider rejection, rate limits, a 180-second timeout and missing/corrupt image data produce sanitized errors. Confirm raw provider responses and credentials are absent from error JSON.
- For a 429, inspect the forwarded `Retry-After` header and the selected `error.metadata` fields. Confirm absent diagnostics are `null`, raw provider messages/content are omitted and an unreadable upstream error body still preserves the 429 and its headers. Check an embedded upstream 429 error is normalized the same way.

Manual development gallery review:

- On opening or refreshing `/`, confirm four idle slots, Sunburst at `01 / 04`, and “Not yet judged.” Verify the Network panel contains no generation POSTs until the button is clicked.
- Complete a batch without 429s and confirm exactly four POSTs in Sunburst → Seedream → Grok → Klein order, with at most one active request. Each browser body must contain only `modelId`; verify identical prompt and shared settings in returned metadata/server requests.
- Click repeatedly while a batch runs and navigate both directions, including `01 / 04` ↔ `04 / 04`. Confirm no extra generation requests, stable selection, synchronized captions/status and placeholders replaced in place.
- Exercise success, non-429 provider failure, timeout, invalid image and missing-key cases. Confirm these failures are not retried and an error slot does not block subsequent models. A missing key produces four local endpoint failures without provider calls.
- For a rate-limited model, verify `Retry-After: 60` delays the next attempt at least 60 seconds; try a future HTTP date too. Check missing, invalid, expired and shorter-than-30-second hints wait at least 30 seconds. Verify the JSON metadata fallback when the header is absent, and that a 429 with unreadable JSON still honors its header. Vary the hint between attempts to confirm the delay updates each time.
- Check success on a retry stops further attempts; three consecutive 429s produce a terminal error with no fourth attempt, then the next model begins. Confirm the progress message reports the actual wait and attempt number, and repeated clicks do not bypass the delay. An unusually long hint must not overflow into an immediate retry.
- Start another batch after completion. Confirm old images disappear, all slots queue again and selection stays where it was. Reload and confirm results reset without starting another batch.
- Navigate away or unmount during a request, decode or retry wait. Confirm requests abort, retry timers are cleared, no further attempts or queued models start, late responses do not update state and created Blob URLs are revoked.
- At desktop and mobile widths down to 280px, confirm controls fit, gallery height stays stable, error text is readable and neighbouring frames remain clipped without horizontal page scrolling.
- Check Tab, Enter/Space, Left/Right keys, rapid navigation and reduced motion during generation. Confirm progress and the selected slot's status are announced, while repeated preview frames are hidden from assistive technology.
- With `npm run build` and `npm run start`, confirm the original botanical demo and `03 / 05` selection remain, no generation controls appear, and the endpoint returns 404.

## Run locally

Use Node.js 24 LTS and npm (recommended and used for verification). Supported alternatives are Node.js 20.19+ within version 20, or 22.13+ within version 22, matching the installed lint tools. From this directory:

```sh
npm ci
npm run dev
```

Open [the homepage](http://localhost:3000) to review the idle development experiment, or [a dated page](http://localhost:3000/gallery/2026-10-18) to see the reserved blank shell. No API key or environment file is needed to view the interface; successful generation requires the server-only key described above. Stop the server with Ctrl+C.

```sh
npm run lint
npm run build
npm run start
```

`dev` starts development mode; `build` prepares production output; `start` serves an existing production build with the botanical demo; `lint` checks code without rewriting files. Dependency installation downloads packages. Next.js writes its normal build/development artifacts. The frontend loads local fonts and production sample photos; development images arrive only through explicit generation. Nothing writes gallery data to persistent storage. Next.js telemetry can be disabled by setting `NEXT_TELEMETRY_DISABLED=1` in your shell.

## Structure

| Folder | Role |
| --- | --- |
| `src/app` | Shared document layout, homepage shell, blank dated page, development preview endpoint and reserved exhibition/cron handlers. |
| `src/components` | Gallery headers, generation batch state, interactive artwork carousel, status placeholders, synchronized details and demo ratings; date navigation remains a placeholder. |
| `src/client` | Browser preview requests, image decoding and generation status labels; no server credentials. |
| `src/data` | Fixed frontend preview content, separate from server data contracts. |
| `src/styles` | Shared canvas/font defaults and component CSS modules. |
| `public` | Existing logo, local sample artwork with sources and local fonts with licenses. |
| `src/config` | Model identifiers and experiment eligibility, shared generation settings/test prompt, and judging dimension names. |
| `src/contracts` | JSDoc-only descriptions of gallery records, usage and temporary generation preview data. |
| `src/server/openrouter` | Server-only authenticated requests and validated image previews; Jev decisions and text generation remain stubs. |
| `src/server/services` | Future theme selection, candidate generation, judging, publication and daily orchestration. |
| `src/server/storage` | Vendor-independent exhibition and image storage stubs. |
| `docs` | Architecture, interfaces and implementation boundaries. |

Every authored JavaScript, JSX and configuration module starts with a short block comment explaining its place in AILOUVRE. CSS also has a role comment. JSON and ignore files use valid native syntax instead of JavaScript comments:

- `package.json`: project metadata, npm scripts, runtime requirements and exact direct dependency versions.
- `package-lock.json`: npm-generated, reproducible dependency resolution; commit this alongside the manifest.
- `.gitignore`: excludes dependencies, build output, logs and real environment files while preserving `.env.example`.
- `.env.example`: server-only `OPENROUTER_API_KEY` for explicit development generation and a reserved `CRON_SECRET` placeholder. Never prefix secrets with `NEXT_PUBLIC_` or commit a populated environment file.
- `next.config.mjs`: empty framework configuration.
- `eslint.config.mjs`: Next.js lint rules; unused function parameters are permitted for the documented stubs, while unused local variables remain errors.

ESLint is pinned to 9.39.5 because the installed Next.js React, accessibility and import plugins declare ESLint 9 peer support. npm reports that ESLint 9 is no longer supported; upgrade the lint stack together when those plugins declare compatibility with ESLint 10. Next.js and React use the current stable releases verified when this scaffold was created.

## Reserved functionality

The future daily process is documented as: resolve theme → generate candidates → save images → judge candidates → save exhibition → publish. None of these steps is connected or implemented.

Configured image models: GPT Image 2.5 Sunburst, Seedream 4.5, Grok Imagine Image 2.0, Muse Image and FLUX.2 Klein 4B. Muse is excluded from the initial Image API experiment. Jev identifier: `typesafe/jev-1.14`. Judging dimensions: adherence, technical integrity, aesthetics and perceived creative interpretation. No weights, rubric prompts, aggregate scores or ranking rules exist.

The page routes are `/` and `/gallery/[date]`. The reserved HTTP routes are `GET /api/exhibitions/[date]` and `GET /api/cron/daily`. These two handlers throw `Error("Not implemented")` and produce an HTTP 500, not a success-shaped placeholder response. Do not connect a scheduler or expose these routes as working endpoints.

Server stub functions throw the same error when called with their documented parameters. They do not call each other or read credentials. Server modules use `server-only` to prevent accidental imports into client components.

Dates are reserved as `YYYY-MM-DD`, with `Europe/London` defining the future daily boundary. No parsing, timezone conversion or scheduling logic exists.

There is no database, storage vendor, deployed scheduler, authentication flow, voting or leaderboard. Only an explicit development generation POST can make a paid provider call. Fixed frontend preview metadata is not published exhibition data. No automated feature tests are included, following `AGENTS.md`.

See [the architecture notes](docs/architecture.md) for future interfaces and API boundaries.

## Manual frontend review

Feature testing is left to developers. For the production botanical frontend preview (`npm run build` and `npm run start`):

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
