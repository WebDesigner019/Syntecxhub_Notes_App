# Notes App — Build Checklist

**Status:** Core implementation complete; desktop flows verified  
**Related:** [PRD](PRD.md) · [Technical Specification](TECH_SPEC.md)

## Phase 0 — Confirmed scope

- [x] Select Notes App from Week 1 options.
- [x] Finalize product identity as Margin Notes (app title: Margin).
- [x] Confirm responsive web app target; native APK is out of scope.
- [x] Decide original CSS/SVG branding and no third-party decorative assets.
- [x] Preserve required React stack and Hooks.
- [x] Set desktop/mobile UX direction and P0 feature boundary.
- [x] Define local-only persistence and project limits.

## Phase 1 — Foundation

- [x] Scaffold Vite React app.
- [x] Add global design tokens, typography, reset, and responsive app shell.
- [x] Create semantic component skeleton and sample visual state.
- [x] Confirm mobile navigation pattern before wiring interactions.

## Phase 2 — Notes behavior

- [x] Define/validate note model and localStorage initializer.
- [x] Implement create and controlled editor draft.
- [x] Implement edit and cancel without mutating saved note prematurely.
- [x] Implement delete confirmation and post-delete selection behavior.
- [x] Persist changes with `useEffect`; surface storage failure gracefully.
- [x] Focus title on create/edit with `useRef`.

## Phase 3 — Discovery and polish

- [x] Add case-insensitive title/body search.
- [x] Sort by most recently updated.
- [x] Add note preview, timestamps, count, and empty/no-result states.
- [x] Add keyboard focus, dialog semantics, validation, and responsive behavior.
- [x] Refine spacing, contrast, type hierarchy, and interaction feedback.

## Phase 4 — Release preparation

- [x] Manually review create/edit/cancel/delete/search/reload flows.
- [ ] Review narrow and wide viewport layouts and keyboard-only use.
- [x] Run production build and resolve build errors.
- [x] Write README with setup, feature list, stack, and limitations.
- [ ] Create GitHub repository using `Syntecxhub_Notes_App` naming pattern and upload the complete source.
- [ ] Submit the project through the official submission form.
- [ ] Share internship status on LinkedIn and mention `@Syntecxhub` if not already completed.

## Decision log

- **App:** Notes App, one of three Week 1 options.
- **Persistence:** browser `localStorage`; no backend or account.
- **Stack:** React + Vite + JavaScript + CSS.
- **State:** `useState`; persistence/focus synchronization with `useEffect`; focus via `useRef`.
- **Dependencies:** avoid UI/state libraries unless implementation reveals a concrete need.
- **Scope guard:** defer Markdown, tags/folders, import/export, themes, cloud sync, and deployment until required work is complete.






