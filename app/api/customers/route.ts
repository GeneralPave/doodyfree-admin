import { NextResponse } from 'next/server';
import { adminDb } from '@/src/lib/firebaseAdmin';

export async function GET() {
  const snap = await adminDb.collection('customers').limit(20).get();
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const ref = await adminDb.collection('customers').add({ ...body, is_active: true, created_at: new Date() });
  return NextResponse.json({ id: ref.id }, { status: 201 });
}