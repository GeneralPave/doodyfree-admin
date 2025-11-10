import { NextResponse } from 'next/server';
import { adminAuth } from '@/src/lib/firebaseAdmin';

/**
 * POST { email, claims }
 * Example: { "email": "you@yourdomain.com", "claims": { "admin": true, "role": "admin" } }
 * Use once to bootstrap your admin account after signup.
 */
export async function POST(req: Request) {
  const { email, claims } = await req.json();
  if (!email || !claims) return NextResponse.json({ error: 'email and claims required' }, { status: 400 });

  const user = await adminAuth.getUserByEmail(email).catch(() => null);
  if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 });

  await adminAuth.setCustomUserClaims(user.uid, claims);
  return NextResponse.json({ ok: true, uid: user.uid, claims });
}