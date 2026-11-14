import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'margin-notes-v1'
const starterNotes = [
  { id: 'welcome-note', title: 'A quieter place to think', body: 'Some thoughts arrive softly. Leave a little space for them here.\n\nUse this page to collect the things you want to remember, return to, or make real.', createdAt: '2026-11-13T09:12:00.000Z', updatedAt: '2026-11-13T09:12:00.000Z' },
  { id: 'small-rituals', title: 'Small rituals, big days', body: 'Make tea before opening the laptop.\nWrite down the one thing that matters today.\nLeave the last ten minutes for a gentle reset.', createdAt: '2026-11-12T15:40:00.000Z', updatedAt: '2026-11-12T15:40:00.000Z' },
  { id: 'weekend-market', title: 'Weekend market', body: 'Look for fresh flowers, good bread, and a new notebook. Take the long way home.', createdAt: '2026-11-10T08:05:00.000Z', updatedAt: '2026-11-10T08:05:00.000Z' },
]
const emptyDraft = { title: '', body: '' }

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return starterNotes
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((n) => n && typeof n.id === 'string' && typeof n.title === 'string' && typeof n.body === 'string' && typeof n.createdAt === 'string' && typeof n.updatedAt === 'string')
  } catch {
    return []
  }
}

function formatDate(value, options = { month: 'short', day: 'numeric' }) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, options).format(date)
}

function relativeDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const today = new Date()
  const sameDay = date.toDateString() === today.toDateString()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (sameDay) return 'Today'
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return formatDate(value, { month: 'long', day: 'numeric' })
}

function Icon({ name, size = 18, className = '' }) {
  const paths = {
    archive: <><path d="M3 4h18v4H3z"/><path d="M5 8v12h14V8M10 12h4"/></>,
    back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h11"/></>,
    notebook: <><rect x="5" y="3" width="15" height="18" rx="2"/><path d="M8 3v18M11 8h5M11 12h5M11 16h3"/></>,
    plus: <><path d="M12 5v14M5 12h14"/><path d="M4 3h11l5 5v13H4z"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    sparkle: <><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4h6v3"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m6 9 6 6 6-6"/>,
  }
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
function BrandMark() {
  return <svg className="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M7 5.5 20.5 3l7 4.3v17L13 27l-6-4.2V5.5Z" fill="#30352E" stroke="currentColor" strokeWidth="1.25" />
    <path d="m10 8.2 13.5-2.4v16.1L10 24.4V8.2Z" fill="#C65336" stroke="#F1B39B" strokeWidth="1.1" />
    <path d="m13 11 7.2-1.3M13 14.5l7.2-1.3M13 18l5.2-.9" stroke="#FFF3E6" strokeWidth="1.25" strokeLinecap="round" />
    <path d="m7 5.5 3 2.7v16.2L7 22.8V5.5Z" fill="#E88D6D" stroke="currentColor" strokeWidth=".8" />
  </svg>
}

function JournalIllustration() {
  return (
    <svg className="journal-illustration" viewBox="0 0 176 126" fill="none" aria-hidden="true">
      <ellipse cx="88" cy="111" rx="62" ry="8" fill="#282A23" opacity=".11" />
      <path d="M33 25c19-6 38-3 55 8v67c-18-10-36-12-55-7V25Z" fill="#F1E5D2" stroke="#8B725E" strokeWidth="2" />
      <path d="M143 25c-19-6-38-3-55 8v67c18-10 36-12 55-7V25Z" fill="#FBF4E8" stroke="#8B725E" strokeWidth="2" />
      <path d="M88 33v67" stroke="#AA927A" strokeWidth="2" />
      <path d="M42 39c13-3 25-1 36 5M42 51c13-3 25-1 36 5M42 63c12-2 23 0 34 5M42 75c11-2 21 0 30 4" stroke="#C4AE96" strokeWidth="2" strokeLinecap="round" />
      <path d="M99 44c11-5 23-6 35-3M99 56c11-5 23-6 35-3M99 68c11-5 23-6 35-3M99 80c9-4 18-5 27-4" stroke="#D6C5B1" strokeWidth="2" strokeLinecap="round" />
      <path d="M115 13c0-5 4-9 9-9s9 4 9 9c0 7-9 15-9 15s-9-8-9-15Z" fill="#C65336" stroke="#9F402B" strokeWidth="1.5" />
      <circle cx="124" cy="13" r="3" fill="#FAF1E5" />
      <path d="m57 24 8-13 8 16" stroke="#69745F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M52 25c5-8 11-8 15-5" stroke="#809172" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 96c17-4 36-2 57 7 20-10 39-12 57-8" stroke="#B89E82" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function NoteRow({ note, selected, onSelect, index }) {
  const preview = note.body.trim().replace(/\s+/g, ' ')
  return (
    <button className={`note-row ${selected ? 'is-selected' : ''}`} onClick={onSelect} aria-current={selected ? 'page' : undefined}>
      <span className="note-row-top"><span className="note-date">{formatDate(note.updatedAt)}</span><span className={`note-index index-${index % 3}`}>{String(index + 1).padStart(2, '0')}</span></span>
      <span className="note-row-title">{note.title || 'Untitled note'}</span>
      <span className="note-row-preview">{preview || 'No additional text'}</span>
    </button>
  )
}

function App() {
  const [notes, setNotes] = useState(loadNotes)
  const [query, setQuery] = useState('')
  const [activeNoteId, setActiveNoteId] = useState('welcome-note')
  const [draft, setDraft] = useState(emptyDraft)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [status, setStatus] = useState('All changes saved')
  const [mobileView, setMobileView] = useState('notes')
  const [toast, setToast] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const titleRef = useRef(null)
  const searchRef = useRef(null)
  const dialogCloseRef = useRef(null)
  const deleteButtonRef = useRef(null)
  const dialogWasOpenRef = useRef(false)
  const toastTimer = useRef(null)

  const sortedNotes = useMemo(() => [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)), [notes])
  const filteredNotes = useMemo(() => {
    const q = query.trim().toLocaleLowerCase()
    if (!q) return sortedNotes
    return sortedNotes.filter((note) => `${note.title} ${note.body}`.toLocaleLowerCase().includes(q))
  }, [query, sortedNotes])
  const activeNote = notes.find((note) => note.id === activeNoteId) ?? null

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
      setStatus('All changes saved')
    } catch {
      setStatus('Saved on this page only')
    }
  }, [notes])

  useEffect(() => {
    setHasUnsavedChanges(false)
  }, [activeNoteId, isCreating, isEditing])

  useEffect(() => {
    if (isCreating || isEditing) titleRef.current?.focus()
  }, [isCreating, isEditing, activeNoteId])

  useEffect(() => {
    if (!pendingDeleteId) {
      if (dialogWasOpenRef.current) deleteButtonRef.current?.focus()
      dialogWasOpenRef.current = false
      return undefined
    }

    dialogWasOpenRef.current = true
    dialogCloseRef.current?.focus()

    const handleDialogKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setPendingDeleteId(null)
        return
      }

      if (event.key !== 'Tab') return
      const dialog = dialogCloseRef.current?.closest('[role="dialog"]')
      const focusable = dialog?.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleDialogKeyDown)
    return () => document.removeEventListener('keydown', handleDialogKeyDown)
  }, [pendingDeleteId])

  useEffect(() => {
    const handleShortcut = (event) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.repeat || pendingDeleteId) return

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault()
        beginCreate()
      } else if (event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [pendingDeleteId])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const announce = useCallback((message) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2500)
  }, [])

  const beginCreate = () => {
    setIsCreating(true)
    setIsEditing(false)
    setActiveNoteId(null)
    setDraft(emptyDraft)
    setMobileView('editor')
  }

  const returnToNotebook = () => {
    setQuery('')
    setActiveNoteId(null)
    setDraft(emptyDraft)
    setIsCreating(false)
    setIsEditing(false)
    setHasUnsavedChanges(false)
    setMobileView('notes')
  }

  const selectNote = (note) => {
    setActiveNoteId(note.id)
    setDraft({ title: note.title, body: note.body })
    setIsCreating(false)
    setIsEditing(false)
    setMobileView('editor')
  }

  const beginEdit = () => {
    if (!activeNote) return
    setDraft({ title: activeNote.title, body: activeNote.body })
    setIsEditing(true)
  }

  const cancelDraft = () => {
    if (isCreating) {
      setIsCreating(false)
      setActiveNoteId(sortedNotes[0]?.id ?? null)
      setDraft(emptyDraft)
    } else {
      setIsEditing(false)
      setDraft(activeNote ? { title: activeNote.title, body: activeNote.body } : emptyDraft)
    }
    setHasUnsavedChanges(false)
  }

  const saveDraft = (event) => {
    event?.preventDefault()
    if (!isCreating && !isEditing) {
      if (activeNote) beginEdit()
      return
    }

    const title = draft.title.trim()
    const body = draft.body.trim()
    if (!title && !body) {
      announce('Add a title or a few words before saving.')
      titleRef.current?.focus()
      return
    }
    const now = new Date().toISOString()
    if (isCreating) {
      const note = { id: crypto.randomUUID?.() ?? `${Date.now()}`, title: title || 'Untitled note', body, createdAt: now, updatedAt: now }
      setNotes((current) => [note, ...current])
      setActiveNoteId(note.id)
      announce('Note tucked away safely.')
    } else if (activeNote) {
      setNotes((current) => current.map((note) => note.id === activeNote.id ? { ...note, title: title || 'Untitled note', body, updatedAt: now } : note))
      announce('Your note is up to date.')
    }
    setIsCreating(false)
    setIsEditing(false)
    setHasUnsavedChanges(false)
  }

  const confirmDelete = () => {
    const id = pendingDeleteId
    if (!id) return
    const remaining = sortedNotes.filter((note) => note.id !== id)
    setNotes(remaining)
    setActiveNoteId(remaining[0]?.id ?? null)
    setDraft(remaining[0] ? { title: remaining[0].title, body: remaining[0].body } : emptyDraft)
    setPendingDeleteId(null)
    setIsCreating(false)
    setIsEditing(false)
    announce('Note deleted.')
  }

  const editorReadOnly = !!activeNote && !isEditing && !isCreating
  const shownDraft = editorReadOnly ? activeNote : draft

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileView === 'editor' ? 'mobile-hidden' : ''}`}>
        <div className="sidebar-inner">
          <button className="brand" type="button" onClick={returnToNotebook} aria-label="Return to Margin Notes notebook">
            <BrandMark /><span className="brand-name">MARGIN<span className="brand-period"> / NOTES</span></span>
          </button>
          <div className="sidebar-intro"><p className="eyebrow">YOUR QUIET CORNER</p><h1>A little room<br />for your thoughts.</h1><span className="intro-rule" /></div>
          <div className="sidebar-actions">
            <button className="new-note-button" onClick={beginCreate}><Icon name="plus" size={18} /><span>New note</span></button>
            <label className="search-box"><Icon name="search" size={17} /><input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a thought…" aria-label="Search notes" />{query && <button type="button" className="clear-search" aria-label="Clear search" onClick={() => setQuery('')}><Icon name="close" size={15} /></button>}</label>
          </div>
          <div className="notes-heading"><span>YOUR NOTES</span><span className="notes-count">{notes.length.toString().padStart(2, '0')}</span></div>
          <nav className="note-list" aria-label="Notes">
            {filteredNotes.map((note, index) => <NoteRow key={note.id} note={note} index={index} selected={note.id === activeNoteId && !isCreating} onSelect={() => selectNote(note)} />)}
            {filteredNotes.length === 0 && <div className="list-empty"><Icon name="search" size={17} /><p>{query ? 'No notes found.' : 'Your page is open.'}</p>{query ? <button onClick={() => setQuery('')}>Clear search</button> : <button onClick={beginCreate}>Write your first note</button>}</div>}
          </nav>
          <div className="sidebar-bottom"><span className="sync-dot" /><span>{status}</span></div>
        </div>
      </aside>

      <section className={`workspace ${mobileView === 'notes' ? 'mobile-hidden' : ''}`}>
        <header className="topbar">
          <button className="mobile-back icon-button" onClick={() => setMobileView('notes')} aria-label="Back to notes"><Icon name="back" size={18} /></button>
          <div className="breadcrumbs"><button className="breadcrumb-home" type="button" onClick={returnToNotebook} aria-label="Return to notebook"><Icon name="notebook" size={16} /><span>Notebook</span></button><span className="crumb-current">{isCreating ? 'New note' : activeNote?.title || 'All notes'}</span></div>
          <div className="topbar-right"><span className="privacy-label"><Icon name="archive" size={16} /> Private notebook</span><span className="local-badge">LOCAL</span></div>
        </header>

        <div className="editor-wrap">
          <div className="editor-meta"><span className="meta-date"><Icon name="clock" size={15} />{activeNote ? `Last touched ${relativeDate(activeNote.updatedAt).toLowerCase()}` : isCreating ? 'A fresh page' : 'Your notebook'}</span></div>
          {(!activeNote && !isCreating) ? (
            <div className="welcome-empty"><div className="journal-art"><JournalIllustration /></div><p className="eyebrow">A PAGE FOR WHAT MATTERS</p><h2>Every good thought<br />starts somewhere.</h2><p className="empty-copy">Keep a small idea, a passing thought,<br />or the start of something bigger.</p><button className="new-note-button centered" onClick={beginCreate}><Icon name="plus" size={17} />Start a note</button></div>
          ) : editorReadOnly ? (
            <div className="note-editor">
              <div className="editor-kicker"><span className="kicker-dot" />NOTE <span className="kicker-separator">·</span> {formatDate(activeNote.createdAt, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <h2 className="note-title-display" onClick={beginEdit} tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && beginEdit()}>{activeNote.title || 'Untitled note'}</h2>
              <div className="title-underline" />
              <div className="note-body-display" onClick={beginEdit} tabIndex="0" onKeyDown={(e) => e.key === 'Enter' && beginEdit()}>{activeNote.body || <span className="body-placeholder">Nothing here yet. Add a few words…</span>}</div>
              <div className="editor-footer"><span className="word-count">{activeNote.body.trim() ? activeNote.body.trim().split(/\s+/).length : 0} words <span>·</span> {activeNote.body.length} characters</span><div className="editor-actions"><button ref={deleteButtonRef} type="button" className="delete-button" onClick={() => setPendingDeleteId(activeNote.id)} aria-label="Delete note"><Icon name="trash" size={16} /></button><button type="button" className="save-button" onClick={beginEdit}>Edit note <Icon name="chevron" size={15} className="edit-chevron" /></button></div></div>
            </div>
          ) : (
            <form className="note-editor" onSubmit={saveDraft}>
              <div className="editor-kicker"><span className="kicker-dot" />NOTE <span className="kicker-separator">·</span> {formatDate(activeNote?.createdAt ?? new Date().toISOString(), { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <input ref={titleRef} className="note-title-input" value={shownDraft.title} onChange={(e) => { setDraft((d) => ({ ...d, title: e.target.value })); setHasUnsavedChanges(true) }} placeholder="Give this thought a title…" aria-label="Note title" maxLength={120} />
              <div className="title-underline" />
              <textarea className="note-body-input" value={shownDraft.body} onChange={(e) => { setDraft((d) => ({ ...d, body: e.target.value })); setHasUnsavedChanges(true) }} placeholder="Start writing here…\n\nThere’s no rush." aria-label="Note body" />
              <div className="editor-footer"><span className="word-count">{hasUnsavedChanges ? <><span className="draft-dot" />Unsaved changes</> : 'Ready to save'} <span>·</span> {(shownDraft.body || '').trim() ? (shownDraft.body || '').trim().split(/\s+/).length : 0} words</span><div className="editor-actions"><button type="button" className="cancel-button" onClick={cancelDraft}>Cancel</button><button type="submit" className="save-button"><Icon name="check" size={16} />Save note</button></div></div>
            </form>
          )}
          <footer className="workspace-footer"><span>TAKE YOUR TIME.</span><span className="footer-mark"><BrandMark /> MARGIN NOTES · 2026</span></footer>
        </div>
      </section>

      {pendingDeleteId && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setPendingDeleteId(null)}><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description"><button ref={dialogCloseRef} className="dialog-close icon-button" aria-label="Close" onClick={() => setPendingDeleteId(null)}><Icon name="close" size={17} /></button><div className="dialog-icon"><Icon name="trash" size={18} /></div><p className="eyebrow">ONE LAST CHECK</p><h2 id="delete-title">Let this note go?</h2><p id="delete-description">You can’t bring it back once it’s gone.</p><div className="dialog-actions"><button className="cancel-button" onClick={() => setPendingDeleteId(null)}>Keep note</button><button className="danger-button" onClick={confirmDelete}>Delete note</button></div></section></div>}
      <div className={`toast ${toast ? 'toast-visible' : ''}`} role="status" aria-live="polite"><span className="toast-check"><Icon name="check" size={14} /></span>{toast}</div>
    </main>
  )
}

export default App






