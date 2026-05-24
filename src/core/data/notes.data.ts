import type { Note } from '../../types';

export const NOTES: Note[] = [
  {
    id: 1,
    title: 'Zettelkasten y el método Luhmann',
    preview:
      'Las notas atómicas son la unidad mínima de pensamiento. Luhmann desarrolló un sistema de fichas reticular...',
    date: 'hoy',
    tags: ['método', 'pkm'],
    type: 'atomic',
    content: `# Zettelkasten y el método Luhmann

Niklas Luhmann desarrolló el *Zettelkasten* como un sistema de [[second brain]] que permitía la emergencia de ideas no planificadas.

## Principios core

El sistema se basa en tres propiedades fundamentales:

- **Atomicidad**: cada nota contiene exactamente una idea
- **Conectividad**: las notas se enlazan entre sí, no en jerarquías
- **Emergencia**: las conexiones generan ideas que ninguna nota individual podría contener

> "No escribo para producir libros. El Zettelkasten escribe; yo solo soy el medio." — Niklas Luhmann

## Implementación en MASTER_BRAIN

En nuestra arquitectura, cada nota atómica tiene un \`id\` único, un conjunto de \`tags\` semánticos y un array de [[wikilinks]] bidireccionales. El [[sistema MOC]] actúa como mapa de contenido.

#pkm #zettelkasten #método`,
  },
  {
    id: 2,
    title: 'RAG pipeline — arquitectura completa',
    preview:
      'El sistema RAG combina recuperación vectorial con generación contextual usando embeddings de 1536 dimensiones...',
    date: 'ayer',
    tags: ['IA', 'arquitectura'],
    type: 'research',
    content: `# RAG pipeline — arquitectura completa

El sistema de **Retrieval-Augmented Generation** opera en tres fases secuenciales.

## Fase 1: Indexación

Cada nota se convierte a un embedding de 1536 dimensiones usando \`text-embedding-3-small\`. El vector se almacena en [[pgvector]] junto con metadatos de chunk.

## Fase 2: Recuperación

El threshold de similitud coseno es **0.78**. Top-K: 8 fragmentos por consulta, con re-ranking semántico.

## Fase 3: Generación

Los fragmentos recuperados forman el contexto enviado al modelo. [[GPT-4o]] para análisis; [[Claude Sonnet]] para síntesis.

#ia #rag #arquitectura`,
  },
  {
    id: 3,
    title: 'Oratoria clásica — Cicerón',
    preview:
      'El De Oratore establece los cinco cánones de la elocuencia. La inventio, dispositio y elocutio son los pilares...',
    date: 'hace 2d',
    tags: ['oratoria', 'CerebroX'],
    type: 'research',
    content: `# Oratoria clásica — Cicerón

El *De Oratore* es el tratado más completo sobre retórica clásica.

## Los cinco cánones

1. **Inventio** — el descubrimiento de argumentos
2. **Dispositio** — la organización del discurso
3. **Elocutio** — el estilo y la selección de palabras
4. **Memoria** — la memorización del discurso
5. **Actio** — la entrega, voz y gesticulación

> Conectar con [[Aristóteles — Retórica]] y el concepto de ethos, pathos, logos.

El [[sistema MOC]] de [[CerebroX]] organiza estos cánones como nodos centrales del vault de oratoria.

#oratoria #cicerón #retórica #cerebrox`,
  },
  {
    id: 4,
    title: 'Daily Note — 21 Mayo 2026',
    preview:
      'Revisión matutina. Foco en finalizar el módulo de embeddings. Conexión entre Zettelkasten e inventio ciceroniana.',
    date: 'hoy',
    tags: ['daily'],
    type: 'daily',
    content: `# Daily Note — 21 Mayo 2026

## Revisión matutina

- [ ] Finalizar módulo de embeddings en MASTER_BRAIN
- [x] Revisar notas de oratoria del fin de semana
- [ ] Preparar flashcards EGEL — Área I
- [x] Sync con Obsidian vault CerebroX

## Intenciones del día

Foco en el **pipeline RAG**. El chunk size de 512 tokens está dando mejores resultados que 256. Revisar [[RAG pipeline]] para ajustar el overlap.

## Reflexión

La conexión entre el método [[Zettelkasten]] y la *inventio* ciceroniana es más profunda de lo que pensaba inicialmente.

#daily #2026-05-21`,
  },
  {
    id: 5,
    title: 'Knowledge Graph — diseño de nodos',
    preview:
      'Especificación de los tipos de nodo y relaciones del grafo de conocimiento. D3 force layout con agrupación...',
    date: 'hace 3d',
    tags: ['arquitectura', 'grafo'],
    type: 'research',
    content: `# Knowledge Graph — diseño de nodos

## Tipos de nodo

- **Nota atómica** — nodo base, color: purple
- **MOC** — nodo hub, tamaño mayor, color: teal
- **Documento PDF** — nodo cuadrado, color: amber
- **Daily Note** — nodo pequeño, color: gray
- **Concepto** — nodo inferido por IA, color: coral

## Relaciones

- \`wikilink\` — conexión explícita del usuario
- \`similar\` — inferida por similitud coseno > 0.85
- \`parte_de\` — nota atómica → MOC

## Implementación D3

Force simulation con \`d3-force\`. Agrupación por clusters semánticos. Zoom y pan nativo. Clic en nodo abre nota.

#arquitectura #grafo #d3`,
  },
  {
    id: 6,
    title: 'Aristóteles — Retórica',
    preview:
      'La retórica aristotélica distingue tres modos de persuasión: ethos, pathos y logos. Fundamento del discurso racional.',
    date: 'hace 4d',
    tags: ['oratoria', 'filosofía'],
    type: 'atomic',
    content: `# Aristóteles — Retórica

La *Retórica* aristotélica es el tratado fundacional del arte persuasivo occidental.

## Los tres pisteis (modos de persuasión)

- **Ethos** — credibilidad del hablante
- **Pathos** — apelación emocional al auditorio
- **Logos** — argumentación racional y evidencia

> Conectar con [[Oratoria clásica — Cicerón]] para la síntesis romana.

## Relevancia contemporánea

El ethos digital se construye a través de la consistencia del vault y la calidad de las notas. Ver [[Zettelkasten y el método Luhmann]].

#oratoria #aristóteles #filosofía #retórica`,
  },
  {
    id: 7,
    title: 'Sistema MOC — Maps of Content',
    preview:
      'Los MOC son índices temáticos que organizan el vault sin romper la naturaleza reticular de las notas...',
    date: 'hace 5d',
    tags: ['pkm', 'moc'],
    type: 'moc',
    content: `# Sistema MOC — Maps of Content

Un **Map of Content** es una nota especial que actúa como índice temático de un área de conocimiento.

## Características

- No es una jerarquía — es un hub de navegación
- Puede enlazar a notas de diferentes carpetas
- Permite múltiples niveles de profundidad

## MOCs del vault actual

- [[MOC Oratoria y Retórica]]
- [[MOC Sistema MASTER_BRAIN]]
- [[MOC Preparación EGEL]]
- [[MOC IA y RAG]]

## Cuándo crear un MOC

Cuando tienes más de 10 notas relacionadas con un tema y necesitas un punto de entrada. El MOC es la solución a la desorientación en vaults grandes.

#pkm #moc #organización`,
  },
  {
    id: 8,
    title: 'SM-2 — Algoritmo de repetición espaciada',
    preview:
      'El algoritmo SM-2 de Piotr Wozniak calcula el intervalo óptimo entre repasos para maximizar la retención...',
    date: 'hace 6d',
    tags: ['flashcards', 'memoria'],
    type: 'atomic',
    content: `# SM-2 — Algoritmo de repetición espaciada

El algoritmo **SM-2** fue desarrollado por Piotr Wozniak en 1987 y es la base de Anki.

## Fórmula

\`I(n) = I(n-1) × EF\`

Donde:
- \`I(n)\` = intervalo tras el n-ésimo repaso
- \`EF\` = factor de facilidad (2.5 por defecto)

## Factores de facilidad

- **Respuesta perfecta (5)**: EF aumenta
- **Correcto con esfuerzo (3-4)**: EF estable
- **Incorrecto (0-2)**: reinicio + EF decrece

## Implementación en MASTER_BRAIN

Las flashcards se generan automáticamente desde notas con IA. El scheduler SM-2 determina cuáles mostrar cada día.

#flashcards #sm2 #memoria #algoritmo`,
  },
];
