import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ViewId, Tab } from '../../types';

const VIEW_ICONS: Record<ViewId, string> = {
  dashboard: '⊞',
  notes: '◻',
  daily: '▷',
  moc: '⊕',
  search: '○',
  ai: '◈',
  graph: '⬡',
  flash: '◇',
  egel: '▲',
  pdf: '▣',
  prompts: '◉',
  sync: '↻',
  split: '⊟',
};

const VIEW_LABELS: Record<ViewId, string> = {
  dashboard: 'Dashboard',
  notes: 'Notas',
  daily: 'Daily Notes',
  moc: 'MOC',
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

let tabCounter = 3;

const INIT_TABS: Tab[] = [
  { id: 1, icon: '⊞', label: 'Dashboard', viewId: 'dashboard' },
  { id: 2, icon: '◻', label: 'Zettelkasten...', viewId: 'notes' },
  { id: 3, icon: '◈', label: 'AI Chat', viewId: 'ai' },
];

interface AppState {
  sidebarCollapsed: boolean;
  currentView: ViewId;
  tabs: Tab[];
  activeTabId: number;
  commandPaletteOpen: boolean;

  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  navigateTo: (view: ViewId, noteId?: number) => void;
  closeTab: (id: number) => void;
  switchTab: (id: number) => void;
  addNewTab: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      sidebarCollapsed: false,
      currentView: 'dashboard',
      tabs: INIT_TABS,
      activeTabId: 1,
      commandPaletteOpen: false,

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      navigateTo: (view) => {
        const label = VIEW_LABELS[view];
        const existing = get().tabs.find((t) => t.viewId === view);
        if (existing) {
          set({ currentView: view, activeTabId: existing.id });
          return;
        }
        tabCounter++;
        const newTab: Tab = {
          id: tabCounter,
          icon: VIEW_ICONS[view],
          label,
          viewId: view,
        };
        set((s) => ({
          tabs: [...s.tabs, newTab],
          activeTabId: newTab.id,
          currentView: view,
        }));
      },

      closeTab: (id) => {
        const { tabs, activeTabId } = get();
        if (tabs.length <= 1) return;
        const next = tabs.filter((t) => t.id !== id);
        if (activeTabId === id) {
          const last = next[next.length - 1];
          set({ tabs: next, activeTabId: last.id, currentView: last.viewId });
        } else {
          set({ tabs: next });
        }
      },

      switchTab: (id) => {
        const tab = get().tabs.find((t) => t.id === id);
        if (tab) set({ activeTabId: id, currentView: tab.viewId });
      },

      addNewTab: () => {
        tabCounter++;
        const newTab: Tab = {
          id: tabCounter,
          icon: '◻',
          label: 'Nueva nota',
          viewId: 'notes',
        };
        set((s) => ({
          tabs: [...s.tabs, newTab],
          activeTabId: newTab.id,
          currentView: 'notes',
        }));
      },

      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
    }),
    { name: 'app-store' }
  )
);
