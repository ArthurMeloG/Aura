'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName]         = useState(user?.name ?? '');
  const [success, setSuccess]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.patch(`/users/${user?.id}`, { name });
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function initials(n: string) { return n.split(' ').map(c => c[0]).slice(0, 2).join('').toUpperCase(); }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>Configurações</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>Gerencie seu perfil e preferências</p>

      {/* Avatar + identity */}
      <div className="card" style={{ padding: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div className="avatar-placeholder avatar-lg" style={{ fontSize: 22 }}>{initials(user?.name ?? 'U')}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{user?.name}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 2 }}>{user?.email}</div>
          <span className={`chip ${user?.role === 'ADMIN' ? 'chip-amber' : user?.role === 'COLLABORATOR' ? 'chip-green' : 'chip-blue'}`} style={{ marginTop: 6 }}>
            {user?.role === 'ADMIN' ? 'Administrador' : user?.role === 'COLLABORATOR' ? 'Colaborador' : 'Estudante'}
          </span>
          {user?.enrollment && (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Matrícula: {user.enrollment}</div>
          )}
        </div>
      </div>

      {/* Edit form */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, margin: '0 0 20px' }}>Editar perfil</h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Nome completo</label>
            <input id="settings-name" type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>E-mail</label>
            <input type="email" className="input" value={user?.email} disabled style={{ opacity: .6, cursor: 'not-allowed' }} />
          </div>

          {success && <div style={{ background: '#dcfce7', color: '#15803d', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13 }}>{success}</div>}
          {error   && <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13 }}>{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', height: 44 }}>
            {loading ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </form>
      </div>

      {/* Logout */}
      <div className="card" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 17, margin: '0 0 12px', color: 'var(--danger)' }}>Sessão</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
          Isso encerrará sua sessão neste dispositivo.
        </p>
        <button className="btn btn-danger" onClick={logout} style={{ height: 44 }}>Sair da conta</button>
      </div>
    </div>
  );
}
