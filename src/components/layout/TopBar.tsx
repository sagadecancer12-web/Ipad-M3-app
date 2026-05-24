import { useAppStore } from '../../core/stores/app.store';

const VIEW_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  notes: 'Notas',
  daily: 'Daily Notes',
  moc: 'Maps of Content',
  search: 'Búsqueda semántica',
  ai: 'AI Chat',
  graph: 'Knowledge Graph',
  flash: 'Flashcards',
  egel: 'EGEL Tracker',
  pdf: 'PDF / OCR',
  prompts: 'Prompt Library',
  sync: 'Obsidian Sync',
  split: 'Split View',
};

export function TopBar() {
  const { toggleSidebar, navigateTo, currentView, setCommandPaletteOpen } = useAppStore();
  const label = VIEW_LABELS[currentView] ?? currentView;

  return (
    <div className="topbar">
      <div className="topbar-toggle" onClick={toggleSidebar} title="Toggle sidebar">
        ≡
      </div>

      <div className="topbar-breadcrumb">
        <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          MASTER_BRAIN
        </span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{label}</span>
      </div>

      <div className="topbar-actions">
        <div
          className="topbar-search"
          onClick={() => setCommandPaletteOpen(true)}
          title="Buscar (⌘K)"
        >
          <span style={{ fontSize: 13 }}>○</span>
          <span>Buscar en vault...</span>
          <kbd>⌘K</kbd>
        </div>

        <button
          className="topbar-btn"
          onClick={() => navigateTo('ai')}
          title="AI Chat"
        >
          ◈ AI
        </button>

        <button
          className="topbar-btn"
          onClick={() => navigateTo('split')}
          title="Vista dividida"
        >
          ⊟ Split
        </button>

        <button
          className="topbar-btn primary"
          onClick={() => navigateTo('notes')}
        >
          + Nueva nota
        </button>
      </div>
    </div>
  );
}
