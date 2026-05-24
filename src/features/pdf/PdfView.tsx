export function PdfView() {
  const docs = [
    { name: 'Ciceron - De Oratore.pdf', pages: 284, status: 'indexed', chunks: 142, date: 'hace 3d' },
    { name: 'Luhmann - Zettelkasten.pdf', pages: 96, status: 'indexed', chunks: 48, date: 'hace 5d' },
    { name: 'RAG Survey 2024.pdf', pages: 38, status: 'indexed', chunks: 22, date: 'ayer' },
    { name: 'EGEL Guia Estudiante.pdf', pages: 52, status: 'processing', chunks: 0, date: 'hoy' },
    { name: 'Aristoteles - Retorica.pdf', pages: 210, status: 'queue', chunks: 0, date: 'hoy' },
  ];

  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <div className="ai-header">
        <span style={{ color: 'var(--text-tertiary)' }}>▣</span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>PDF / OCR / Audio</span>
        <span className="ai-badge context">23 procesados</span>
        <span className="ai-badge model" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--accent-mid)' }}>
          2 en cola
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button className="topbar-btn primary">+ Subir PDF</button>
          <button className="topbar-btn">🎙 Audio (Whisper)</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="widget">
          <div className="widget-header">
            <span style={{ color: 'var(--text-tertiary)' }}>▣</span>
            <span className="widget-title">Documentos indexados</span>
          </div>
          {docs.map((doc, i) => (
            <div key={i} className="note-row">
              <span style={{ fontSize: 18 }}>📄</span>
              <div className="note-row-content">
                <div className="note-row-title">{doc.name}</div>
                <div className="note-row-meta">
                  <span>{doc.pages} páginas</span>
                  {doc.chunks > 0 && <span>{doc.chunks} chunks · 1536-dim</span>}
                  <span>{doc.date}</span>
                </div>
              </div>
              <span className={`tag ${doc.status === 'indexed' ? 'tag-teal' : doc.status === 'processing' ? 'tag-accent' : 'tag-gray'}`} style={{ fontSize: 10 }}>
                {doc.status === 'indexed' ? '✓ indexado' : doc.status === 'processing' ? '⟳ procesando' : '○ cola'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div className="stat-card">
            <div className="stat-icon">▣</div>
            <div className="stat-label">Documentos PDF</div>
            <div className="stat-value accent">21</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎙</div>
            <div className="stat-label">Transcripciones audio</div>
            <div className="stat-value purple">2</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⬡</div>
            <div className="stat-label">Chunks en pgvector</div>
            <div className="stat-value teal">1,847</div>
          </div>
        </div>

        <div className="widget">
          <div className="widget-header">
            <span style={{ color: 'var(--text-tertiary)' }}>◎</span>
            <span className="widget-title">Pipeline de procesamiento</span>
          </div>
          <div style={{ padding: '14px 18px' }}>
            {[
              { step: '1. Extracción', desc: 'PDF.js · OCR con Tesseract.js', status: '✓', color: 'var(--teal)' },
              { step: '2. Chunking', desc: '512 tokens · 50 overlap · markdown-aware', status: '✓', color: 'var(--teal)' },
              { step: '3. Embedding', desc: 'text-embedding-3-small · 1536 dim', status: '✓', color: 'var(--teal)' },
              { step: '4. Indexado', desc: 'pgvector · ivfflat · coseno', status: '✓', color: 'var(--teal)' },
              { step: '5. RAG', desc: 'top-K=8 · threshold 0.78 · re-ranking', status: '✓', color: 'var(--teal)' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: s.color, fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.status}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{s.step}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
