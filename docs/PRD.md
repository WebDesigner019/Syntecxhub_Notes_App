# Notes App — Product Requirements Document

**Status:** Implementation in progress  
**Owner:** Muhammad Mansur Adam  
**Project:** Syntecxhub Web Development Internship — Week 1  
**Last updated:** 14 November 2026

## 1. Purpose

Build **Margin Notes**, a polished, responsive notes application that demonstrates practical React fundamentals and satisfies the Week 1 Notes App assignment. Users should be able to capture, find, edit, and delete notes, with notes retained in the same browser across reloads.

## 2. Problem and audience

People need a quick, calm place to keep short personal notes. The target user is a single person using the app in one browser. This is a portfolio-ready internship exercise, not a multi-user hosted notes service.

## 3. Goals

- Meet the assignment: add/edit/delete notes, manage notes with `useState`, focus the input with `useRef`, persist using `localStorage`, and provide clean styling.
- Make common actions discoverable and fast on desktop and mobile.
- Provide useful feedback for empty, searching, saving, and destructive-action states.
- Keep the implementation understandable to a reviewer and straightforward to run from GitHub.

## 4. Out of scope

- Accounts, authentication, cloud sync, backend/database, collaboration.
- Rich text, Markdown rendering, file attachments, reminders, folders/tags, import/export.
- Multiple themes, analytics, and a public deployment unless separately requested.

## 5. User stories

1. As a user, I can create a note with a title and body so I can capture an idea.
2. As a user, I can edit a saved note and see when it was updated.
3. As a user, I can delete a note after a clear confirmation so accidental removal is less likely.
4. As a user, I can search note titles and bodies to find information quickly.
5. As a user, I can reload or revisit the page and still see my notes.
6. As a user, I can tell when there are no notes or when my search has no matches, and know what to do next.

## 6. Functional requirements

### P0 — required

- Create notes with a non-empty title or body; trim whitespace and reject fully empty notes.
- Edit note title and body; save updates and update the modification timestamp.
- Delete a note only after explicit confirmation; cancellation leaves it intact.
- Persist all note data to `localStorage`, and restore it on app startup.
- Focus the title input when opening the create or edit form.
- Search case-insensitively across title and body.
- Sort notes by most recently updated, newest first.
- Display empty-library and no-search-results states.
- Support responsive desktop and mobile layouts, keyboard operation, visible focus, and semantic labels.

### P1 — useful polish

- Show formatted creation/update time in the note list or editor.
- Show a live note count and a short save/persistence status.
- Provide a cancel action while editing; preserve the saved note until Save is used.
- Include a small starter set of sample notes on first launch, with a way to remove them like any other notes.

## 7. UX and visual direction

A quiet digital notebook called **Margin Notes**: warm off-white canvas, deep ink text, muted olive with warm clay accents, generous spacing, clear type hierarchy, and subtle borders/shadows. See [Product Identity](PRODUCT_IDENTITY.md). Desktop uses a compact left navigation rail, searchable note list, and a focused editor pane. On narrow screens, list and editor become navigable single-column views with controls remaining reachable. Do not rely on color alone for status or selection. Destructive actions are visually distinct and confirmed.

## 8. Information architecture

- App shell: brand/title, note count, create action.
- Note navigation: search, selected note list, date, empty state.
- Editor: title field, body field, save/cancel, timestamp, delete.
- Feedback: validation message, persistence status, delete confirmation.

## 9. Acceptance criteria

- A fresh user can create a note, see it in the list, edit it, reload, and verify it remains.
- Search finds matches in both title and body and the empty-results state is clear.
- Delete confirmation supports both confirm and cancel.
- Empty title/body input is not saved; whitespace-only input is treated as empty.
- Create/edit opens with title focus and keyboard focus remains visible.
- Layout remains usable at mobile widths without horizontal overflow.
- No note data is sent to a server; persistence is browser-local.
- The repository includes a README with setup, feature list, stack, and known limitation that data is local to the browser.

## 10. Risks and assumptions

- `localStorage` can be unavailable, cleared, or contain malformed data. The app should recover to an empty list and show a helpful persistence warning rather than crash.
- Data is device/browser-local and is not backed up or synchronized.
- Date formatting uses the user's device locale.
- The PDF requires at least one project from this week's three options; this plan selects Notes App.

## 11. Success measures

- All P0 requirements and acceptance criteria are satisfied.
- A reviewer can run the app from the README and understand its component/state structure.
- A first-time user can create and retrieve a note without instruction.


