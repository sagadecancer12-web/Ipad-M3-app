import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Note } from '../../types';
import { NOTES } from '../data/notes.data';

interface NotesState {
  notes: Note[];
  activeNoteId: number;
  searchQuery: string;
  isEditing: boolean;

  setActiveNote: (id: number) => void;
  setSearchQuery: (q: string) => void;
  setIsEditing: (editing: boolean) => void;
  getActiveNote: () => Note | undefined;
  getFilteredNotes: () => Note[];
  updateNoteTitle: (id: number, title: string) => void;
  updateNoteContent: (id: number, content: string) => void;
}

export const useNotesStore = create<NotesState>()(
  devtools(
    (set, get) => ({
      notes: NOTES,
      activeNoteId: 1,
      searchQuery: '',
      isEditing: false,

      setActiveNote: (id: number) => set({ activeNoteId: id }),
      setSearchQuery: (q: string) => set({ searchQuery: q }),
      setIsEditing: (editing: boolean) => set({ isEditing: editing }),

      getActiveNote: () => {
        const { notes, activeNoteId } = get();
        return notes.find((n) => n.id === activeNoteId);
      },

      getFilteredNotes: () => {
        const { notes, searchQuery } = get();
        if (!searchQuery.trim()) return notes;
        const q = searchQuery.toLowerCase();
        return notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.preview.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q))
        );
      },

      updateNoteTitle: (id: number, title: string) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, title } : n)),
        })),

      updateNoteContent: (id: number, content: string) =>
        set((s) => ({
          notes: s.notes.map((n) => (n.id === id ? { ...n, content } : n)),
        })),
    }),
    { name: 'notes-store' }
  )
);
