'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Conversation } from '@/lib/types';
import { useSocket } from '@/contexts/SocketContext';

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

function initials(name?: string) {
  return (name ?? 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function QueuePage() {
  const [queue, setQueue] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const load = () => {
    api.get<Conversation[]>('/conversations/queue')
      .then(setQueue)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    socket?.on('queue_updated', load);
    return () => { socket?.off('queue_updated', load); };
  }, [socket]);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <Link href="/conversations" style={{ display: 'inline-flex' }}>
          <button className="btn btn-ghost" style={{ padding: '6px 12px' }}>← Voltar</button>
        </Link>
        <div>
          <h1 style={{ fontSize: 24, margin: 0 }}>Fila de Atendimento</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '4px 0 0' }}>
            {queue.length} aluno{queue.length !== 1 ? 's' : ''} aguardando
          </p>
        </div>
      </div>

      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 20, marginBottom: 12, opacity: .5 }}>
              <div style={{ background: 'var(--border)', height: 14, width: '40%', borderRadius: 6 }} />
            </div>
          ))
        : queue.length === 0
          ? (
            <div className="card" style={{ padding: 56, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p style={{ color: 'var(--text-secondary)' }}>Nenhum aluno na fila</p>
            </div>
          )
          : queue.map(conv => (
            <div key={conv.id} className="card animate-fade-in" style={{ padding: 18, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="avatar-placeholder avatar-md" style={{ fontSize: 15 }}>{initials(conv.student?.name)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{conv.student?.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
                  Aguardando há {timeAgo(conv.updatedAt)}
                </div>
              </div>
              <Link href={`/conversations/${conv.id}`}>
                <button className="btn btn-primary" style={{ fontSize: 13 }}>Atender</button>
              </Link>
            </div>
          ))
      }
    </div>
  );
}
