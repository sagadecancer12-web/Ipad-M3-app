import type { ViewId } from '../../types';
import { useAppStore } from '../../core/stores/app.store';

interface NavItem {
  id: ViewId;
  icon: string;
  label: string;
  badge?: string;
  badgeLive?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'notes', icon: '◻', label: 'Notas', badge: '142' },
  { id: 'daily', icon: '▷', label: 'Daily Notes' },
  { id: 'moc', icon: '⊕', label: 'MOC' },
  { id: 'search', icon: '○', label: 'Búsqueda semántica' },
  { id: 'ai', icon: '◈', label: 'AI Chat', badge: '·', badgeLive: true },
];

const TOOL_ITEMS: NavItem[] = [
  { id: 'graph', icon: '⬡', label: 'Knowledge Graph' },
  { id: 'flash', icon: '◇', label: 'Flashcards', badge: '24' },
  { id: 'egel', icon: '▲', label: 'EGEL Tracker' },
  { id: 'pdf', icon: '▣', label: 'PDF / OCR' },
  { id: 'prompts', icon: '◉', label: 'Prompt Library' },
  { id: 'sync', icon: '↻', label: 'Obsidian Sync' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, navigateTo, currentView } = useAppStore();
  const collapsed = sidebarCollapsed;

  return (
    <div className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">MB</div>
        {!collapsed && <div className="sidebar-logo-text">MASTER<span>_BRAIN</span></div>}
      </div>

      {/* Body */}
      <div className="sidebar-body">
        <div className="sidebar-section">
          {!collapsed && <div className="sidebar-section-label">Workspace</div>}
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`nav-item${currentView === item.id ? ' active' : ''}`}
              onClick={() => navigateTo(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className={`nav-badge${item.badgeLive ? ' live' : ''}`}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section">
          {!collapsed && <div className="sidebar-section-label">Herramientas</div>}
          {TOOL_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`nav-item${currentView === item.id ? ' active' : ''}`}
              onClick={() => navigateTo(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="nav-item" onClick={toggleSidebar} title={collapsed ? 'Expandir sidebar' : undefined}>
          <span className="nav-icon">{collapsed ? '→' : '←'}</span>
          {!collapsed && <span className="nav-label">Colapsar sidebar</span>}
        </div>
        <div className="nav-item" title={collapsed ? 'Ajustes' : undefined}>
          <span className="nav-icon">◎</span>
          {!collapsed && <span className="nav-label">Ajustes</span>}
        </div>
      </div>
    </div>
  );
}
