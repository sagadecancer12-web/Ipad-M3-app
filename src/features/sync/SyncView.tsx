export function SyncView() {
  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <div className="ai-header">
        <span style={{ color: 'var(--teal)' }}>↻</span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Obsidian Sync</span>
        <span className="ai-badge status">● sincronizado</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button className="topbar-btn">↻ Sync ahora</button>
          <button className="topbar-btn primary">⚙ Configurar</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-label">Última sincronización</div>
            <div className="stat-value teal" style={{ fontSize: 18 }}>hace 3min</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">◻</div>
            <div className="stat-label">Notas sincronizadas</div>
            <div className="stat-value accent">142</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">☁</div>
            <div className="stat-label">iCloud Drive</div>
            <div className="stat-value teal" style={{ fontSize: 18 }}>2.3 GB</div>
          </div>
        </div>

        {/* Sync log */}
        <div className="widget">
          <div className="widget-header">
            <span style={{ color: 'var(--text-tertiary)' }}>↻</span>
            <span className="widget-title">Registro de sincronización</span>
          </div>
          {[
            { time: '09:47', event: 'Vault sincronizado completamente', type: 'success' },
            { time: '09:45', event: 'Nota "Daily Note 21 Mayo" actualizada', type: 'info' },
            { time: '09:30', event: 'Nota "RAG pipeline" modificada en Obsidian', type: 'info' },
            { time: '09:15', event: 'Conflicto resuelto: "Zettelkasten" — versión local preferida', type: 'warning' },
            { time: '08:55', event: 'Sincronización inicial completada', type: 'success' },
          ].map((log, i) => (
            <div key={i} className="note-row">
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', flexShrink: 0, minWidth: 40 }}>
                {log.time}
              </span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, marginTop: 4, background: log.type === 'success' ? 'var(--teal)' : log.type === 'warning' ? 'var(--accent)' : 'var(--text-tertiary)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{log.event}</span>
            </div>
          ))}
        </div>

        {/* Config */}
        <div className="widget">
          <div className="widget-header">
            <span style={{ color: 'var(--text-tertiary)' }}>⚙</span>
            <span className="widget-title">Configuración</span>
          </div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Vault path', value: '~/Library/Mobile Documents/iCloud~md~obsidian/CerebroX/' },
              { label: 'Sync interval', value: 'Automático (iCloud)' },
              { label: 'Conflictos', value: 'Preferir versión local' },
              { label: 'Formato', value: 'Markdown · Frontmatter YAML · Wikilinks Obsidian' },
            ].map((c, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  {c.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
