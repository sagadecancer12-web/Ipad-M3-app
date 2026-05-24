import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatMessage } from '../../types';
import { INITIAL_MESSAGES } from '../data/chat.data';
import { getCurrentTime } from '../utils/markdown';

interface AiState {
  messages: ChatMessage[];
  inputText: string;
  isTyping: boolean;
  selectedModel: string;

  setInputText: (text: string) => void;
  sendMessage: () => void;
  clearConversation: () => void;
  setSelectedModel: (model: string) => void;
}

const AI_RESPONSES: string[] = [
  'Basándome en tus **142 notas** indexadas, encuentro una conexión relevante entre los conceptos que mencionas y las notas de oratoria clásica. La clave está en la estructura reticular del conocimiento.',
  'He analizado los chunks relevantes de tu vault. El patrón emergente sugiere que la **inventio** ciceroniana y tu pipeline RAG comparten la misma lógica de recuperación: ambos buscan el argumento más relevante para el contexto.',
  'El sistema RAG recuperó **8 fragmentos** con similitud coseno > 0.78. La síntesis indica que tu enfoque en notas atómicas maximiza la precisión del retrieval porque cada chunk contiene exactamente una idea.',
  'Detecté **3 notas** altamente relacionadas con tu consulta: *Zettelkasten y el método Luhmann*, *Sistema MOC* y *RAG pipeline*. ¿Quieres que genere una nota de síntesis que conecte estos conceptos?',
  'El análisis semántico de tu vault revela un cluster temático fuerte entre **oratoria clásica** y **epistemología**. Hay 7 notas que orbitan este nodo pero no están conectadas explícitamente con wikilinks.',
];

let responseIndex = 0;

export const useAiStore = create<AiState>()(
  devtools(
    (set, get) => ({
      messages: INITIAL_MESSAGES,
      inputText: '',
      isTyping: false,
      selectedModel: 'claude-sonnet-4-6',

      setInputText: (text: string) => set({ inputText: text }),

      sendMessage: () => {
        const { inputText, messages } = get();
        if (!inputText.trim()) return;

        const userMsg: ChatMessage = {
          id: Date.now(),
          role: 'user',
          text: inputText.trim(),
          time: getCurrentTime(),
        };

        set({ messages: [...messages, userMsg], inputText: '', isTyping: true });

        setTimeout(() => {
          const aiMsg: ChatMessage = {
            id: Date.now() + 1,
            role: 'ai',
            text: AI_RESPONSES[responseIndex % AI_RESPONSES.length],
            time: getCurrentTime(),
            sources: ['Zettelkasten y el método Luhmann', 'RAG pipeline — arquitectura completa'],
          };
          responseIndex++;
          set((s) => ({ messages: [...s.messages, aiMsg], isTyping: false }));
        }, 1400 + Math.random() * 800);
      },

      clearConversation: () =>
        set({
          messages: [
            {
              id: Date.now(),
              role: 'ai',
              text: 'Conversación reiniciada. Vault activo: **142 notas**, **23 documentos**, **8 decks**. ¿En qué trabajamos?',
              time: getCurrentTime(),
              sources: [],
            },
          ],
        }),

      setSelectedModel: (model: string) => set({ selectedModel: model }),
    }),
    { name: 'ai-store' }
  )
);
