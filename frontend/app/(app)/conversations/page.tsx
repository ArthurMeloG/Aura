'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Conversation } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const STATUS_LABEL: Record<string, string> = {
  BOT:    '🤖 Chatbot',
  QUEUED: '⏳ Na fila',
  ACTIVE: '✅ Ativo',
  CLOSED: '🔒 Encerrado',
};

const STATUS_CHIP: Record<string, string> = {
  BOT:    'chip-blue',
  QUEUED: 'chip-amber',
  ACTIVE: 'chip-green',
  CLOSED: 'chip-slate',
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

function initials(name?: string) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function ConversationsPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Conversation[]>('/conversations')
      .then(setConversations)
      .finally(() => setLoading(false));
  }, []);

  const startNew = async () => {
    const conv = await api.post<Conversation>('/conversations/start', {});
    setConversations(cs => [conv, ...cs]);
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, margin: 0 }}>Conversas</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: 14 }}>
            Atendimento via chatbot ou humano
          </p>
        </div>
        {user?.role === 'STUDENT' && (
          <button className="btn btn-primary" onClick={startNew} style={{ gap: 6 }}>
            <span>+</span> Nova conversa
          </button>
        )}
      </div>

      {/* Collaborator: queue banner */}
      {(user?.role === 'COLLABORATOR' || user?.role === 'ADMIN') && (
        <div className="card" style={{
          padding: '16px 20px', marginBottom: 20,
          background: 'linear-gradient(90deg, var(--navy) 0%, var(--navy-container) 100%)',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>Fila de atendimento</p>
            <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, margin: '2px 0 0' }}>Alunos aguardando atendimento humano</p>
          </div>
          <Link href="/conversations/queue" className="btn btn-secondary" style={{ fontSize: 13 }}>Ver fila</Link>
        </div>
      )}

      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 20, marginBottom: 12, display: 'flex', gap: 14, opacity: .5 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--border)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ background: 'var(--border)', height: 14, width: '40%', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ background: 'var(--border)', height: 11, width: '70%', borderRadius: 6 }} />
              </div>
            </div>
          ))
        : conversations.length === 0
          ? (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                {user?.role === 'STUDENT' ? 'Nenhuma conversa ainda. Clique em "Nova conversa" para começar.' : 'Nenhuma conversa atribuída'}
              </p>
            </div>
          )
          : conversations.map(conv => (
            <Link key={conv.id} href={`/conversations/${conv.id}`} style={{ textDecoration: 'none' }}>
              <div className="card animate-fade-in" style={{ padding: 18, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'box-shadow .15s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
              >
                <div className="avatar-placeholder avatar-md" style={{ fontSize: 15 }}>
                  {initials(user?.role === 'STUDENT' ? (conv.collaborator?.name ?? 'Bot') : conv.student?.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>
                      {user?.role === 'STUDENT' ? (conv.collaborator?.name ?? 'Chatbot UnBot') : conv.student?.name}
                    </span>
                    <span className={`chip ${STATUS_CHIP[conv.status]}`}>{STATUS_LABEL[conv.status]}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.messages?.[conv.messages.length - 1]?.content ?? 'Conversa iniciada'}
                  </p>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, flexShrink: 0 }}>
                  {timeAgo(conv.updatedAt)}
                </div>
              </div>
            </Link>
          ))
      }
    </div>
  );
}
