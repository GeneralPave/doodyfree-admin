'use client';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';

export default function AuthButton() {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (u) => setUid(u ? u.uid : null));
  }, []);

  if (!uid) {
    return <Link href="/signin">Sign in</Link>;
  }

  return (
    <button
      onClick={() => signOut(getAuth())}
      style={{ marginLeft: 'auto' }}
      title={uid}
    >
      Log out
    </button>
  );
}
