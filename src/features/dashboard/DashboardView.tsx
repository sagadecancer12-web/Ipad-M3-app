import { useAppStore } from '../../core/stores/app.store';
import { useNotesStore } from '../../core/stores/notes.store';
import { EGEL_AREAS } from '../../core/data/egel.data';
import { getCurrentDateStr, getGreeting } from '../../core/utils/markdown';
import type { ViewId } from '../../types';

const TAG_COLORS = ['tag-purple', 'tag-teal', 'tag-accent', 'tag-gray'];

function getTagColor(index: number): string {
  return TAG_COLORS[index % TAG_COLORS.length];
}

function getProgressColor(pct: number): string {
  if (pct >= 70) return 'var(--teal)';
  if (pct >= 50) return 'var(--accent)';
  return 'var(--red)';
}

export function DashboardView() {
  const { navigateTo } = useAppStore();
  const { notes, setActiveNote } = useNotesStore();
  const dateStr = getCurrentDateStr();
  const greeting = getGreeting();

  const recentNotes = notes.slice(0, 5);
  const dueToday = 24;

  return (
    <div className="dashboard fade-in">
      {/* Header */}
      <div className="dashboard-greeting">
        {greeting}, <strong>MASTER_BRAIN</strong>
      </div>
      <div className="dashboard-date">{dateStr}</div>

      {/* Stats */}
      <div className="dash-grid dash-stats">
        <div className="stat-card">
          <div className="stat-icon">◻</div>
          <div className="stat-label">notas totales</div>
          <div className="stat-value accent">142</div>
          <div className="stat-sub">+3 esta semana</div>
          <div className="stat-trend">↑ 2.1% vs semana anterior</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">◇</div>
          <div className="stat-label">flashcards pendientes</div>
          <div className="stat-value purple">{dueToday}</div>
          <div className="stat-sub">para hoy · SM-2</div>
          <div className="stat-trend" style={{ color: 'var(--purple)' }}>▶ 8 decks activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">▣</div>
          <div className="stat-label">documentos procesados</div>
          <div className="stat-value teal">23</div>
          <div className="stat-sub">2 PDFs en cola</div>
          <div className="stat-trend" style={{ color: 'var(--teal)' }}>≈ 1536-dim embeddings</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⬡</div>
          <div className="stat-label">conexiones en grafo</div>
          <div className="stat-value" style={{ color: 'var(--blue)' }}>387</div>
          <div className="stat-sub">links + similitud IA</div>
          <div className="stat-trend" style={{ color: 'var(--blue)' }}>↑ 12 nuevas ayer</div>
        </div>
      </div>

      {/* Main grid */}
      <div className="dash-grid dash-main">
        {/* Left: Recent notes */}
        <div className="widget">
          <div className="widget-header">
            <span style={{ color: 'var(--text-tertiary)' }}>◻</span>
            <span className="widget-title">Notas recientes</span>
            <span className="widget-action" onClick={() => navigateTo('notes')}>
              ver todas →
            </span>
          </div>
          <div className="widget-body">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="note-row"
                onClick={() => {
                  setActiveNote(note.id);
                  navigateTo('notes');
                }}
              >
                <span className="note-row-icon">◻</span>
                <div className="note-row-content">
                  <div className="note-row-title">{note.title}</div>
                  <div className="note-row-meta">
                    {note.tags.map((t, i) => (
                      <span key={i} className={`tag ${getTagColor(i)}`}>#{t}</span>
                    ))}
                    <span>{note.date}</span>
                  </div>
                </div>
                <span style={{ color: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                  →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* EGEL */}
          <div className="widget">
            <div className="widget-header">
              <span style={{ color: 'var(--text-tertiary)' }}>▲</span>
              <span className="widget-title">EGEL Tracker</span>
              <span className="widget-action" onClick={() => navigateTo('egel' as ViewId)}>
                detalle →
              </span>
            </div>
            {EGEL_AREAS.map((a, i) => (
              <div key={i} className="egel-row" onClick={() => navigateTo('egel' as ViewId)}>
                <div className="egel-area-name">{a.shortLabel}</div>
                <div style={{ flex: 2 }}>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${a.pct}%`, background: getProgressColor(a.pct) }}
                    />
                  </div>
                </div>
                <div className="egel-pct">{a.pct}%</div>
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="widget">
            <div className="widget-header">
              <span style={{ color: 'var(--purple)' }}>◈</span>
              <span className="widget-title">AI Insight</span>
              <span className="widget-action" onClick={() => navigateTo('ai')}>
                explorar →
              </span>
            </div>
            <div style={{ padding: '14px 18px' }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                Detecté una conexión no explorada entre tus notas de{' '}
                <strong style={{ color: 'var(--purple)' }}>oratoria clásica</strong> y el concepto
                de <strong style={{ color: 'var(--accent)' }}>inventio</strong> en tu sistema de prompts.
                Hay{' '}
                <strong style={{ color: 'var(--teal)' }}>7 notas</strong> que orbitan este nodo sin
                wikilinks explícitos.
              </div>
              <div className="source-chips">
                <span className="source-chip">◻ Cicerón → De Oratore</span>
                <span className="source-chip">◉ Prompt Library</span>
                <span className="source-chip">◻ Zettelkasten</span>
              </div>
              <button
                className="topbar-btn primary"
                style={{ marginTop: 12, fontSize: 12 }}
                onClick={() => navigateTo('ai')}
              >
                ◈ Explorar con IA
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="widget">
            <div className="widget-header">
              <span style={{ color: 'var(--text-tertiary)' }}>◎</span>
              <span className="widget-title">Acciones rápidas</span>
            </div>
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { icon: '▷', label: 'Abrir daily note de hoy', view: 'daily' as ViewId, color: 'var(--teal)' },
                { icon: '◇', label: `Repasar ${dueToday} flashcards`, view: 'flash' as ViewId, color: 'var(--purple)' },
                { icon: '⬡', label: 'Ver knowledge graph', view: 'graph' as ViewId, color: 'var(--blue)' },
                { icon: '⊟', label: 'Vista split (editor + AI)', view: 'split' as ViewId, color: 'var(--accent)' },
              ].map((a) => (
                <div
                  key={a.view}
                  className="nav-item"
                  style={{ borderRadius: 'var(--radius-sm)', padding: '8px 10px', minHeight: 36 }}
                  onClick={() => navigateTo(a.view)}
                >
                  <span style={{ color: a.color, fontSize: 14, width: 18, textAlign: 'center' }}>
                    {a.icon}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.label}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--text-tertiary)', fontSize: 11 }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
