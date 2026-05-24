import { useState, useCallback } from 'react';
import { NOTES } from '../../core/data/notes.data';
import { useNotesStore } from '../../core/stores/notes.store';
import { useAppStore } from '../../core/stores/app.store';

interface SearchResult {
  noteId: number;
  title: string;
  excerpt: string;
  score: number;
  tags: string[];
  date: string;
}

function simulateSearch(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return NOTES
    .filter((n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q))
    )
    .map((n) => {
      const idx = n.content.toLowerCase().indexOf(q);
      const excerpt = idx >= 0
        ? '...' + n.content.slice(Math.max(0, idx - 40), idx + 100).replace(/[#*`]/g, '') + '...'
        : n.preview;
      const score = n.title.toLowerCase().includes(q) ? 0.97 : 0.78 + Math.random() * 0.15;
      return { noteId: n.id, title: n.title, excerpt, score, tags: n.tags, date: n.date };
    })
    .sort((a, b) => b.score - a.score);
}

export function SearchView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  const { setActiveNote } = useNotesStore();
  const { navigateTo } = useAppStore();

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setIsSearching(true);
    setSearched(false);
    setTimeout(() => {
      setResults(simulateSearch(query));
      setIsSearching(false);
      setSearched(true);
    }, 600 + Math.random() * 400);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div className="ai-header">
        <span style={{ color: 'var(--text-tertiary)' }}>○</span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Búsqueda semántica</span>
        <span className="ai-badge model">RAG · pgvector</span>
        <span className="ai-badge context">1536-dim embeddings</span>
      </div>

      {/* Search input */}
      <div style={{ padding: '20px 24px 0' }}>
        <div
          className="ai-input-box"
          style={{ maxWidth: 680, margin: '0 auto' }}
        >
          <span style={{ color: 'var(--text-tertiary)', fontSize: 16, flexShrink: 0 }}>○</span>
          <input
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 15,
              fontFamily: 'var(--font-sans)',
              color: 'var(--text-primary)',
            }}
            placeholder="Busca en tus 142 notas y 23 documentos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="ai-send-btn"
            onClick={handleSearch}
            disabled={!query.trim()}
            style={{ background: 'var(--accent)', width: 36, height: 36 }}
          >
            ↵
          </button>
        </div>

        {/* Quick searches */}
        <div style={{ maxWidth: 680, margin: '12px auto 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Zettelkasten método', 'RAG pipeline embeddings', 'oratoria cicerón', 'SM-2 algoritmo', 'knowledge graph'].map((q) => (
            <span
              key={q}
              className="source-chip"
              style={{ cursor: 'pointer' }}
              onClick={() => { setQuery(q); setTimeout(handleSearch, 50); }}
            >
              {q}
            </span>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {isSearching && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <div style={{ marginBottom: 12, fontSize: 24 }}>○</div>
              <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                Buscando en vault...
                <span className="typing-dot" style={{ marginLeft: 8 }} />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
              <div style={{ fontSize: 11, marginTop: 6 }}>embed → pgvector → rerank</div>
            </div>
          )}

          {!isSearching && searched && results.length === 0 && (
            <div className="placeholder-view">
              <div className="placeholder-icon">○</div>
              <div className="placeholder-label">Sin resultados</div>
              <div className="placeholder-desc">No encontré notas con similitud coseno ≥ 0.78 para "{query}".</div>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="fade-in">
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: 16 }}>
                {results.length} resultados para "{query}" · similitud coseno ≥ 0.78 · top-K 8
              </div>
              {results.map((r) => (
                <div
                  key={r.noteId}
                  className="widget"
                  style={{ marginBottom: 12, cursor: 'pointer' }}
                  onClick={() => {
                    setActiveNote(r.noteId);
                    navigateTo('notes');
                  }}
                >
                  <div style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: 13, marginTop: 1 }}>◻</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                          {r.title}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {r.excerpt}
                        </div>
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: 11, padding: '2px 8px',
                        borderRadius: 3, flexShrink: 0,
                        background: r.score >= 0.9 ? 'var(--teal-dim)' : 'var(--accent-dim)',
                        color: r.score >= 0.9 ? 'var(--teal)' : 'var(--accent)',
                        border: `1px solid ${r.score >= 0.9 ? 'rgba(62,207,176,0.2)' : 'var(--accent-mid)'}`,
                      }}>
                        {r.score.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {r.tags.slice(0, 3).map((t, i) => (
                        <span key={i} className="tag tag-purple" style={{ fontSize: 9 }}>#{t}</span>
                      ))}
                      <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                        {r.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && !searched && (
            <div className="placeholder-view" style={{ paddingTop: 40 }}>
              <div className="placeholder-icon">○</div>
              <div className="placeholder-label">Búsqueda semántica vectorial</div>
              <div className="placeholder-desc">
                Busca conceptos, ideas o fragmentos de texto. El sistema usa embeddings de 1536 dimensiones y similitud coseno para encontrar notas semánticamente relacionadas.
              </div>
              <div className="placeholder-badges">
                <span className="tag tag-purple">text-embedding-3-small</span>
                <span className="tag tag-teal">pgvector</span>
                <span className="tag tag-accent">cos ≥ 0.78</span>
                <span className="tag tag-gray">top-K 8</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
