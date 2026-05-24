import { useNotesStore } from '../../core/stores/notes.store';
import { useAppStore } from '../../core/stores/app.store';
import { renderMarkdown } from '../../core/utils/markdown';

const MOC_DATA = [
  {
    id: 'moc-oratoria',
    title: 'MOC Oratoria y Retórica',
    icon: '⊕',
    color: 'var(--accent)',
    noteCount: 8,
    description: 'Índice central de oratoria clásica: Cicerón, Aristóteles, técnicas modernas.',
    links: ['Oratoria clásica — Cicerón', 'Aristóteles — Retórica', 'Los cinco cánones'],
  },
  {
    id: 'moc-pkm',
    title: 'MOC Sistema MASTER_BRAIN',
    icon: '⊕',
    color: 'var(--purple)',
    noteCount: 15,
    description: 'Arquitectura del vault, metodología PKM, herramientas y flujos de trabajo.',
    links: ['Zettelkasten y el método Luhmann', 'Sistema MOC', 'RAG pipeline'],
  },
  {
    id: 'moc-egel',
    title: 'MOC Preparación EGEL',
    icon: '⊕',
    color: 'var(--red)',
    noteCount: 22,
    description: 'Todas las notas de estudio organizadas por área temática del EGEL.',
    links: ['Área I — Matemático', 'Área II — Lenguaje', 'Área III — Sociales'],
  },
  {
    id: 'moc-ia',
    title: 'MOC IA y RAG',
    icon: '⊕',
    color: 'var(--teal)',
    noteCount: 12,
    description: 'Embeddings, RAG pipeline, modelos de lenguaje, pgvector, arquitecturas.',
    links: ['RAG pipeline — arquitectura', 'Knowledge Graph', 'text-embedding-3-small'],
  },
];

const MOC_CONTENT = `# MOC Oratoria y Retórica

## Notas nucleares

- [[Oratoria clásica — Cicerón]] — Los cinco cánones
- [[Aristóteles — Retórica]] — Ethos, Pathos, Logos
- [[Quintiliano — Institutio Oratoria]] — pending

## Sub-áreas

### Retórica clásica
- [[De Oratore — análisis]]
- [[Figuras retóricas — taxonomía]]

### Oratoria contemporánea
- [[TED Talks — estructura]]
- [[Debate académico — técnicas]]

## Conexiones IA
- Ver [[Prompt Library]] → categoría Oratoria
- Ver [[RAG pipeline]] para búsqueda semántica de pasajes

#moc #oratoria #retórica`;

export function MocView() {
  const { notes, setActiveNote } = useNotesStore();
  const { navigateTo } = useAppStore();

  const mocNotes = notes.filter((n) => n.type === 'moc');
  const selectedMoc = MOC_DATA[0];

  return (
    <div className="notes-panel fade-in">
      {/* List */}
      <div className="notes-list">
        <div className="notes-list-header">
          <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: 2 }}>
            {MOC_DATA.length} Maps of Content
          </div>
        </div>
        <div className="notes-list-items">
          {MOC_DATA.map((moc) => (
            <div key={moc.id} className={`note-item${moc.id === 'moc-pkm' ? ' active' : ''}`}>
              <div className="note-item-title">
                <span style={{ marginRight: 6, color: moc.color }}>⊕</span>
                {moc.title}
              </div>
              <div className="note-item-preview">{moc.description}</div>
              <div className="note-item-footer">
                <span className="note-item-date">{moc.noteCount} notas</span>
                <span className="tag tag-teal" style={{ fontSize: 9 }}>moc</span>
              </div>
            </div>
          ))}

          {mocNotes.length > 0 && (
            <>
              <div style={{ padding: '8px 14px 4px', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                En vault
              </div>
              {mocNotes.map((note) => (
                <div
                  key={note.id}
                  className="note-item"
                  onClick={() => { setActiveNote(note.id); navigateTo('notes'); }}
                >
                  <div className="note-item-title">
                    <span style={{ marginRight: 6, color: 'var(--purple)', opacity: 0.7 }}>⊕</span>
                    {note.title}
                  </div>
                  <div className="note-item-preview">{note.preview}</div>
                  <div className="note-item-footer">
                    <span className="note-item-date">{note.date}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="notes-editor">
        <div className="editor-topbar">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--accent)', marginRight: 8 }}>⊕</span>
              {selectedMoc.title}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginTop: 2 }}>
              {selectedMoc.noteCount} notas · Map of Content
            </div>
          </div>
          <button className="topbar-btn">◈ IA</button>
          <button className="topbar-btn primary">+ Agregar nota</button>
        </div>

        <div className="editor-toolbar">
          {['H1', 'H2', 'H3', 'B', 'I'].map((t) => (
            <button key={t} className="toolbar-btn">{t}</button>
          ))}
          <div className="toolbar-sep" />
          <button className="toolbar-btn">[[Link]]</button>
          <button className="toolbar-btn">⬡ Grafo</button>
        </div>

        <div className="editor-body">
          <div className="editor-content fade-in" dangerouslySetInnerHTML={{ __html: renderMarkdown(MOC_CONTENT) }} />
        </div>

        <div className="editor-meta">
          <span className="meta-item">⊕ moc</span>
          <span className="meta-item">⬡ {selectedMoc.links.length} enlaces directos</span>
          <span className="tag tag-teal">#moc</span>
          <span className="tag tag-accent">#oratoria</span>
        </div>
      </div>
    </div>
  );
}
