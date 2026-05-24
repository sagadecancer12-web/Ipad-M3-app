import { useState } from 'react';
import { PROMPTS } from '../../core/data/prompts.data';
import type { Prompt } from '../../types';

const CATEGORY_COLORS: Record<string, string> = {
  PKM: 'tag-purple',
  IA: 'tag-teal',
  Estudio: 'tag-accent',
  Oratoria: 'tag-blue',
  EGEL: 'tag-red',
};

export function PromptsView() {
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<string>('Todos');

  const categories = ['Todos', ...new Set(PROMPTS.map((p) => p.category))];
  const filtered = filter === 'Todos' ? PROMPTS : PROMPTS.filter((p) => p.category === filter);

  const renderTemplate = (template: string, vars: Record<string, string>) => {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] || `{{${key}}}`);
  };

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* List */}
      <div className="notes-list" style={{ width: 280, minWidth: 280 }}>
        <div className="notes-list-header">
          <div className="notes-list-search">
            <span style={{ fontSize: 13 }}>○</span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Buscar prompts...</span>
          </div>
          <div className="notes-list-filter">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`tag ${filter === cat ? 'tag-accent' : 'tag-gray'}`}
                style={{ cursor: 'pointer', fontSize: 10 }}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
        <div className="notes-list-items">
          {filtered.map((prompt) => (
            <div
              key={prompt.id}
              className={`note-item${selected?.id === prompt.id ? ' active' : ''}`}
              onClick={() => { setSelected(prompt); setVariables({}); }}
            >
              <div className="note-item-title">{prompt.title}</div>
              <div className="note-item-preview">{prompt.template.slice(0, 80)}...</div>
              <div className="note-item-footer">
                <span className={`tag ${CATEGORY_COLORS[prompt.category] ?? 'tag-gray'}`} style={{ fontSize: 9 }}>
                  {prompt.category}
                </span>
                <span className="tag tag-gray" style={{ fontSize: 9 }}>{prompt.model}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="editor-topbar">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{selected.title}</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginTop: 2 }}>
                {selected.model} · {selected.category}
              </div>
            </div>
            <button className="topbar-btn">◎ Duplicar</button>
            <button className="topbar-btn primary">◈ Ejecutar</button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Template */}
            <div className="widget">
              <div className="widget-header">
                <span style={{ color: 'var(--text-tertiary)' }}>◻</span>
                <span className="widget-title">Template</span>
              </div>
              <div style={{ padding: 18 }}>
                <pre style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  background: 'var(--bg-surface)',
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}>
                  {renderTemplate(selected.template, variables)}
                </pre>
              </div>
            </div>

            {/* Variables */}
            {selected.variables.length > 0 && (
              <div className="widget">
                <div className="widget-header">
                  <span style={{ color: 'var(--text-tertiary)' }}>◎</span>
                  <span className="widget-title">Variables</span>
                </div>
                <div style={{ padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {selected.variables.map((v) => (
                    <div key={v}>
                      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--teal)', marginBottom: 6 }}>
                        {`{{${v}}}`}
                      </div>
                      <textarea
                        style={{
                          width: '100%',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '8px 12px',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 13,
                          resize: 'vertical',
                          outline: 'none',
                          minHeight: 60,
                        }}
                        placeholder={`Valor para {{${v}}}...`}
                        value={variables[v] ?? ''}
                        onChange={(e) => setVariables((prev) => ({ ...prev, [v]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selected.tags.map((t, i) => (
                <span key={i} className="tag tag-purple" style={{ fontSize: 11 }}>#{t}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="placeholder-view">
          <div className="placeholder-icon">◉</div>
          <div className="placeholder-label">Prompt Library</div>
          <div className="placeholder-desc">
            Selecciona un prompt para ver su template, configurar variables y ejecutarlo directamente.
          </div>
          <div className="placeholder-badges">
            {categories.filter((c) => c !== 'Todos').map((c) => (
              <span key={c} className={`tag ${CATEGORY_COLORS[c] ?? 'tag-gray'}`}>{c}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
