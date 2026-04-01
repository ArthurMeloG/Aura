'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { Conversation, Message } from '@/lib/types';

function timeStr(iso: string) {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function initials(name?: string) {
  return (name ?? 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();

  const [conv,    setConv]    = useState<Conversation | null>(null);
  const [messages,setMessages]= useState<Message[]>([]);
  const [input,   setInput]   = useState('');
  const [sending, setSending] = useState(false);
  const [typing,  setTyping]  = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- Load conversation ---
  useEffect(() => {
    api.get<Conversation>(`/conversations/${id}`)
      .then(c => { setConv(c); setMessages(c.messages ?? []); })
      .catch(() => router.push('/conversations'));
  }, [id, router]);

  // --- Socket room ---
  useEffect(() => {
    if (!socket || !id) return;
    socket.emit('join_conversation', { conversationId: id });

    socket.on('new_message', (msg: Message) => {
      setMessages(ms => [...ms, msg]);
      if (msg.isBot) { setTyping(false); }
    });
    return () => { socket.off('new_message'); };
  }, [socket, id]);

  // --- Scroll to bottom ---
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setSending(true);
    if (conv?.status === 'BOT') setTyping(true);

    if (socket) {
      socket.emit('send_message', { conversationId: id, content: text });
      setSending(false);
    } else {
      // Fallback (no WS)
      try {
        const res = await api.post<{ message: Message }>(`/conversations/${id}/messages`, { content: text });
        if (res.message) setMessages(ms => [...ms, res.message]);
      } finally { setSending(false); setTyping(false); }
    }
  };

  const claim = async () => {
    if (!socket) return;
    socket.emit('claim_conversation', { conversationId: id });
    setConv(c => c ? { ...c, status: 'ACTIVE', collaborator: user as never } : c);
  };

  const close = async () => {
    await api.patch(`/conversations/${id}/close`, {});
    setConv(c => c ? { ...c, status: 'CLOSED' } : c);
  };

  if (!conv) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--navy)', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const isCollaborator = user?.role === 'COLLABORATOR' || user?.role === 'ADMIN';
  const canClaim = isCollaborator && conv.status === 'QUEUED';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        background: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => router.push('/conversations')}>← Voltar</button>
        <div className="avatar-placeholder avatar-sm" style={{ fontSize: 13 }}>
          {initials(isCollaborator ? conv.student?.name : (conv.collaborator?.name ?? 'Bot'))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>
            {isCollaborator ? conv.student?.name : (conv.collaborator?.name ?? 'Chatbot UnBot')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {conv.status === 'BOT' ? '🤖 Respondendo automaticamente' :
             conv.status === 'QUEUED' ? '⏳ Aguardando atendente' :
             conv.status === 'ACTIVE' ? '✅ Em atendimento' : '🔒 Encerrado'}
          </div>
        </div>
        {canClaim && (
          <button className="btn btn-primary" style={{ fontSize: 13 }} onClick={claim}>Assumir conversa</button>
        )}
        {conv.status === 'ACTIVE' && isCollaborator && (
          <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={close}>Encerrar</button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => {
          const isMine = msg.senderId === user?.id;
          const isBot  = msg.isBot;

          return (
            <div key={msg.id ?? i} className="animate-fade-in"
              style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : isMine ? 'flex-end' : 'flex-start', gap: 8 }}>

              {(isBot || !isMine) && (
                <div className="avatar-placeholder" style={{ width: 30, height: 30, fontSize: 12 }}>
                  {isBot ? '🤖' : initials(msg.sender?.name ?? 'U')}
                </div>
              )}

              <div style={{ maxWidth: '70%' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: isMine ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  background: isMine ? 'var(--bubble-student)' : 'var(--bubble-bot)',
                  color: isMine ? 'var(--bubble-student-text)' : 'var(--text-primary)',
                  fontSize: 14, lineHeight: 1.55,
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: isMine ? 'right' : 'left' }}>
                  {timeStr(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div className="avatar-placeholder" style={{ width: 30, height: 30, fontSize: 12 }}>🤖</div>
            <div style={{ padding: '10px 16px', borderRadius: '4px 16px 16px 16px', background: 'var(--bubble-bot)', display: 'flex', gap: 5, alignItems: 'center' }}>
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {conv.status !== 'CLOSED' && (
        <div style={{
          padding: '16px 24px', background: 'var(--card)', borderTop: '1px solid var(--border)',
          display: 'flex', gap: 10, alignItems: 'flex-end',
        }}>
          <textarea
            className="input"
            style={{ resize: 'none', minHeight: 44, maxHeight: 120, lineHeight: 1.5, paddingTop: 10 }}
            placeholder={conv.status === 'BOT' ? 'Pergunte ao chatbot…' : 'Digite sua mensagem…'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            rows={1}
          />
          <button className="btn btn-primary" style={{ padding: '10px 20px', flexShrink: 0 }} onClick={send} disabled={!input.trim() || sending}>
            Enviar →
          </button>
        </div>
      )}
      {conv.status === 'CLOSED' && (
        <div style={{ padding: '14px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          Conversa encerrada
        </div>
      )}
    </div>
  );
}
