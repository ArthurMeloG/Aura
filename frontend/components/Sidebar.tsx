'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const NAV = [
  { href: '/feed',          icon: '📰', label: 'Feed de Notícias' },
  { href: '/conversations', icon: '💬', label: 'Conversas'        },
  { href: '/settings',      icon: '⚙️',  label: 'Configurações'   },
];

const ADMIN_NAV = [
  { href: '/admin', icon: '🛡️', label: 'Painel Admin' },
];

function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = [
    ...NAV,
    ...(user?.role === 'ADMIN' || user?.role === 'COLLABORATOR' ? ADMIN_NAV : []),
  ];

  return (
    <aside style={{
      width: 260,
      minHeight: '100vh',
      background: 'linear-gradient(160deg, var(--navy) 0%, var(--navy-container) 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26 }}>🎓</span>
          <div>
            <div style={{ color: '#fff', fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>UnBot</div>
            <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, marginTop: 2 }}>Comunicação Universitária</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {links.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-item${pathname.startsWith(href) ? ' active' : ''}`}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* User card */}
      {user && (
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div className="avatar-placeholder avatar-md" style={{ fontSize: 15 }}>
              {initials(user.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <span className={`chip ${user.role === 'ADMIN' ? 'chip-amber' : user.role === 'COLLABORATOR' ? 'chip-green' : 'chip-blue'}`} style={{ marginTop: 3 }}>
                {user.role === 'ADMIN' ? 'Admin' : user.role === 'COLLABORATOR' ? 'Colaborador' : 'Aluno'}
              </span>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ width: '100%', color: 'rgba(255,255,255,.7)', fontSize: 13 }} onClick={logout}>
            Sair
          </button>
        </div>
      )}
    </aside>
  );
}
