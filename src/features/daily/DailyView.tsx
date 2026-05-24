import { useState } from 'react';
import { renderMarkdown } from '../../core/utils/markdown';

const today = new Date();
const todayStr = today.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const todayKey = today.toISOString().slice(0, 10);

const DAILY_TEMPLATE = `# Daily Note — ${today.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}

## Revisión matutina

- [ ] Revisar notas pendientes del día anterior
- [ ] Repasar flashcards del día (SM-2)
- [ ] Revisar progreso EGEL

## Intenciones del día

_Escribe tus 3 intenciones principales aquí..._

## Notas y capturas

_Espacio libre para capturas del día..._

## Reflexión

_¿Qué aprendí hoy? ¿Qué conexiones descubrí?_

#daily #${todayKey}`;

interface DailyEntry {
  date: string;
  label: string;
  preview: string;
  streak: boolean;
}

const PAST_ENTRIES: DailyEntry[] = [
  { date: '2026-05-21', label: '21 Mayo', preview: 'Revisión de RAG pipeline. Conexión entre Zettelkasten e inventio ciceroniana...', streak: true },
  { date: '2026-05-20', label: '20 Mayo', preview: 'Flashcards EGEL Área I. 18 tarjetas repasadas. Progreso +3%.', streak: true },
  { date: '2026-05-19', label: '19 Mayo', preview: 'Knowledge Graph node design. D3 force layout. Clusters semánticos.', streak: true },
  { date: '2026-05-18', label: '18 Mayo', preview: 'Oratoria clásica — De Oratore completado. Conexión con prompt library.', streak: true },
  { date: '2026-05-17', label: '17 Mayo', preview: 'Setup inicial MASTER_BRAIN. Primera nota atómica creada.', streak: true },
];

export function DailyView() {
  const [selectedDate, setSelectedDate] = useState<string>(todayKey);
  const [editorMode, setEditorMode] = useState<'preview' | 'edit'>('edit');
  const [content, setContent] = useState(DAILY_TEMPLATE);
  const [streakCount] = useState(7);

  const isToday = selectedDate === todayKey;
  const selectedEntry = PAST_ENTRIES.find((e) => e.date === selectedDate);

  return (
    <div className="notes-panel fade-in">
      {/* Sidebar */}
      <div className="notes-list">
        <div className="notes-list-header">
          {/* Streak */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0 8px' }}>
            <div style={{ fontSize: 20 }}>🔥</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                {streakCount}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                días de racha
              </div>
            </div>
          </div>
        </div>
        <div className="notes-list-items">
          {/* Today */}
          <div
            className={`note-item${isToday ? ' active' : ''}`}
            onClick={() => setSelectedDate(todayKey)}
          >
            <div className="note-item-title">
              <span style={{ marginRight: 6, color: 'var(--teal)' }}>▷</span>
              Hoy
            </div>
            <div className="note-item-preview">{todayStr}</div>
            <div className="note-item-footer">
              <span className="tag tag-teal" style={{ fontSize: 9 }}>nuevo</span>
            </div>
          </div>

          {/* Past entries */}
          {PAST_ENTRIES.map((entry) => (
            <div
              key={entry.date}
              className={`note-item${selectedDate === entry.date ? ' active' : ''}`}
              onClick={() => setSelectedDate(entry.date)}
            >
              <div className="note-item-title">
                <span style={{ marginRight: 6, opacity: 0.6 }}>▷</span>
                {entry.label}
              </div>
              <div className="note-item-preview">{entry.preview}</div>
              <div className="note-item-footer">
                <span className="note-item-date">{entry.date}</span>
                {entry.streak && <span style={{ fontSize: 12 }}>🔥</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="notes-editor">
        <div className="editor-topbar">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
              {isToday ? '▷ Daily Note de hoy' : `▷ Daily — ${selectedEntry?.label ?? selectedDate}`}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginTop: 2 }}>
              {todayStr}
            </div>
          </div>
          <button
            className={`topbar-btn${editorMode === 'edit' ? ' primary' : ''}`}
            onClick={() => setEditorMode(editorMode === 'edit' ? 'preview' : 'edit')}
          >
            {editorMode === 'edit' ? '◻ Preview' : '✎ Editar'}
          </button>
          {isToday && <button className="topbar-btn primary">✓ Guardar</button>}
        </div>

        <div className="editor-toolbar">
          {['H1', 'H2', 'B', 'I', 'Code', '—'].map((t) => (
            <button key={t} className="toolbar-btn">{t}</button>
          ))}
          <div className="toolbar-sep" />
          <button className="toolbar-btn">- [ ] Task</button>
          <button className="toolbar-btn">[[Link]]</button>
          <button className="toolbar-btn">#tag</button>
          <div className="toolbar-sep" />
          <button className="toolbar-btn">📋 Template</button>
        </div>

        <div className="editor-body">
          {editorMode === 'edit' ? (
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
              value={isToday ? content : (selectedEntry?.preview ?? '')}
              onChange={(e) => { if (isToday) setContent(e.target.value); }}
              readOnly={!isToday}
              spellCheck={false}
            />
          ) : (
            <div
              className="editor-content fade-in"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(isToday ? content : (selectedEntry?.preview ?? '')) }}
            />
          )}
        </div>

        <div className="editor-meta">
          <span className="meta-item">▷ daily</span>
          <span className="meta-item">◷ {isToday ? 'hoy' : selectedDate}</span>
          <span className="meta-item">≈ {(isToday ? content : selectedEntry?.preview ?? '').split(/\s+/).filter(Boolean).length} palabras</span>
          <span className="tag tag-teal">#daily</span>
        </div>
      </div>
    </div>
  );
}
