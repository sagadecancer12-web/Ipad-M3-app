import { useState } from 'react';
import { useNotesStore } from '../../core/stores/notes.store';
import { useAppStore } from '../../core/stores/app.store';
import { renderMarkdown, extractWordCount, extractWikilinks } from '../../core/utils/markdown';

const TAG_COLORS = ['tag-purple', 'tag-teal', 'tag-accent', 'tag-gray', 'tag-red'];

function getTagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length];
}

const TYPE_ICONS: Record<string, string> = {
  atomic: '◻',
  daily: '▷',
  moc: '⊕',
  research: '▣',
  egel: '▲',
};

export function NotesView() {
  const { notes, activeNoteId, setActiveNote, searchQuery, setSearchQuery, getFilteredNotes } = useNotesStore();
  const { navigateTo } = useAppStore();
  const [editorMode, setEditorMode] = useState<'preview' | 'edit'>('preview');

  const filteredNotes = getFilteredNotes();
  const activeNote = notes.find((n) => n.id === activeNoteId) ?? notes[0];
  const wc = activeNote ? extractWordCount(activeNote.content) : 0;
  const links = activeNote ? extractWikilinks(activeNote.content) : [];

  return (
    <div className="notes-panel fade-in">
      {/* Sidebar list */}
      <div className="notes-list">
        <div className="notes-list-header">
          <div className="notes-list-search">
            <span style={{ fontSize: 13 }}>○</span>
            <input
              placeholder="Filtrar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <span
                style={{ cursor: 'pointer', color: 'var(--text-tertiary)' }}
                onClick={() => setSearchQuery('')}
              >
                ×
              </span>
            )}
          </div>
          <div className="notes-list-filter">
            {['todo', 'atomic', 'daily', 'moc'].map((f) => (
              <span
                key={f}
                className="tag tag-gray"
                style={{ cursor: 'pointer', fontSize: 10 }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <div className="notes-list-items">
          {filteredNotes.length === 0 && (
            <div style={{ padding: 20, color: 'var(--text-tertiary)', fontSize: 12, textAlign: 'center' }}>
              Sin resultados para "{searchQuery}"
            </div>
          )}
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`note-item${note.id === activeNote?.id ? ' active' : ''}`}
              onClick={() => setActiveNote(note.id)}
            >
              <div className="note-item-title">
                <span style={{ marginRight: 6, opacity: 0.6 }}>{TYPE_ICONS[note.type] ?? '◻'}</span>
                {note.title}
              </div>
              <div className="note-item-preview">{note.preview}</div>
              <div className="note-item-footer">
                <span className="note-item-date">{note.date}</span>
                {note.tags.slice(0, 2).map((t, i) => (
                  <span key={i} className={`tag ${getTagColor(i)}`} style={{ fontSize: 9 }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      {activeNote ? (
        <div className="notes-editor">
          {/* Editor top bar */}
          <div className="editor-topbar">
            <input
              className="editor-title-input"
              defaultValue={activeNote.title}
              key={activeNote.id}
              placeholder="Título..."
            />
            <button
              className="topbar-btn"
              onClick={() => navigateTo('ai')}
              title="Analizar con IA"
            >
              ◈ IA
            </button>
            <button
              className={`topbar-btn${editorMode === 'preview' ? '' : ' primary'}`}
              onClick={() => setEditorMode(editorMode === 'preview' ? 'edit' : 'preview')}
            >
              {editorMode === 'preview' ? '✎ Editar' : '◻ Preview'}
            </button>
            <button className="topbar-btn primary">
              ✓ Guardar
            </button>
          </div>

          {/* Toolbar */}
          <div className="editor-toolbar">
            {['H1', 'H2', 'H3', 'B', 'I', '—', 'Code', 'Quote'].map((t) => (
              <button key={t} className="toolbar-btn">{t}</button>
            ))}
            <div className="toolbar-sep" />
            <button className="toolbar-btn">[[Link]]</button>
            <button className="toolbar-btn">#tag</button>
            <button className="toolbar-btn">- [ ] Task</button>
            <div className="toolbar-sep" />
            <button className="toolbar-btn">○ Buscar</button>
            <button className="toolbar-btn" onClick={() => navigateTo('graph')}>⬡ Grafo</button>
          </div>

          {/* Content */}
          <div className="editor-body" key={activeNote.id}>
            {editorMode === 'preview' ? (
              <div
                className="editor-content fade-in"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(activeNote.content) }}
              />
            ) : (
              <textarea
                className="editor-content fade-in"
                style={{
                  width: '100%',
                  maxWidth: 680,
                  margin: '0 auto',
                  display: 'block',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  lineHeight: 1.8,
                  color: 'var(--text-primary)',
                  height: '100%',
                  minHeight: 400,
                }}
                defaultValue={activeNote.content}
                spellCheck={false}
              />
            )}
          </div>

          {/* Meta bar */}
          <div className="editor-meta">
            <span className="meta-item">
              {TYPE_ICONS[activeNote.type] ?? '◻'} {activeNote.type}
            </span>
            <span className="meta-item">◷ {activeNote.date}</span>
            <span className="meta-item">≈ {wc} palabras</span>
            <span className="meta-item">⬡ {links.length} enlaces</span>
            {activeNote.tags.map((t, i) => (
              <span key={i} className={`tag ${getTagColor(i)}`}>#{t}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="placeholder-view">
          <div className="placeholder-icon">◻</div>
          <div className="placeholder-label">Selecciona una nota</div>
          <div className="placeholder-desc">Elige una nota de la lista para comenzar a editar.</div>
        </div>
      )}
    </div>
  );
}
