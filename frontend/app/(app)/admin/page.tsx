'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Metrics {
  users: { total: number; byRole: { role: string; _count: { id: number } }[] };
  posts: number;
  conversations: { total: number; queued: number };
  recentConversations: {
    id: string; status: string; updatedAt: string;
    student: { name: string; email: string };
    collaborator?: { name: string };
    messages: { content: string; createdAt: string }[];
  }[];
}

const STATUS_CHIP: Record<string, string> = {
  BOT:    'chip-blue',
  QUEUED: 'chip-amber',
  ACTIVE: 'chip-green',
  CLOSED: 'chip-slate',
};
const STATUS_LABEL: Record<string, string> = {
  BOT:'🤖 Bot', QUEUED:'⏳ Fila', ACTIVE:'✅ Ativo', CLOSED:'🔒 Encerrado',
};

function timeAgo(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 3600) return `${Math.floor(d/60)}m`;
  if (d < 86400) return `${Math.floor(d/3600)}h`;
  return `${Math.floor(d/86400)}d`;
}

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [tab, setTab] = useState<'overview' | 'faq'>('overview');

  useEffect(() => {
    api.get<Metrics>('/admin/metrics').then(setMetrics).catch(console.error);
  }, []);

  const stats = metrics ? [
    { label: 'Usuários',      value: metrics.users.total,               icon: '👥', color: 'var(--navy)' },
    { label: 'Publicações',   value: metrics.posts,                      icon: '📰', color: '#1a73e8' },
    { label: 'Conversas',     value: metrics.conversations.total,        icon: '💬', color: '#16a34a' },
    { label: 'Na fila',       value: metrics.conversations.queued,       icon: '⏳', color: '#d97706' },
  ] : [];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, margin: 0 }}>Painel Administrativo</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6 }}>Visão geral da plataforma</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--card)', padding: 4, borderRadius: 12, border: '1px solid var(--border)', width: 'fit-content' }}>
        {(['overview', 'faq'] as const).map(t => (
          <button key={t} className="btn" style={{
            padding: '7px 18px', fontSize: 13,
            background: tab === t ? 'var(--navy)' : 'transparent',
            color: tab === t ? '#fff' : 'var(--text-secondary)',
            borderRadius: 9,
          }} onClick={() => setTab(t)}>
            {t === 'overview' ? '📊 Visão geral' : '❓ Base de FAQ'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
            {stats.map(s => (
              <div key={s.label} className="card" style={{ padding: '22px 24px' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 30, fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Users by role */}
          {metrics && (
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, margin: '0 0 16px' }}>Usuários por função</h2>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {metrics.users.byRole.map(r => (
                  <div key={r.role} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`chip ${r.role === 'ADMIN' ? 'chip-amber' : r.role === 'COLLABORATOR' ? 'chip-green' : 'chip-blue'}`}>
                      {r.role === 'ADMIN' ? 'Admin' : r.role === 'COLLABORATOR' ? 'Colaborador' : 'Aluno'}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{r._count.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent conversations */}
          {metrics && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, margin: 0 }}>Conversas recentes</h2>
                <Link href="/conversations/queue"><button className="btn btn-secondary" style={{ fontSize: 12 }}>Ver fila</button></Link>
              </div>
              {metrics.recentConversations.length === 0
                ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nenhuma conversa ainda</p>
                : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {metrics.recentConversations.map(c => (
                      <Link key={c.id} href={`/conversations/${c.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                          <span className={`chip ${STATUS_CHIP[c.status]}`}>{STATUS_LABEL[c.status]}</span>
                          <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{c.student?.name}</span>
                          {c.collaborator && <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{c.collaborator.name}</span>}
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{timeAgo(c.updatedAt)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              }
            </div>
          )}
        </>
      )}

      {tab === 'faq' && <FaqManager />}
    </div>
  );
}

function FaqManager() {
  const [entries, setEntries] = useState<{ id: string; question: string; answer: string; keywords: string[]; category?: string }[]>([]);
  const [form, setForm] = useState({ question: '', answer: '', keywords: '', category: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<typeof entries>('/admin/faq').then(setEntries).catch(console.error);
  }, []);

  const create = async () => {
    if (!form.question || !form.answer) return;
    setSaving(true);
    try {
      const entry = await api.post<(typeof entries)[0]>('/admin/faq', {
        question: form.question,
        answer:   form.answer,
        keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean),
        category: form.category || undefined,
      });
      setEntries(es => [entry, ...es]);
      setForm({ question: '', answer: '', keywords: '', category: '' });
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    await api.delete(`/admin/faq/${id}`);
    setEntries(es => es.filter(e => e.id !== id));
  };

  return (
    <div>
      {/* Create form */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, margin: '0 0 16px' }}>Adicionar entrada ao FAQ</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input className="input" placeholder="Pergunta" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
          <textarea className="input" placeholder="Resposta" rows={3} style={{ resize: 'vertical' }} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} />
          <input className="input" placeholder="Palavras-chave (separadas por vírgula)" value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} />
          <input className="input" placeholder="Categoria (opcional)" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start', height: 44 }} onClick={create} disabled={saving || !form.question || !form.answer}>
            {saving ? 'Salvando…' : 'Adicionar'}
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {entries.map(e => (
          <div key={e.id} className="card" style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{e.question}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5 }}>{e.answer}</div>
              {e.keywords.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                  {e.keywords.map(k => <span key={k} className="chip chip-slate">{k}</span>)}
                </div>
              )}
            </div>
            <button className="btn btn-ghost" style={{ color: 'var(--danger)', fontSize: 20, padding: '4px 8px' }} onClick={() => remove(e.id)}>×</button>
          </div>
        ))}
        {entries.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Nenhuma entrada no FAQ ainda</p>}
      </div>
    </div>
  );
}
