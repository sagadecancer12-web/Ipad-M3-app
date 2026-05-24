import { useRef, useEffect, useCallback } from 'react';
import { useAiStore } from '../../core/stores/ai.store';

const MODELS = [
  { id: 'claude-sonnet-4-6', label: 'claude-sonnet-4-6' },
  { id: 'gpt-4o', label: 'gpt-4o' },
  { id: 'gpt-4o-mini', label: 'gpt-4o-mini' },
];

function formatText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');
}

export function AIChatView() {
  const { messages, inputText, isTyping, selectedModel, setInputText, sendMessage, clearConversation, setSelectedModel } =
    useAiStore();
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    sendMessage();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="ai-panel fade-in">
      {/* Header */}
      <div className="ai-header">
        <span style={{ fontSize: 16, color: 'var(--purple)' }}>◈</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          AI Chat
        </span>

        <select
          className="ai-badge model"
          style={{ background: 'var(--purple-dim)', border: '1px solid var(--purple-mid)', color: 'var(--purple)', cursor: 'pointer', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: 10 }}
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>

        <span className="ai-badge context">RAG · 142 notas</span>
        <span className="ai-badge status">● online</span>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <button className="topbar-btn">⊕ Contexto</button>
          <button className="topbar-btn" onClick={clearConversation}>↺ Nuevo</button>
        </div>
      </div>

      {/* Messages */}
      <div className="ai-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`msg ${msg.role} fade-in`}>
            <div className={`msg-avatar ${msg.role}`}>
              {msg.role === 'ai' ? '◈' : 'yo'}
            </div>
            <div className="msg-body">
              <div className="msg-bubble">
                <div dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                {msg.sources && msg.sources.length > 0 && (
                  <div className="source-chips">
                    {msg.sources.map((s, i) => (
                      <span key={i} className="source-chip">◻ {s}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="msg-time">{msg.time}</div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="msg ai fade-in">
            <div className="msg-avatar ai">◈</div>
            <div className="msg-body">
              <div className="msg-bubble" style={{ padding: '14px 16px' }}>
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="ai-input-area">
        <div className="ai-input-box">
          <textarea
            ref={textareaRef}
            className="ai-textarea"
            placeholder="Pregunta sobre tus notas, documentos o ideas..."
            value={inputText}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="ai-send-btn"
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            title="Enviar"
          >
            ↑
          </button>
        </div>
        <div className="ai-input-meta">
          <span className="ai-input-hint">Enter · enviar — Shift+Enter · nueva línea</span>
          <span className="ai-input-hint" style={{ marginLeft: 'auto' }}>
            142 notas · 23 docs · k=8 · cos≥0.78
          </span>
        </div>
      </div>
    </div>
  );
}
