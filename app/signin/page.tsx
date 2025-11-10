'use client';

import React from 'react';
import { auth } from '@/src/lib/firebaseClient';
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Force token refresh to pick up custom claims if they were just set.
      await auth.currentUser?.getIdToken(true);
      router.push('/customers');
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  async function onSignOut() {
    await signOut(auth);
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1>Sign in</h1>
      <p style={{ color: '#666' }}>Use the email/password you added in Firebase Auth.</p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
      </form>

      <hr style={{ margin: '24px 0' }} />
      <button onClick={onSignOut}>Sign out</button>
    </div>
  );
}
