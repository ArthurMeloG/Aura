'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { AuthResponse } from '@/lib/types';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await api.post<AuthResponse>('/auth/login', { email, password });
      login(data.access_token, data.user);
      router.push('/feed');
    } catch (err: unknown) {
      setError((err as Error).message ?? 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-container) 60%, #1a3a6e 100%)',
    }}>
      {/* Left brand panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', color: '#fff',
      }} className="hidden md:flex">
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
        <h1 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 40, color: '#fff', marginBottom: 16, lineHeight: 1.15 }}>
          Bem-vindo ao<br />UnBot
        </h1>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 17, maxWidth: 380, lineHeight: 1.6 }}>
          Sua central de informações universitárias. Tire dúvidas, acompanhe editais e fale com a secretaria em um único lugar.
        </p>
        <div style={{ display: 'flex', gap: 28, marginTop: 48 }}>
          {[['📢', 'Editais e avisos'], ['💬', 'Atendimento rápido'], ['🤖', 'Chatbot 24h']].map(([icon, label]) => (
            <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.75)', fontSize: 14 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>{label as string}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        width: '100%', maxWidth: 460,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '48px 40px',
        background: 'rgba(255,255,255,.04)',
        backdropFilter: 'blur(24px)',
        borderLeft: '1px solid rgba(255,255,255,.1)',
      }}>
        <div className="card" style={{ padding: '40px 36px' }}>
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
            <h2 style={{ margin: 0, fontSize: 22 }}>Entrar na plataforma</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 6 }}>
              Use seu e-mail institucional
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                E-mail
              </label>
              <input
                id="email" type="email" required
                className="input" placeholder="seu@university.edu"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                Senha
              </label>
              <input
                id="password" type="password" required
                className="input" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div style={{
                background: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)',
                padding: '10px 14px', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <button id="login-btn" type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4, height: 48, fontSize: 15 }}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              Não tem conta?{' '}
              <Link href="/register" style={{ color: 'var(--navy)', fontWeight: 600 }}>Cadastrar-se</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
