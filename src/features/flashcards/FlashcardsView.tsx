import { useState, useCallback } from 'react';
import { FLASHCARDS } from '../../core/data/flashcards.data';
import type { FlashCard } from '../../types';

const RATINGS = [
  { label: 'Difícil', value: 1, color: 'var(--red)', emoji: '✗' },
  { label: 'Regular', value: 3, color: 'var(--accent)', emoji: '△' },
  { label: 'Bien', value: 4, color: 'var(--teal)', emoji: '○' },
  { label: 'Perfecto', value: 5, color: 'var(--purple)', emoji: '◉' },
];

const DECK_COLORS: Record<string, string> = {
  'PKM': 'var(--purple)',
  'IA y RAG': 'var(--teal)',
  'Oratoria': 'var(--accent)',
  'Arquitectura': 'var(--blue)',
  'Memoria y aprendizaje': 'var(--red)',
};

const dueCards = FLASHCARDS.filter((c) => c.dueDate === 'hoy' || c.dueDate === 'pasado');
const decks = [...new Set(FLASHCARDS.map((c) => c.deck))];

export function FlashcardsView() {
  const [mode, setMode] = useState<'browse' | 'study'>('browse');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [studied, setStudied] = useState<number[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [studyQueue, setStudyQueue] = useState<FlashCard[]>([]);

  const startStudy = useCallback((deck?: string) => {
    const queue = deck
      ? FLASHCARDS.filter((c) => c.deck === deck)
      : dueCards;
    setStudyQueue(queue);
    setCurrentIndex(0);
    setFlipped(false);
    setStudied([]);
    setSelectedDeck(deck ?? null);
    setMode('study');
  }, []);

  const handleRate = useCallback((_rating: number) => {
    const card = studyQueue[currentIndex];
    if (!card) return;
    setStudied((s) => [...s, card.id]);
    if (currentIndex + 1 >= studyQueue.length) {
      setMode('browse');
    } else {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    }
  }, [currentIndex, studyQueue]);

  const currentCard = studyQueue[currentIndex];
  const progress = studyQueue.length > 0 ? (studied.length / studyQueue.length) * 100 : 0;

  if (mode === 'study' && currentCard) {
    return (
      <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-base)' }}>
        {/* Header */}
        <div className="ai-header">
          <span style={{ color: 'var(--text-tertiary)' }}>◇</span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Estudio — {selectedDeck ?? 'Pendientes hoy'}</span>
          <span className="ai-badge model" style={{ background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--accent-mid)' }}>
            {currentIndex + 1} / {studyQueue.length}
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <button className="topbar-btn" onClick={() => setMode('browse')}>
              ✗ Terminar
            </button>
          </div>
        </div>

        {/* Progress */}
        <div style={{ padding: '0 24px' }}>
          <div className="progress-bar" style={{ height: 3, marginTop: 0 }}>
            <div className="progress-fill" style={{ width: `${progress}%`, background: 'var(--teal)' }} />
          </div>
        </div>

        {/* Card area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 32px', gap: 24 }}>
          <div
            className="flashcard-container"
            style={{ width: '100%', maxWidth: 560 }}
            onClick={() => setFlipped((f) => !f)}
          >
            <div className={`flashcard${flipped ? ' flipped' : ''}`}>
              {/* Front */}
              <div className="flashcard-face">
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Pregunta · {currentCard.deck}
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5, textAlign: 'center' }}>
                  {currentCard.front}
                </div>
                <div style={{ marginTop: 24, fontSize: 12, color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  toca para revelar →
                </div>
              </div>
              {/* Back */}
              <div className="flashcard-face flashcard-back">
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Respuesta
                </div>
                <div style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.6, textAlign: 'center' }}>
                  {currentCard.back}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {currentCard.tags.map((t, i) => (
                    <span key={i} className="tag tag-accent" style={{ fontSize: 10 }}>#{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Rating buttons */}
          {flipped && (
            <div className="fade-in" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              {RATINGS.map((r) => (
                <button
                  key={r.value}
                  className="topbar-btn"
                  style={{
                    height: 44,
                    padding: '0 20px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${r.color}30`,
                    background: `${r.color}12`,
                    color: r.color,
                    fontSize: 13,
                    fontWeight: 500,
                    minWidth: 100,
                  }}
                  onClick={() => handleRate(r.value)}
                >
                  {r.emoji} {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Browse mode
  return (
    <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* Header */}
      <div className="ai-header">
        <span style={{ color: 'var(--text-tertiary)' }}>◇</span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Flashcards</span>
        <span className="ai-badge model">{FLASHCARDS.length} tarjetas</span>
        <span className="ai-badge context">{dueCards.length} pendientes hoy</span>
        <button className="topbar-btn primary" style={{ marginLeft: 'auto' }} onClick={() => startStudy()}>
          ▶ Estudiar pendientes ({dueCards.length})
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Racha actual', value: '7d', color: 'var(--accent)' },
            { label: 'Precisión 30d', value: '76%', color: 'var(--teal)' },
            { label: 'Tiempo de repaso', value: '~12min', color: 'var(--purple)' },
          ].map((s) => (
            <div key={s.label} className="stat-card" style={{ padding: '14px 16px' }}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontSize: 22, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Decks */}
        <div className="widget">
          <div className="widget-header">
            <span style={{ color: 'var(--text-tertiary)' }}>◇</span>
            <span className="widget-title">Decks activos</span>
          </div>
          {decks.map((deck) => {
            const cards = FLASHCARDS.filter((c) => c.deck === deck);
            const due = cards.filter((c) => c.dueDate === 'hoy' || c.dueDate === 'pasado');
            const color = DECK_COLORS[deck] ?? 'var(--purple)';
            return (
              <div
                key={deck}
                className="note-row"
                onClick={() => startStudy(deck)}
              >
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 4 }} />
                <div className="note-row-content">
                  <div className="note-row-title">{deck}</div>
                  <div className="note-row-meta">
                    <span>{cards.length} tarjetas</span>
                    {due.length > 0 && (
                      <span className="tag tag-accent" style={{ fontSize: 9 }}>{due.length} pendientes</span>
                    )}
                  </div>
                </div>
                <button className="topbar-btn primary" style={{ fontSize: 11, padding: '0 10px', height: 26 }}>
                  ▶ Estudiar
                </button>
              </div>
            );
          })}
        </div>

        {/* All cards */}
        <div className="widget">
          <div className="widget-header">
            <span style={{ color: 'var(--text-tertiary)' }}>◻</span>
            <span className="widget-title">Todas las tarjetas</span>
          </div>
          {FLASHCARDS.map((card) => (
            <div key={card.id} className="note-row">
              <div className="note-row-content">
                <div className="note-row-title" style={{ fontSize: 12 }}>{card.front}</div>
                <div className="note-row-meta">
                  <span style={{ fontSize: 10 }}>{card.deck}</span>
                  <span className={`tag ${card.dueDate === 'hoy' || card.dueDate === 'pasado' ? 'tag-accent' : 'tag-gray'}`} style={{ fontSize: 9 }}>
                    {card.dueDate}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                EF {card.easeFactor}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
