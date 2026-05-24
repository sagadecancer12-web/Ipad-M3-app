// ─── Markdown renderer utility ───────────────────────────────────────────────

export function renderMarkdown(md: string): string {
  return md
    .replace(/\[\[([^\]]+)\]\]/g, '<a class="wikilink" href="#">[[$1]]</a>')
    .replace(/#(\w[\w-]*)/g, '<span class="tag-inline">#$1</span>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="task-done">✓ $1</li>')
    .replace(/^- \[ \] (.+)$/gm, '<li class="task-pending">○ $1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ordered">$2</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li[^>]*>[\s\S]+?<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hublp/]|$)(.+)$/gm, '<p>$1</p>');
}

export function extractWordCount(content: string): number {
  return content.split(/\s+/).filter(Boolean).length;
}

export function extractWikilinks(content: string): string[] {
  const matches = content.matchAll(/\[\[([^\]]+)\]\]/g);
  return [...matches].map((m) => m[1]);
}

export function extractTags(content: string): string[] {
  const matches = content.matchAll(/#(\w[\w-]*)/g);
  return [...new Set([...matches].map((m) => m[1]))];
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'hoy';
  if (days === 1) return 'ayer';
  if (days < 7) return `hace ${days}d`;
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

export function getCurrentDateStr(): string {
  return new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export function getCurrentTime(): string {
  return new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}
