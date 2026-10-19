# AILOUVRE architecture

## Current state

This is a scaffold, not a working gallery. Pages and components return `null`; only the required root HTML/body layout and AILOUVRE metadata render. All non-rendering functions throw `Error("Not implemented")`. Configuration contains static identifiers only. No application data is fetched or saved and no API key is read.

## Intended data flow

1. Resolve the exhibition date and a human-authored or LLM-authored daily brief.
2. Generate candidate images from the same brief using the four configured models.
3. Save generated image data to future durable storage and retain image identifiers/locations.
4. Evaluate each saved candidate with Jev against separate judging dimensions.
5. Save the brief, artwork, judgments, provenance and measured usage as an exhibition.
6. Publish the exhibition for public daily and dated pages.

This ordering is documentation only. `runDailyExhibition` contains no orchestration. A storage implementation, theme model, schedule and scoring policy are outside this deliverable.

## Browser and server boundary

Future public UI consumes published exhibition data, never provider credentials. There are no client components, effects, browser storage, subscriptions or event handlers in the scaffold. Every module under `src/server` is marked `server-only`, as are HTTP route handlers. Pages currently import no services.

OpenRouter will be the sole model connection, using one server-side account/key with distinct endpoint families:

| Adapter | Reserved endpoint | Stub |
| --- | --- | --- |
| Images | `POST https://openrouter.ai/api/v1/images` | `requestImageGeneration({ model, prompt, settings })` |
| Jev decisions | `POST https://openrouter.ai/api/alpha/decisions` | `requestJudgment({ model, state, questions })` |
| Optional LLM themes | `POST https://openrouter.ai/api/v1/chat/completions` | `requestTheme({ model, instructions })` |
| Shared transport | Endpoint supplied by a future adapter | `requestOpenRouter({ endpoint, body })` |

The experimental Decisions interface and model capabilities must be rechecked when integrations are implemented. Nothing sends requests or normalizes provider responses yet. No direct TypeSafe, OpenAI, Google, xAI or Meta client is installed.

## Service and storage interfaces

All functions below are exported asynchronous stubs. Inputs and future outputs are documented with JSDoc in their modules.

| Responsibility | Interfaces |
| --- | --- |
| Daily themes | `resolveDailyTheme({ date, humanTheme })` |
| Candidates | `generateCandidates({ exhibitionId, brief, models, imagesPerModel })` |
| Questions and judging | `buildJudgingQuestions({ brief })`, `judgeArtwork({ artwork, brief })` |
| Read and publish | `getDailyExhibition({ date })`, `publishExhibition({ exhibitionId })` |
| Daily orchestration | `runDailyExhibition({ date, humanTheme })` |
| Exhibition persistence | `getExhibition({ date })`, `saveExhibition({ exhibition })` |
| Image persistence | `saveImage({ image, artworkId })`, `getImageUrl({ imageId })` |

`generateCandidates` reserves paired artwork metadata and opaque generated image data, allowing the future image-storage step to retain the bytes before judging. Image representation and storage provider remain deliberately unspecified.

`DailyBrief`, `Artwork`, `Judgment`, `Exhibition`, `DimensionScore`, `Usage` and `ExhibitionDate` are JSDoc contracts, not runtime schemas. They reserve stable identifiers, prompt/model provenance, image locations and input/output token and USD-cost metadata. Unknown usage is nullable rather than assumed to be free. Date strings and timestamps are not generated or validated.

Separate judgment dimensions are reserved without scales, question text, weights, aggregation or winner selection. A confidence value describes a model answer signal and does not establish correctness. Human validation remains future research work.

## Public route reservations

| Route | Purpose | Current behavior |
| --- | --- | --- |
| `/` | Daily public exhibition | Blank page shell |
| `/gallery/[date]` | Exhibition archive by date | Blank page shell; date ignored |
| `GET /api/exhibitions/[date]` | Future exhibition read interface | Throws unimplemented error; HTTP 500 |
| `GET /api/cron/daily` | Future authorized scheduler invocation | Throws unimplemented error; HTTP 500 |

No scheduler is registered. The cron handler performs no authentication because it performs no work; authentication must be implemented before connecting any scheduler. The empty `CRON_SECRET` template reserves that later boundary.

## Verification boundaries

Lint and production build should succeed without credentials. Visiting either page should show a blank shell with AILOUVRE metadata. API route failures are expected. Verification should check opening comments and stub bodies without adding feature tests. Generated `.next` output is ignored, while `package-lock.json` is retained for reproducible installation.
