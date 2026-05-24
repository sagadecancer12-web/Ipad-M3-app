import './styles/globals.css';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { TabBar } from './components/layout/TabBar';
import { CommandPalette } from './components/shared/CommandPalette';
import { ViewRouter } from './features/ViewRouter';

export default function App() {
  return (
    <>
      <div className="app-shell">
        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <div className="main">
          {/* Top bar */}
          <TopBar />

          {/* Content area */}
          <div className="content">
            <div className="panel-layout">
              {/* Tab bar */}
              <TabBar />

              {/* Panel content */}
              <div className="panel-content">
                <ViewRouter />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      <CommandPalette />
    </>
  );
}
