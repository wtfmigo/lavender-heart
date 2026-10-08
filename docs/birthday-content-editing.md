# Birthday content editing

The public experience works from `frontend/public/content/experience.json` today. All development messages and image assignments live in this file; components do not invent personal content. The current nature photographs are reusable development assets, not personal memories. Their provenance is in `birthday-media-assets.md`.

Leave `VITE_API_BASE_URL` blank when using this file editing path. Open the JSON in your editor, make changes, explicitly Save, then reload the page. The route fetches fresh content and validates the entire document. Keep a copy before editing. Invalid JSON or invalid content shows a recoverable loading error rather than rendering unsafe content. Run `npm.cmd run test` from `frontend` to validate the saved local content before building.

| Content                      | Field to edit                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Recipient                    | `settings.recipientName`                                                               |
| Birthday / relationship date | `settings.birthdayDate`, `settings.relationshipStartDate`; use `YYYY-MM-DD` or `null`  |
| Closing signature            | `settings.closingSignature`                                                            |
| Relationship counter         | `settings.relationshipCounterVisible`; leave false until a real start date is supplied |
| Chapter text and visibility  | Match each `sections` entry by its `key`, then edit its `content` or `visible`         |
| Story memories               | `story`; `position` controls order, not `date`                                         |
| Full-width memory photo      | `memoryPhoto`                                                                          |
| Gallery                      | `gallery`, in owner-defined array order                                                |
| Love statements              | `loveEntries`; `position` controls order                                               |
| Timeline                     | `timeline`; `position` controls order, not `date`                                      |
| Birthday letter              | `sections` entry `birthday_letter`: `opening`, `body`, `signature`, `date`             |
| Closing message              | `sections` entry `final_closing`: `message`, `date`                                    |

`hero` and `intro` top-level fields are compatibility aliases in the public contract. Keep them synchronized with the corresponding section content when editing. The public presentation uses the section content.

Rich text is structured data, never HTML. For a simple paragraph use:

```json
{
  "blocks": [
    {
      "type": "paragraph",
      "children": [
        { "type": "text", "text": "Your supplied words", "marks": [] }
      ]
    }
  ]
}
```

Add more paragraph blocks for a longer letter. Supported marks are `bold` and `italic`; line breaks use `{ "type": "line_break" }`. Keep Hero and Finale visible. Hidden chapters and empty optional collections disappear from presentation and navigation together.

Put supplied photos in `frontend/public/photos/` and update each descriptor's `src`, `alt`, actual pixel `width` / `height`, `caption`, and focal coordinates (`focalX` / `focalY` between 0 and 1). Set `smallSrc` only when that responsive file exists. Use a local `/photos/...` path or a trusted HTTPS image URL. Give each item a unique `id`. Never place private images in this publicly served directory unless they are intended for visitors.

For production, rebuild with `npm.cmd run build` after saving. No protected browser admin or upload workflow is provided by this file editing path. It requires access to the project files. The existing persistence architecture remains available for later secure owner editing.

## Optional public API

Set `VITE_API_BASE_URL` to the Laravel API URL (including `/api/`), restart the development server or rebuild, and configure Laravel's `FRONTEND_URL` to allow the frontend origin. The frontend tries `GET /api/experience`, validates its response, and resolves media descriptors against that API origin. An unavailable, unconfigured, invalid or slow API falls back to the local JSON; caller cancellation stops the request. Valid backend content takes precedence over the local file.

The API reads existing persistence only. It excludes hidden sections, deleted entries, unavailable media and private persistence fields. `GET /api/media/{ulid}` serves an existing ready derivative only when a visible live collection references it. No original-storage paths are returned. Populate real backend content through a future protected editor or a trusted maintenance workflow before enabling the API. This build does not seed development content into the real database.

The current development backend uses `DB_DATABASE=:memory:` and therefore has no persistent content tables across HTTP requests. Before enabling real API content, configure a persistent database, apply the approved migrations with `php artisan migrate`, initialize the fixed settings/chapters, and supply owner content. Database failures return sanitized 503 responses; an initialized but unconfigured site returns 404. Neither prevents the local birthday page from working.

The approved backend full-width memory contract has no photo assignment. Consequently the API returns `memoryPhoto: null`; the local editing path supports the full-width photo today. API photo assignment and production media processing remain follow-up work. Avoid enabling an incomplete backend configuration for the gift.
