import { useAppStore } from '../../core/stores/app.store';

export function TabBar() {
  const { tabs, activeTabId, switchTab, closeTab, addNewTab } = useAppStore();

  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab${activeTabId === tab.id ? ' active' : ''}`}
          onClick={() => switchTab(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
          {tabs.length > 1 && (
            <span
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              title="Cerrar pestaña"
            >
              ×
            </span>
          )}
        </div>
      ))}
      <div className="tab-add" onClick={addNewTab} title="Nueva pestaña">
        +
      </div>
    </div>
  );
}
