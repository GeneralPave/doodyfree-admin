'use client';

import React from 'react';
import { auth } from '@/src/lib/firebaseClient';
import { onAuthStateChanged, User } from 'firebase/auth';

type Props = { children: React.ReactNode };

export default function RequireAdmin({ children }: Props) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) { setIsAdmin(false); return; }
      const token = await u.getIdTokenResult(true); // force refresh to read latest claims
      setIsAdmin(!!token.claims?.admin);
    });
    return () => unsub();
  }, []);

  if (user === null || isAdmin === null) return <p>Checking sign-in…</p>;
  if (!user) return <p>Not signed in. Go to <a href="/signin">/signin</a>.</p>;
  if (!isAdmin) return <p>No admin access. Ask an admin to grant you access.</p>;

  return <>{children}</>;
}
