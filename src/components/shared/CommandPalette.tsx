import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../core/stores/app.store';
import type { ViewId } from '../../types';

interface CmdItem {
  id: string;
  icon: string;
  label: string;
  description: string;
  action: () => void;
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, navigateTo } = useAppStore();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const COMMANDS: CmdItem[] = [
    { id: 'dashboard', icon: '⊞', label: 'Ir a Dashboard', description: 'Vista general del vault', action: () => { navigateTo('dashboard'); close(); } },
    { id: 'notes', icon: '◻', label: 'Ir a Notas', description: '142 notas en el vault', action: () => { navigateTo('notes'); close(); } },
    { id: 'ai', icon: '◈', label: 'Abrir AI Chat', description: 'Chat con RAG sobre tus notas', action: () => { navigateTo('ai'); close(); } },
    { id: 'graph', icon: '⬡', label: 'Knowledge Graph', description: 'Red de notas y conexiones', action: () => { navigateTo('graph'); close(); } },
    { id: 'flash', icon: '◇', label: 'Flashcards', description: '24 tarjetas pendientes hoy', action: () => { navigateTo('flash'); close(); } },
    { id: 'egel', icon: '▲', label: 'EGEL Tracker', description: 'Seguimiento de dominio', action: () => { navigateTo('egel'); close(); } },
    { id: 'split', icon: '⊟', label: 'Vista Split', description: 'Editor + AI Chat', action: () => { navigateTo('split'); close(); } },
    { id: 'daily', icon: '▷', label: 'Daily Note de hoy', description: 'Abrir nota del día', action: () => { navigateTo('daily'); close(); } },
    { id: 'moc', icon: '⊕', label: 'Maps of Content', description: 'Índices temáticos del vault', action: () => { navigateTo('moc' as ViewId); close(); } },
    { id: 'prompts', icon: '◉', label: 'Prompt Library', description: '6 prompts categorizados', action: () => { navigateTo('prompts'); close(); } },
    { id: 'pdf', icon: '▣', label: 'PDF / OCR', description: 'Procesar documentos', action: () => { navigateTo('pdf'); close(); } },
    { id: 'sync', icon: '↻', label: 'Obsidian Sync', description: 'Sincronizar con iCloud', action: () => { navigateTo('sync'); close(); } },
  ];

  const close = () => {
    setCommandPaletteOpen(false);
    setQuery('');
    setSelected(0);
  };

  const filtered = COMMANDS.filter(
    (c) =>
      !query ||
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelected(0);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (!commandPaletteOpen) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === 'Enter') { e.preventDefault(); filtered[selected]?.action(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, filtered, selected]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="cmd-overlay" onClick={close}>
      <div className="cmd-palette scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-input">
          <span style={{ color: 'var(--text-tertiary)', fontSize: 16 }}>○</span>
          <input
            ref={inputRef}
            placeholder="Buscar en vault, navegar, ejecutar acción..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
          />
          {query && (
            <span
              style={{ cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: 18 }}
              onClick={() => setQuery('')}
            >×</span>
          )}
        </div>

        <div className="cmd-results">
          {filtered.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>
              Sin resultados para "{query}"
            </div>
          )}
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className={`cmd-item${i === selected ? ' selected' : ''}`}
              onClick={item.action}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="cmd-item-icon">{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: 1 }}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cmd-footer">
          <span>↑↓ navegar</span>
          <span>↵ ejecutar</span>
          <span>Esc cerrar</span>
          <span style={{ marginLeft: 'auto' }}>{filtered.length} resultados</span>
        </div>
      </div>
    </div>
  );
}
