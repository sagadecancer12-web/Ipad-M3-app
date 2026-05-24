import { useState } from 'react';
import { EGEL_AREAS } from '../../core/data/egel.data';
import { useNotesStore } from '../../core/stores/notes.store';
import { useAppStore } from '../../core/stores/app.store';

function getProgressColor(pct: number): string {
  if (pct >= 70) return 'var(--teal)';
  if (pct >= 50) return 'var(--accent)';
  return 'var(--red)';
}

function getProgressLabel(pct: number): string {
  if (pct >= 80) return 'Excelente';
  if (pct >= 70) return 'Bien';
  if (pct >= 50) return 'Regular';
  return 'Necesita refuerzo';
}

export function EgelView() {
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const { notes, setActiveNote } = useNotesStore();
  const { navigateTo } = useAppStore();

  const totalPct = Math.round(EGEL_AREAS.reduce((acc, a) => acc + a.pct, 0) / EGEL_AREAS.length);
  const egelNotes = notes.filter((n) => n.tags.includes('egel') || n.type === 'egel');

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div className="ai-header">
        <span style={{ color: 'var(--text-tertiary)' }}>▲</span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>EGEL Tracker</span>
        <span className="ai-badge context">5 áreas</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>
            Dominio global:
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: getProgressColor(totalPct), fontFamily: 'var(--font-mono)' }}>
            {totalPct}%
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', gap: 16, flexDirection: 'column' }}>
        {/* Overall progress */}
        <div className="widget">
          <div className="widget-header">
            <span style={{ color: 'var(--text-tertiary)' }}>▲</span>
            <span className="widget-title">Dominio por área</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            {EGEL_AREAS.map((area, i) => {
              const color = getProgressColor(area.pct);
              const isSelected = selectedArea === i;
              return (
                <div
                  key={i}
                  style={{
                    padding: '14px 18px',
                    borderBottom: i < EGEL_AREAS.length - 1 ? '1px solid var(--border)' : 'none',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--bg-hover)' : 'transparent',
                    transition: 'background var(--transition)',
                  }}
                  onClick={() => setSelectedArea(isSelected ? null : i)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{area.area}</div>
                    <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color, fontWeight: 600 }}>
                      {area.pct}%
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                      {getProgressLabel(area.pct)}
                    </div>
                  </div>
                  <div className="progress-bar" style={{ height: 6 }}>
                    <div className="progress-fill" style={{ width: `${area.pct}%`, background: color }} />
                  </div>
                  {isSelected && (
                    <div className="fade-in" style={{ marginTop: 12, display: 'flex', gap: 20 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Notas</span>
                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{area.notes}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Decks SM-2</span>
                        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{area.decks}</span>
                      </div>
                      <button
                        className="topbar-btn primary"
                        style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('flash');
                        }}
                      >
                        ◇ Estudiar deck
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Projection */}
        <div className="dash-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="stat-card">
            <div className="stat-icon">◎</div>
            <div className="stat-label">Objetivo EGEL</div>
            <div className="stat-value accent">70%</div>
            <div className="stat-sub">Nivel suficiencia</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">▲</div>
            <div className="stat-label">Brecha actual</div>
            <div className="stat-value red">{Math.max(0, 70 - totalPct)}%</div>
            <div className="stat-sub">para alcanzar objetivo</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">◷</div>
            <div className="stat-label">Tiempo estimado</div>
            <div className="stat-value teal">3.5sem</div>
            <div className="stat-sub">a ritmo actual</div>
          </div>
        </div>

        {/* EGEL Notes */}
        {egelNotes.length > 0 && (
          <div className="widget">
            <div className="widget-header">
              <span style={{ color: 'var(--text-tertiary)' }}>◻</span>
              <span className="widget-title">Notas de preparación EGEL</span>
            </div>
            {egelNotes.map((note) => (
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
                  <div className="note-row-meta">{note.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="widget">
          <div className="widget-header">
            <span style={{ color: 'var(--purple)' }}>◈</span>
            <span className="widget-title">Recomendaciones AI</span>
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { area: 'Área IV — Ciencias naturales', tip: 'Solo 43% de dominio. Prioridad alta. Generar flashcards desde las notas pendientes.', color: 'var(--red)' },
              { area: 'Área III — Ciencias sociales', tip: '58% de dominio. Revisar los conceptos de análisis social comparado.', color: 'var(--accent)' },
              { area: 'Área I — Matemático', tip: '72% de dominio. Cerca del objetivo. 3 sesiones más de repaso.', color: 'var(--teal)' },
            ].map((r, i) => (
              <div key={i} style={{ borderLeft: `2px solid ${r.color}`, paddingLeft: 12 }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: r.color, marginBottom: 3 }}>{r.area}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.tip}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
