'use client';
import RequireAdmin from '@/src/components/RequireAdmin';
import { db } from '@/src/lib/firebaseClient';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import React from 'react';

type Employee = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  is_active?: boolean;
};

export default function EmployeesPage() {
  const [rows, setRows] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    const q = query(collection(db, 'employees'), where('is_active', '==', true));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    setRows(items);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Employee = {
      first_name: String(fd.get('first_name') || ''),
      last_name: String(fd.get('last_name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      is_active: true,
    };
    await addDoc(collection(db, 'employees'), payload);
    (e.target as HTMLFormElement).reset();
    load();
  }

  return (
    <RequireAdmin>
      <div style={{ display: 'grid', gap: 24 }}>
        <section>
          <h2>Employees</h2>
          {loading ? <p>Loading…</p> : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Name</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Contact</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id}>
                      <td style={{ padding: 8 }}>{r.first_name} {r.last_name}</td>
                      <td style={{ padding: 8 }}>{r.email}{r.phone ? ` | ${r.phone}` : ''}</td>
                      <td style={{ padding: 8 }}>{r.is_active ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h3>Add / Edit Employee (basic)</h3>
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 600 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input name="first_name" placeholder="First name" required />
              <input name="last_name" placeholder="Last name" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input name="email" type="email" placeholder="Email" required />
              <input name="phone" placeholder="Phone" />
            </div>
            <button>Save</button>
          </form>
        </section>
      </div>
    </RequireAdmin>
  );
}
