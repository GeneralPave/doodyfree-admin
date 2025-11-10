'use client';
import RequireAdmin from '@/src/components/RequireAdmin';
import { db } from '@/src/lib/firebaseClient';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import React from 'react';

type Customer = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  yard_size_sqft?: number;
  number_of_pets?: number;
  is_active?: boolean;
};

export default function CustomersPage() {
  const [rows, setRows] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function load() {
    setLoading(true);
    const q = query(collection(db, 'customers'), where('is_active', '==', true));
    const snap = await getDocs(q);
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    setRows(items);
    setLoading(false);
  }

  React.useEffect(() => { load(); }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload: Customer = {
      first_name: String(fd.get('first_name') || ''),
      last_name: String(fd.get('last_name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      city: String(fd.get('city') || ''),
      province: String(fd.get('province') || 'BC'),
      postal_code: String(fd.get('postal_code') || ''),
      yard_size_sqft: Number(fd.get('yard_size_sqft') || 0),
      number_of_pets: Number(fd.get('number_of_pets') || 1),
      is_active: true,
    };
    await addDoc(collection(db, 'customers'), payload);
    (e.target as HTMLFormElement).reset();
    load();
  }

return (
  <RequireAdmin>
    <div style={{ display: 'grid', gap: 24 }}>
      <section>
        <h2>Customers</h2>
        {loading ? <p>Loading…</p> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Name</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Contact</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>City</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Yard (sq ft)</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>Pets</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    <td style={{ padding: 8 }}>{r.first_name} {r.last_name}</td>
                    <td style={{ padding: 8 }}>{r.email}{r.phone ? ` | ${r.phone}` : ''}</td>
                    <td style={{ padding: 8 }}>{r.city || '-'}</td>
                    <td style={{ padding: 8 }}>{r.yard_size_sqft ?? '-'}</td>
                    <td style={{ padding: 8 }}>{r.number_of_pets ?? 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3>Add / Edit Customer (basic)</h3>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 700 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input name="first_name" placeholder="First name" required />
            <input name="last_name" placeholder="Last name" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input name="email" type="email" placeholder="Email" required />
            <input name="phone" placeholder="Phone" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <input name="city" placeholder="City" />
            <input name="province" placeholder="Province" defaultValue="BC" />
            <input name="postal_code" placeholder="Postal code" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input name="yard_size_sqft" type="number" placeholder="Yard size (sq ft)" />
            <input name="number_of_pets" type="number" defaultValue={1} placeholder="# of pets" />
          </div>
          <button>Save</button>
        </form>
      </section>
    </div>
  </RequireAdmin>
);

}