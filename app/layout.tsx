// app/layout.tsx
import React from 'react';
import Link from 'next/link';
import AuthButton from '@/src/components/AuthButton';

export const metadata = {
  title: 'DoodyFree Admin',
  description: 'Customers & Employees',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <div
          style={{
            padding: 16,
            display: 'flex',
            gap: 16,
            borderBottom: '1px solid #e5e7eb',
            alignItems: 'center',
          }}
        >
          <Link href="/" style={{ fontWeight: 700 }}>DoodyFree</Link>
          <Link href="/customers">Customers</Link>
          <Link href="/employees">Employees</Link>
          <AuthButton />
        </div>

        <main style={{ padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}

