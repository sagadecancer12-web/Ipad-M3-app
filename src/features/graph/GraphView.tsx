import { useRef, useEffect, useState, useCallback } from 'react';
import { useNotesStore } from '../../core/stores/notes.store';
import { useAppStore } from '../../core/stores/app.store';

interface NodeData {
  id: string;
  label: string;
  type: 'note' | 'moc' | 'daily' | 'concept' | 'document';
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: string[];
}

interface EdgeData {
  from: string;
  to: string;
}

const TYPE_COLORS: Record<string, string> = {
  note: '#9d7bea',
  moc: '#3ecfb0',
  daily: '#8a8a96',
  concept: '#e05a5a',
  document: '#e8a030',
};

const TYPE_SIZE: Record<string, number> = {
  note: 8,
  moc: 14,
  daily: 6,
  concept: 10,
  document: 9,
};

function buildGraph(notes: ReturnType<typeof useNotesStore.getState>['notes']): {
  nodes: NodeData[];
  edges: EdgeData[];
} {
  const nodes: NodeData[] = notes.map((n, i) => {
    const angle = (i / notes.length) * Math.PI * 2;
    const radius = 140 + Math.random() * 80;
    return {
      id: String(n.id),
      label: n.title.slice(0, 20),
      type: n.type === 'moc' ? 'moc' : n.type === 'daily' ? 'daily' : 'note',
      x: 300 + Math.cos(angle) * radius,
      y: 240 + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      connections: [],
    };
  });

  // Add concept nodes
  const concepts = ['Zettelkasten', 'RAG', 'Oratoria', 'EGEL', 'SM-2'];
  concepts.forEach((c, i) => {
    const angle = (i / concepts.length) * Math.PI * 2;
    nodes.push({
      id: `concept-${c}`,
      label: c,
      type: 'concept',
      x: 300 + Math.cos(angle) * 60,
      y: 240 + Math.sin(angle) * 60,
      vx: 0,
      vy: 0,
      connections: [],
    });
  });

  // Build edges
  const edges: EdgeData[] = [];
  const edgeSet = new Set<string>();

  notes.forEach((n) => {
    const fromId = String(n.id);
    // Cross-note links
    notes.forEach((other) => {
      if (n.id !== other.id && n.content.includes(other.title.slice(0, 15))) {
        const key = [fromId, String(other.id)].sort().join('-');
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ from: fromId, to: String(other.id) });
        }
      }
    });
    // Link to concepts
    concepts.forEach((c) => {
      if (n.content.toLowerCase().includes(c.toLowerCase()) || n.tags.some(t => t.toLowerCase().includes(c.toLowerCase()))) {
        const key = [fromId, `concept-${c}`].sort().join('-');
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ from: fromId, to: `concept-${c}` });
        }
      }
    });
  });

  return { nodes, edges };
}

export function GraphView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<NodeData[]>([]);
  const edgesRef = useRef<EdgeData[]>([]);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });

  const { notes, setActiveNote } = useNotesStore();
  const { navigateTo } = useAppStore();

  useEffect(() => {
    const { nodes, edges } = buildGraph(notes);
    nodesRef.current = nodes;
    edgesRef.current = edges;
  }, [notes]);

  const simulate = useCallback(() => {
    const nodes = nodesRef.current;
    const edges = edgesRef.current;

    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = Math.min(800 / (dist * dist), 2);
        nodes[i].vx -= (dx / dist) * force;
        nodes[i].vy -= (dy / dist) * force;
        nodes[j].vx += (dx / dist) * force;
        nodes[j].vy += (dy / dist) * force;
      }
    }

    // Attraction along edges
    edges.forEach(({ from, to }) => {
      const a = nodes.find((n) => n.id === from);
      const b = nodes.find((n) => n.id === to);
      if (!a || !b) return;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - 100) * 0.01;
      a.vx += (dx / dist) * force;
      a.vy += (dy / dist) * force;
      b.vx -= (dx / dist) * force;
      b.vy -= (dy / dist) * force;
    });

    // Center gravity
    nodes.forEach((n) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      n.vx += (canvas.width / 2 - n.x) * 0.001;
      n.vy += (canvas.height / 2 - n.y) * 0.001;
      n.vx *= 0.85;
      n.vy *= 0.85;
      n.x += n.vx;
      n.y += n.vy;
    });
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = transformRef.current;
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.scale(t.scale, t.scale);

    // Draw edges
    edgesRef.current.forEach(({ from, to }) => {
      const a = nodesRef.current.find((n) => n.id === from);
      const b = nodesRef.current.find((n) => n.id === to);
      if (!a || !b) return;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle =
        hoveredNode === from || hoveredNode === to
          ? 'rgba(157,123,234,0.4)'
          : 'rgba(255,255,255,0.06)';
      ctx.lineWidth = hoveredNode === from || hoveredNode === to ? 1.5 : 0.8;
      ctx.stroke();
    });

    // Draw nodes
    nodesRef.current.forEach((node) => {
      const size = TYPE_SIZE[node.type] ?? 8;
      const isSelected = selectedNode?.id === node.id;
      const isHovered = hoveredNode === node.id;
      const color = TYPE_COLORS[node.type] ?? '#9d7bea';

      // Glow
      if (isSelected || isHovered) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 6, 0, Math.PI * 2);
        ctx.fillStyle = color + '20';
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, isSelected ? size + 3 : size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Label
      if (isSelected || isHovered || size >= 12) {
        ctx.font = `${size >= 12 ? 10 : 9}px "JetBrains Mono"`;
        ctx.fillStyle = 'rgba(232,232,234,0.85)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + size + 12);
      }
    });

    ctx.restore();
  }, [selectedNode, hoveredNode]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    });
    resizeObserver.observe(container);
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    let frame = 0;
    const loop = () => {
      frame++;
      if (frame < 180) simulate();
      draw();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
    };
  }, [simulate, draw]);

  const getNodeAt = (px: number, py: number) => {
    const t = transformRef.current;
    const cx = (px - t.x) / t.scale;
    const cy = (py - t.y) / t.scale;
    return nodesRef.current.find((n) => {
      const size = TYPE_SIZE[n.type] ?? 8;
      const dx = n.x - cx;
      const dy = n.y - cy;
      return Math.sqrt(dx * dx + dy * dy) <= size + 4;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (dragRef.current) {
      const t = transformRef.current;
      const n = nodesRef.current.find((x) => x.id === dragRef.current!.id);
      if (n) {
        n.x = (px - t.x) / t.scale - dragRef.current.offsetX;
        n.y = (py - t.y) / t.scale - dragRef.current.offsetY;
        n.vx = 0;
        n.vy = 0;
      }
      return;
    }

    const node = getNodeAt(px, py);
    setHoveredNode(node?.id ?? null);
    canvasRef.current!.style.cursor = node ? 'pointer' : 'default';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const node = getNodeAt(px, py);
    if (node) {
      const t = transformRef.current;
      dragRef.current = {
        id: node.id,
        offsetX: (px - t.x) / t.scale - node.x,
        offsetY: (py - t.y) / t.scale - node.y,
      };
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    if (!dragRef.current) return;
    const node = getNodeAt(px, py);
    dragRef.current = null;
    if (node) {
      setSelectedNode(node);
      if (node.type === 'note' || node.type === 'daily' || node.type === 'moc') {
        const noteId = parseInt(node.id, 10);
        if (!isNaN(noteId)) setActiveNote(noteId);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const t = transformRef.current;
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    t.scale = Math.max(0.3, Math.min(3, t.scale * delta));
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-base)',
      }}
      className="fade-in"
    >
      {/* Header */}
      <div className="ai-header">
        <span style={{ color: 'var(--text-tertiary)' }}>⬡</span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Knowledge Graph</span>
        <span className="ai-badge model" style={{ background: 'var(--teal-dim)', color: 'var(--teal)', borderColor: 'rgba(62,207,176,0.2)' }}>
          {nodesRef.current.length} nodos
        </span>
        <span className="ai-badge context">{edgesRef.current.length} conexiones</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <span
              key={type}
              className="source-chip"
              style={{ borderLeft: `3px solid ${color}`, paddingLeft: 8 }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%' }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        />
        {/* Selected node info */}
        {selectedNode && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-med)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 13,
              pointerEvents: 'none',
              minWidth: 200,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: TYPE_COLORS[selectedNode.type],
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{selectedNode.label}</div>
              <div style={{ color: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                {selectedNode.type}
              </div>
            </div>
            <button
              className="topbar-btn"
              style={{ pointerEvents: 'all', marginLeft: 8 }}
              onClick={() => {
                navigateTo('notes');
                setSelectedNode(null);
              }}
            >
              Abrir →
            </button>
          </div>
        )}

        {/* Instructions */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-tertiary)',
            textAlign: 'right',
            lineHeight: 1.8,
          }}
        >
          <div>🖱 arrastrar nodos</div>
          <div>⚙ scroll para zoom</div>
          <div>clic para seleccionar</div>
        </div>
      </div>
    </div>
  );
}
