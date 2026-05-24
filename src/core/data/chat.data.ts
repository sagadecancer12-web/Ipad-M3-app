import type { ChatMessage } from '../../types';

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    role: 'ai',
    text: 'Hola. Tengo acceso a tu vault de MASTER_BRAIN — **142 notas**, **23 documentos PDF**, **8 flashcard decks**. ¿En qué quieres trabajar hoy?',
    time: '09:14',
    sources: [],
  },
  {
    id: 2,
    role: 'user',
    text: 'Explícame cómo conecta el Zettelkasten con mi pipeline RAG',
    time: '09:15',
  },
  {
    id: 3,
    role: 'ai',
    text: `Basándome en tus notas, hay una **convergencia estructural** entre ambos sistemas:

El Zettelkasten opera con **notas atómicas** conectadas por wikilinks. Tu RAG pipeline opera con **chunks** de 512 tokens conectados por similitud vectorial.

En ambos casos, la recuperación no es jerárquica — es reticular. Cuando el sistema busca contexto para una consulta, el proceso es análogo a cómo Luhmann "navegaba" por fichas.

La diferencia clave: Luhmann usaba asociación manual; tu sistema usa distancia coseno en un espacio de **1536 dimensiones**.`,
    time: '09:15',
    sources: ['Zettelkasten y el método Luhmann', 'RAG pipeline — arquitectura'],
  },
];
