# Notes App — Technical Specification

**Status:** Core implementation complete  
**Related:** [Product Requirements Document](PRD.md)  
**Last updated:** 14 November 2026

## 1. Platform and stack

Responsive web app for desktop and mobile browsers. An APK/native package is outside this assignment scope. Product naming, palette, and asset policy are in [Product Identity](PRODUCT_IDENTITY.md).

### Stack

- React with functional components and Hooks.
- Vite as the development server and production build tool.
- JavaScript with JSX, CSS, and browser `localStorage`.
- No component library, router, state library, or backend for this single-screen app. Use native CSS and semantic HTML to keep the fundamentals visible and avoid unnecessary setup.

## 2. Architecture

Single-page responsive web application named **Margin Notes** with one top-level `App` owning the note collection, current selection/editor mode, and search query. Keep components small and presentational:

- `App`: state orchestration and high-level layout.
- `Sidebar`: app identity, create action, search, note list/count.
- `NoteListItem`: title, excerpt, timestamp, selected state.
- `NoteEditor`: controlled title/body fields and save/cancel/delete actions.
- `ConfirmDialog`: accessible delete confirmation.
- `EmptyState`: empty library and no search matches.

Pass data and callbacks through props. Avoid introducing global state for a single page.

## 3. Data model

```js
{
  id: string,             // crypto.randomUUID() with a safe fallback if needed
  title: string,
  body: string,
  createdAt: string,      // ISO timestamp
  updatedAt: string       // ISO timestamp
}
```

The editor uses a draft object. Updating a draft does not mutate the saved note until Save. New notes are assigned IDs/timestamps on save. Sort saved notes by `updatedAt` descending.

## 4. State model

- `notes`: persisted list of note objects (`useState`). Initialize lazily from validated local storage.
- `query`: search input string (`useState`).
- `activeNoteId`: selected saved note ID or null (`useState`).
- `draft`: controlled editor values while creating/editing (`useState`).
- `isCreating`: editor mode (`useState`).
- `pendingDeleteId`: note awaiting confirmation, or null (`useState`).
- `titleInputRef`: DOM focus target (`useRef`).
- `filteredNotes`: derived from `notes` + normalized `query`; do not duplicate as state. Use `useMemo` only if the list becomes measurably large; for the assignment scale, simple derived filtering is clearer.

## 5. Effects and persistence

- Load once through a lazy initializer that catches storage access/parse errors and validates the stored shape.
- Persist `notes` in a `useEffect` after changes. Catch quota/security errors and expose a non-blocking status message. Avoid writing an initial empty array before the loaded value is established.
- Focus the title field when create/edit mode opens (effect keyed to the editor mode/selection).
- Keep effects limited to synchronizing with browser APIs; derive filtered lists during render.

## 6. Interaction rules

### Create
1. Create action opens a blank draft and focuses the title.
2. Save validates trimmed title/body; reject if both are empty.
3. On success append the new note, select it, exit create mode, and clear the draft.

### Edit
1. Selecting a note loads a draft copy.
2. Save validates and updates the saved note while preserving `createdAt` and refreshing `updatedAt`.
3. Cancel discards draft changes and returns to the selected saved note.

### Delete
1. Delete action records the target ID and opens a confirmation dialog.
2. Confirm removes the note and clears selection if needed; select the most recent remaining note if available.
3. Cancel closes the dialog without changing notes.

### Search
- Case-insensitive substring match against title and body.
- Search does not alter stored notes or selection.
- If the selected note is filtered out, show a neutral editor prompt or retain selection with clear selected-state behavior; decide and implement consistently. Preferred behavior: keep the current editor content until another result is selected, but visually distinguish selection outside the filtered list.

## 7. Accessibility and responsive behavior

- Use `<label>` for title, body, and search fields; buttons have meaningful accessible names.
- Use semantic buttons and dialog semantics (`role="dialog"`, `aria-modal="true"`, labelled heading); return focus after confirmation closes.
- Ensure visible `:focus-visible` styling, sufficient contrast, keyboard-operable controls, and no color-only indication.
- Desktop: list/editor split view with a compact navigation area.
- Mobile: single-column navigation between notes and editor; include an obvious back-to-list action and persistent create/save controls.
- Respect reduced-motion preference; transitions are optional and short.

## 8. Error handling

- Invalid/corrupt localStorage: ignore invalid value, start empty, show non-blocking recovery status.
- Storage unavailable or write failure: keep the app usable in memory and show that changes may not persist.
- Validation: inline text near the editor action/field; do not rely on alert dialogs.
- Delete: custom accessible confirmation, no irreversible delete on a single accidental click.

## 9. Project structure

```text
.
├── docs/
│   ├── PRD.md
│   ├── TECH_SPEC.md
│   └── BUILD_CHECKLIST.md
├── src/
│   ├── components/
│   ├── hooks/             # only if a persistence hook improves clarity
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
└── README.md
```

Do not create abstractions solely to match this sketch; keep structure proportional to the app.

## 10. Definition of done

- P0 requirements and PRD acceptance criteria are complete.
- Responsive and keyboard interactions are reviewed manually.
- Production build completes without errors.
- README explains setup, features, stack, persistence limitation, and screenshots/demo link if available.
- Source is ready for repository `Syntecxhub_Notes_App` (using the assignment naming pattern `Syntecxhub_Project_Name`).



