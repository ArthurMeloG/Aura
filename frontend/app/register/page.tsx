'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { AuthResponse } from '@/lib/types';

export default function RegisterPage() {
  const { login } = useAuth();
  const router    = useRouter();
  const [form, setForm]     = useState({ name: '', email: '', password: '', enrollment: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await api.post<AuthResponse>('/auth/register', form);
      login(data.access_token, data.user);
      router.push('/feed');
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-container) 60%, #1a3a6e 100%)',
      padding: '24px',
    }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: 440, padding: '40px 36px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
          <h2 style={{ margin: 0, fontSize: 22 }}>Criar conta</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6 }}>Plataforma de comunicação universitária</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { id: 'name',       label: 'Nome completo',      type: 'text',     placeholder: 'Seu nome' },
            { id: 'email',      label: 'E-mail institucional',type: 'email',    placeholder: 'seu@university.edu' },
            { id: 'enrollment', label: 'Matrícula (opcional)',type: 'text',     placeholder: '20230001' },
            { id: 'password',   label: 'Senha',               type: 'password', placeholder: 'Mínimo 6 caracteres' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                {label}
              </label>
              <input
                id={id} type={type} required={id !== 'enrollment'}
                className="input" placeholder={placeholder}
                value={(form as Record<string, string>)[id]}
                onChange={set(id)}
              />
            </div>
          ))}

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button id="register-btn" type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4, height: 48, fontSize: 15 }}>
            {loading ? 'Cadastrando…' : 'Criar conta'}
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            Já tem conta?{' '}
            <Link href="/login" style={{ color: 'var(--navy)', fontWeight: 600 }}>Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
