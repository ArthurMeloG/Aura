'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Post, PostCategory } from '@/lib/types';

const CATEGORIES: { value: PostCategory | 'ALL'; label: string }[] = [
  { value: 'ALL',      label: 'Todos'     },
  { value: 'EDITAL',   label: 'Editais'   },
  { value: 'EVENTO',   label: 'Eventos'   },
  { value: 'AVISO',    label: 'Avisos'    },
  { value: 'ACADEMICO',label: 'Acadêmico' },
  { value: 'GERAL',    label: 'Geral'     },
];

const CHIP_MAP: Record<PostCategory, string> = {
  EDITAL:   'chip-navy',
  EVENTO:   'chip-blue',
  AVISO:    'chip-amber',
  ACADEMICO:'chip-green',
  GERAL:    'chip-slate',
};

const LABEL_MAP: Record<PostCategory, string> = {
  EDITAL:   '📋 Edital',
  EVENTO:   '🎉 Evento',
  AVISO:    '⚠️ Aviso',
  ACADEMICO:'🎓 Acadêmico',
  GERAL:    '📌 Geral',
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function FeedPage() {
  const [posts, setPosts]           = useState<Post[]>([]);
  const [category, setCategory]     = useState<PostCategory | 'ALL'>('ALL');
  const [loading, setLoading]       = useState(true);
  const [likedIds, setLikedIds]     = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    const q = category !== 'ALL' ? `?category=${category}` : '';
    api.get<Post[]>(`/posts${q}`)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [category]);

  const toggleLike = async (id: string) => {
    try {
      const updated = await api.post<Post>(`/posts/${id}/like`, {});
      setPosts(ps => ps.map(p => p.id === id ? { ...p, likesCount: updated.likesCount } : p));
      setLikedIds(ids => {
        const next = new Set(ids);
        ids.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    } catch { /* ignore */ }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, margin: 0 }}>Feed de Notícias</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '6px 0 0', fontSize: 14 }}>
          Acompanhe editais, eventos e avisos da universidade
        </p>
      </div>

      {/* Category filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            className="btn"
            style={{
              padding: '7px 16px', fontSize: 13, borderRadius: '99px',
              background: category === c.value ? 'var(--navy)' : 'var(--card)',
              color: category === c.value ? '#fff' : 'var(--text-secondary)',
              border: `1.5px solid ${category === c.value ? 'var(--navy)' : 'var(--border)'}`,
              fontWeight: category === c.value ? 600 : 500,
            }}
            onClick={() => setCategory(c.value)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 24, marginBottom: 16, opacity: .5 }}>
              <div style={{ background: 'var(--border)', height: 16, width: '60%', borderRadius: 8, marginBottom: 12 }} />
              <div style={{ background: 'var(--border)', height: 12, width: '90%', borderRadius: 8, marginBottom: 6 }} />
              <div style={{ background: 'var(--border)', height: 12, width: '70%', borderRadius: 8 }} />
            </div>
          ))
        : posts.length === 0
          ? (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ color: 'var(--text-secondary)' }}>Nenhuma publicação encontrada</p>
            </div>
          )
          : posts.map(post => (
            <article key={post.id} className="card animate-fade-in" style={{ padding: 24, marginBottom: 16 }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <div className="avatar-placeholder avatar-md" style={{ fontSize: 15 }}>
                  {initials(post.author?.name ?? 'U')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{post.author?.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>·</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{timeAgo(post.createdAt)}</span>
                  </div>
                  <span className={`chip ${CHIP_MAP[post.category]}`} style={{ marginTop: 4 }}>
                    {LABEL_MAP[post.category]}
                  </span>
                </div>
              </div>

              {/* Title & content */}
              <h2 style={{ fontSize: 17, margin: '0 0 8px', fontWeight: 700 }}>{post.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                {post.content.length > 280 ? post.content.slice(0, 280) + '…' : post.content}
              </p>

              {/* Footer actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <button
                  className="btn btn-ghost"
                  style={{
                    fontSize: 13, padding: '6px 12px', gap: 6,
                    color: likedIds.has(post.id) ? 'var(--danger)' : 'var(--text-secondary)',
                  }}
                  onClick={() => toggleLike(post.id)}
                >
                  {likedIds.has(post.id) ? '❤️' : '🤍'} {post.likesCount}
                </button>
              </div>
            </article>
          ))
      }
    </div>
  );
}
