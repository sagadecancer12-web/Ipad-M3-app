// ─── MASTER_BRAIN Global Types ───────────────────────────────────────────────

export type NoteType = 'atomic' | 'daily' | 'moc' | 'research' | 'egel';
export type TagColor = 'purple' | 'teal' | 'accent' | 'red' | 'gray';
export type MessageRole = 'ai' | 'user';
export type ViewId =
  | 'dashboard'
  | 'notes'
  | 'daily'
  | 'moc'
  | 'search'
  | 'ai'
  | 'graph'
  | 'flash'
  | 'egel'
  | 'pdf'
  | 'prompts'
  | 'sync'
  | 'split';

export interface NoteFrontmatter {
  id: string;
  title: string;
  type: NoteType;
  tags: string[];
  created: string;
  updated: string;
}

export interface Note {
  id: number;
  title: string;
  preview: string;
  date: string;
  tags: string[];
  content: string;
  type: NoteType;
  wordCount?: number;
  links?: string[];
}

export interface ChatMessage {
  id: number;
  role: MessageRole;
  text: string;
  time: string;
  sources?: string[];
}

export interface EgelArea {
  area: string;
  shortLabel: string;
  pct: number;
  notes: number;
  decks: number;
}

export interface FlashCard {
  id: number;
  front: string;
  back: string;
  deck: string;
  easeFactor: number;
  interval: number;
  dueDate: string;
  tags: string[];
}

export interface Prompt {
  id: number;
  title: string;
  category: string;
  template: string;
  variables: string[];
  model: string;
  tags: string[];
}

export interface Tab {
  id: number;
  icon: string;
  label: string;
  viewId: ViewId;
  noteId?: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'note' | 'moc' | 'daily' | 'concept' | 'document';
  x: number;
  y: number;
  connections: string[];
}
