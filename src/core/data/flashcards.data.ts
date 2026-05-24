import type { FlashCard } from '../../types';

export const FLASHCARDS: FlashCard[] = [
  { id: 1, front: '¿Cuál es la fórmula del algoritmo SM-2?', back: 'I(n) = I(n-1) × EF, donde EF es el factor de facilidad (por defecto 2.5). Los intervalos comienzan en 1, 6 días.', deck: 'Memoria y aprendizaje', easeFactor: 2.5, interval: 6, dueDate: 'hoy', tags: ['sm2', 'memoria'] },
  { id: 2, front: '¿Qué significa "atomicidad" en Zettelkasten?', back: 'Una nota atómica contiene exactamente UNA idea. Es el principio más importante del método Luhmann.', deck: 'PKM', easeFactor: 2.8, interval: 14, dueDate: 'hoy', tags: ['zettelkasten', 'pkm'] },
  { id: 3, front: '¿Cuáles son los tres pisteis de Aristóteles?', back: 'Ethos (credibilidad), Pathos (apelación emocional) y Logos (argumentación racional).', deck: 'Oratoria', easeFactor: 2.3, interval: 3, dueDate: 'hoy', tags: ['oratoria', 'aristóteles'] },
  { id: 4, front: '¿Qué threshold de similitud usa el RAG pipeline?', back: 'Similitud coseno mínima de 0.78. Top-K: 8 fragmentos por consulta.', deck: 'IA y RAG', easeFactor: 2.1, interval: 1, dueDate: 'hoy', tags: ['rag', 'ia'] },
  { id: 5, front: '¿Qué es un MOC en PKM?', back: 'Map of Content — índice temático que actúa como hub de navegación sin crear jerarquías. No es una carpeta.', deck: 'PKM', easeFactor: 2.6, interval: 8, dueDate: 'mañana', tags: ['moc', 'pkm'] },
  { id: 6, front: '¿Cuáles son los cinco cánones de la retórica ciceroniana?', back: 'Inventio, Dispositio, Elocutio, Memoria y Actio — los cinco pasos del proceso retórico clásico.', deck: 'Oratoria', easeFactor: 2.4, interval: 4, dueDate: 'hoy', tags: ['cicerón', 'oratoria'] },
  { id: 7, front: '¿Qué modelo se usa para embeddings en MASTER_BRAIN?', back: 'text-embedding-3-small con 1536 dimensiones. Chunk size: 512 tokens, overlap: 50 tokens.', deck: 'IA y RAG', easeFactor: 2.2, interval: 2, dueDate: 'hoy', tags: ['embeddings', 'ia'] },
  { id: 8, front: '¿Qué es local-first en arquitectura de software?', back: 'La fuente de verdad es local (IndexedDB/Dexie). El servidor es el espejo remoto. Funciona sin conexión.', deck: 'Arquitectura', easeFactor: 2.7, interval: 10, dueDate: 'pasado', tags: ['arquitectura', 'offline'] },
];
