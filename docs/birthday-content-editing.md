# Birthday content editing

The public experience works from `frontend/public/content/experience.json` today. Names, dates, messages, visibility, collections, and photo descriptors live in this file. Gallery introduction and closing copy lives in `frontend/src/features/public/collectionContent.ts` (`intro`, `closingLabel`, and `closing`). Components do not invent personal content. The current gift uses owner-supplied personal photographs; derivatives in `frontend/public/photos/personal/` are ignored by Git and must be restored separately after cloning.

The frontend loads the JSON from the same static host; no API or environment configuration is required. Open the JSON in your editor, make changes, explicitly Save, then reload the page. The route fetches fresh content and validates the entire document. Keep a copy before editing. Invalid JSON or invalid content shows a recoverable loading error rather than rendering unsafe content. Run `npm.cmd run test` from `frontend` to validate the saved local content before building. Changes to `collectionContent.ts` update through Vite during development and require a new build for production.

| Content                      | Field to edit                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Recipient                    | `settings.recipientName`                                                               |
| Birthday / relationship date | `settings.birthdayDate`, `settings.relationshipStartDate`; use `YYYY-MM-DD` or `null`  |
| Closing signature            | `settings.closingSignature`                                                            |
| Relationship counter         | `settings.relationshipCounterVisible`; leave false until a real start date is supplied |
| Chapter text and visibility  | Match each `sections` entry by its `key`, then edit its `content` or `visible`         |
| Story memories               | `story`; `position` controls order, not `date`                                         |
| Full-width memory photo      | `memoryPhoto`                                                                          |
| Gallery photos               | `gallery`, in owner-defined array order                                                |
| Gallery introduction/closing | `frontend/src/features/public/collectionContent.ts`                                    |
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

For production, rebuild with `npm.cmd run build` after saving. No protected browser admin or upload workflow is provided by this file editing path. It requires access to the project files. There is no backend persistence or future-editor scaffold in the current application.
